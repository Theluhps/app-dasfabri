# ✅ CHECKLIST DE DEPLOY - DASFABRI

**Data:** Janeiro 2025  
**Domínios:** dasfabri.com.br e dasfabri.com

> **⚠️ IMPORTANTE:** Este checklist é para o **SISTEMA COMPLETO**.  
> Se você quer apenas colocar o **SITE DE MARKETING** no ar, use:  
> `docs/public/GUIA_DEPLOY_SITE_MARKETING.md`

---

## 📋 PRÉ-DEPLOY

### Configuração Local
- [ ] Clonar repositório atualizado
- [ ] Verificar Node.js 18+ instalado
- [ ] Verificar Python 3.11+ instalado
- [ ] Testar build local do frontend
- [ ] Testar backend localmente
- [ ] Executar todos os testes (58 testes devem passar)

### Configuração de Ambiente
- [ ] Criar `.env.production` no backend
- [ ] Criar `.env.production` no frontend
- [ ] Configurar `DATABASE_URL` (PostgreSQL)
- [ ] Gerar `SECRET_KEY` segura
- [ ] Configurar `CORS_ORIGINS` com domínios corretos
- [ ] Configurar `VITE_API_URL` no frontend

### Preparação do Servidor
- [ ] Acessar cPanel da Hostgator
- [ ] Verificar espaço em disco disponível
- [ ] Verificar recursos (CPU, RAM)
- [ ] Criar banco de dados PostgreSQL
- [ ] Criar usuário do banco de dados
- [ ] Configurar permissões do banco

---

## 🚀 DEPLOY DO BACKEND

### Build Local
- [ ] Executar `./scripts/deploy_backend.sh production`
- [ ] Verificar se `requirements_prod.txt` foi criado
- [ ] Verificar se não há erros no build

### Upload para Servidor
- [ ] Conectar via SSH ou FTP
- [ ] Criar diretório `/home/usuario/api/`
- [ ] Upload de todos os arquivos (exceto venv, __pycache__)
- [ ] Upload de `.env.production`

### Configuração no Servidor
- [ ] Criar ambiente virtual: `python3 -m venv venv`
- [ ] Ativar venv: `source venv/bin/activate`
- [ ] Instalar dependências: `pip install -r requirements_prod.txt`
- [ ] Verificar variáveis de ambiente
- [ ] Executar migrations: `alembic upgrade head`

### Iniciar Serviço
- [ ] Via cPanel Python App: Iniciar aplicação
- [ ] Ou via systemd: `systemctl start dasfabri-api`
- [ ] Verificar se está rodando: `ps aux | grep uvicorn`
- [ ] Testar endpoint: `curl http://localhost:8000/health`

---

## 🎨 DEPLOY DO FRONTEND

### Build Local
- [ ] Executar `./scripts/deploy_frontend.sh production`
- [ ] Verificar se `dist/` foi criado
- [ ] Verificar tamanho do build
- [ ] Testar build localmente

### Upload para Servidor
- [ ] Conectar via SSH ou FTP
- [ ] Navegar para `/home/usuario/public_html/`
- [ ] Limpar arquivos antigos (se houver)
- [ ] Upload de todos os arquivos de `dist/`
- [ ] Upload de `.htaccess` para raiz do public_html

### Configuração no Servidor
- [ ] Verificar permissões dos arquivos (644 para arquivos, 755 para diretórios)
- [ ] Verificar se `.htaccess` está na raiz
- [ ] Testar acesso: `curl https://dasfabri.com.br`

---

## 🌐 CONFIGURAÇÃO DE DOMÍNIOS

### dasfabri.com.br (Registro.br)
- [ ] Acessar painel do Registro.br
- [ ] Configurar DNS:
  - [ ] Registro A: `@` → IP da Hostgator
  - [ ] Registro A: `www` → IP da Hostgator
  - [ ] Registro A: `api` → IP da Hostgator (se subdomínio separado)
- [ ] Ou configurar nameservers da Hostgator
- [ ] Aguardar propagação DNS (pode levar até 48h)

### dasfabri.com (Hostgator)
- [ ] Acessar cPanel da Hostgator
- [ ] Ir em "Domínios" ou "Addon Domains"
- [ ] Adicionar domínio `dasfabri.com`
- [ ] Apontar para `/public_html` ou subdiretório
- [ ] Configurar redirecionamento (se necessário)

---

## 🔒 CONFIGURAÇÃO SSL

### Let's Encrypt (Gratuito)
- [ ] Acessar cPanel
- [ ] Ir em "SSL/TLS Status" ou "Let's Encrypt"
- [ ] Instalar certificado para `dasfabri.com.br`
- [ ] Instalar certificado para `www.dasfabri.com.br`
- [ ] Instalar certificado para `dasfabri.com`
- [ ] Instalar certificado para `www.dasfabri.com`
- [ ] Instalar certificado para `api.dasfabri.com.br` (se usar subdomínio)
- [ ] Configurar renovação automática

### Verificação
- [ ] Testar HTTPS: `curl https://dasfabri.com.br`
- [ ] Verificar certificado no navegador
- [ ] Verificar se redireciona HTTP → HTTPS

---

## 🗄️ BANCO DE DADOS

### Configuração
- [ ] Criar banco: `dasfabri_prod`
- [ ] Criar usuário: `dasfabri_user`
- [ ] Atribuir privilégios completos
- [ ] Testar conexão: `psql -U dasfabri_user -d dasfabri_prod`

### Migrations
- [ ] Executar migrations: `alembic upgrade head`
- [ ] Verificar tabelas criadas
- [ ] Criar usuário admin inicial (se necessário)

### Backup
- [ ] Configurar backup automático no cPanel
- [ ] Testar restauração de backup
- [ ] Documentar processo de backup

---

## 🧪 TESTES PÓS-DEPLOY

### Frontend
- [ ] Acessar `https://dasfabri.com.br`
- [ ] Verificar se carrega corretamente
- [ ] Testar navegação entre páginas
- [ ] Verificar se não há erros no console
- [ ] Testar em diferentes navegadores

### Backend
- [ ] Testar `/health`: `curl https://api.dasfabri.com.br/health`
- [ ] Testar `/docs`: Acessar Swagger UI
- [ ] Testar endpoint raiz: `curl https://api.dasfabri.com.br/`
- [ ] Verificar CORS funcionando

### Integração
- [ ] Testar login
- [ ] Testar registro
- [ ] Testar requisições autenticadas
- [ ] Testar upload de arquivos (se houver)
- [ ] Testar todas as funcionalidades principais

### Performance
- [ ] Verificar tempo de carregamento
- [ ] Verificar se assets estão sendo servidos com cache
- [ ] Verificar compressão Gzip funcionando
- [ ] Testar em dispositivos móveis

---

## 📊 MONITORAMENTO

### Logs
- [ ] Configurar acesso aos logs do backend
- [ ] Configurar acesso aos logs do frontend
- [ ] Configurar acesso aos logs do banco de dados
- [ ] Verificar se logs estão sendo gerados

### Uptime
- [ ] Configurar monitoramento (UptimeRobot, Pingdom, etc.)
- [ ] Configurar alertas de email
- [ ] Testar alertas

### Performance
- [ ] Monitorar uso de CPU
- [ ] Monitorar uso de RAM
- [ ] Monitorar uso de disco
- [ ] Monitorar uso de banco de dados

---

## 🔐 SEGURANÇA

### Verificações
- [ ] Verificar se `.env.production` não está no repositório
- [ ] Verificar se `SECRET_KEY` é forte
- [ ] Verificar se SSL está funcionando
- [ ] Verificar headers de segurança
- [ ] Verificar se CORS está configurado corretamente
- [ ] Verificar se senhas do banco estão seguras

### Firewall
- [ ] Configurar firewall (se disponível)
- [ ] Permitir apenas portas necessárias
- [ ] Bloquear acesso direto ao banco de dados

---

## 📝 DOCUMENTAÇÃO

### Atualizar
- [ ] Documentar URLs de produção
- [ ] Documentar credenciais (em local seguro)
- [ ] Documentar processo de deploy
- [ ] Documentar processo de rollback
- [ ] Atualizar README com informações de produção

---

## 🚨 PLANO DE ROLLBACK

### Preparação
- [ ] Ter backup do código anterior
- [ ] Ter backup do banco de dados anterior
- [ ] Documentar processo de rollback
- [ ] Testar processo de rollback

### Em caso de problemas
- [ ] Parar serviço
- [ ] Restaurar código anterior
- [ ] Restaurar banco de dados (se necessário)
- [ ] Reiniciar serviço
- [ ] Verificar se está funcionando

---

## ✅ FINALIZAÇÃO

- [ ] Todos os testes passando
- [ ] Site acessível publicamente
- [ ] SSL funcionando
- [ ] Monitoramento configurado
- [ ] Backup configurado
- [ ] Documentação atualizada
- [ ] Equipe notificada

---

## 📞 CONTATOS DE EMERGÊNCIA

- **Hostgator Suporte:** [número/email]
- **Registro.br Suporte:** [número/email]
- **Equipe Técnica:** [contatos]

---

**Última atualização:** Janeiro 2025

