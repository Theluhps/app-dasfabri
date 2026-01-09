# 🔧 CORREÇÃO - FAVICON (LOGO DAS)

## ✅ Configuração Atual

O `index.html` já está configurado corretamente:

```html
<link rel="icon" type="image/png" href="/das-logo.png" />
<link rel="shortcut icon" type="image/png" href="/das-logo.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/das-logo.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/das-logo.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/das-logo.png" />
```

O arquivo `das-logo.png` existe em:
- ✅ `apps/marketing-site/frontend/public/das-logo.png`
- ✅ `apps/marketing-site/frontend/dist/das-logo.png` (após build)

---

## 🚀 SOLUÇÃO

### 1. Verificar se o arquivo está no servidor

**No cPanel File Manager:**
1. Abra a pasta `dasfabri.com/`
2. Verifique se existe o arquivo `das-logo.png` na raiz
3. Se não existir, faça upload do arquivo:
   - Localização no seu computador: `apps/marketing-site/frontend/dist/das-logo.png`
   - Upload para: `dasfabri.com/das-logo.png` (raiz do site)

### 2. Limpar cache do navegador

**Safari (Mac):**
1. Pressione `Cmd+Option+E` (limpar cache)
2. Ou: Safari → Preferências → Avançado → "Mostrar menu Desenvolver"
3. Depois: Desenvolver → Limpar Caches

**Chrome/Edge:**
1. Pressione `Cmd+Shift+Delete` (Mac) ou `Ctrl+Shift+Delete` (Windows)
2. Selecione "Imagens e arquivos em cache"
3. Clique em "Limpar dados"

**Ou forçar recarregamento:**
- Pressione `Cmd+Shift+R` (Mac) ou `Ctrl+Shift+R` (Windows)

### 3. Verificar no navegador

1. Acesse `http://dasfabri.com`
2. Abra o DevTools (F12)
3. Vá na aba "Network"
4. Recarregue a página (F5)
5. Procure por `das-logo.png`
6. Verifique se retorna status 200 (sucesso) ou 404 (não encontrado)

### 4. Testar diretamente

Acesse diretamente:
- `http://dasfabri.com/das-logo.png`

Se aparecer a imagem, o arquivo está no servidor.
Se der erro 404, o arquivo não foi uploadado.

---

## 📋 CHECKLIST

- [ ] Arquivo `das-logo.png` existe em `public/das-logo.png`
- [ ] Build foi feito (`npm run build`)
- [ ] Arquivo `das-logo.png` existe em `dist/das-logo.png`
- [ ] Arquivo foi uploadado para `dasfabri.com/das-logo.png` (raiz)
- [ ] Cache do navegador foi limpo
- [ ] Teste direto: `http://dasfabri.com/das-logo.png` funciona
- [ ] Favicon aparece na aba do navegador

---

## 🔍 TROUBLESHOOTING

### Problema: Favicon não aparece

**Solução 1: Verificar caminho**
- O arquivo DEVE estar na raiz: `dasfabri.com/das-logo.png`
- NÃO em: `dasfabri.com/images/das-logo.png`

**Solução 2: Verificar formato**
- PNG funciona, mas alguns navegadores preferem `.ico`
- Se necessário, converter para `.ico`:
  - Use um conversor online (ex: convertio.co)
  - Renomeie para `favicon.ico`
  - Atualize `index.html`:
    ```html
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    ```

**Solução 3: Forçar atualização**
- Adicione um parâmetro de versão no `index.html`:
  ```html
  <link rel="icon" type="image/png" href="/das-logo.png?v=2" />
  ```
- Isso força o navegador a buscar uma nova versão

---

## 💡 DICA

**Para garantir que funcione:**
1. Faça upload do arquivo `das-logo.png` para a raiz do site
2. Limpe o cache do navegador
3. Teste em aba anônima/privada
4. Se ainda não funcionar, adicione também um `favicon.ico` na raiz

---

**Última atualização:** Janeiro 2025

