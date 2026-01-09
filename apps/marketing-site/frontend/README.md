# Dasfabri - Plataforma SaaS de Comércio Exterior

Sistema completo de gestão de processos de importação e exportação, desenvolvido com tecnologias modernas.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com:

- **Vite** - Build tool e dev server ultra-rápido
- **TypeScript** - Tipagem estática para JavaScript
- **React 18** - Biblioteca para construção de interfaces
- **shadcn-ui** - Componentes UI acessíveis e customizáveis
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento para aplicações React
- **Framer Motion** - Biblioteca de animações
- **Recharts** - Biblioteca de gráficos
- **Zod** - Validação de schemas TypeScript-first

## 📋 Pré-requisitos

- Node.js 18+ (recomendado usar [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm ou yarn

## 🛠️ Instalação

```sh
# 1. Clone o repositório
git clone <SEU_REPOSITORIO_GIT>

# 2. Navegue até o diretório do frontend
cd apps/marketing-site/frontend

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:8080`

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com hot-reload
- `npm run build` - Cria build de produção
- `npm run build:prod` - Build otimizado para produção
- `npm run build:dev` - Build para desenvolvimento
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter ESLint
- `npm run analyze` - Analisa o bundle de produção

## 🏗️ Estrutura do Projeto

```
frontend/
├── public/              # Arquivos estáticos
│   ├── images/          # Imagens da aplicação
│   └── favicon.svg      # Favicon da Dasfabri
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   ├── contexts/       # Contextos React (Auth, Theme, etc)
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   ├── lib/            # Utilitários e helpers
│   └── App.tsx         # Componente principal
└── package.json
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend com:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Dasfabri
```

## 📦 Build para Produção

```sh
npm run build:prod
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

## 🧪 Testes

```sh
# Executar testes (quando implementados)
npm test
```

## 📝 Licença

Copyright © 2025 Dasfabri. Todos os direitos reservados.

## 🤝 Contribuindo

Para contribuir com o projeto, entre em contato com a equipe de desenvolvimento.

## 📞 Suporte

Para suporte técnico, entre em contato através dos canais oficiais da Dasfabri.
