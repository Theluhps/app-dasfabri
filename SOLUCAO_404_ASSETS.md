# 🔧 SOLUÇÃO - ERRO 404 NOS ARQUIVOS CSS/JS

## Problema Identificado

```
[Error] Failed to load resource: 404 (index-DSgL_L74.js)
[Error] Failed to load resource: 404 (index-B6f76jXm.css)
```

**Causa:** Os arquivos CSS e JS não foram encontrados no servidor.

---

## ✅ SOLUÇÃO

### Opção 1: Verificar se Arquivos Foram Uploadados (Mais Provável)

**No cPanel File Manager:**

1. Abra a pasta `dasfabri.com/`
2. Verifique se existe a pasta `assets/`
3. Dentro de `assets/`, verifique se existem:
   - `index-DSgL_L74.js`
   - `index-B6f76jXm.css`

**Se a pasta `assets/` não existir ou estiver vazia:**

1. No seu computador, abra a pasta:
   ```
   Desktop → Dasfabri Sistema SaaS → apps → marketing-site → frontend → dist → assets
   ```

2. Você verá os arquivos:
   - `index-DSgL_L74.js`
   - `index-B6f76jXm.css`

3. **Fazer upload:**
   - No cPanel File Manager, dentro de `dasfabri.com/`
   - Clicar em "↑ Carregar" (Upload)
   - **OU** criar a pasta `assets/` primeiro:
     - Clicar em "+ Pasta"
     - Nome: `assets`
     - Depois fazer upload dos arquivos dentro dela

### Opção 2: Upload Completo Novamente

Se os arquivos não foram uploadados corretamente:

1. **No seu computador:**
   - Abra: `Desktop → Dasfabri Sistema SaaS → apps → marketing-site → frontend → dist`

2. **No cPanel File Manager:**
   - Abra: `dasfabri.com/`
   - Delete todos os arquivos antigos (se houver)
   - Faça upload de TODOS os arquivos de `dist/`:
     - `index.html`
     - Pasta `assets/` (inteira, com todos os arquivos dentro)
     - `das-logo.png`
     - Outros arquivos

### Opção 3: Verificar Estrutura Correta

A estrutura no servidor DEVE ser:

```
dasfabri.com/
├── index.html
├── .htaccess
├── assets/
│   ├── index-DSgL_L74.js    ← DEVE EXISTIR
│   └── index-B6f76jXm.css    ← DEVE EXISTIR
├── das-logo.png
└── outros arquivos...
```

**IMPORTANTE:** Os arquivos JS e CSS DEVEM estar dentro da pasta `assets/`, não na raiz!

---

## 📋 CHECKLIST DE VERIFICAÇÃO

No cPanel File Manager, dentro de `dasfabri.com/`:

- [ ] Existe pasta `assets/`?
- [ ] Dentro de `assets/` existe `index-DSgL_L74.js`?
- [ ] Dentro de `assets/` existe `index-B6f76jXm.css`?
- [ ] `index.html` está na raiz de `dasfabri.com/`?
- [ ] `.htaccess` está na raiz de `dasfabri.com/`?

---

## 🚀 PASSOS PARA CORRIGIR

### Passo 1: Verificar no cPanel

1. File Manager → `dasfabri.com/`
2. Ver se existe pasta `assets/`
3. Clicar em `assets/` para abrir
4. Ver se tem os arquivos JS e CSS

### Passo 2: Se Não Existir

1. **Criar pasta `assets/`:**
   - Dentro de `dasfabri.com/`
   - Clicar em "+ Pasta"
   - Nome: `assets`

2. **Fazer upload dos arquivos:**
   - No seu computador: `dist/assets/`
   - Upload de `index-DSgL_L74.js`
   - Upload de `index-B6f76jXm.css`

### Passo 3: Testar

1. Recarregar a página: `http://dasfabri.com`
2. Verificar Console (F12) - não deve ter mais erros 404
3. Site deve carregar normalmente

---

## 💡 DICA

**Upload de Pasta Inteira:**

Alguns File Managers permitem upload de pasta inteira:
- Arrastar e soltar a pasta `assets/` completa
- Isso faz upload de todos os arquivos dentro dela

**Ou fazer upload arquivo por arquivo:**
- Abrir pasta `assets/` no servidor
- Upload de cada arquivo individualmente

---

**Última atualização:** Janeiro 2025

