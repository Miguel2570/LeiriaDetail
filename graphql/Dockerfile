# Etapa 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ✅ Copia TODA a pasta schema com subpastas
RUN cp -r /app/src/schema/* /app/dist/schema/

# ✅ Copia outras pastas necessárias
RUN cp -r /app/src/graphql /app/dist/graphql 2>/dev/null || true
RUN cp -r /app/src/resolvers /app/dist/resolvers 2>/dev/null || true
RUN cp -r /app/src/proxy /app/dist/proxy 2>/dev/null || true

# Etapa 2: Produção
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist

USER node
EXPOSE 4001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

CMD ["node", "dist/app.js"]