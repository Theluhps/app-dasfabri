# 🏗️ ESTRUTURA BIG TECH - DASFABRI

## 📐 ARQUITETURA PROPOSTA (Estilo Google/Microsoft)

```
dasfabri/
├── .github/                          # CI/CD e workflows
│   └── workflows/
│       ├── ci.yml                    # Continuous Integration
│       └── deploy.yml               # Deploy automation
│
├── apps/                             # Aplicações (Monorepo style)
│   ├── marketing-site/               # Site público/marketing
│   │   ├── frontend/                 # React frontend
│   │   │   ├── src/
│   │   │   ├── public/
│   │   │   ├── package.json
│   │   │   └── vite.config.ts
│   │   └── backend/                  # API de marketing (opcional)
│   │       ├── api/
│   │       ├── main.py
│   │       └── requirements.txt
│   │
│   └── saas-platform/                # Sistema SaaS principal
│       ├── backend/                   # FastAPI backend
│       │   ├── app/
│       │   │   ├── api/              # Rotas da API
│       │   │   │   ├── v1/
│       │   │   │   │   ├── auth.py
│       │   │   │   │   ├── users.py
│       │   │   │   │   └── ...
│       │   │   ├── core/             # Configurações core
│       │   │   │   ├── config.py
│       │   │   │   ├── security.py
│       │   │   │   └── database.py
│       │   │   ├── models/           # Modelos SQLAlchemy
│       │   │   ├── schemas/          # Pydantic schemas
│       │   │   └── services/         # Business logic
│       │   ├── alembic/              # Migrações
│       │   │   ├── versions/
│       │   │   └── env.py
│       │   ├── tests/                # Testes
│       │   │   ├── unit/
│       │   │   ├── integration/
│       │   │   └── e2e/
│       │   ├── scripts/              # Scripts utilitários
│       │   ├── main.py               # Entry point
│       │   ├── requirements.txt
│       │   └── alembic.ini
│       │
│       └── frontend/                  # Frontend do sistema (se diferente)
│           └── [estrutura React]
│
├── infrastructure/                    # Infraestrutura como código
│   ├── docker/                        # Dockerfiles
│   │   ├── backend.Dockerfile
│   │   └── frontend.Dockerfile
│   ├── kubernetes/                    # K8s manifests (futuro)
│   ├── terraform/                     # Terraform (futuro)
│   └── scripts/                       # Scripts de deploy
│       ├── deploy.sh
│       └── setup.sh
│
├── shared/                            # Código compartilhado
│   ├── types/                         # TypeScript types compartilhados
│   ├── utils/                         # Utilitários compartilhados
│   └── constants/                     # Constantes compartilhadas
│
├── docs/                              # Documentação
│   ├── public/                        # Documentação pública
│   │   ├── api/                       # Documentação da API
│   │   ├── user-guide/                # Guia do usuário
│   │   └── getting-started.md
│   │
│   └── internal/                      # Documentação interna ⚠️ SIGILOSA
│       ├── .gitignore                 # Ignorar no git
│       ├── architecture/               # Arquitetura do sistema
│       │   ├── system-design.md
│       │   ├── database-schema.md
│       │   └── api-design.md
│       ├── design/                    # Design decisions
│       │   ├── decisions/
│       │   └── patterns/
│       ├── processes/                 # Processos internos
│       │   ├── development.md
│       │   └── deployment.md
│       └── security/                  # Segurança
│           └── security-policy.md
│
├── presentations/                     # Apresentações
│   ├── commercial/                    # Apresentações comerciais
│   └── technical/                     # Apresentações técnicas
│
├── data/                              # Dados e bancos
│   ├── databases/                     # Bancos de dados
│   │   └── kue_marketing.db           # Banco principal
│   └── seeds/                         # Dados de seed
│
├── scripts/                           # Scripts de manutenção
│   ├── cleanup.sh
│   ├── backup.sh
│   └── migration.sh
│
├── .gitignore                         # Git ignore global
├── .env.example                       # Exemplo de variáveis de ambiente
├── docker-compose.yml                 # Docker compose
├── package.json                       # Workspace root (se monorepo)
├── README.md                          # Documentação principal
└── CONTRIBUTING.md                    # Guia de contribuição
```

## 🔄 MAPEAMENTO DE ARQUIVOS ATUAIS

### Site de Marketing
- `Dasfabri/Dasfabri-Platform/` → `apps/marketing-site/frontend/`
- `Dasfabri/backend/` → `apps/marketing-site/backend/` (se necessário)

### Sistema SaaS
- `backend/` → `apps/saas-platform/backend/`
- `kue_marketing.db` → `data/databases/kue_marketing.db`

### Documentação
- `Apresentações/` → `presentations/`
- Criar `docs/internal/` para documentação sigilosa

### Limpeza
- `Dasfabri Platform/` → Verificar se é duplicado
- `Dasfabri-Platform/` → Verificar se é duplicado
- `src/` (raiz) → Verificar se é necessário

## 🔒 PROTEÇÃO DE DOCUMENTAÇÃO SIGILOSA

1. `.gitignore` em `docs/internal/` para não commitar
2. Permissões de acesso restritas
3. Separação clara de documentação pública vs sigilosa

## ✅ PRINCÍPIOS DA ESTRUTURA

1. **Separação de Responsabilidades**: Cada app em sua pasta
2. **Escalabilidade**: Estrutura preparada para crescimento
3. **Manutenibilidade**: Código organizado e documentado
4. **Segurança**: Documentação sigilosa protegida
5. **CI/CD Ready**: Estrutura preparada para automação
6. **Monorepo Style**: Tudo em um repositório, mas organizado

