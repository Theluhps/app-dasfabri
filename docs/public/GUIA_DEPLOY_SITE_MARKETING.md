# 🚀 GUIA DE DEPLOY - SITE DE MARKETING DASFABRI

**Data:** Janeiro 2025  
**Domínios:** dasfabri.com.br (Registro.br) e dasfabri.com (Hostgator)  
**Objetivo:** Colocar apenas o site de marketing/landing page no ar

---

## 📋 O QUE ESTAMOS DEPLOYANDO

✅ **Site de Marketing (Landing Page)**
- Página inicial (Index.tsx)
- Hero, Features, FAQ, CTA
- Site estático (HTML/CSS/JS)
- **NÃO precisa de backend**
- **NÃO precisa de banco de dados**

❌ **NÃO estamos deployando:**
- Sistema SaaS completo
- Backend API
- Banco de dados
- Áreas internas do sistema

---

## 🎯 PRÉ-REQUISITOS

- ✅ Conta Hostgator
- ✅ Domínio dasfabri.com.br (Registro.br)
- ✅ Domínio dasfabri.com (Hostgator)
- ✅ Acesso ao cPanel da Hostgator
- ✅ Node.js 18+ instalado localmente (para build)

---

## 📦 PASSO 1: PREPARAR BUILD LOCAL

### 1.1 Navegar para o diretório do frontend

```bash
cd apps/marketing-site/frontend
```

### 1.2 Instalar dependências (se ainda não instalou)

```bash
npm install
```

### 1.3 Configurar variáveis de ambiente (opcional)

Criar arquivo `.env.production`:

```env
# Para o site de marketing, não precisamos de API
# Mas podemos deixar configurado para quando o sistema estiver pronto
VITE_API_URL=https://api.dasfabri.com.br
```

**Nota:** Como o site de marketing não faz chamadas à API, essa variável não será usada agora.

### 1.4 Configurar Base Path (se usar subdiretório)

**⚠️ IMPORTANTE:** Se você vai usar um **subdiretório** (ex: `/public_html/dasfabri/`), precisa configurar o base path:

**Arquivo: `apps/marketing-site/frontend/vite.config.ts`**

```typescript
export default defineConfig(({ mode }) => ({
  base: '/dasfabri/', // ← Adicione esta linha (ajuste o nome do diretório)
  server: {
    host: "127.0.0.1",
    port: 8080,
  },
  // ... resto da configuração
}));
```

**Se usar Addon Domain ou Subdomínio:** Não precisa configurar base path, deixe como está.

### 1.5 Fazer build de produção

```bash
npm run build
```

Isso criará uma pasta `dist/` com todos os arquivos estáticos prontos para deploy.

### 1.6 Verificar o build

```bash
# Ver o tamanho do build
du -sh dist

# Listar arquivos principais
ls -lh dist/
```

Você deve ver:
- `index.html` (página principal)
- `assets/` (CSS, JS, imagens)
- Outros arquivos estáticos

---

## 📤 PASSO 2: UPLOAD PARA HOSTGATOR

> **⚠️ IMPORTANTE:** Como você tem outros sites na Hostgator, você tem 3 opções:
> 1. **Subdiretório** (ex: `/public_html/dasfabri/`) - Mais simples
> 2. **Subdomínio** (ex: `dasfabri.seusite.com`) - Intermediário
> 3. **Addon Domain** (ex: `dasfabri.com` apontando para subdiretório) - Recomendado

### Opção 1: Subdiretório (Mais Simples)

Se você quer que o site fique em `https://dasfabri.com.br/dasfabri/` ou similar:

1. **Acessar cPanel**
   - Login: `https://cpanel.hostgator.com.br`
   - Usuário e senha da Hostgator

2. **Abrir File Manager**
   - No cPanel, buscar "File Manager"
   - Navegar para `/public_html/`

3. **Criar subdiretório**
   - Clicar em "New Folder"
   - Nome: `dasfabri` (ou o nome que preferir)
   - Navegar para `/public_html/dasfabri/`

4. **Upload dos arquivos**
   - Clicar em "Upload"
   - Selecionar TODOS os arquivos da pasta `dist/`
   - Aguardar upload completar

5. **Verificar estrutura**
   - Deve ter `index.html` em `/public_html/dasfabri/`
   - Deve ter pasta `assets/` com CSS/JS

**⚠️ Nota:** Com subdiretório, você precisará configurar o Vite para usar base path. Veja seção "Configurar Base Path" abaixo.

### Opção 2: Addon Domain (Recomendado)

Para que `dasfabri.com.br` aponte diretamente para o site (sem subdiretório na URL):

1. **Acessar cPanel**
   - Ir em "Domínios" → "Addon Domains"

2. **Adicionar domínio**
   - **New Domain Name:** `dasfabri.com.br`
   - **Subdomain/FTP Username:**** `dasfabri` (gerado automaticamente)
   - **Document Root:** `/home/usuario/dasfabri.com.br` (ou deixar padrão)
   - Clicar em "Add Domain"

3. **Abrir File Manager**
   - Navegar para `/home/usuario/dasfabri.com.br/` (ou o Document Root configurado)

4. **Upload dos arquivos**
   - Clicar em "Upload"
   - Selecionar TODOS os arquivos da pasta `dist/`
   - Aguardar upload completar

5. **Verificar estrutura**
   - Deve ter `index.html` na raiz do diretório do domínio
   - Deve ter pasta `assets/` com CSS/JS

**✅ Vantagem:** URL limpa (`https://dasfabri.com.br` sem subdiretório)

### Opção 3: Subdomínio

Se você quer usar `dasfabri.seusite.com`:

1. **Acessar cPanel**
   - Ir em "Subdomains"

2. **Criar subdomínio**
   - **Subdomain:** `dasfabri`
   - **Domain:** Selecione o domínio principal
   - **Document Root:** `/home/usuario/dasfabri.seusite.com` (ou deixar padrão)
   - Clicar em "Create"

3. **Abrir File Manager**
   - Navegar para o Document Root do subdomínio

4. **Upload dos arquivos**
   - Upload de todos os arquivos de `dist/`

### Opção A: Via cPanel File Manager (Mais Fácil)

1. **Acessar cPanel**
   - Login: `https://cpanel.hostgator.com.br`
   - Usuário e senha da Hostgator

2. **Abrir File Manager**
   - No cPanel, buscar "File Manager"
   - Navegar para o diretório correto (veja opções acima)

3. **Limpar arquivos antigos (se houver)**
   - Selecionar todos os arquivos antigos
   - Deletar (ou fazer backup antes)

4. **Upload dos arquivos**
   - Clicar em "Upload"
   - Selecionar TODOS os arquivos da pasta `dist/`
   - Aguardar upload completar

5. **Verificar estrutura**
   - Deve ter `index.html` na raiz do diretório
   - Deve ter pasta `assets/` com CSS/JS

### Opção B: Via FTP

1. **Conectar via FTP**
   - Host: `ftp.seusite.com` (ou IP da Hostgator)
   - Usuário: seu usuário Hostgator
   - Senha: sua senha Hostgator
   - Porta: 21

2. **Navegar para o diretório correto**
   - **Subdiretório:** `/public_html/dasfabri/`
   - **Addon Domain:** `/home/usuario/dasfabri.com.br/`
   - **Subdomínio:** `/home/usuario/dasfabri.seusite.com/`

3. **Upload**
   - Upload de todos os arquivos de `dist/`
   - Manter estrutura de pastas

### Opção C: Via rsync (SSH - se disponível)

```bash
# Do seu computador local
cd apps/marketing-site/frontend

# Para Addon Domain (recomendado):
rsync -avz --delete \
  dist/ usuario@hostgator.com:/home/usuario/dasfabri.com.br/

# Para subdiretório:
rsync -avz --delete \
  dist/ usuario@hostgator.com:/home/usuario/public_html/dasfabri/

# Para subdomínio:
rsync -avz --delete \
  dist/ usuario@hostgator.com:/home/usuario/dasfabri.seusite.com/
```

---

## ⚙️ PASSO 3: CONFIGURAR .htaccess

### 3.1 Criar/Editar .htaccess

No cPanel File Manager, criar ou editar arquivo `.htaccess` na **raiz do diretório onde você fez o upload**:

- **Addon Domain:** `/home/usuario/dasfabri.com.br/.htaccess`
- **Subdiretório:** `/public_html/dasfabri/.htaccess`
- **Subdomínio:** `/home/usuario/dasfabri.seusite.com/.htaccess`

```apache
# Configuração Apache para React Router (SPA)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Redirecionar HTTP para HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Não redirecionar arquivos existentes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Redirecionar tudo para index.html (React Router)
  RewriteRule . /index.html [L]
</IfModule>

# Cache para arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Imagens - Cache de 1 ano
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS e JavaScript - Cache de 1 ano
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  
  # Fontes - Cache de 1 ano
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  
  # HTML - Sem cache (sempre atualizado)
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

**Nota:** O arquivo `.htaccess` já está criado em `apps/marketing-site/frontend/public/.htaccess`. Você pode copiar esse arquivo para a raiz do diretório onde fez o upload.

**⚠️ Se usar subdiretório:** Você precisará ajustar o `.htaccess` para considerar o base path:

```apache
# Para subdiretório /dasfabri/
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dasfabri/  # ← Ajuste o nome do diretório
  
  # Redirecionar HTTP para HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Não redirecionar arquivos existentes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Redirecionar tudo para index.html
  RewriteRule . /dasfabri/index.html [L]  # ← Ajuste o caminho
</IfModule>
```

---

## 🌐 PASSO 4: CONFIGURAR DOMÍNIOS

### 4.1 dasfabri.com.br (Registro.br)

1. **Acessar Registro.br**
   - Login: `https://registro.br`

2. **Configurar DNS**
   - Ir em "Meus Domínios" → "dasfabri.com.br"
   - Configurar registros A:
     ```
     @           A    IP_DA_HOSTGATOR
     www         A    IP_DA_HOSTGATOR
     ```
   - **OU** configurar nameservers da Hostgator:
     ```
     ns1.hostgator.com.br
     ns2.hostgator.com.br
     ```

3. **Aguardar propagação**
   - Pode levar de algumas horas até 48h
   - Verificar: `ping dasfabri.com.br`

### 4.2 dasfabri.com (Hostgator)

1. **Acessar cPanel**
   - Ir em "Domínios" ou "Addon Domains"

2. **Adicionar domínio**
   - Clicar em "Addon Domain" ou "Criar Domínio"
   - Domínio: `dasfabri.com`
   - Document Root: `/public_html` (ou deixar padrão)
   - Salvar

3. **Verificar**
   - O domínio deve aparecer na lista de domínios

---

## 🔒 PASSO 5: CONFIGURAR SSL (HTTPS)

### 5.1 Instalar Let's Encrypt (Gratuito)

1. **Acessar cPanel**
   - Ir em "SSL/TLS Status" ou "Let's Encrypt"

2. **Instalar certificado**
   - Selecionar `dasfabri.com.br`
   - Clicar em "Run AutoSSL" ou "Install"
   - Repetir para `www.dasfabri.com.br`
   - Repetir para `dasfabri.com`
   - Repetir para `www.dasfabri.com`

3. **Aguardar instalação**
   - Pode levar alguns minutos

4. **Verificar**
   - Acessar `https://dasfabri.com.br`
   - Verificar se aparece o cadeado verde no navegador

### 5.2 Forçar HTTPS

O `.htaccess` já está configurado para redirecionar HTTP → HTTPS automaticamente.

---

## ✅ PASSO 6: TESTAR

### 6.1 Testes Básicos

- [ ] Acessar `https://dasfabri.com.br` - deve carregar
- [ ] Acessar `https://www.dasfabri.com.br` - deve redirecionar ou carregar
- [ ] Acessar `https://dasfabri.com` - deve carregar
- [ ] Verificar se aparece o cadeado verde (SSL)
- [ ] Testar navegação entre seções
- [ ] Verificar se imagens carregam
- [ ] Verificar se CSS está aplicado
- [ ] Testar em diferentes navegadores
- [ ] Testar em dispositivos móveis

### 6.2 Testes de Performance

- [ ] Verificar tempo de carregamento
- [ ] Verificar se assets estão sendo servidos com cache
- [ ] Verificar se compressão Gzip está funcionando

### 6.3 Comandos de Teste

```bash
# Testar se o site responde
curl -I https://dasfabri.com.br

# Verificar SSL
openssl s_client -connect dasfabri.com.br:443 -servername dasfabri.com.br

# Verificar redirecionamento HTTP → HTTPS
curl -I http://dasfabri.com.br
# Deve retornar 301 ou 302
```

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando precisar atualizar o site:

1. **Fazer alterações localmente**
2. **Fazer novo build:**
   ```bash
   cd apps/marketing-site/frontend
   npm run build
   ```
3. **Upload novamente:**
   - Via cPanel File Manager
   - Ou via FTP
   - Ou via rsync

---

## 📝 CHECKLIST RÁPIDO

- [ ] Build local feito (`npm run build`)
- [ ] Arquivos de `dist/` uploadados para `public_html/`
- [ ] `.htaccess` configurado na raiz
- [ ] DNS configurado (Registro.br e Hostgator)
- [ ] SSL instalado (Let's Encrypt)
- [ ] Site acessível via HTTPS
- [ ] Testado em diferentes navegadores
- [ ] Testado em dispositivos móveis

---

## 🚨 PROBLEMAS COMUNS

### Site não carrega
- Verificar se arquivos estão em `public_html/`
- Verificar se `index.html` está na raiz
- Verificar permissões dos arquivos (644 para arquivos, 755 para diretórios)

### Erro 404 em rotas
- Verificar se `.htaccess` está configurado
- Verificar se `mod_rewrite` está habilitado no Apache

### SSL não funciona
- Aguardar propagação (pode levar até 24h)
- Verificar se certificado foi instalado corretamente
- Verificar se domínio está apontando corretamente

### Imagens não carregam
- Verificar caminhos das imagens
- Verificar se pasta `assets/` foi uploadada
- Verificar permissões

---

## 📞 SUPORTE

- **Hostgator:** Suporte via chat/email
- **Registro.br:** Suporte via telefone/chat

---

## ✅ PRÓXIMOS PASSOS (Futuro)

Quando o sistema SaaS estiver pronto para produção:
1. Deploy do backend (API)
2. Configurar banco de dados PostgreSQL
3. Atualizar `VITE_API_URL` no frontend
4. Fazer novo build com API configurada

---

**Última atualização:** Janeiro 2025

