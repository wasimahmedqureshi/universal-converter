FROM node:22-alpine AS base

# Install system dependencies for conversions
RUN apk add --no-cache \
  ffmpeg \
  imagemagick \
  ghostscript \
  libreoffice \
  pandoc \
  tesseract-ocr \
  poppler-utils \
  && rm -rf /var/cache/apk/*

WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build layer
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production layer
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
