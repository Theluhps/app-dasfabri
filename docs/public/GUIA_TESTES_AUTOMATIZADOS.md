# 🧪 Guia de Testes Automatizados das APIs

## 📋 Visão Geral

Este guia explica como executar os testes automatizados criados para todas as APIs do sistema.

## 🎯 O que está sendo testado?

Os testes cobrem as seguintes APIs:

1. **Products API** - Catálogo de produtos
2. **Warehouses API** - Gestão de armazéns
3. **Drawback API** - Gestão de atos de drawback
4. **Control Tower API** - Dashboard unificado
5. **Dashboard API** - KPIs preditivos e alertas
6. **Tracking API** - Rastreamento em tempo real
7. **Compliance API** - Verificações de compliance
8. **Comments API** - Sistema de comentários
9. **Classification API** - Classificação automática NCM
10. **Customs API** - Operações alfandegárias

## 🚀 Como Executar os Testes

### Pré-requisitos

1. Python 3.8+ instalado
2. Virtual environment ativado
3. Dependências instaladas

### Instalação das Dependências de Teste

```bash
cd apps/saas-platform/backend
source venv/bin/activate  # Se estiver usando venv
pip install -r requirements-test.txt
```

### Executar Todos os Testes

```bash
# Opção 1: Usando o script
cd apps/saas-platform/backend
./scripts/run_tests.sh

# Opção 2: Diretamente com pytest
pytest tests/test_apis.py -v

# Opção 3: Com mais detalhes
pytest tests/test_apis.py -v --tb=short
```

### Executar Testes Específicos

```bash
# Testar apenas API de Produtos
pytest tests/test_apis.py::TestProductsAPI -v

# Testar apenas API de Armazéns
pytest tests/test_apis.py::TestWarehousesAPI -v

# Testar apenas criação de produtos
pytest tests/test_apis.py::TestProductsAPI::test_create_product -v
```

### Executar com Cobertura

```bash
pytest tests/test_apis.py --cov=app --cov-report=html
```

## 📊 Estrutura dos Testes

### Classes de Teste

- `TestProductsAPI` - Testes da API de Produtos
- `TestWarehousesAPI` - Testes da API de Armazéns
- `TestDrawbackAPI` - Testes da API de Drawback
- `TestControlTowerAPI` - Testes da API de Control Tower
- `TestDashboardAPI` - Testes da API de Dashboard
- `TestTrackingAPI` - Testes da API de Tracking
- `TestComplianceAPI` - Testes da API de Compliance
- `TestCommentsAPI` - Testes da API de Comentários
- `TestClassificationAPI` - Testes da API de Classificação
- `TestCustomsAPI` - Testes da API de Alfândega

### Fixtures Disponíveis

- `test_user` - Cria um usuário de teste
- `auth_token` - Obtém token de autenticação
- `auth_headers` - Headers de autenticação prontos para uso

## 🔍 Exemplos de Testes

### Teste de Criação de Produto

```python
def test_create_product(self, auth_headers):
    product_data = {
        "code": "PROD-001",
        "name": "Produto Teste",
        "unit_price": 100.50,
        "currency": "USD"
    }
    response = client.post(
        "/api/v1/products/",
        json=product_data,
        headers=auth_headers
    )
    assert response.status_code == 200
```

### Teste de Listagem

```python
def test_list_products(self, auth_headers):
    response = client.get("/api/v1/products/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

## ⚙️ Configuração

### Arquivo pytest.ini

O arquivo `pytest.ini` contém a configuração padrão dos testes:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
```

### Database de Teste

Os testes usam um banco de dados SQLite em memória (`test.db`) que é criado e destruído automaticamente para cada teste.

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'pytest'"

**Solução:** Instale as dependências de teste:
```bash
pip install -r requirements-test.txt
```

### Erro: "Database locked"

**Solução:** Certifique-se de que não há outros processos acessando o banco de teste. Feche todas as conexões antes de executar os testes.

### Testes falhando com 401 (Unauthorized)

**Solução:** Verifique se o fixture `auth_token` está funcionando corretamente. O usuário de teste deve estar sendo criado antes dos testes.

## 📝 Adicionando Novos Testes

Para adicionar novos testes:

1. Crie uma nova classe de teste ou adicione métodos à classe existente
2. Use os fixtures disponíveis (`auth_headers`, `test_user`, etc.)
3. Siga o padrão de nomenclatura: `test_<nome_do_teste>`
4. Execute os testes para verificar se passam

### Exemplo de Novo Teste

```python
class TestNewAPI:
    def test_new_endpoint(self, auth_headers):
        response = client.get("/api/v1/new/endpoint", headers=auth_headers)
        assert response.status_code == 200
        assert "expected_field" in response.json()
```

## ✅ Checklist de Testes

- [x] Products API - CRUD completo
- [x] Warehouses API - CRUD completo
- [x] Drawback API - Criação e listagem
- [x] Control Tower API - Resumo e dashboard
- [x] Dashboard API - KPIs e alertas
- [x] Tracking API - Status de rastreamento
- [x] Compliance API - Listagem e resumo
- [x] Comments API - Criação e listagem
- [x] Classification API - Classificação de produtos
- [x] Customs API - Validação de documentos

## 🎯 Próximos Passos

1. Adicionar testes de integração mais complexos
2. Adicionar testes de performance
3. Adicionar testes de segurança
4. Configurar CI/CD para executar testes automaticamente

## 📚 Recursos Adicionais

- [Documentação do Pytest](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/20/core/testing.html)

