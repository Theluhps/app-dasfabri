# 📤 GUIA DE UPLOAD - HOSTGATOR

**Status:** Pronto para upload  
**Domínio:** dasfabri.com  
**Pasta no servidor:** `/home/usuario/dasfabri.com/`

---

## 📋 CHECKLIST PRÉ-UPLOAD

- [x] DNS configurado (registros A)
- [x] Build criado (`dist/`)
- [x] Favicon atualizado
- [ ] Upload dos arquivos
- [ ] Configurar .htaccess
- [ ] Instalar SSL

---

## 🚀 PASSO A PASSO - UPLOAD

### 1. Acessar cPanel File Manager

1. Login: `https://cpanel.hostgator.com.br`
2. Buscar "File Manager" ou "Gerenciador de Arquivos"
3. Abrir File Manager

### 2. Navegar para a pasta `dasfabri.com`

1. No painel esquerdo (árvore de diretórios), encontrar `dasfabri.com`
2. **Clicar na pasta `dasfabri.com`** para abrir
3. Verificar se está vazia ou tem arquivos antigos

### 3. Limpar arquivos antigos (se houver)

- Se houver arquivos antigos, selecionar todos
- Clicar em "Excluir" ou "🗑 Excluir"
- Confirmar exclusão

### 4. Fazer Upload dos Arquivos

**Opção A: Upload múltiplo (recomendado)**

1. Clicar no botão **"↑ Carregar"** (Upload) na barra de ferramentas
2. Na tela de upload:
   - Arrastar e soltar TODOS os arquivos de `dist/`
   - OU clicar em "Selecionar arquivos" e escolher múltiplos
3. Aguardar upload completar (pode levar alguns minutos)

**Arquivos para upload:**
- ✅ `index.html` (obrigatório)
- ✅ `assets/` (pasta inteira - CSS e JS)
- ✅ `images/` (pasta inteira - imagens)
- ✅ `das-logo.png` (logo/favicon)
- ✅ `favicon.ico`, `favicon.png`, `favicon.svg` (se existirem)
- ✅ `robots.txt`
- ✅ Outros arquivos da pasta `dist/`

**Opção B: Upload via FTP**

Se preferir usar FTP:
1. Conectar via cliente FTP (FileZilla, Cyberduck, etc.)
2. Host: `ftp.dasfabri.com` ou IP da Hostgator
3. Usuário: seu usuário Hostgator
4. Senha: sua senha Hostgator
5. Navegar para `/home/usuario/dasfabri.com/`
6. Upload de todos os arquivos de `dist/`

### 5. Verificar Estrutura Final

Dentro de `dasfabri.com/` você deve ter:

```
dasfabri.com/
├── index.html          ← Página principal
├── das-logo.png       ← Logo/Favicon
├── assets/            ← CSS e JS
│   ├── index-XXXXX.css
│   └── index-XXXXX.js
├── images/            ← Imagens
├── robots.txt
└── outros arquivos...
```

### 6. Criar/Configurar .htaccess

1. Dentro da pasta `dasfabri.com/`, clicar em **"+ Arquivo"**
2. Nome do arquivo: `.htaccess` (com o ponto no início)
3. Clicar em **"Editar"** para abrir
4. Colar o seguinte conteúdo:

```apache
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

5. Salvar o arquivo

---

## ✅ VERIFICAÇÃO PÓS-UPLOAD

### Verificar Arquivos

- [ ] `index.html` está na raiz de `dasfabri.com/`
- [ ] Pasta `assets/` existe e tem arquivos CSS/JS
- [ ] Pasta `images/` existe (se houver)
- [ ] `das-logo.png` está na raiz
- [ ] `.htaccess` está na raiz

### Verificar Permissões

Os arquivos devem ter permissões:
- Arquivos: `644` (rw-r--r--)
- Pastas: `755` (rwxr-xr-x)

Para verificar/alterar:
1. Selecionar arquivo/pasta
2. Clicar em "Permissões"
3. Ajustar se necessário

---

## 🔒 PRÓXIMOS PASSOS (Após Upload)

### 1. Aguardar Propagação DNS

- Pode levar algumas horas (até 24h)
- Verificar: `ping dasfabri.com` (deve retornar `192.185.215.162`)

### 2. Instalar SSL (Let's Encrypt)

1. cPanel → **"SSL/TLS Status"** ou **"Let's Encrypt"**
2. Selecionar `dasfabri.com`
3. Clicar em **"Run AutoSSL"** ou **"Install"**
4. Repetir para `www.dasfabri.com`
5. Aguardar instalação (alguns minutos)

### 3. Testar o Site

- Acessar: `https://dasfabri.com`
- Verificar se carrega corretamente
- Verificar se o favicon aparece (logo "Das")
- Testar navegação entre páginas
- Limpar cache do navegador se necessário (Cmd+Shift+R)

---

## 🚨 PROBLEMAS COMUNS

### Site não carrega
- Verificar se arquivos estão em `dasfabri.com/` (não em subpasta)
- Verificar se `index.html` está na raiz
- Verificar permissões dos arquivos

### Erro 404 em rotas
- Verificar se `.htaccess` está configurado
- Verificar se `mod_rewrite` está habilitado (geralmente está)

### Favicon não aparece
- Limpar cache do navegador
- Verificar se `das-logo.png` está na raiz
- Verificar se `index.html` tem as tags corretas

### SSL não funciona
- Aguardar propagação DNS primeiro
- Verificar se certificado foi instalado
- Verificar se domínio está apontando corretamente

---

## 📞 SUPORTE

- **Hostgator:** Suporte via chat/email
- **Verificar logs:** cPanel → "Error Log"

---

**Última atualização:** Janeiro 2025

