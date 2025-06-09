#!/bin/bash
set -e

# Rodar migrações Alembic
alembic -c backend/alembic.ini upgrade head

# Iniciar o servidor FastAPI
exec gunicorn -k uvicorn.workers.UvicornWorker main:app --chdir backend --bind 0.0.0.0:10000 