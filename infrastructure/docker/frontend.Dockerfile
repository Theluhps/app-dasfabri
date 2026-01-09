FROM node:18-alpine AS builder

WORKDIR /app

# Copiar e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código e build
COPY . .
RUN npm run build

# Stage de produção
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

