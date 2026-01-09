"""
API para comentários e colaboração em processos
"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
from pydantic import BaseModel
from app.models import (
    User, Comment, CommentAttachment,
    ImportProcess, ExportProcess
)
from app.core.security import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundError, BusinessLogicError
from app.core.logging_config import logger

router = APIRouter()

# Schemas Pydantic
class CommentBase(BaseModel):
    text: str
    mentions: Optional[List[int]] = None  # Lista de user IDs mencionados

class CommentCreate(CommentBase):
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    parent_comment_id: Optional[int] = None

class CommentUpdate(BaseModel):
    text: str

class AttachmentResponse(BaseModel):
    id: int
    file_name: str
    file_size: int
    mime_type: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
        orm_mode = True

class CommentResponse(BaseModel):
    id: int
    text: str
    mentions: Optional[List[int]] = None
    created_by: int
    created_by_name: str
    created_by_role: Optional[str] = None
    parent_comment_id: Optional[int] = None
    attachments: List[AttachmentResponse] = []
    replies: List['CommentResponse'] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        orm_mode = True

# Permitir referência forward para replies (Pydantic v2)
try:
    CommentResponse.model_rebuild()
except AttributeError:
    # Pydantic v1 não tem model_rebuild, mas funciona sem ele
    pass

@router.get("/processes/{process_id}/comments", response_model=List[CommentResponse])
def get_process_comments(
    process_id: str,
    include_replies: bool = Query(True),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Listar comentários de um processo
    process_id pode ser import_process_id ou export_process_id
    """
    logger.info(f"Buscando comentários para processo: {process_id}")
    
    try:
        process_id_int = int(process_id)
        
        # Verificar se é import ou export
        import_process = db.query(ImportProcess).filter(
            ImportProcess.id == process_id_int,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if import_process:
            comments = db.query(Comment).filter(
                Comment.import_process_id == process_id_int,
                Comment.company_id == current_user.company_id,
                Comment.deleted == False,
                Comment.parent_comment_id == None  # Apenas comentários principais
            ).order_by(Comment.created_at.desc()).limit(limit).all()
        else:
            export_process = db.query(ExportProcess).filter(
                ExportProcess.id == process_id_int,
                ExportProcess.company_id == current_user.company_id
            ).first()
            
            if not export_process:
                raise NotFoundError(
                    detail=f"Processo não encontrado: {process_id}",
                    resource="Process"
                )
            
            comments = db.query(Comment).filter(
                Comment.export_process_id == process_id_int,
                Comment.company_id == current_user.company_id,
                Comment.deleted == False,
                Comment.parent_comment_id == None
            ).order_by(Comment.created_at.desc()).limit(limit).all()
        
        # Converter para response
        result = []
        for comment in comments:
            comment_dict = {
                "id": comment.id,
                "text": comment.text,
                "mentions": json.loads(comment.mentions) if comment.mentions else None,
                "created_by": comment.created_by,
                "created_by_name": comment.created_by_user.name if comment.created_by_user else "Usuário",
                "created_by_role": comment.created_by_user.role.value if comment.created_by_user and comment.created_by_user.role else None,
                "parent_comment_id": comment.parent_comment_id,
                "attachments": [
                    AttachmentResponse.model_validate(att) 
                    for att in db.query(CommentAttachment).filter(
                        CommentAttachment.comment_id == comment.id
                    ).all()
                ],
                "replies": [],
                "created_at": comment.created_at,
                "updated_at": comment.updated_at
            }
            
            # Buscar replies se solicitado
            if include_replies:
                replies = db.query(Comment).filter(
                    Comment.parent_comment_id == comment.id,
                    Comment.deleted == False
                ).order_by(Comment.created_at.asc()).all()
                
                comment_dict["replies"] = [
                    {
                        "id": reply.id,
                        "text": reply.text,
                        "mentions": json.loads(reply.mentions) if reply.mentions else None,
                        "created_by": reply.created_by,
                        "created_by_name": reply.created_by_user.name if reply.created_by_user else "Usuário",
                        "created_by_role": reply.created_by_user.role.value if reply.created_by_user and reply.created_by_user.role else None,
                        "parent_comment_id": reply.parent_comment_id,
                        "attachments": [
                            AttachmentResponse.model_validate(att) 
                            for att in db.query(CommentAttachment).filter(
                                CommentAttachment.comment_id == reply.id
                            ).all()
                        ],
                        "replies": [],
                        "created_at": reply.created_at,
                        "updated_at": reply.updated_at
                    }
                    for reply in replies
                ]
            
            result.append(CommentResponse(**comment_dict))
        
        return result
        
    except ValueError:
        raise NotFoundError(
            detail=f"ID de processo inválido: {process_id}",
            resource="Process"
        )

@router.post("/processes/{process_id}/comments", response_model=CommentResponse)
def create_comment(
    process_id: str,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Criar novo comentário em um processo
    """
    logger.info(f"Criando comentário para processo: {process_id}")
    
    try:
        process_id_int = int(process_id)
        
        # Verificar se o processo existe
        import_process = db.query(ImportProcess).filter(
            ImportProcess.id == process_id_int,
            ImportProcess.company_id == current_user.company_id
        ).first()
        
        if import_process:
            comment.import_process_id = process_id_int
        else:
            export_process = db.query(ExportProcess).filter(
                ExportProcess.id == process_id_int,
                ExportProcess.company_id == current_user.company_id
            ).first()
            
            if not export_process:
                raise NotFoundError(
                    detail=f"Processo não encontrado: {process_id}",
                    resource="Process"
                )
            comment.export_process_id = process_id_int
        
        # Verificar se parent_comment existe (se for reply)
        if comment.parent_comment_id:
            parent = db.query(Comment).filter(
                Comment.id == comment.parent_comment_id,
                Comment.company_id == current_user.company_id,
                Comment.deleted == False
            ).first()
            
            if not parent:
                raise NotFoundError(
                    detail=f"Comentário pai não encontrado: {comment.parent_comment_id}",
                    resource="Comment"
                )
        
        # Criar comentário
        db_comment = Comment(
            text=comment.text,
            mentions=json.dumps(comment.mentions) if comment.mentions else None,
            import_process_id=comment.import_process_id,
            export_process_id=comment.export_process_id,
            parent_comment_id=comment.parent_comment_id,
            company_id=current_user.company_id,
            created_by=current_user.id
        )
        
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        
        logger.info(f"Comentário criado: ID {db_comment.id}")
        
        # Retornar comentário criado
        return CommentResponse(
            id=db_comment.id,
            text=db_comment.text,
            mentions=json.loads(db_comment.mentions) if db_comment.mentions else None,
            created_by=db_comment.created_by,
            created_by_name=current_user.name or current_user.email,
            created_by_role=current_user.role.value if current_user.role else None,
            parent_comment_id=db_comment.parent_comment_id,
            attachments=[],
            replies=[],
            created_at=db_comment.created_at,
            updated_at=db_comment.updated_at
        )
        
    except ValueError:
        raise NotFoundError(
            detail=f"ID de processo inválido: {process_id}",
            resource="Process"
        )

@router.post("/comments/{comment_id}/reply", response_model=CommentResponse)
def reply_to_comment(
    comment_id: int,
    comment: CommentBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Responder a um comentário existente
    """
    logger.info(f"Respondendo ao comentário: {comment_id}")
    
    parent_comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.company_id == current_user.company_id,
        Comment.deleted == False
    ).first()
    
    if not parent_comment:
        raise NotFoundError(
            detail=f"Comentário não encontrado: {comment_id}",
            resource="Comment"
        )
    
    # Criar reply
    reply = Comment(
        text=comment.text,
        mentions=json.dumps(comment.mentions) if comment.mentions else None,
        import_process_id=parent_comment.import_process_id,
        export_process_id=parent_comment.export_process_id,
        parent_comment_id=comment_id,
        company_id=current_user.company_id,
        created_by=current_user.id
    )
    
    db.add(reply)
    db.commit()
    db.refresh(reply)
    
    logger.info(f"Reply criado: ID {reply.id}")
    
    return CommentResponse(
        id=reply.id,
        text=reply.text,
        mentions=json.loads(reply.mentions) if reply.mentions else None,
        created_by=reply.created_by,
        created_by_name=current_user.name or current_user.email,
        created_by_role=current_user.role.value if current_user.role else None,
        parent_comment_id=reply.parent_comment_id,
        attachments=[],
        replies=[],
        created_at=reply.created_at,
        updated_at=reply.updated_at
    )

@router.patch("/comments/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    update: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualizar comentário (apenas o próprio autor)
    """
    logger.info(f"Atualizando comentário: {comment_id}")
    
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.company_id == current_user.company_id,
        Comment.deleted == False
    ).first()
    
    if not comment:
        raise NotFoundError(
            detail=f"Comentário não encontrado: {comment_id}",
            resource="Comment"
        )
    
    # Verificar se é o autor
    if comment.created_by != current_user.id:
        raise BusinessLogicError(
            detail="Você não tem permissão para editar este comentário",
            resource="Comment"
        )
    
    comment.text = update.text
    comment.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(comment)
    
    logger.info(f"Comentário atualizado: ID {comment_id}")
    
    return CommentResponse(
        id=comment.id,
        text=comment.text,
        mentions=json.loads(comment.mentions) if comment.mentions else None,
        created_by=comment.created_by,
        created_by_name=comment.created_by_user.name if comment.created_by_user else "Usuário",
        created_by_role=comment.created_by_user.role.value if comment.created_by_user and comment.created_by_user.role else None,
        parent_comment_id=comment.parent_comment_id,
        attachments=[
            AttachmentResponse.model_validate(att) 
            for att in db.query(CommentAttachment).filter(
                CommentAttachment.comment_id == comment.id
            ).all()
        ],
        replies=[],
        created_at=comment.created_at,
        updated_at=comment.updated_at
    )

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletar comentário (soft delete)
    """
    logger.info(f"Deletando comentário: {comment_id}")
    
    comment = db.query(Comment).filter(
        Comment.id == comment_id,
        Comment.company_id == current_user.company_id,
        Comment.deleted == False
    ).first()
    
    if not comment:
        raise NotFoundError(
            detail=f"Comentário não encontrado: {comment_id}",
            resource="Comment"
        )
    
    # Verificar se é o autor ou admin
    if comment.created_by != current_user.id and current_user.role.value != "admin":
        raise BusinessLogicError(
            detail="Você não tem permissão para deletar este comentário",
            resource="Comment"
        )
    
    # Soft delete
    comment.deleted = True
    comment.deleted_at = datetime.utcnow()
    comment.deleted_by = current_user.id
    
    db.commit()
    
    logger.info(f"Comentário deletado: ID {comment_id}")
    
    return {"message": "Comentário deletado com sucesso"}

@router.get("/users/mention-suggestions", response_model=List[dict])
def get_mention_suggestions(
    query: str = Query("", min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Buscar usuários para menção (@mention)
    Retorna lista de usuários da mesma empresa
    """
    logger.debug(f"Buscando sugestões de menção: query={query}")
    
    users = db.query(User).filter(
        User.company_id == current_user.company_id,
        User.status == "active",
        User.id != current_user.id  # Excluir o próprio usuário
    ).filter(
        User.name.ilike(f"%{query}%") | User.email.ilike(f"%{query}%")
    ).limit(limit).all()
    
    return [
        {
            "id": user.id,
            "name": user.name or user.email,
            "email": user.email,
            "role": user.role.value if user.role else None
        }
        for user in users
    ]

