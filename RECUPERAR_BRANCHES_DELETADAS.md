# 🔄 COMO RECUPERAR BRANCHES DELETADAS

**Situação:** Você deletou branches sem querer e quer recuperá-las

---

## ✅ SOLUÇÃO: USAR GIT REFLOG

O Git mantém um histórico de TODAS as ações (reflog). Mesmo branches deletadas podem ser recuperadas!

---

## 🔍 PASSO 1: VERIFICAR REFLOG

Execute para ver o histórico completo:

```bash
cd "/Users/thelhps/Desktop/Dasfabri Sistema SaaS"
git reflog
```

Isso mostra TODAS as ações, incluindo:
- Commits
- Checkouts
- Branch creations
- Branch deletions

---

## 📋 PASSO 2: IDENTIFICAR A BRANCH DELETADA

No reflog, procure por:
- `branch: Created from...` (criação da branch)
- `branch: Deleted...` (deleção da branch)
- O hash do commit da branch

Exemplo:
```
abc1234 branch: Created from main
def5678 branch: Deleted branch feature-x
```

---

## 🔄 PASSO 3: RECUPERAR A BRANCH

### Opção A: Se você souber o nome da branch

```bash
# Recuperar branch pelo nome
git checkout -b nome-da-branch abc1234
```

Onde `abc1234` é o hash do último commit da branch.

### Opção B: Se você souber o hash do commit

```bash
# Recuperar branch pelo hash
git checkout -b nome-da-branch abc1234
```

### Opção C: Recuperar todas as branches deletadas

```bash
# Ver todas as branches que existiram
git reflog | grep "branch:"

# Para cada branch, recuperar:
git checkout -b nome-da-branch hash-do-commit
```

---

## 🎯 EXEMPLO PRÁTICO

Se você deletou uma branch chamada `feature-login`:

```bash
# 1. Ver reflog
git reflog | grep "feature-login"

# 2. Encontrar o hash (exemplo: abc1234)
# 3. Recuperar
git checkout -b feature-login abc1234
```

---

## ⚠️ IMPORTANTE

- **Reflog local:** Só funciona para branches que existiram localmente
- **Reflog remoto:** Se a branch estava no GitHub, pode recuperar de lá
- **Tempo limite:** Reflog pode expirar após ~90 dias (configurável)

---

## 🔍 RECUPERAR DO GITHUB (Se estava no remoto)

Se a branch estava no GitHub:

```bash
# Ver branches remotas (incluindo deletadas)
git fetch origin
git branch -r

# Recuperar branch remota
git checkout -b nome-da-branch origin/nome-da-branch
```

---

## 📝 COMANDOS ÚTEIS

```bash
# Ver todas as branches (locais e remotas)
git branch -a

# Ver reflog completo
git reflog

# Ver reflog de uma branch específica
git reflog show nome-da-branch

# Ver commits de uma branch deletada
git log --all --oneline --graph | grep "nome-da-branch"
```

---

**Vou verificar o reflog agora para encontrar suas branches deletadas!** 🔍
