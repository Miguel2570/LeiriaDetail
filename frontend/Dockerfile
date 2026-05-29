# Etapa 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Argumentos de build
ARG VITE_API_URL
ARG VITE_GRAPHQL_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração Nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]