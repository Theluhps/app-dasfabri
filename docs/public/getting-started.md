# 🚀 Guia de Início Rápido - Dasfabri

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- npm ou yarn

## Instalação

### Backend (Sistema SaaS)

```bash
cd apps/saas-platform/backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend (Site de Marketing)

```bash
cd apps/marketing-site/frontend
npm install
```

## Executando

### Backend

```bash
cd apps/saas-platform/backend
uvicorn main:app --reload
```

Acesse: http://localhost:8000/docs

### Frontend

```bash
cd apps/marketing-site/frontend
npm run dev
```

Acesse: http://localhost:8080

## Estrutura do Projeto

- `apps/` - Aplicações principais
- `docs/` - Documentação
- `data/` - Bancos de dados
- `infrastructure/` - Scripts de deploy

Para mais informações, consulte a documentação completa.

