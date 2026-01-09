# 🔧 REMOVER node_modules DO GIT

**Problema:** `node_modules/` está sendo commitado, tornando o push muito grande (89.87 MiB)

---

## ✅ SOLUÇÃO

Execute estes comandos no terminal:

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"

# 1. Remover node_modules do git (mas manter localmente)
git rm -r --cached apps/marketing-site/frontend/node_modules

# 2. Remover apresentações grandes (opcional, mas recomendado)
git rm --cached "presentations/commercial/PPT Apresentação comercial.pptx"
git rm --cached "presentations/commercial/Importação.key"
git rm --cached "presentations/technical/Proposta tecnica po management.key"
git rm --cached "Apresentaçoes/PPT Apresentação comercial.pptx"

# 3. Adicionar .gitignore atualizado
git add .gitignore

# 4. Fazer commit
git commit -m "Remove node_modules e arquivos grandes do git"

# 5. Tentar push novamente
git push origin main --force
```

---

## 📋 O QUE ISSO FAZ

- ✅ Remove `node_modules/` do git (mas mantém localmente)
- ✅ Remove arquivos grandes (.key, .pptx) do git
- ✅ Atualiza `.gitignore` para evitar no futuro
- ✅ Reduz drasticamente o tamanho do push

---

## ⚠️ IMPORTANTE

Depois disso, `node_modules/` não será mais commitado. Quando alguém clonar o repositório, precisará rodar `npm install` para instalar as dependências.

---

**Execute os comandos acima no terminal!** 🚀
