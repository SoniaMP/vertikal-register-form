# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

# Etapa de dependencias
FROM base AS deps
WORKDIR /app

# Instalamos dependencias nativas necesarias para compilar módulos nativos
RUN apk add --no-cache python3 make g++ libc6-compat

# Copiamos archivos de dependencias
COPY package.json package-lock.json* ./

# Instalamos dependencias
RUN npm ci

# Etapa de construcción
FROM base AS builder
WORKDIR /app

# Copiamos node_modules de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiamos todo el código fuente
COPY . .

# Variables de entorno para el build
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME
ARG DATABASE_URL

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV DATABASE_URL=${DATABASE_URL}

# Generamos el cliente de Prisma
RUN npx prisma generate

# Construimos la aplicación Next.js
RUN npm run build

# Etapa final de ejecución
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Creamos usuario y grupo para Next.js
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos archivos públicos
COPY --from=builder /app/public ./public

# Copiamos el output standalone de Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copiamos Prisma y configuración
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json

# Copiamos node_modules necesarios para Prisma y better-sqlite3 en runtime
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Establecemos permisos correctos
RUN chown -R nextjs:nodejs /app

# Creamos directorio para la base de datos
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]