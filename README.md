# 🚀 Dasfabri - Sistema SaaS de Comércio Exterior

Sistema completo de gestão de comércio exterior com arquitetura moderna estilo Big Tech.

## 📁 Estrutura do Projeto

```
dasfabri/
├── apps/                    # Aplicações (Monorepo)
│   ├── marketing-site/     # Site público/marketing
│   └── saas-platform/      # Sistema SaaS principal
├── docs/                   # Documentação
│   ├── public/            # Documentação pública
│   └── internal/          # ⚠️ Documentação sigilosa (protegida)
├── data/                   # Dados e bancos
├── infrastructure/         # Infraestrutura e deploy
├── presentations/          # Apresentações
└── scripts/                # Scripts de manutenção
```

## 🚀 Início Rápido

### Backend (Sistema SaaS)

```bash
cd apps/saas-platform/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Acesse: http://localhost:8000/docs

### Frontend (Site de Marketing)

```bash
cd apps/marketing-site/frontend
npm install
npm run dev
```

Acesse: http://localhost:8080

### Iniciar Sistema Completo

```bash
./infrastructure/scripts/start.sh
```

## 📚 Documentação

- **Pública**: `docs/public/`
- **Sigilosa**: `docs/internal/` ⚠️ (protegida, não commitada)

## 🔒 Segurança

A documentação em `docs/internal/` é sigilosa e **NÃO será commitada** no Git. Contém informações sobre arquitetura, design e processos internos.

## 🛠️ Tecnologias

- **Backend**: FastAPI, SQLAlchemy, Alembic
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: SQLite (dev) / PostgreSQL (prod)

## 📖 Mais Informações

Consulte `docs/public/getting-started.md` para guia completo.

## ⚠️ Importante

- Documentação sigilosa em `docs/internal/` está protegida
- Teste o sistema antes de fazer deploy
- Estrutura organizada em padrão Big Tech
