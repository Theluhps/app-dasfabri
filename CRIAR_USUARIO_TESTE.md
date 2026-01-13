# 👤 CRIAR USUÁRIO DE TESTE

## 📋 INFORMAÇÕES ENCONTRADAS

### Script Antigo (pode estar desatualizado):
- **Email:** `teste@dasfabri.com`
- **Senha:** `teste123`

### Usuários de Teste (para testes automatizados):
- **Email:** `test@example.com`
- **Senha:** `testpassword123`

---

## ⚠️ IMPORTANTE

**Não há um usuário de teste criado automaticamente no banco de dados!**

Você precisa criar um usuário manualmente ou usar o endpoint de registro.

---

## 🚀 COMO CRIAR USUÁRIO DE TESTE

### Opção 1: Usar Endpoint de Registro (Recomendado)

Após o deploy funcionar, você pode criar um usuário usando a API:

**POST** `/api/v1/auth/register`

```json
{
  "name": "Admin Teste",
  "email": "admin@dasfabri.com",
  "password": "admin123",
  "role": "admin"
}
```

### Opção 2: Criar via Script Python

Você pode criar um script para adicionar usuário diretamente no banco:

```python
from app.core.security import get_password_hash
from app.models import User, Company, UserStatus
from app.core.database import SessionLocal

db = SessionLocal()

# Criar empresa
company = Company(
    name="Empresa Teste",
    cnpj="12345678000190",
    email="contato@empresateste.com"
)
db.add(company)
db.commit()

# Criar usuário admin
user = User(
    name="Admin Teste",
    email="admin@dasfabri.com",
    hashed_password=get_password_hash("admin123"),
    company_id=company.id,
    role="admin",
    status=UserStatus.active
)
db.add(user)
db.commit()
```

---

## 📝 CREDENCIAIS SUGERIDAS PARA TESTE

**Email:** `admin@dasfabri.com`  
**Senha:** `admin123`  
**Role:** `admin`

**OU**

**Email:** `teste@dasfabri.com`  
**Senha:** `teste123`  
**Role:** `admin`

---

## 🔐 LOGIN VIA API

Após criar o usuário, faça login:

**POST** `/api/v1/auth/login`

**Form Data:**
- `username`: `admin@dasfabri.com`
- `password`: `admin123`

**Resposta:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {...}
}
```

---

**Você precisa criar o usuário primeiro! Use o endpoint de registro ou crie via script.** 🚀
