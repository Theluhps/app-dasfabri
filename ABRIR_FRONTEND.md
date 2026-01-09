# 🚀 Como Visualizar o Frontend

## Servidor de Desenvolvimento

O servidor frontend está sendo iniciado. Siga estes passos:

### 1. Verificar se o servidor está rodando

Abra seu navegador e acesse:
```
http://localhost:5173
```

### 2. Se o servidor não estiver rodando

Execute no terminal:
```bash
cd apps/marketing-site/frontend
npm run dev
```

### 3. Módulos Disponíveis para Testar

#### 📦 Products Management (`/products`)
- Filtros por categoria e status
- Paginação
- Badge de confiança NCM
- Importação CSV
- Classificação automática

#### 🏭 Warehouses Management (`/warehouses`)
- Gestão de armazéns
- Inventário com adição de itens
- Movimentações de estoque
- Tabs organizadas

#### ✨ Classification NCM (`/classification`)
- Classificação de produtos
- Classificação de processos existentes
- Consulta rápida de NCM
- Informações detalhadas de NCM

#### 🏛️ Advanced Customs (`/customs`)
- Consulta de status de desembaraço
- Validação de documentos
- Submissão à alfândega
- Integração Siscomex

### 4. Login

Se precisar fazer login, use as credenciais do sistema.

### 5. Navegação

Use o menu lateral para navegar entre os módulos.

---

**Nota:** Certifique-se de que o backend está rodando em `http://localhost:8000` para que todas as funcionalidades funcionem corretamente.
