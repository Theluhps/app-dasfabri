"""
Configuração global para testes pytest
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Importar Base dos modelos (não do core.database) para garantir que seja o mesmo usado pelos modelos
from app.models import (
    Base,  # Base dos modelos
    User, UserStatus, Company, Supplier, Product, ProductCategory,
    ImportProcess, ExportProcess, ImportDocument,
    Payment, Container, PurchaseOrder, POItem,
    TrackingEvent, ComplianceCheck, Comment, CommentAttachment,
    DrawbackAct, DrawbackCredit, Warehouse, InventoryItem, StockMovement,
    Task, TaskStatus, TaskPriority, TaskType
)
from app.core.security import get_password_hash

# Database de teste - usar arquivo temporário para garantir que todas as sessões compartilhem o mesmo banco
# Com :memory:, cada conexão cria um banco separado, então usamos um arquivo temporário
import tempfile
import os

# Criar arquivo temporário para o banco de teste
test_db_file = tempfile.NamedTemporaryFile(delete=False, suffix='.db')
test_db_path = test_db_file.name
test_db_file.close()

SQLALCHEMY_DATABASE_URL = f"sqlite:///{test_db_path}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Limpar arquivo temporário ao final dos testes
def cleanup_test_db():
    """Remove o arquivo de banco de teste após os testes"""
    if os.path.exists(test_db_path):
        os.unlink(test_db_path)

# Criar todas as tabelas uma vez no início
# Isso garante que as tabelas existam antes de qualquer teste
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def db():
    """Cria uma sessão de banco de dados para cada teste"""
    # Limpar e recriar todas as tabelas antes de cada teste
    # Isso garante um estado limpo para cada teste
    Base.metadata.drop_all(bind=engine)
    
    # Criar todas as tabelas de forma explícita e síncrona
    # Usar engine.begin() para garantir que a criação seja transacional
    with engine.begin() as conn:
        Base.metadata.create_all(bind=engine)
        # Verificar que as tabelas foram criadas
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        # Se não houver tabelas, algo deu errado
        if not tables:
            raise RuntimeError("Falha ao criar tabelas no banco de teste")
    
    # Criar a sessão DEPOIS de garantir que as tabelas existam
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.rollback()
        session.close()

@pytest.fixture(scope="session", autouse=True)
def cleanup():
    """Limpa o banco de teste após todos os testes"""
    yield
    cleanup_test_db()

@pytest.fixture(scope="function")
def db_session(db):
    """Alias para db para compatibilidade"""
    return db

@pytest.fixture(scope="function")
def test_company(db):
    """Cria uma empresa de teste"""
    company = Company(
        name="Test Company",
        cnpj="12345678000190",
        email="test@company.com",
        country="Brasil"
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@pytest.fixture(scope="function")
def test_user_from_conftest(db, test_company):
    """Cria um usuário de teste (para uso quando test_user não está definido no test_apis.py)"""
    user = User(
        name="Test User",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        company_id=test_company.id,
        status=UserStatus.active
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

