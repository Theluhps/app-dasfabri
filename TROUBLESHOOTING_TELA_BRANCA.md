# 🔍 TROUBLESHOOTING - TELA BRANCA

## Problema
Site mostra tela branca ao acessar `http://dasfabri.com/`

---

## 🔎 DIAGNÓSTICO

### 1. Verificar Console do Navegador

**IMPORTANTE:** Abra o console do navegador para ver erros:

1. Acesse `http://dasfabri.com`
2. Pressione `F12` ou `Cmd+Option+I` (Mac)
3. Vá na aba **"Console"**
4. Veja se há erros em vermelho

**Erros comuns:**
- `Failed to load resource` → Arquivo não encontrado
- `404 Not Found` → Arquivo não existe no servidor
- `CORS error` → Problema de permissões
- `Uncaught Error` → Erro no JavaScript

### 2. Verificar Network (Rede)

1. No DevTools, vá na aba **"Network"**
2. Recarregue a página (`F5` ou `Cmd+R`)
3. Veja quais arquivos estão sendo carregados:
   - ✅ `index.html` → deve retornar 200
   - ✅ `index-DSgL_L74.js` → deve retornar 200
   - ✅ `index-B6f76jXm.css` → deve retornar 200
   - ❌ Se algum retornar 404 → arquivo não foi uploadado

### 3. Verificar Estrutura no Servidor

No cPanel File Manager, dentro de `dasfabri.com/`, você DEVE ter:

```
dasfabri.com/
├── index.html          ← OBRIGATÓRIO
├── .htaccess          ← OBRIGATÓRIO
├── assets/            ← OBRIGATÓRIO
│   ├── index-DSgL_L74.js
│   └── index-B6f76jXm.css
├── das-logo.png
└── outros arquivos...
```

---

## 🔧 SOLUÇÕES

### Solução 1: Verificar se Arquivos Foram Uploadados

**No cPanel File Manager:**

1. Abra a pasta `dasfabri.com/`
2. Verifique se existe:
   - [ ] `index.html`
   - [ ] Pasta `assets/` com arquivos dentro
   - [ ] `.htaccess`

**Se faltar algum arquivo:**
- Faça upload novamente
- Certifique-se de fazer upload de TODOS os arquivos de `dist/`

### Solução 2: Verificar Caminhos dos Arquivos

O `index.html` deve referenciar:
- `/assets/index-DSgL_L74.js` (caminho absoluto)
- `/assets/index-B6f76jXm.css` (caminho absoluto)

**Se os nomes dos arquivos forem diferentes:**
- Os arquivos em `assets/` podem ter nomes diferentes
- Verifique os nomes reais no servidor
- Atualize o `index.html` se necessário

### Solução 3: Verificar Permissões

**No cPanel File Manager:**

1. Selecionar `index.html`
2. Clicar em "Permissões"
3. Deve ser: `644` (rw-r--r--)

4. Selecionar pasta `assets/`
5. Clicar em "Permissões"
6. Deve ser: `755` (rwxr-xr-x)

### Solução 4: Verificar .htaccess

O `.htaccess` pode estar bloqueando arquivos. Teste:

1. Renomear `.htaccess` para `.htaccess.bak` (temporariamente)
2. Recarregar a página
3. Se funcionar, o problema está no `.htaccess`

### Solução 5: Verificar Erros JavaScript

**No Console do Navegador:**

Se houver erros JavaScript:
- Anote o erro exato
- Pode ser problema de dependências ou código

---

## 🚨 PROBLEMAS COMUNS

### Problema 1: Arquivos CSS/JS retornam 404

**Causa:** Arquivos não foram uploadados ou estão em local errado

**Solução:**
1. Verificar se pasta `assets/` existe em `dasfabri.com/`
2. Verificar se arquivos estão dentro de `assets/`
3. Fazer upload novamente se necessário

### Problema 2: CORS Error

**Causa:** Servidor bloqueando requisições

**Solução:**
- Geralmente não é problema para arquivos estáticos
- Se aparecer, verificar configurações do servidor

### Problema 3: JavaScript não executa

**Causa:** Erro no código JavaScript

**Solução:**
- Verificar console para erro específico
- Pode ser necessário corrigir o código

### Problema 4: .htaccess bloqueando

**Causa:** Regras do `.htaccess` muito restritivas

**Solução:**
1. Renomear `.htaccess` para `.htaccess.bak`
2. Testar se site carrega
3. Se carregar, ajustar `.htaccess`

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Console do navegador aberto (F12)
- [ ] Verificar erros no Console
- [ ] Verificar Network (quais arquivos carregam)
- [ ] Verificar se `index.html` existe no servidor
- [ ] Verificar se pasta `assets/` existe no servidor
- [ ] Verificar se arquivos JS/CSS estão em `assets/`
- [ ] Verificar permissões dos arquivos (644 para arquivos, 755 para pastas)
- [ ] Verificar se `.htaccess` está configurado corretamente

---

## 🔄 PRÓXIMOS PASSOS

1. **Abrir Console do Navegador** e verificar erros
2. **Verificar Network** para ver quais arquivos não carregam
3. **Verificar estrutura no servidor** (File Manager)
4. **Compartilhar os erros** encontrados para correção específica

---

**Última atualização:** Janeiro 2025

