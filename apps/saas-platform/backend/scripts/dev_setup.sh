#!/bin/bash

# Scripts de desenvolvimento para acelerar workflow

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

cd "$BACKEND_DIR"

echo "🔧 Scripts de Desenvolvimento Dasfabri"
echo "======================================"
echo ""

case "$1" in
    "migrate")
        echo "📦 Criando nova migration..."
        alembic revision --autogenerate -m "$2"
        echo "✅ Migration criada"
        ;;
    
    "migrate-up")
        echo "⬆️ Aplicando migrations..."
        alembic upgrade head
        echo "✅ Migrations aplicadas"
        ;;
    
    "migrate-down")
        echo "⬇️ Revertendo última migration..."
        alembic downgrade -1
        echo "✅ Migration revertida"
        ;;
    
    "reset-db")
        echo "🗑️ Resetando banco de dados..."
        read -p "Tem certeza? Isso apagará todos os dados! (s/N): " confirm
        if [[ $confirm == [sS] ]]; then
            rm -f ../../data/databases/kue_marketing.db
            alembic upgrade head
            echo "✅ Banco resetado"
        else
            echo "❌ Operação cancelada"
        fi
        ;;
    
    "seed")
        echo "🌱 Populando banco com dados de teste..."
        python -m app.scripts.seed_data
        echo "✅ Dados de teste inseridos"
        ;;
    
    "test")
        echo "🧪 Rodando testes..."
        pytest "$2" -v
        ;;
    
    "test-cov")
        echo "🧪 Rodando testes com cobertura..."
        pytest --cov=app --cov-report=html --cov-report=term
        echo "✅ Relatório em htmlcov/index.html"
        ;;
    
    "lint")
        echo "🔍 Verificando código..."
        flake8 app/
        black --check app/
        mypy app/
        echo "✅ Código verificado"
        ;;
    
    "format")
        echo "✨ Formatando código..."
        black app/
        isort app/
        echo "✅ Código formatado"
        ;;
    
    "dev")
        echo "🚀 Iniciando servidor de desenvolvimento..."
        uvicorn main:app --reload --host 0.0.0.0 --port 8000
        ;;
    
    *)
        echo "Uso: $0 <comando> [args]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  migrate <mensagem>    - Criar nova migration"
        echo "  migrate-up            - Aplicar migrations"
        echo "  migrate-down          - Reverter última migration"
        echo "  reset-db              - Resetar banco de dados"
        echo "  seed                  - Popular com dados de teste"
        echo "  test [path]           - Rodar testes"
        echo "  test-cov              - Testes com cobertura"
        echo "  lint                  - Verificar código"
        echo "  format                - Formatador código"
        echo "  dev                   - Iniciar servidor dev"
        ;;
esac

