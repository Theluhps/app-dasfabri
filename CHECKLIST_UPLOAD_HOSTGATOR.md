# ✅ CHECKLIST: UPLOAD PARA HOSTGATOR

## ⚠️ IMPORTANTE: ARQUIVO .env

O arquivo `.env` foi criado e o build foi refeito com as configurações do EmailJS.

---

## 📋 CHECKLIST ANTES DO UPLOAD

- [x] Arquivo `.env` criado com todas as configurações
- [x] Build refeito (`npm run build`)
- [ ] Verificar pasta `dist/` foi gerada
- [ ] Upload para Hostgator

---

## 🚀 PASSOS PARA UPLOAD

### 1. Verificar pasta dist/

```bash
cd apps/marketing-site/frontend
ls -la dist/
```

Você deve ver:
- `index.html`
- `assets/` (pasta com CSS e JS)

### 2. Upload para Hostgator

1. Acesse o **cPanel** da Hostgator
2. Vá em **"File Manager"**
3. Navegue até a pasta do domínio `dasfabri.com`
4. **Selecione todos os arquivos** da pasta `dist/`
5. Faça upload (substitua os arquivos antigos)

**OU**

1. Use um cliente FTP (FileZilla, Cyberduck, etc.)
2. Conecte ao servidor Hostgator
3. Navegue até a pasta do domínio
4. Faça upload da pasta `dist/`

---

## ✅ DEPOIS DO UPLOAD

### 1. Testar o site

1. Acesse: `http://dasfabri.com` ou `https://dasfabri.com`
2. Verifique se o site carrega corretamente

### 2. Testar formulários

1. Preencha o formulário de **"Agende uma Demo"**
2. Preencha o formulário de **"Solicitar Acesso"**
3. Verifique a caixa de entrada de `dasfsociais@gmail.com`
4. Você deve receber os emails imediatamente! 🎉

---

## 🔍 VERIFICAR SE FUNCIONOU

### Se os emails chegarem:
✅ **SUCESSO!** EmailJS está funcionando perfeitamente!

### Se os emails NÃO chegarem:

1. Verifique se o arquivo `.env` estava presente durante o build
2. Verifique se fez rebuild após criar o `.env`
3. Verifique o console do navegador (F12) para erros
4. Verifique se as variáveis estão no código compilado

---

## 📊 CONFIGURAÇÕES FINAIS

- ✅ Service ID: `service_b356vgs`
- ✅ Public Key: `EigDHTvAsFSxLIw3A`
- ✅ Template ID Contato: `template_0undr9w`
- ✅ Template ID Acesso: `template_gmra0qh`
- ✅ Build feito com `.env` configurado

---

## 🎯 RESULTADO ESPERADO

Após o upload:
- ✅ Formulários funcionam sem backend
- ✅ Emails vão direto para `dasfsociais@gmail.com`
- ✅ Marketing e vendas podem trabalhar leads imediatamente
- ✅ Sistema de fallback (backend + localStorage) também funciona

---

**Última atualização:** Janeiro 2025

