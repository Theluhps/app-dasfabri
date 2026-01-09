# 🔧 Troubleshooting - Servidor não responde

## Problema: Script não consegue acessar o servidor

### 1. Verificar se o servidor está rodando

```bash
# Verificar processo na porta 8000
lsof -ti:8000

# Ou verificar todos os processos Python
ps aux | grep uvicorn
```

### 2. Testar conexão manualmente

```bash
# Testar endpoint raiz
curl http://localhost:8000/

# Testar endpoint health
curl http://localhost:8000/health

# Testar com timeout
curl --connect-timeout 5 http://localhost:8000/
```

### 3. Verificar logs do servidor

Se o servidor estiver rodando, verifique os logs para ver se há erros:

```bash
# Se estiver rodando em um terminal, veja os logs lá
# Ou verifique se há arquivo de log
```

### 4. Reiniciar o servidor

```bash
# Parar o servidor atual (Ctrl+C ou kill)
kill $(lsof -ti:8000) 2>/dev/null

# Iniciar novamente
cd apps/saas-platform/backend
source ../../../venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Verificar firewall/permissões

```bash
# Verificar se a porta está aberta
netstat -an | grep 8000

# No macOS, verificar configurações de firewall
# System Preferences > Security & Privacy > Firewall
```

### 6. Testar em outro navegador/ferramenta

- Abra no navegador: `http://localhost:8000/`
- Abra Swagger: `http://localhost:8000/docs`
- Use Postman ou Insomnia

### 7. Verificar variáveis de ambiente

```bash
# Verificar se há variáveis que podem estar afetando
env | grep -i port
env | grep -i host
```

### 8. Executar o script de teste atualizado

```bash
cd apps/saas-platform/backend
./scripts/test_apis.sh
```

O script agora tem:
- ✅ Timeout de 2 segundos
- ✅ Verificação alternativa usando endpoint raiz
- ✅ Verificação de processo como fallback
- ✅ Mensagens de erro mais claras

## Solução Rápida

Se nada funcionar, tente:

```bash
# 1. Parar tudo
kill $(lsof -ti:8000) 2>/dev/null

# 2. Limpar cache Python (se houver)
find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null

# 3. Reiniciar servidor
cd apps/saas-platform/backend
source ../../../venv/bin/activate
uvicorn main:app --reload
```

## Contato

Se o problema persistir, verifique:
- Logs do servidor
- Mensagens de erro no terminal
- Status do venv (se está ativado)

