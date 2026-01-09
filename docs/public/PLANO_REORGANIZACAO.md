# 📁 PLANO DE REORGANIZAÇÃO - PROJETO DASFABRI

## 🎯 OBJETIVO
Reorganizar o projeto em uma estrutura clara que separe:
1. **Site público** (marketing/landing page)
2. **Sistema SaaS** (aplicação completa)
3. **Documentação** (pública e sigilosa)
4. **Apresentações**

## 📂 NOVA ESTRUTURA PROPOSTA

```
Dasfabri-Sistema-SaaS/
├── site/                          # Site público/marketing
│   ├── frontend/                  # Frontend do site (React)
│   │   └── Dasfabri-Platform/    # Código do site
│   └── backend/                   # Backend do site (se houver)
│       └── Dasfabri/backend/      # API de marketing
│
├── sistema/                       # Sistema SaaS completo
│   ├── backend/                   # Backend principal (FastAPI)
│   │   ├── api/                   # Rotas da API
│   │   ├── models/                # Modelos de dados
│   │   ├── migrations/            # Migrações do banco
│   │   ├── scripts/              # Scripts utilitários
│   │   ├── main.py                # Entry point
│   │   ├── database.py            # Configuração do banco
│   │   ├── requirements.txt       # Dependências Python
│   │   └── alembic.ini            # Configuração Alembic
│   │
│   ├── frontend/                  # Frontend do sistema (se diferente do site)
│   │   └── [a ser definido]
│   │
│   └── database/                  # Bancos de dados
│       └── kue_marketing.db       # Banco principal
│
├── documentacao/                  # Documentação
│   ├── publica/                   # Documentação pública
│   │   └── README.md              # Documentação geral
│   │
│   └── sigilosa/                  # Documentação sigilosa ⚠️ PROTEGIDA
│       ├── arquitetura/           # Arquitetura do sistema
│       ├── design/                # Design e planejamento
│       ├── processos/             # Processos internos
│       └── .gitignore             # Ignorar no git
│
├── apresentacoes/                 # Apresentações
│   ├── comercial/                 # Apresentações comerciais
│   └── tecnica/                   # Apresentações técnicas
│
├── scripts/                       # Scripts de manutenção
│   └── limpar_projeto_seguro.sh
│
├── .gitignore                     # Configuração Git
├── README.md                      # Documentação principal
└── [arquivos de configuração raiz]
```

## 🔄 MAPEAMENTO DE MOVIMENTAÇÃO

### Site Público
- `Dasfabri/Dasfabri-Platform/` → `site/frontend/Dasfabri-Platform/`
- `Dasfabri/backend/` → `site/backend/` (se for só para marketing)

### Sistema SaaS
- `backend/` → `sistema/backend/`
- `kue_marketing.db` → `sistema/database/kue_marketing.db`

### Documentação
- `Apresentações/` → `apresentacoes/`
- Criar `documentacao/sigilosa/` para documentação protegida

### Limpeza
- Remover projetos duplicados/antigos:
  - `Dasfabri Platform/`
  - `Dasfabri-Platform/` (se duplicado)
  - `src/` (raiz)
  - `Dasfabri/Dasfabri Platform/`

## 🔒 PROTEÇÃO DA DOCUMENTAÇÃO SIGILOSA

1. Criar `.gitignore` em `documentacao/sigilosa/`
2. Adicionar regras de acesso restrito
3. Separar claramente documentação pública vs sigilosa

## ✅ CHECKLIST DE REORGANIZAÇÃO

- [ ] Criar nova estrutura de pastas
- [ ] Mover site público
- [ ] Mover sistema SaaS
- [ ] Mover banco de dados
- [ ] Mover apresentações
- [ ] Criar estrutura de documentação
- [ ] Configurar proteção de documentação sigilosa
- [ ] Atualizar caminhos nos arquivos de configuração
- [ ] Testar que tudo funciona após reorganização
- [ ] Limpar projetos duplicados
