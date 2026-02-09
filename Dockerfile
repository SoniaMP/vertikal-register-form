# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

# toolchain nativo para better-sqlite3 y similares
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args para NEXT_PUBLIC_*
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# database url
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL


# prisma + build
RUN npx prisma generate
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# usuario no-root
RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -u 1001 -G nextjs

# Copiamos solo el output standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma runtime + scripts (por si seed/migrate dentro del contenedor)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

# Carpeta para la SQLite (montada como volumen)
RUN mkdir -p /app/data && chown -R nextjs:nextjs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
