# Multi-stage image: deps → builder → runner.
# Runner keeps src/ + template/backend so Cloud Run can override CMD for
# `payload migrate` and seed scripts (same Artifact Registry tag as the app).
FROM node:22-slim AS base
WORKDIR /app
RUN npm i -g bun

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json bun.lock ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/template/backend ./template/backend
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["npx", "next", "start"]
