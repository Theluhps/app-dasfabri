# Dasfabri Backend

Backend SaaS multiempresa com FastAPI, SQLAlchemy, Alembic e PostgreSQL/SQLite.

## Pré-requisitos
- Python 3.11
- Git

## Instalação local
```sh
# Clone o repositório
git clone <seu-repo-github>
cd <seu-repo-github>/backend

# Crie e ative o ambiente virtual
python3.11 -m venv ../venv
source ../venv/bin/activate

# Instale as dependências
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

## Migrações Alembic
```sh
# Gere a migração inicial (se necessário)
PYTHONPATH=$(pwd)/.. alembic -c alembic.ini revision --autogenerate -m "initial"

# Aplique as migrações
PYTHONPATH=$(pwd)/.. alembic -c alembic.ini upgrade head
```

## Rodando o servidor localmente
```sh
uvicorn main:app --reload
```
Acesse: http://localhost:8000/docs

## Deploy no Render
- Configure as variáveis de ambiente, especialmente `DATABASE_URL` para PostgreSQL.
- Ajuste o `alembic.ini` para:
  ```
  sqlalchemy.url = ${DATABASE_URL}
  ```
- Comando de start sugerido:
  ```
  gunicorn -k uvicorn.workers.UvicornWorker main:app
  ```
- Garanta que as migrações rodem no deploy (adicione um script de inicialização se necessário):
  ```sh
  alembic upgrade head && gunicorn -k uvicorn.workers.UvicornWorker main:app
  ```

## .gitignore sugerido
```
venv/
*.pyc
__pycache__/
*.db
.env
```

## Observações
- Para produção, use PostgreSQL.
- Nunca commite arquivos sensíveis ou a venv.
- Teste os endpoints no Swagger UI antes do deploy. 