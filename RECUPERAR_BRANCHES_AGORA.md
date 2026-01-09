# 🔄 RECUPERAR BRANCHES DELETADAS - GUIA RÁPIDO

**Branches encontradas no GitHub:**
- `origin/DATA`
- `origin/codespace-stunning-bassoon-4vqg559xvjw2jg6g`
- `origin/master`

---

## ✅ RECUPERAR BRANCHES DO GITHUB

### Passo 1: Atualizar referências remotas

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"
git fetch origin
```

### Passo 2: Ver todas as branches remotas

```bash
git branch -r
```

### Passo 3: Recuperar cada branch

Para cada branch que você quer recuperar:

```bash
# Exemplo: Recuperar branch DATA
git checkout -b DATA origin/DATA

# Exemplo: Recuperar branch master
git checkout -b master origin/master

# Exemplo: Recuperar branch codespace
git checkout -b codespace origin/codespace-stunning-bassoon-4vqg559xvjw2jg6g
```

---

## 🔍 RECUPERAR BRANCHES DELETADAS LOCALMENTE

Se você deletou branches que só existiam localmente:

### Passo 1: Ver reflog completo

```bash
git reflog --all
```

### Passo 2: Procurar pela branch deletada

Procure por linhas como:
- `branch: Created from...`
- `branch: Deleted...`
- O nome da branch

### Passo 3: Recuperar pelo hash

```bash
# Exemplo: Se você encontrou o hash abc1234
git checkout -b nome-da-branch abc1234
```

---

## 📋 COMANDOS ÚTEIS

```bash
# Ver todas as branches (locais e remotas)
git branch -a

# Ver branches remotas
git branch -r

# Ver branches locais
git branch

# Ver reflog (histórico de ações)
git reflog

# Ver reflog de uma branch específica
git reflog show nome-da-branch

# Atualizar referências do GitHub
git fetch origin --prune
```

---

## 🎯 EXEMPLO COMPLETO

Se você quer recuperar a branch `DATA`:

```bash
# 1. Atualizar referências
git fetch origin

# 2. Verificar se existe
git branch -r | grep DATA

# 3. Recuperar
git checkout -b DATA origin/DATA

# 4. Verificar
git branch
```

---

## ⚠️ IMPORTANTE

- **Branches no GitHub:** Podem ser recuperadas a qualquer momento
- **Branches locais deletadas:** Podem ser recuperadas pelo reflog (até ~90 dias)
- **Commits não perdidos:** Mesmo deletando branches, os commits ainda existem no reflog

---

**Quer que eu execute os comandos para recuperar as branches do GitHub agora?** 🚀
