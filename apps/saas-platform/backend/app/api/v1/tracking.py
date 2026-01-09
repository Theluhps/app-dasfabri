"""
API para rastreamento em tempo real de embarques e containers
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.models import User, TrackingEvent, TrackingEventStatus, ImportProcess, Container, ContainerStatus
from app.core.security import get_current_user
from app.core.database import get_db
from app.core.exceptions import NotFoundError, BusinessLogicError
from app.core.logging_config import logger

router = APIRouter()

# Schemas Pydantic
class TrackingEventBase(BaseModel):
    status: TrackingEventStatus
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: str
    vessel: Optional[str] = None
    port: Optional[str] = None
    port_code: Optional[str] = None

class TrackingEventCreate(TrackingEventBase):
    shipment_id: str
    container_number: Optional[str] = None
    import_process_id: Optional[int] = None
    export_process_id: Optional[int] = None
    container_id: Optional[int] = None

class TrackingEventResponse(TrackingEventBase):
    id: int
    shipment_id: str
    container_number: Optional[str]
    timestamp: datetime
    source: str
    
    class Config:
        orm_mode = True

class TrackingStatusResponse(BaseModel):
    shipment_id: str
    container_number: Optional[str] = None
    origin: str
    destination: str
    vessel: Optional[str] = None
    current_location: Optional[str] = None
    current_status: Optional[TrackingEventStatus] = None
    last_update: Optional[datetime] = None
    events: List[TrackingEventResponse] = []

@router.get("/map-data", response_model=List[TrackingEventResponse])
def get_map_data(
    status: Optional[TrackingEventStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna dados de eventos de rastreamento com coordenadas para exibição em mapa.
    """
    query = db.query(TrackingEvent).filter(
        TrackingEvent.company_id == current_user.company_id,
        TrackingEvent.latitude.isnot(None),
        TrackingEvent.longitude.isnot(None)
    )
    if status:
        query = query.filter(TrackingEvent.status == status)
    
    events = query.order_by(TrackingEvent.timestamp.desc()).all()
    return [TrackingEventResponse.from_orm(event) for event in events]

@router.get("/{shipment_id}", response_model=TrackingStatusResponse)
def get_tracking_status(
    shipment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obter status atual de rastreamento de um embarque
    Pode buscar por process_id, container_number ou shipment_id
    """
    logger.info(f"Buscando tracking para shipment_id: {shipment_id}")
    
    # Buscar eventos de tracking
    events = db.query(TrackingEvent).filter(
        TrackingEvent.shipment_id == shipment_id,
        TrackingEvent.company_id == current_user.company_id
    ).order_by(TrackingEvent.timestamp.desc()).all()
    
    if not events:
        # Tentar buscar por container_number
        container = db.query(Container).filter(
            Container.container_number == shipment_id,
            Container.company_id == current_user.company_id
        ).first()
        
        if container:
            events = db.query(TrackingEvent).filter(
                TrackingEvent.container_id == container.id,
                TrackingEvent.company_id == current_user.company_id
            ).order_by(TrackingEvent.timestamp.desc()).all()
            
            if events:
                shipment_id = container.container_number
                origin = container.origin_port
                destination = container.destination_port
                vessel = container.vessel
                current_location = container.current_location
            else:
                raise NotFoundError("Tracking", shipment_id)
        else:
            # Tentar buscar por import_process_id
            try:
                process_id = int(shipment_id)
                process = db.query(ImportProcess).filter(
                    ImportProcess.id == process_id,
                    ImportProcess.company_id == current_user.company_id
                ).first()
                
                if process:
                    events = db.query(TrackingEvent).filter(
                        TrackingEvent.import_process_id == process_id,
                        TrackingEvent.company_id == current_user.company_id
                    ).order_by(TrackingEvent.timestamp.desc()).all()
                    
                    if events:
                        shipment_id = process.reference_number
                        origin = process.origin
                        destination = process.destination
                        vessel = None
                        current_location = None
                    else:
                        raise NotFoundError("Tracking", f"processo {shipment_id}")
                else:
                    raise NotFoundError("Embarque/Processo", shipment_id)
            except ValueError:
                raise NotFoundError("Embarque/Processo", shipment_id)
    else:
        # Se encontrou eventos, buscar informações do processo/container
        first_event = events[0]
        origin = first_event.location if first_event.status == TrackingEventStatus.departed else "N/A"
        destination = "N/A"
        vessel = first_event.vessel
        current_location = first_event.location
        
        # Tentar buscar informações do container ou processo
        if first_event.container_id:
            container = db.query(Container).filter(
                Container.id == first_event.container_id,
                Container.company_id == current_user.company_id
            ).first()
            if container:
                origin = container.origin_port
                destination = container.destination_port
                vessel = container.vessel or vessel
                current_location = container.current_location or current_location
        
        if first_event.import_process_id:
            process = db.query(ImportProcess).filter(
                ImportProcess.id == first_event.import_process_id,
                ImportProcess.company_id == current_user.company_id
            ).first()
            if process:
                origin = process.origin
                destination = process.destination
    
    # Determinar status atual
    current_status = events[0].status if events else None
    last_update = events[0].timestamp if events else None
    
    # Container number do primeiro evento
    container_number = events[0].container_number if events else None
    
    return TrackingStatusResponse(
        shipment_id=shipment_id,
        container_number=container_number,
        origin=origin,
        destination=destination,
        vessel=vessel,
        current_location=current_location,
        current_status=current_status,
        last_update=last_update,
        events=[TrackingEventResponse.model_validate(e) for e in reversed(events)]  # Ordem cronológica
    )

@router.get("/{shipment_id}/events", response_model=List[TrackingEventResponse])
def get_tracking_events(
    shipment_id: str,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obter histórico completo de eventos de rastreamento
    """
    logger.debug(f"Buscando eventos de tracking para shipment_id: {shipment_id}")
    
    events = db.query(TrackingEvent).filter(
        TrackingEvent.shipment_id == shipment_id,
        TrackingEvent.company_id == current_user.company_id
    ).order_by(TrackingEvent.timestamp.desc()).limit(limit).all()
    
    if not events:
        raise NotFoundError("Tracking Events", shipment_id)
    
    return [TrackingEventResponse.model_validate(e) for e in reversed(events)]

@router.post("/{shipment_id}/refresh")
def refresh_tracking(
    shipment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Forçar atualização do rastreamento (buscar de APIs externas)
    Por enquanto, retorna sucesso. Em produção, aqui seria feita a integração
    com APIs de rastreamento (Neotracker, APIs de agências marítimas, etc.)
    """
    logger.info(f"Atualizando tracking para shipment_id: {shipment_id}")
    
    # TODO: Implementar integração com APIs externas
    # - Neotracker
    # - APIs de agências marítimas (MSC, Maersk, CMA CGM)
    # - APIs de terminais portuários
    
    # Por enquanto, apenas retornar sucesso
    return {
        "message": "Tracking atualizado com sucesso",
        "shipment_id": shipment_id,
        "updated_at": datetime.utcnow()
    }

@router.post("/{shipment_id}/events", response_model=TrackingEventResponse)
def create_tracking_event(
    shipment_id: str,
    event: TrackingEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Criar novo evento de rastreamento manualmente
    """
    logger.info(f"Criando evento de tracking para shipment_id: {shipment_id}")
    
    # Verificar se o shipment_id corresponde a um processo ou container
    import_process = None
    container = None
    
    if event.import_process_id:
        import_process = db.query(ImportProcess).filter(
            ImportProcess.id == event.import_process_id,
            ImportProcess.company_id == current_user.company_id
        ).first()
        if not import_process:
            raise NotFoundError("Processo de importação", event.import_process_id)
    
    if event.container_id:
        container = db.query(Container).filter(
            Container.id == event.container_id,
            Container.company_id == current_user.company_id
        ).first()
        if not container:
            raise NotFoundError("Container", event.container_id)
    
    # Criar evento
    db_event = TrackingEvent(
        shipment_id=shipment_id,
        container_number=event.container_number,
        status=event.status,
        location=event.location,
        latitude=event.latitude,
        longitude=event.longitude,
        description=event.description,
        vessel=event.vessel,
        port=event.port,
        port_code=event.port_code,
        import_process_id=event.import_process_id,
        export_process_id=event.export_process_id,
        container_id=event.container_id,
        company_id=current_user.company_id,
        source="manual",
        timestamp=datetime.utcnow()
    )
    
    db.add(db_event)
    
    # Atualizar localização atual do container se aplicável
    if container:
        container.current_location = event.location
        container.status = ContainerStatus.in_transit if event.status == TrackingEventStatus.in_transit else container.status
    
    db.commit()
    db.refresh(db_event)
    
    logger.info(f"Evento de tracking criado: ID {db_event.id}")
    return TrackingEventResponse.model_validate(db_event)

