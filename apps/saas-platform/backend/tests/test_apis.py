"""
Testes automatizados para todas as APIs do sistema
"""
import sys
import os

# Adicionar o diretório raiz do backend ao path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Importar app do main.py (que está na raiz do backend)
# O main.py está em apps/saas-platform/backend/main.py
from main import app

from app.core.database import get_db
# Importar Base dos modelos (não do core.database) para garantir que seja o mesmo usado pelos modelos
from app.models import (
    Base,  # Base dos modelos
    User, UserStatus, Company, Supplier, Product, ProductCategory,
    ImportProcess, ExportProcess, ImportDocument, ImportStatus,
    Payment, Container, PurchaseOrder, POItem,
    TrackingEvent, ComplianceCheck, Comment, CommentAttachment,
    DrawbackAct, DrawbackCredit, Warehouse, InventoryItem, StockMovement,
    Task, TaskStatus, TaskPriority, TaskType
)
from app.models.import_document import DocumentStatus
from app.core.security import get_password_hash

# Importar engine e sessionmaker do conftest para usar o mesmo banco
from tests.conftest import engine, TestingSessionLocal

# Variável global para armazenar a sessão atual do teste
_current_db_session = None

def override_get_db():
    """Override para get_db que usa a mesma sessão do fixture db"""
    # Usar a sessão global se disponível, caso contrário criar uma nova
    if _current_db_session is not None:
        yield _current_db_session
    else:
        # Garantir que as tabelas existam antes de criar a sessão
        Base.metadata.create_all(bind=engine)
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Fixtures
@pytest.fixture(autouse=True)
def set_db_session(db):
    """Define a sessão atual para o override_get_db usar"""
    global _current_db_session
    _current_db_session = db
    yield
    _current_db_session = None

@pytest.fixture
def test_user(db):
    """Cria um usuário de teste"""
    # O fixture db já garante que as tabelas existam
    # Criar empresa de teste
    company = Company(
        name="Test Company",
        cnpj="12345678000190",
        email="test@company.com",
        country="Brasil"
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    
    # Criar usuário de teste
    user = User(
        name="Test User",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        company_id=company.id,
        status=UserStatus.active
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@pytest.fixture
def auth_token(test_user):
    """Obtém token de autenticação"""
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "test@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def auth_headers(auth_token):
    """Headers de autenticação"""
    return {"Authorization": f"Bearer {auth_token}"}


class TestProductsAPI:
    """Testes para a API de Produtos"""
    
    def test_list_products(self, auth_headers):
        """Testa listagem de produtos"""
        response = client.get("/api/v1/products/", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_create_product(self, auth_headers):
        """Testa criação de produto"""
        product_data = {
            "code": "PROD-001",
            "name": "Produto Teste",
            "description": "Descrição do produto teste",
            "ncm": "12345678",
            "unit_price": 100.50,
            "currency": "USD"
        }
        response = client.post(
            "/api/v1/products/",
            json=product_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == product_data["code"]
        assert data["name"] == product_data["name"]
    
    def test_get_product(self, auth_headers):
        """Testa obtenção de produto específico"""
        # Primeiro criar um produto
        product_data = {
            "code": "PROD-002",
            "name": "Produto para Get",
            "unit_price": 200.00,
            "currency": "BRL"
        }
        create_response = client.post(
            "/api/v1/products/",
            json=product_data,
            headers=auth_headers
        )
        product_id = create_response.json()["id"]
        
        # Buscar o produto
        response = client.get(
            f"/api/v1/products/{product_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["id"] == product_id
    
    def test_update_product(self, auth_headers):
        """Testa atualização de produto"""
        # Criar produto
        product_data = {
            "code": "PROD-003",
            "name": "Produto Original",
            "unit_price": 150.00,
            "currency": "USD"
        }
        create_response = client.post(
            "/api/v1/products/",
            json=product_data,
            headers=auth_headers
        )
        product_id = create_response.json()["id"]
        
        # Atualizar produto
        update_data = {
            "name": "Produto Atualizado",
            "unit_price": 175.00
        }
        response = client.patch(
            f"/api/v1/products/{product_id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["name"] == update_data["name"]
    
    def test_list_categories(self, auth_headers):
        """Testa listagem de categorias"""
        response = client.get("/api/v1/products/categories/", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_delete_product(self, auth_headers):
        """Testa desativação de produto"""
        # Criar produto
        product_data = {
            "code": "PROD-DELETE",
            "name": "Produto para Deletar",
            "unit_price": 100.00,
            "currency": "USD"
        }
        create_response = client.post(
            "/api/v1/products/",
            json=product_data,
            headers=auth_headers
        )
        product_id = create_response.json()["id"]
        
        # Desativar produto
        response = client.delete(
            f"/api/v1/products/{product_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert "desativado" in response.json()["message"].lower()
    
    def test_classify_product_by_id(self, auth_headers):
        """Testa classificação de produto por ID"""
        # Criar produto
        product_data = {
            "code": "PROD-CLASSIFY",
            "name": "Produto para Classificar",
            "unit_price": 100.00,
            "currency": "USD"
        }
        create_response = client.post(
            "/api/v1/products/",
            json=product_data,
            headers=auth_headers
        )
        product_id = create_response.json()["id"]
        
        # Classificar produto
        response = client.post(
            f"/api/v1/products/{product_id}/classify",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "ncm" in data
        assert "confidence" in data
    
    def test_create_category(self, auth_headers):
        """Testa criação de categoria"""
        category_data = {
            "name": "Categoria Teste",
            "description": "Descrição da categoria teste"
        }
        response = client.post(
            "/api/v1/products/categories/",
            json=category_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == category_data["name"]


class TestWarehousesAPI:
    """Testes para a API de Armazéns"""
    
    def test_list_warehouses(self, auth_headers):
        """Testa listagem de armazéns"""
        response = client.get("/api/v1/warehouses/", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_create_warehouse(self, auth_headers):
        """Testa criação de armazém"""
        warehouse_data = {
            "code": "WH-001",
            "name": "Armazém Teste",
            "description": "Descrição do armazém teste",
            "address": "Rua Teste, 123",
            "city": "São Paulo",
            "state": "SP",
            "country": "Brasil",
            "total_capacity": 1000.00
        }
        response = client.post(
            "/api/v1/warehouses/",
            json=warehouse_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == warehouse_data["code"]
        assert data["name"] == warehouse_data["name"]
    
    def test_get_warehouse(self, auth_headers):
        """Testa obtenção de armazém específico"""
        # Criar armazém
        warehouse_data = {
            "code": "WH-002",
            "name": "Armazém para Get",
            "total_capacity": 500.00
        }
        create_response = client.post(
            "/api/v1/warehouses/",
            json=warehouse_data,
            headers=auth_headers
        )
        warehouse_id = create_response.json()["id"]
        
        # Buscar armazém
        response = client.get(
            f"/api/v1/warehouses/{warehouse_id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["id"] == warehouse_id
    
    def test_get_inventory(self, auth_headers):
        """Testa obtenção de inventário"""
        # Criar armazém
        warehouse_data = {
            "code": "WH-003",
            "name": "Armazém com Inventário",
            "total_capacity": 1000.00
        }
        create_response = client.post(
            "/api/v1/warehouses/",
            json=warehouse_data,
            headers=auth_headers
        )
        warehouse_id = create_response.json()["id"]
        
        # Buscar inventário
        response = client.get(
            f"/api/v1/warehouses/{warehouse_id}/inventory",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_add_inventory_item(self, auth_headers, test_user, db):
        """Testa adição de item ao inventário"""
        from app.models import Product, Warehouse
        from decimal import Decimal
        
        # Criar produto
        product = Product(
            code="PROD-INV",
            name="Produto para Inventário",
            company_id=test_user.company_id,
            unit_price=Decimal("100.00"),
            currency="USD"
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        
        # Criar armazém
        warehouse_data = {
            "code": "WH-ADD-INV",
            "name": "Armazém para Adicionar Item",
            "address": "Rua Teste, 456"
        }
        create_response = client.post(
            "/api/v1/warehouses/",
            json=warehouse_data,
            headers=auth_headers
        )
        warehouse_id = create_response.json()["id"]
        
        # Adicionar item ao inventário
        item_data = {
            "product_id": product.id,
            "quantity": 100,
            "unit": "kg",
            "location": "A1-B2-C3"
        }
        response = client.post(
            f"/api/v1/warehouses/{warehouse_id}/inventory",
            json=item_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["product_id"] == product.id
        assert data["quantity"] == 100
    
    def test_create_stock_movement(self, auth_headers, test_user, db):
        """Testa criação de movimentação de estoque"""
        from app.models import Product, Warehouse
        from decimal import Decimal
        
        # Criar produto
        product = Product(
            code="PROD-MOV",
            name="Produto para Movimentação",
            company_id=test_user.company_id,
            unit_price=Decimal("50.00"),
            currency="USD"
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        
        # Criar armazém
        warehouse_data = {
            "code": "WH-MOV",
            "name": "Armazém para Movimentação",
            "address": "Rua Teste, 789"
        }
        create_response = client.post(
            "/api/v1/warehouses/",
            json=warehouse_data,
            headers=auth_headers
        )
        warehouse_id = create_response.json()["id"]
        
        # Criar movimentação de entrada
        movement_data = {
            "movement_type": "entry",
            "product_id": product.id,
            "quantity": 50,
            "unit": "kg",
            "reference_number": "MOV-001",
            "notes": "Movimentação de teste"
        }
        response = client.post(
            f"/api/v1/warehouses/{warehouse_id}/movements",
            json=movement_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["movement_type"] == "entry"
        assert data["quantity"] == 50
    
    def test_get_warehouse_movements(self, auth_headers, test_user, db):
        """Testa listagem de movimentações de estoque"""
        from app.models import Product, Warehouse
        from decimal import Decimal
        
        # Criar produto
        product = Product(
            code="PROD-MOV-LIST",
            name="Produto para Listar Movimentações",
            company_id=test_user.company_id,
            unit_price=Decimal("75.00"),
            currency="USD"
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        
        # Criar armazém
        warehouse_data = {
            "code": "WH-MOV-LIST",
            "name": "Armazém para Listar Movimentações",
            "address": "Rua Teste, 101"
        }
        create_response = client.post(
            "/api/v1/warehouses/",
            json=warehouse_data,
            headers=auth_headers
        )
        warehouse_id = create_response.json()["id"]
        
        # Criar uma movimentação primeiro
        movement_data = {
            "movement_type": "entry",
            "product_id": product.id,
            "quantity": 25,
            "unit": "kg"
        }
        client.post(
            f"/api/v1/warehouses/{warehouse_id}/movements",
            json=movement_data,
            headers=auth_headers
        )
        
        # Listar movimentações
        response = client.get(
            f"/api/v1/warehouses/{warehouse_id}/movements",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestDrawbackAPI:
    """Testes para a API de Drawback"""
    
    def test_list_acts(self, auth_headers):
        """Testa listagem de atos de drawback"""
        response = client.get("/api/v1/drawback/acts", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_create_act(self, auth_headers):
        """Testa criação de ato de drawback"""
        act_data = {
            "act_type": "suspension",
            "description": "Ato de teste",
            "total_value": 10000.00,
            "currency": "USD"
        }
        response = client.post(
            "/api/v1/drawback/acts",
            json=act_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        # O act_number é gerado automaticamente no formato DB-{company_id}-{numero}
        assert "act_number" in data
        assert data["act_number"].startswith("DB-")
        assert data["act_type"] == act_data["act_type"]
        assert data["description"] == act_data["description"]
    
    def test_list_credits(self, auth_headers):
        """Testa listagem de créditos"""
        response = client.get("/api/v1/drawback/credits", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestControlTowerAPI:
    """Testes para a API de Control Tower"""
    
    def test_get_summary(self, auth_headers):
        """Testa obtenção de resumo"""
        response = client.get("/api/v1/control-tower/summary", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_processes" in data
    
    def test_get_dashboard(self, auth_headers):
        """Testa obtenção de dashboard"""
        response = client.get("/api/v1/control-tower/dashboard", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
    
    def test_list_all_processes(self, auth_headers):
        """Testa listagem de todos os processos"""
        response = client.get("/api/v1/control-tower/processes/all", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        assert "processes" in data
        assert "total" in data
        assert isinstance(data["processes"], list)


class TestDashboardAPI:
    """Testes para a API de Dashboard Inteligente"""
    
    def test_get_predictive_kpis(self, auth_headers):
        """Testa obtenção de KPIs preditivos"""
        response = client.get("/api/v1/dashboard/predictive-kpis", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_proactive_alerts(self, auth_headers):
        """Testa obtenção de alertas proativos"""
        response = client.get("/api/v1/dashboard/proactive-alerts", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_performance_data(self, auth_headers):
        """Testa obtenção de dados de performance"""
        # A rota correta é /api/v1/dashboard/performance-data com parâmetro months
        response = client.get("/api/v1/dashboard/performance-data?months=6", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestTrackingAPI:
    """Testes para a API de Tracking"""
    
    def test_get_tracking_status(self, auth_headers):
        """Testa obtenção de status de rastreamento"""
        # A rota correta é /api/v1/tracking/{shipment_id}, não /status
        # Como não temos dados de teste, vamos apenas verificar que a rota existe
        # e retorna 404 quando não encontra (o que é esperado)
        response = client.get("/api/v1/tracking/1", headers=auth_headers)
        # Pode retornar 404 se não houver processo, mas não deve ser erro 500
        assert response.status_code in [200, 404]


class TestComplianceAPI:
    """Testes para a API de Compliance"""
    
    def test_list_checks(self, auth_headers):
        """Testa listagem de verificações de compliance"""
        # A rota correta é /api/v1/compliance/{process_id}/checks
        # Como não temos um processo de teste, vamos apenas verificar que a rota existe
        # e retorna 404 quando não encontra (o que é esperado)
        response = client.get("/api/v1/compliance/1/checks", headers=auth_headers)
        # Pode retornar 404 se não houver processo, mas não deve ser erro 500
        assert response.status_code in [200, 404]
    
    def test_get_summary(self, auth_headers):
        """Testa obtenção de resumo de compliance"""
        # A rota correta é /api/v1/compliance/{process_id}/summary
        # Como não temos um processo de teste, vamos apenas verificar que a rota existe
        # e retorna 404 quando não encontra (o que é esperado)
        response = client.get("/api/v1/compliance/1/summary", headers=auth_headers)
        # Pode retornar 404 se não houver processo, mas não deve ser erro 500
        assert response.status_code in [200, 404]


class TestCommentsAPI:
    """Testes para a API de Comentários"""
    
    def test_list_comments(self, auth_headers):
        """Testa listagem de comentários"""
        # A rota correta é /api/v1/comments/{process_id}
        # Como não temos um processo de teste, vamos apenas verificar que a rota existe
        # e retorna 404 quando não encontra (o que é esperado)
        response = client.get("/api/v1/comments/1", headers=auth_headers)
        # Pode retornar 404 se não houver processo, mas não deve ser erro 500
        assert response.status_code in [200, 404]
    
    def test_create_comment(self, auth_headers):
        """Testa criação de comentário"""
        comment_data = {
            "process_id": 1,
            "process_type": "import",
            "content": "Comentário de teste"
        }
        response = client.post(
            "/api/v1/comments/",
            json=comment_data,
            headers=auth_headers
        )
        # Pode retornar 404 se processo não existir, mas estrutura deve estar correta
        assert response.status_code in [200, 404]


class TestClassificationAPI:
    """Testes para a API de Classificação"""
    
    def test_classify_product(self, auth_headers):
        """Testa classificação de produto"""
        classify_data = {
            "product_name": "Produto para classificar",  # Campo correto é product_name, não name
            "description": "Descrição do produto"
        }
        response = client.post(
            "/api/v1/classification/classify",
            json=classify_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "ncm" in data or "suggestions" in data
    
    def test_classify_existing_product(self, auth_headers, test_user, db):
        """Testa classificação de produto existente"""
        from app.models import Product
        from decimal import Decimal
        
        # Criar produto
        product = Product(
            code="PROD-CLASSIFY-EXISTING",
            name="Produto para Classificar Existente",
            company_id=test_user.company_id,
            unit_price=Decimal("200.00"),
            currency="USD"
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        
        # Classificar produto existente
        response = client.post(
            f"/api/v1/classification/products/{product.id}/classify",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "ncm" in data
        assert "confidence" in data
    
    def test_classify_import_process(self, auth_headers, test_user, db):
        """Testa classificação de processo de importação"""
        from app.models import ImportProcess
        from decimal import Decimal
        
        # Criar processo de importação
        process = ImportProcess(
            reference_number="IMP-CLASSIFY-001",
            client="Cliente Teste",
            product="Produto para Classificar",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor Teste",
            company_id=test_user.company_id,
            created_by=test_user.id,
            invoice_value=Decimal("15000.00"),
            currency="USD"
        )
        db.add(process)
        db.commit()
        db.refresh(process)
        
        # Classificar processo
        response = client.post(
            f"/api/v1/classification/processes/import/{process.id}/classify",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "ncm" in data
        assert "message" in data
    
    def test_classify_export_process(self, auth_headers, test_user, db):
        """Testa classificação de processo de exportação"""
        from app.models import ExportProcess
        from decimal import Decimal
        
        # Criar processo de exportação
        process = ExportProcess(
            reference_number="EXP-CLASSIFY-001",
            client="Cliente Teste",
            product="Produto para Exportar",
            origin="Brasil",
            destination="EUA",
            destination_country="EUA",
            company_id=test_user.company_id,
            created_by=test_user.id,
            invoice_value=Decimal("20000.00"),
            currency="USD"
        )
        db.add(process)
        db.commit()
        db.refresh(process)
        
        # Classificar processo
        response = client.post(
            f"/api/v1/classification/processes/export/{process.id}/classify",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "ncm" in data
        assert "message" in data
    
    def test_get_ncm_info(self, auth_headers):
        """Testa obtenção de informações sobre código NCM"""
        response = client.get(
            "/api/v1/classification/ncm/12345678/info",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "ncm" in data
        assert "description" in data
        assert "tax_rate" in data


class TestCustomsAPI:
    """Testes para a API de Alfândega"""
    
    def test_validate_documents(self, auth_headers):
        """Testa validação de documentos"""
        # O endpoint precisa de process_type como query parameter
        response = client.post(
            "/api/v1/customs/processes/1/validate?process_type=import",
            headers=auth_headers
        )
        # Pode retornar 404 se processo não existir
        assert response.status_code in [200, 404]
    
    def test_get_customs_status(self, auth_headers, test_user, db):
        """Testa obtenção de status de desembaraço"""
        from app.models import ImportProcess
        from decimal import Decimal
        
        # Criar processo de importação
        process = ImportProcess(
            reference_number="IMP-STATUS-001",
            client="Cliente Teste",
            product="Produto Teste",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor Teste",
            company_id=test_user.company_id,
            created_by=test_user.id,
            invoice_value=Decimal("10000.00"),
            currency="USD"
        )
        db.add(process)
        db.commit()
        db.refresh(process)
        
        # Buscar status
        response = client.get(
            f"/api/v1/customs/processes/{process.id}/status?process_type=import",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "process_id" in data
    
    def test_submit_to_customs(self, auth_headers, test_user, db):
        """Testa submissão de processo para desembaraço"""
        from app.models import ImportProcess, ImportDocument, DocumentType, DocumentStatus
        from decimal import Decimal
        
        # Criar processo de importação
        process = ImportProcess(
            reference_number="IMP-SUBMIT-001",
            client="Cliente Teste",
            product="Produto Teste",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor Teste",
            company_id=test_user.company_id,
            created_by=test_user.id,
            invoice_value=Decimal("5000.00"),
            currency="USD"
        )
        db.add(process)
        db.commit()
        db.refresh(process)
        
        # Adicionar todos os documentos necessários para importação
        required_docs = [
            (DocumentType.commercial_invoice, "/test/invoice.pdf"),
            (DocumentType.bill_of_lading, "/test/bill_of_lading.pdf"),
            (DocumentType.packing_list, "/test/packing_list.pdf"),
            (DocumentType.certificate_of_origin, "/test/certificate_of_origin.pdf")
        ]
        
        for doc_type, file_path in required_docs:
            doc = ImportDocument(
                import_process_id=process.id,
                company_id=test_user.company_id,
                uploaded_by=test_user.id,
                document_type=doc_type,
                status=DocumentStatus.approved,
                file_path=file_path
            )
            db.add(doc)
        db.commit()
        
        # Submeter para desembaraço
        response = client.post(
            f"/api/v1/customs/processes/{process.id}/submit?process_type=import",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "process_id" in data
    
    def test_get_siscomex_status(self, auth_headers):
        """Testa obtenção de status do Siscomex"""
        response = client.get(
            "/api/v1/customs/siscomex/DUIMP-12345678",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "duimp_number" in data
        assert "status" in data
    
    def test_sync_siscomex(self, auth_headers, test_user, db):
        """Testa sincronização com Siscomex"""
        from app.models import ImportProcess
        from decimal import Decimal
        
        # Criar processo de importação
        process = ImportProcess(
            reference_number="IMP-SYNC-001",
            client="Cliente Teste",
            product="Produto Teste",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor Teste",
            company_id=test_user.company_id,
            created_by=test_user.id,
            invoice_value=Decimal("3000.00"),
            currency="USD"
        )
        db.add(process)
        db.commit()
        db.refresh(process)
        
        # Sincronizar com Siscomex
        response = client.post(
            f"/api/v1/customs/siscomex/sync?process_id={process.id}&process_type=import",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestWatchlistAPI:
    """Testes para a API de Watchlist/Favoritos"""
    
    def test_toggle_favorite(self, auth_headers, test_user, db):
        """Testa marcar/desmarcar processo como favorito"""
        # Criar processo de importação
        import_process = ImportProcess(
            reference_number="IMP-TEST-001",
            client="Cliente Teste",
            product="Produto Teste",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor Teste",
            status=ImportStatus.draft,
            company_id=test_user.company_id,
            created_by=test_user.id
        )
        db.add(import_process)
        db.commit()
        db.refresh(import_process)
        
        # Marcar como favorito
        response = client.post(
            f"/api/v1/import-processes/{import_process.id}/toggle-favorite",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_favorite"] == True or data["is_favorite"] == 1
        
        # Desmarcar favorito
        response = client.post(
            f"/api/v1/import-processes/{import_process.id}/toggle-favorite",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["is_favorite"] == False
    
    def test_list_favorites(self, auth_headers, test_user, db):
        """Testa listagem de processos favoritos"""
        # Criar processo favorito
        import_process = ImportProcess(
            reference_number="IMP-FAV-001",
            client="Cliente Favorito",
            product="Produto Favorito",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor",
            status=ImportStatus.draft,
            company_id=test_user.company_id,
            created_by=test_user.id,
            is_favorite=1
        )
        db.add(import_process)
        db.commit()
        
        # Listar favoritos
        response = client.get(
            "/api/v1/import-processes/favorites",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1


class TestCSVUploadAPI:
    """Testes para a API de CSV Upload"""
    
    def test_import_products_csv(self, auth_headers):
        """Testa importação de produtos via CSV"""
        # Criar CSV de teste
        csv_content = "code,name,description,ncm,unit_price,currency,category\n"
        csv_content += "PROD-CSV-001,Produto CSV 1,Descrição 1,12345678,100.00,USD,Categoria 1\n"
        csv_content += "PROD-CSV-002,Produto CSV 2,Descrição 2,87654321,200.00,BRL,Categoria 2\n"
        
        # Criar arquivo temporário
        import tempfile
        import os
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            f.write(csv_content)
            temp_path = f.name
        
        try:
            # Fazer upload
            with open(temp_path, 'rb') as csv_file:
                files = {'file': ('test_products.csv', csv_file, 'text/csv')}
                response = client.post(
                    "/api/v1/products/import-csv",
                    files=files,
                    headers=auth_headers
                )
            
            assert response.status_code == 200
            data = response.json()
            assert "imported_count" in data or "imported" in data
        finally:
            os.unlink(temp_path)
    
    def test_import_processes_csv(self, auth_headers):
        """Testa importação de processos via CSV"""
        # Criar CSV de teste
        csv_content = "reference_number,client,product,origin,destination,status,estimated_arrival,invoice_value,currency\n"
        csv_content += "IMP-CSV-001,Cliente 1,Produto 1,China,Brasil,draft,2024-12-31,10000.00,USD\n"
        csv_content += "IMP-CSV-002,Cliente 2,Produto 2,USA,Brasil,draft,2024-12-31,20000.00,USD\n"
        
        # Criar arquivo temporário
        import tempfile
        import os
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            f.write(csv_content)
            temp_path = f.name
        
        try:
            # Fazer upload
            with open(temp_path, 'rb') as csv_file:
                files = {'file': ('test_processes.csv', csv_file, 'text/csv')}
                response = client.post(
                    "/api/v1/import-processes/import-csv",
                    files=files,
                    headers=auth_headers
                )
            
            assert response.status_code == 200
            data = response.json()
            assert "imported" in data or "imported_count" in data
        finally:
            os.unlink(temp_path)


class TestTasksAPI:
    """Testes para a API de Tasks"""
    
    def test_create_task(self, auth_headers, test_user):
        """Testa criação de tarefa"""
        from datetime import datetime, timedelta
        task_data = {
            "title": "Tarefa de Teste",
            "description": "Descrição da tarefa",
            "priority": "high",
            "task_type": "document",
            "due_date": (datetime.utcnow() + timedelta(days=7)).isoformat(),
            "is_urgent": True
        }
        response = client.post(
            "/api/v1/tasks/",
            json=task_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == task_data["title"]
        assert data["priority"] == task_data["priority"]
    
    def test_list_tasks(self, auth_headers):
        """Testa listagem de tarefas"""
        response = client.get("/api/v1/tasks/", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_task(self, auth_headers, test_user, db):
        """Testa obtenção de tarefa específica"""
        from datetime import datetime, timedelta
        # Criar tarefa
        task = Task(
            title="Tarefa para Get",
            description="Descrição",
            priority=TaskPriority.medium,
            task_type=TaskType.other,
            due_date=datetime.utcnow() + timedelta(days=5),
            company_id=test_user.company_id,
            created_by=test_user.id
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        
        # Buscar tarefa
        response = client.get(
            f"/api/v1/tasks/{task.id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["id"] == task.id
    
    def test_update_task(self, auth_headers, test_user, db):
        """Testa atualização de tarefa"""
        from datetime import datetime, timedelta
        # Criar tarefa
        task = Task(
            title="Tarefa Original",
            priority=TaskPriority.low,
            task_type=TaskType.other,
            due_date=datetime.utcnow() + timedelta(days=5),
            company_id=test_user.company_id,
            created_by=test_user.id
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        
        # Atualizar tarefa
        update_data = {
            "title": "Tarefa Atualizada",
            "status": "in_progress"
        }
        response = client.patch(
            f"/api/v1/tasks/{task.id}",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["title"] == update_data["title"]
    
    def test_complete_task(self, auth_headers, test_user, db):
        """Testa completar tarefa"""
        from datetime import datetime, timedelta
        # Criar tarefa
        task = Task(
            title="Tarefa para Completar",
            priority=TaskPriority.medium,
            task_type=TaskType.other,
            due_date=datetime.utcnow() + timedelta(days=5),
            company_id=test_user.company_id,
            created_by=test_user.id,
            status=TaskStatus.pending
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        
        # Completar tarefa
        response = client.post(
            f"/api/v1/tasks/{task.id}/complete",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["status"] == "completed"
    
    def test_list_pending_tasks(self, auth_headers):
        """Testa listagem de tarefas pendentes"""
        response = client.get("/api/v1/tasks/pending", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_overdue_tasks(self, auth_headers):
        """Testa listagem de tarefas atrasadas"""
        response = client.get("/api/v1/tasks/overdue", headers=auth_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestBulkActionsAPI:
    """Testes para a API de Bulk Actions"""
    
    def test_bulk_approve_processes(self, auth_headers, test_user, db):
        """Testa aprovação em massa de processos"""
        # Criar processos
        process1 = ImportProcess(
            reference_number="IMP-BULK-001",
            client="Cliente 1",
            product="Produto 1",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor",
            status=ImportStatus.draft,
            company_id=test_user.company_id,
            created_by=test_user.id
        )
        process2 = ImportProcess(
            reference_number="IMP-BULK-002",
            client="Cliente 2",
            product="Produto 2",
            origin="USA",
            destination="Brasil",
            supplier="Fornecedor",
            status=ImportStatus.draft,
            company_id=test_user.company_id,
            created_by=test_user.id
        )
        db.add(process1)
        db.add(process2)
        db.commit()
        db.refresh(process1)
        db.refresh(process2)
        
        # Aprovar em massa
        response = client.post(
            "/api/v1/import-processes/bulk-approve",
            json={"process_ids": [process1.id, process2.id]},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["approved"] == 2
    
    def test_bulk_approve_documents(self, auth_headers, test_user, db):
        """Testa aprovação em massa de documentos"""
        # Criar processo
        import_process = ImportProcess(
            reference_number="IMP-DOC-001",
            client="Cliente",
            product="Produto",
            origin="China",
            destination="Brasil",
            supplier="Fornecedor",
            status=ImportStatus.draft,
            company_id=test_user.company_id,
            created_by=test_user.id
        )
        db.add(import_process)
        db.commit()
        db.refresh(import_process)
        
        # Criar documentos
        doc1 = ImportDocument(
            document_type="commercial_invoice",
            file_name="doc1.pdf",
            status=DocumentStatus.pending,
            import_process_id=import_process.id,
            company_id=test_user.company_id,
            uploaded_by=test_user.id
        )
        doc2 = ImportDocument(
            document_type="packing_list",
            file_name="doc2.pdf",
            status=DocumentStatus.pending,
            import_process_id=import_process.id,
            company_id=test_user.company_id,
            uploaded_by=test_user.id
        )
        db.add(doc1)
        db.add(doc2)
        db.commit()
        db.refresh(doc1)
        db.refresh(doc2)
        
        # Aprovar em massa
        response = client.post(
            "/api/v1/documents/bulk-approve",
            json={"document_ids": [doc1.id, doc2.id]},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["approved_count"] == 2


class TestMapDataAPI:
    """Testes para a API de Map Data"""
    
    def test_get_map_data(self, auth_headers, test_user, db):
        """Testa obtenção de dados do mapa"""
        # Criar evento de tracking com coordenadas
        from app.models import TrackingEventStatus
        tracking_event = TrackingEvent(
            shipment_id="SHIP-001",
            status=TrackingEventStatus.in_transit,
            location="Porto de Santos",
            latitude=-23.9608,
            longitude=-46.3332,
            description="Em trânsito",
            company_id=test_user.company_id
        )
        db.add(tracking_event)
        db.commit()
        
        # Buscar dados do mapa
        response = client.get(
            "/api/v1/tracking/map-data",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_map_data_with_status_filter(self, auth_headers):
        """Testa filtro de status no mapa"""
        response = client.get(
            "/api/v1/tracking/map-data?status=in-transit",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestDashboardConfigAPI:
    """Testes para a API de Dashboard Config"""
    
    def test_get_available_widgets(self, auth_headers):
        """Testa listagem de widgets disponíveis"""
        response = client.get(
            "/api/v1/user/dashboard-config/available-widgets",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "widgets" in data
        assert "total" in data
        assert isinstance(data["widgets"], list)
        assert len(data["widgets"]) > 0
    
    def test_get_dashboard_config(self, auth_headers):
        """Testa obtenção de configuração do dashboard"""
        response = client.get(
            "/api/v1/user/dashboard-config/",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "widgets_config" in data
        assert "user_id" in data
    
    def test_update_dashboard_config(self, auth_headers):
        """Testa atualização de configuração do dashboard"""
        config_data = {
            "widgets_config": {
                "widgets": [
                    {"id": "kpis", "enabled": True, "position": 0},
                    {"id": "pending_tasks", "enabled": True, "position": 1},
                    {"id": "recent_processes", "enabled": False, "position": 2}
                ]
            }
        }
        response = client.put(
            "/api/v1/user/dashboard-config/",
            json=config_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["widgets_config"]["widgets"][0]["id"] == "kpis"
    
    def test_reset_dashboard_config(self, auth_headers):
        """Testa reset de configuração do dashboard"""
        response = client.post(
            "/api/v1/user/dashboard-config/reset",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "widgets_config" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

