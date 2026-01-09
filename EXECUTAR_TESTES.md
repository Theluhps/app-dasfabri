# 🧪 Como Executar os Testes Automatizados

## 📋 Pré-requisitos

1. Python 3.8+ instalado
2. Virtual environment (venv) ativado
3. Dependências do backend instaladas

## 🚀 Execução Rápida

### Opção 1: Usando o Script (Recomendado)

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"
source venv/bin/activate
cd apps/saas-platform/backend
./scripts/run_tests.sh
```

### Opção 2: Manual

```bash
# 1. Ativar venv
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"
source venv/bin/activate

# 2. Ir para o backend
cd apps/saas-platform/backend

# 3. Instalar dependências de teste (se necessário)
pip install -r requirements-test.txt

# 4. Executar testes
pytest tests/test_apis.py -v
```

## 📊 Comandos Úteis

### Executar todos os testes
```bash
pytest tests/test_apis.py -v
```

### Executar testes específicos
```bash
# Apenas API de Produtos
pytest tests/test_apis.py::TestProductsAPI -v

# Apenas API de Armazéns
pytest tests/test_apis.py::TestWarehousesAPI -v

# Teste específico
pytest tests/test_apis.py::TestProductsAPI::test_create_product -v
```

### Executar com mais detalhes
```bash
pytest tests/test_apis.py -v --tb=long
```

### Executar com cobertura
```bash
pytest tests/test_apis.py --cov=app --cov-report=html
```

### Executar apenas testes que falharam
```bash
pytest tests/test_apis.py --lf
```

## 📋 APIs Testadas

Os testes cobrem as seguintes APIs:

1. ✅ **Products API** - CRUD completo de produtos
2. ✅ **Warehouses API** - CRUD completo de armazéns
3. ✅ **Drawback API** - Gestão de atos e créditos
4. ✅ **Control Tower API** - Dashboard unificado
5. ✅ **Dashboard API** - KPIs preditivos e alertas
6. ✅ **Tracking API** - Rastreamento em tempo real
7. ✅ **Compliance API** - Verificações de compliance
8. ✅ **Comments API** - Sistema de comentários
9. ✅ **Classification API** - Classificação automática
10. ✅ **Customs API** - Operações alfandegárias

## 🔍 Entendendo os Resultados

### ✅ Teste Passou
```
test_create_product PASSED
```

### ❌ Teste Falhou
```
test_create_product FAILED
AssertionError: expected 200, got 404
```

### ⚠️ Teste Pulado
```
test_something SKIPPED
```

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'pytest'"
**Solução:**
```bash
pip install -r requirements-test.txt
```

### Erro: "Database locked"
**Solução:**
- Certifique-se de que não há outros processos acessando o banco
- Feche todas as conexões antes de executar

### Erro: "401 Unauthorized"
**Solução:**
- Verifique se o fixture `auth_token` está funcionando
- O usuário de teste deve estar sendo criado corretamente

### Erro: "ImportError"
**Solução:**
- Verifique se todas as dependências estão instaladas
- Execute: `pip install -r requirements.txt`

## 📈 Exemplo de Saída

```
tests/test_apis.py::TestProductsAPI::test_list_products PASSED
tests/test_apis.py::TestProductsAPI::test_create_product PASSED
tests/test_apis.py::TestProductsAPI::test_get_product PASSED
tests/test_apis.py::TestWarehousesAPI::test_list_warehouses PASSED
...

======================== 50 passed in 15.23s ========================
```

## 🎯 Próximos Passos

Após executar os testes:
1. Verifique quais testes passaram
2. Corrija os testes que falharam
3. Adicione novos testes para funcionalidades específicas
4. Configure CI/CD para executar testes automaticamente

