# ================================
# 1. Install dependencies
# ================================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ================================
# 2. Build the app
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy installed deps and app code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client (Ensure this schema path is correct)
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# ================================
# 3. Production image
# ================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set permissions for nextjs cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# COPY STANDALONE BUILD
# (Ensure 'output: "standalone"' is in your next.config.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy .env file (Now allowed because we fixed .dockerignore)
COPY .env .env

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]