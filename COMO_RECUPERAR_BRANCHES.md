# 🔄 COMO RECUPERAR BRANCHES DELETADAS

**Branches encontradas no GitHub:**
- ✅ `origin/DATA`
- ✅ `origin/master`
- ✅ `origin/codespace-stunning-bassoon-4vqg559xvjw2jg6g`
- ✅ `origin/main` (já existe localmente)

---

## 🚀 OPÇÃO 1: Script Automático (Recomendado)

Execute:

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"
./scripts/recuperar_branches.sh
```

O script vai:
1. Atualizar referências do GitHub
2. Mostrar branches disponíveis
3. Recuperar todas automaticamente

---

## 🎯 OPÇÃO 2: Manual (Passo a Passo)

### Recuperar branch DATA:

```bash
git fetch origin
git checkout -b DATA origin/DATA
```

### Recuperar branch master:

```bash
git checkout -b master origin/master
```

### Recuperar branch codespace:

```bash
git checkout -b codespace origin/codespace-stunning-bassoon-4vqg559xvjw2jg6g
```

---

## 🔍 RECUPERAR BRANCHES DELETADAS LOCALMENTE

Se você deletou branches que só existiam localmente:

### Passo 1: Ver reflog

```bash
git reflog --all
```

### Passo 2: Encontrar a branch

Procure por:
- `branch: Created from...`
- `branch: Deleted...`
- O nome da branch

### Passo 3: Recuperar pelo hash

```bash
# Exemplo: Se encontrou hash abc1234
git checkout -b nome-da-branch abc1234
```

---

## 📋 COMANDOS ÚTEIS

```bash
# Ver todas as branches (locais e remotas)
git branch -a

# Ver apenas branches remotas
git branch -r

# Ver apenas branches locais
git branch

# Atualizar referências do GitHub
git fetch origin --prune

# Ver histórico de ações (reflog)
git reflog
```

---

## ⚠️ IMPORTANTE

- **Branches no GitHub:** ✅ Podem ser recuperadas a qualquer momento
- **Branches locais deletadas:** ✅ Podem ser recuperadas pelo reflog (até ~90 dias)
- **Commits não perdidos:** ✅ Mesmo deletando branches, os commits ainda existem

---

## 🎯 PRÓXIMOS PASSOS

1. **Execute o script:** `./scripts/recuperar_branches.sh`
2. **Ou recupere manualmente** usando os comandos acima
3. **Verifique:** `git branch` para ver todas as branches

---

**Pronto para recuperar! Execute o script ou os comandos manuais acima.** 🚀
