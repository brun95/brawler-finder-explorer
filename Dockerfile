# syntax = docker/dockerfile:1

# Builder image
FROM oven/bun:1.1.24-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --ci

# Copy rest of the app
COPY . .
RUN bunx next build

# ---

# Runner image
FROM oven/bun:1.1.24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone output
COPY --from=builder /app/.next/standalone .
# Copy public and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]