# 🚀 GUIA COMPLETO DE DEPLOY PARA PRODUÇÃO

**Data:** Janeiro 2025  
**Domínios:** dasfabri.com.br (Registro.br) e dasfabri.com (Hostgator)  
**Status:** Preparação para produção

---

## 📋 SUMÁRIO

1. [Pré-requisitos](#pré-requisitos)
2. [Arquitetura de Deploy](#arquitetura-de-deploy)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Frontend](#configuração-do-frontend)
5. [Deploy na Hostgator](#deploy-na-hostgator)
6. [Configuração de Domínios](#configuração-de-domínios)
7. [Configuração de Banco de Dados](#configuração-de-banco-de-dados)
8. [Variáveis de Ambiente](#variáveis-de-ambiente)
9. [Testes Pós-Deploy](#testes-pós-deploy)
10. [Monitoramento e Manutenção](#monitoramento-e-manutenção)

---

## 1. PRÉ-REQUISITOS

### Contas e Acessos Necessários:
- ✅ Conta Hostgator (já possui)
- ✅ Domínio dasfabri.com.br (Registro.br)
- ✅ Domínio dasfabri.com (Hostgator)
- ✅ Acesso SSH à Hostgator
- ✅ Acesso ao cPanel da Hostgator

### Ferramentas Necessárias:
- Node.js 18+ (para build do frontend)
- Python 3.11+ (para backend)
- Git (para versionamento)
- SSH Client (para acesso remoto)

---

## 2. ARQUITETURA DE DEPLOY

### Opção 1: Hostgator Shared Hosting (Recomendado para início)

```
┌─────────────────────────────────────┐
│         dasfabri.com.br             │
│         (Registro.br)               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Hostgator                    │
│  ┌──────────────────────────────┐  │
│  │  Frontend (Nginx/Static)      │  │
│  │  /public_html/                 │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Backend (Python/FastAPI)    │  │
│  │  /home/user/api/              │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  PostgreSQL (Hostgator DB)   │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Opção 2: VPS/Dedicated (Recomendado para escala)

Se a Hostgator oferecer VPS, podemos usar Docker:
- Backend em container
- Frontend em Nginx
- PostgreSQL em container ou serviço gerenciado

---

## 3. CONFIGURAÇÃO DO BACKEND

### 3.1 Preparar Build Local

```bash
# 1. Navegar para o diretório do backend
cd apps/saas-platform/backend

# 2. Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Testar localmente
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3.2 Configurar para Produção

**Arquivo: `apps/saas-platform/backend/.env.production`**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dasfabri_prod

# Security
SECRET_KEY=SUA_CHAVE_SECRETA_SUPER_SEGURA_AQUI
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
CORS_ORIGINS=https://dasfabri.com.br,https://www.dasfabri.com.br,https://dasfabri.com,https://www.dasfabri.com

# Environment
ENVIRONMENT=production
DEBUG=false

# API
API_V1_PREFIX=/api/v1
```

### 3.3 Criar Script de Deploy

**Arquivo: `scripts/deploy_backend.sh`**

```bash
#!/bin/bash
set -e

echo "🚀 Deploy do Backend Dasfabri..."

# Variáveis
BACKEND_DIR="apps/saas-platform/backend"
REMOTE_USER="seu_usuario"
REMOTE_HOST="seu_hostgator.com"
REMOTE_PATH="/home/${REMOTE_USER}/api"

# Build local
echo "📦 Preparando build..."
cd "$BACKEND_DIR"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Criar arquivo de requirements para produção
pip freeze > requirements_prod.txt

# Upload para servidor
echo "📤 Enviando arquivos para servidor..."
rsync -avz --exclude 'venv' --exclude '__pycache__' --exclude '*.pyc' \
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

# Executar no servidor
echo "🔧 Configurando servidor..."
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'EOF'
cd /home/seu_usuario/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements_prod.txt

# Criar systemd service (se VPS)
# ou configurar via cPanel Python App

echo "✅ Backend deployado com sucesso!"
EOF
```

---

## 4. CONFIGURAÇÃO DO FRONTEND

### 4.1 Preparar Build de Produção

**Arquivo: `apps/marketing-site/frontend/.env.production`**

```env
VITE_API_URL=https://api.dasfabri.com.br
# ou
VITE_API_URL=https://dasfabri.com.br/api
```

### 4.2 Build do Frontend

```bash
# 1. Navegar para o diretório do frontend
cd apps/marketing-site/frontend

# 2. Instalar dependências
npm install

# 3. Build para produção
npm run build

# 4. O build estará em: dist/
```

### 4.3 Configurar Nginx (se VPS)

**Arquivo: `infrastructure/nginx/dasfabri.conf`**

```nginx
server {
    listen 80;
    server_name dasfabri.com.br www.dasfabri.com.br dasfabri.com www.dasfabri.com;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dasfabri.com.br www.dasfabri.com.br dasfabri.com www.dasfabri.com;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/dasfabri.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dasfabri.com.br/privkey.pem;

    # Frontend
    root /var/www/dasfabri/frontend/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Frontend - React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.4 Script de Deploy do Frontend

**Arquivo: `scripts/deploy_frontend.sh`**

```bash
#!/bin/bash
set -e

echo "🚀 Deploy do Frontend Dasfabri..."

# Variáveis
FRONTEND_DIR="apps/marketing-site/frontend"
REMOTE_USER="seu_usuario"
REMOTE_HOST="seu_hostgator.com"
REMOTE_PATH="/home/${REMOTE_USER}/public_html"

# Build
echo "📦 Fazendo build de produção..."
cd "$FRONTEND_DIR"
npm install
npm run build

# Upload
echo "📤 Enviando arquivos para servidor..."
rsync -avz --delete \
  dist/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/

echo "✅ Frontend deployado com sucesso!"
```

---

## 5. DEPLOY NA HOSTGATOR

### 5.1 Via cPanel (Shared Hosting)

#### Backend (Python App):

1. **Acessar cPanel**
   - Login em: `https://cpanel.hostgator.com.br`
   - Usuário e senha da Hostgator

2. **Criar Python App**
   - Buscar "Python App" ou "Setup Python App"
   - Criar nova aplicação:
     - **App Name:** `dasfabri-api`
     - **Python Version:** `3.11` (ou mais recente)
     - **App Directory:** `api`
     - **App URL:** `api.dasfabri.com.br` (ou subdomínio)

3. **Upload do Código**
   - Via File Manager ou FTP:
     - Upload de `apps/saas-platform/backend/` para `/home/usuario/api/`
   - Via Git (se disponível):
     ```bash
     cd /home/usuario/api
     git clone https://github.com/seu-repo/dasfabri.git .
     ```

4. **Instalar Dependências**
   - No terminal SSH ou via cPanel:
     ```bash
     cd /home/usuario/api
     source venv/bin/activate
     pip install -r requirements.txt
     ```

5. **Configurar Variáveis de Ambiente**
   - No cPanel Python App, adicionar:
     - `DATABASE_URL`
     - `SECRET_KEY`
     - `CORS_ORIGINS`
     - etc.

6. **Iniciar Aplicação**
   - No cPanel Python App, clicar em "Start"

#### Frontend (Static Files):

1. **Acessar File Manager**
   - No cPanel, abrir "File Manager"

2. **Navegar para public_html**
   - `/home/usuario/public_html/`

3. **Upload dos Arquivos**
   - Upload de todos os arquivos de `apps/marketing-site/frontend/dist/`
   - Manter estrutura de pastas

4. **Configurar .htaccess** (se necessário)
   - Para React Router funcionar:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### 5.2 Via SSH (VPS/Dedicated)

```bash
# 1. Conectar via SSH
ssh usuario@seu_hostgator.com

# 2. Criar diretórios
mkdir -p /var/www/dasfabri/{frontend,backend}
mkdir -p /var/www/dasfabri/backend/venv

# 3. Clonar repositório (ou fazer upload)
cd /var/www/dasfabri
git clone https://github.com/seu-repo/dasfabri.git .

# 4. Configurar Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 5. Configurar Frontend
cd ../frontend
npm install
npm run build

# 6. Configurar Nginx (se disponível)
# Copiar arquivo de configuração nginx
sudo cp infrastructure/nginx/dasfabri.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/dasfabri.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 7. Configurar Systemd para Backend
sudo cp infrastructure/systemd/dasfabri-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable dasfabri-api
sudo systemctl start dasfabri-api
```

---

## 6. CONFIGURAÇÃO DE DOMÍNIOS

### 6.1 dasfabri.com.br (Registro.br)

1. **Acessar Registro.br**
   - Login em: `https://registro.br`

2. **Configurar DNS**
   - Adicionar registros A:
     ```
     @           A    IP_DA_HOSTGATOR
     www         A    IP_DA_HOSTGATOR
     api         A    IP_DA_HOSTGATOR
     ```
   - Ou configurar nameservers da Hostgator:
     ```
     ns1.hostgator.com.br
     ns2.hostgator.com.br
     ```

### 6.2 dasfabri.com (Hostgator)

1. **Acessar cPanel da Hostgator**
   - Ir em "Domínios" ou "Addon Domains"

2. **Adicionar Domínio**
   - Adicionar `dasfabri.com`
   - Apontar para `/public_html` (ou subdiretório)

3. **Configurar SSL**
   - Usar "Let's Encrypt" (gratuito) via cPanel
   - Ou comprar certificado SSL

---

## 7. CONFIGURAÇÃO DE BANCO DE DADOS

### 7.1 PostgreSQL na Hostgator

1. **Criar Banco de Dados**
   - No cPanel, ir em "MySQL Databases" ou "PostgreSQL Databases"
   - Criar novo banco: `dasfabri_prod`
   - Criar usuário: `dasfabri_user`
   - Atribuir privilégios

2. **Configurar Connection String**
   ```env
   DATABASE_URL=postgresql://dasfabri_user:senha@localhost:5432/dasfabri_prod
   ```

3. **Executar Migrations**
   ```bash
   cd /home/usuario/api
   source venv/bin/activate
   alembic upgrade head
   ```

### 7.2 Backup Automático

- Configurar backup automático via cPanel
- Ou usar script cron:
  ```bash
  0 2 * * * pg_dump -U dasfabri_user dasfabri_prod > /backup/dasfabri_$(date +\%Y\%m\%d).sql
  ```

---

## 8. VARIÁVEIS DE AMBIENTE

### 8.1 Backend (.env.production)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dasfabri_prod

# Security
SECRET_KEY=GERAR_CHAVE_ALEATORIA_SEGURA_AQUI
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
CORS_ORIGINS=https://dasfabri.com.br,https://www.dasfabri.com.br,https://dasfabri.com,https://www.dasfabri.com

# Environment
ENVIRONMENT=production
DEBUG=false

# API
API_V1_PREFIX=/api/v1

# Email (se necessário)
SMTP_HOST=smtp.hostgator.com.br
SMTP_PORT=587
SMTP_USER=contato@dasfabri.com.br
SMTP_PASSWORD=sua_senha
```

### 8.2 Frontend (.env.production)

```env
VITE_API_URL=https://api.dasfabri.com.br
# ou se backend estiver no mesmo domínio:
VITE_API_URL=https://dasfabri.com.br
```

---

## 9. TESTES PÓS-DEPLOY

### 9.1 Checklist de Testes

- [ ] Frontend carrega corretamente
- [ ] Backend responde em `/health`
- [ ] API Swagger acessível em `/docs`
- [ ] Login funciona
- [ ] CORS configurado corretamente
- [ ] SSL funcionando (HTTPS)
- [ ] Banco de dados conectado
- [ ] Migrations executadas
- [ ] Upload de arquivos funciona
- [ ] Email (se configurado) funciona

### 9.2 Comandos de Teste

```bash
# Testar backend
curl https://api.dasfabri.com.br/health

# Testar frontend
curl https://dasfabri.com.br

# Testar API
curl https://api.dasfabri.com.br/api/v1/
```

---

## 10. MONITORAMENTO E MANUTENÇÃO

### 10.1 Logs

- **Backend:** `/home/usuario/api/logs/` ou via cPanel
- **Frontend:** Logs do servidor web (Nginx/Apache)
- **Banco de Dados:** Logs do PostgreSQL

### 10.2 Monitoramento

- Configurar uptime monitoring (UptimeRobot, Pingdom)
- Configurar alertas de erro
- Monitorar uso de recursos (CPU, RAM, Disco)

### 10.3 Backup

- Backup diário do banco de dados
- Backup semanal do código
- Testar restauração de backups periodicamente

---

## 📞 SUPORTE

Em caso de problemas:
1. Verificar logs
2. Verificar configurações de DNS
3. Verificar SSL
4. Verificar variáveis de ambiente
5. Contatar suporte Hostgator

---

## ✅ PRÓXIMOS PASSOS

1. [ ] Configurar domínios DNS
2. [ ] Fazer build local e testar
3. [ ] Fazer deploy do backend
4. [ ] Fazer deploy do frontend
5. [ ] Configurar SSL
6. [ ] Executar migrations
7. [ ] Testar todas as funcionalidades
8. [ ] Configurar monitoramento
9. [ ] Configurar backups

---

**Última atualização:** Janeiro 2025

