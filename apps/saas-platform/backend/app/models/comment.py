"""
Modelo para comentários e colaboração em processos
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from . import Base

class Comment(Base):
    """Comentário em um processo de importação/exportação"""
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Conteúdo
    text = Column(Text, nullable=False)
    
    # Menções (@mentions)
    mentions = Column(Text, nullable=True)  # JSON array de user IDs mencionados
    
    # Relacionamentos
    company_id = Column(Integer, ForeignKey('companies.id'), nullable=False)
    import_process_id = Column(Integer, ForeignKey('import_processes.id'), nullable=True)
    export_process_id = Column(Integer, ForeignKey('export_processes.id'), nullable=True)
    
    # Usuário que criou o comentário
    created_by = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Comentário pai (para replies)
    parent_comment_id = Column(Integer, ForeignKey('comments.id'), nullable=True)
    
    # Anexos
    attachments = Column(Text, nullable=True)  # JSON array de attachment IDs
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Soft delete
    deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)
    deleted_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    # Relationships
    company = relationship("Company", back_populates="comments")
    import_process = relationship("ImportProcess", back_populates="comments")
    export_process = relationship("ExportProcess", back_populates="comments")
    created_by_user = relationship("User", foreign_keys=[created_by], back_populates="comments")
    parent_comment = relationship("Comment", remote_side=[id], back_populates="replies")
    replies = relationship("Comment", back_populates="parent_comment", cascade="all, delete-orphan")

class CommentAttachment(Base):
    """Anexo de um comentário"""
    __tablename__ = 'comment_attachments'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informações do arquivo
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)  # em bytes
    mime_type = Column(String)
    
    # Relacionamento
    comment_id = Column(Integer, ForeignKey('comments.id'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    comment = relationship("Comment")

