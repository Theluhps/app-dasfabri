# 🚀 DEPLOY DE ATUALIZAÇÕES NO HOSTGATOR

**Data:** Janeiro 2025  
**Atualizações:** Traduções (i18n), Cores corrigidas, Formulários funcionais

---

## ✅ BUILD CONCLUÍDO

O build do frontend foi gerado com sucesso:
- ✅ `dist/index.html`
- ✅ `dist/assets/index-ch4yyocZ.js` (1,780.14 kB)
- ✅ `dist/assets/index-CkC7WN8Q.css` (108.76 kB)

**Localização:** `apps/marketing-site/frontend/dist/`

---

## 📋 O QUE FOI ATUALIZADO

### 1. Traduções (i18n)
- ✅ Português (pt-BR) - Completo
- ✅ Inglês (en-US) - Completo
- ✅ Todos os componentes traduzidos
- ✅ Seletor de idioma funcional

### 2. Correções Visuais
- ✅ Cores dos botões corrigidas
- ✅ Telas de login/registro com fundo branco
- ✅ Textos visíveis e legíveis

### 3. Formulários
- ✅ Formulário de contato funcional
- ✅ Formulário de registro funcional
- ✅ Integração com backend

---

## 📦 PASSO 1: LOCALIZAR PASTA DIST

A pasta `dist/` está em:
```
/Users/thelhps/Desktop/Dasfabri Sistema SaaS/apps/marketing-site/frontend/dist/
```

**Conteúdo da pasta:**
- `index.html`
- `assets/` (CSS e JS)
- Outros arquivos estáticos

---

## 📤 PASSO 2: UPLOAD PARA HOSTGATOR

### Opção A: Via cPanel File Manager (Recomendado)

1. **Acessar cPanel**
   - URL: `https://dasfabri.com/cpanel` (ou URL fornecida pela Hostgator)
   - Login com suas credenciais

2. **Abrir File Manager**
   - Procure por "File Manager" no cPanel
   - Navegue até a pasta do domínio:
     - Se Addon Domain: `/public_html/dasfabri.com/`
     - Se Subdomain: `/public_html/dasfabri/`
     - Se raiz: `/public_html/`

3. **Fazer Backup (IMPORTANTE!)**
   - Selecione todos os arquivos atuais
   - Clique em "Compress" → "Zip Archive"
   - Renomeie para `backup-antes-atualizacao-YYYY-MM-DD.zip`
   - Baixe o backup para seu computador

4. **Deletar arquivos antigos**
   - Selecione todos os arquivos e pastas (exceto `.htaccess` se existir)
   - Clique em "Delete"
   - **NÃO delete a pasta raiz!**

5. **Upload dos novos arquivos**
   - Clique em "Upload"
   - Selecione TODOS os arquivos da pasta `dist/`:
     - `index.html`
     - Pasta `assets/` completa
     - Qualquer outro arquivo na pasta `dist/`
   - Aguarde o upload completar

6. **Verificar `.htaccess`**
   - Certifique-se de que o arquivo `.htaccess` existe na raiz
   - Se não existir, crie com o conteúdo abaixo (ou use o arquivo existente)

### Opção B: Via FTP (Alternativa)

1. **Conectar via FTP**
   - Host: `ftp.dasfabri.com` (ou IP fornecido)
   - Usuário: Seu usuário Hostgator
   - Senha: Sua senha Hostgator
   - Porta: 21

2. **Navegar até a pasta do domínio**
   - `/public_html/dasfabri.com/` (ou pasta correspondente)

3. **Fazer backup**
   - Baixe todos os arquivos atuais para backup local

4. **Deletar arquivos antigos**
   - Delete tudo exceto `.htaccess`

5. **Upload dos novos arquivos**
   - Faça upload de todos os arquivos da pasta `dist/`

---

## ⚙️ PASSO 3: VERIFICAR .htaccess

O arquivo `.htaccess` deve estar na raiz do site com este conteúdo:

```apache
# React Router - Redirecionar todas as rotas para index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Redirecionar HTTP para HTTPS
<IfModule mod_rewrite.c>
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Cache de arquivos estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Segurança
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

**Se o arquivo não existir:**
1. No File Manager, clique em "New File"
2. Nome: `.htaccess`
3. Cole o conteúdo acima
4. Salve

---

## ✅ PASSO 4: VERIFICAR DEPLOY

### 4.1 Testar o site

1. Acesse: `https://dasfabri.com`
2. Verifique se o site carrega corretamente
3. Teste a troca de idioma (PT/EN)
4. Teste os formulários

### 4.2 Verificar traduções

1. Clique no seletor de idioma (PT/EN)
2. Verifique se todo o conteúdo muda
3. Teste em diferentes páginas/seções

### 4.3 Verificar formulários

1. Preencha o formulário de contato
2. Preencha o formulário de registro
3. Verifique se não há erros no console (F12)

### 4.4 Verificar cores

1. Verifique se os botões têm a cor azul correta
2. Verifique se as telas de login/registro têm fundo branco
3. Verifique se os textos estão visíveis

---

## 🐛 TROUBLESHOOTING

### Problema: Site mostra tela branca

**Solução:**
1. Verifique se todos os arquivos foram enviados
2. Verifique se a pasta `assets/` está na raiz
3. Verifique o console do navegador (F12) para erros
4. Limpe o cache do navegador (Cmd+Shift+R)

### Problema: Traduções não funcionam

**Solução:**
1. Verifique se o arquivo JS foi atualizado
2. Limpe o cache do navegador
3. Verifique se o seletor de idioma está visível

### Problema: Formulários não funcionam

**Solução:**
1. Verifique se o backend está acessível
2. Verifique o console do navegador para erros
3. Verifique a configuração da API em `config/api.ts`

### Problema: Arquivos não aparecem no File Manager

**Solução:**
1. Verifique se está na pasta correta
2. Atualize a página do File Manager
3. Verifique permissões dos arquivos (deve ser 644)

---

## 📊 CHECKLIST DE DEPLOY

- [ ] Backup dos arquivos antigos feito
- [ ] Arquivos antigos deletados
- [ ] Novos arquivos da pasta `dist/` enviados
- [ ] Arquivo `.htaccess` verificado/criado
- [ ] Site acessível em `https://dasfabri.com`
- [ ] Traduções funcionando (PT/EN)
- [ ] Formulários funcionando
- [ ] Cores corretas
- [ ] Sem erros no console

---

## 📝 NOTAS IMPORTANTES

1. **Backend:** O backend continua rodando localmente. Os formulários tentarão conectar em `http://localhost:8000` (em desenvolvimento) ou na URL configurada em produção.

2. **API URL:** Se quiser que os formulários funcionem em produção, você precisa:
   - Configurar a variável `VITE_API_URL` no build
   - Ou atualizar `config/api.ts` para usar a URL do backend em produção

3. **Cache:** Após o deploy, pode levar alguns minutos para o cache do navegador atualizar. Use modo anônimo para testar.

---

## 🎯 PRÓXIMOS PASSOS

Após o deploy bem-sucedido:

1. ✅ Testar todas as funcionalidades
2. ⏳ Configurar backend em produção (se necessário)
3. ⏳ Configurar domínio de API (se necessário)
4. ⏳ Monitorar logs de erro

---

**Última atualização:** Janeiro 2025

