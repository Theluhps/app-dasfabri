# 🐛 DEBUG: Tela Branca no Frontend

## ⚠️ PROBLEMA
A tela está aparecendo em branco, o que geralmente indica um erro JavaScript.

## 🔍 COMO DIAGNOSTICAR

### 1. Abra o Console do Navegador

**Chrome/Safari:**
- Pressione `Cmd + Option + I` (Mac) ou `F12` (Windows)
- Ou clique com botão direito → "Inspecionar" → Aba "Console"

**Firefox:**
- Pressione `Cmd + Option + K` (Mac) ou `F12` (Windows)

### 2. Verifique os Erros

Procure por erros em vermelho no console. Os mais comuns são:

- `Cannot find module` - Módulo não encontrado
- `Uncaught TypeError` - Erro de tipo
- `ReferenceError` - Variável não definida
- `Failed to fetch` - Erro de rede

### 3. Verifique a Aba Network

Na aba "Network" do DevTools:
- Recarregue a página (Cmd+R)
- Verifique se há requisições falhando (em vermelho)
- Especialmente verifique se `/src/main.tsx` está carregando

## 🔧 SOLUÇÕES COMUNS

### Solução 1: Limpar Cache e Recompilar

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS/apps/marketing-site/frontend"
rm -rf node_modules/.vite
npm run dev
```

### Solução 2: Verificar Erros no Terminal

No terminal onde o `npm run dev` está rodando, verifique se há erros de compilação.

### Solução 3: Recarregar Forçadamente

No navegador:
- Pressione `Cmd + Shift + R` (Mac) ou `Ctrl + Shift + R` (Windows)
- Isso força o recarregamento sem cache

### Solução 4: Verificar se o Elemento Root Existe

No console do navegador, execute:

```javascript
document.getElementById('root')
```

Deve retornar o elemento `<div id="root">`. Se retornar `null`, há um problema no HTML.

## 📋 CHECKLIST

- [ ] Console do navegador aberto
- [ ] Erros verificados no console
- [ ] Aba Network verificada
- [ ] Terminal do servidor verificado
- [ ] Cache limpo
- [ ] Página recarregada forçadamente

## 🆘 ENVIE AS INFORMAÇÕES

Se ainda não funcionar, envie:

1. **Screenshot do console** com os erros
2. **Erros do terminal** onde o servidor está rodando
3. **URL** que está tentando acessar

## 💡 DICA RÁPIDA

Tente acessar diretamente:
- `http://localhost:8080/test-dashboard` - Rota de teste pública

Se essa rota funcionar, o problema pode ser com autenticação ou rotas protegidas.

