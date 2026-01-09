# Como Atualizar o Favicon no Safari

O favicon foi atualizado para usar a logo real da Dasfabri (`/images/dasfabri-logo-icon.png`).

## ⚠️ IMPORTANTE: O Safari tem cache muito agressivo para favicons

Siga estes passos na ordem:

### 1. Reinicie o Servidor
No terminal onde o servidor está rodando:
```bash
# Pressione Ctrl + C para parar
# Depois execute novamente:
npm run dev
```

### 2. Limpe o Cache do Safari

**Opção A - Limpar Cache Completo:**
1. Safari > Preferências (ou `Cmd + ,`)
2. Avançado
3. Marque "Mostrar menu Desenvolver na barra de menus"
4. Desenvolver > Limpar Caches
5. Feche e reabra o Safari

**Opção B - Limpar Histórico:**
1. Safari > Limpar Histórico...
2. Selecione "Última hora" ou "Hoje"
3. Clique em "Limpar Histórico"

### 3. Acesse em Modo Anônimo
1. `Cmd + Shift + N` (abrir janela anônima)
2. Acesse: `http://localhost:8080`
3. O favicon deve aparecer corretamente

### 4. Forçar Atualização da Página
- `Cmd + Shift + R` (hard refresh)
- Ou `Cmd + Option + R`

### 5. Verificar se o Arquivo Está Sendo Servido
No terminal, execute:
```bash
curl -I http://localhost:8080/images/dasfabri-logo-icon.png
```

Deve retornar `200 OK`.

## Se Ainda Não Funcionar

1. Feche TODAS as abas do Safari
2. Feche completamente o Safari (`Cmd + Q`)
3. Abra o Safari novamente
4. Acesse `http://localhost:8080` em uma nova aba

## Verificação Final

O favicon deve mostrar a logo da Dasfabri (não o texto "DAS").

Se ainda estiver mostrando o texto "DAS", o cache do Safari está muito persistente. Tente:
- Reiniciar o Mac
- Ou usar outro navegador temporariamente para verificar

