# ponytail: single-stage image (~1GB, full node_modules) — the "build" job also runs
# `payload migrate` and needs tsx/src/tsconfig paths at runtime, so there's nothing to prune
# into a slim standalone copy. Split into a multi-stage build if image size or cold start
# ever becomes a measured problem.
FROM node:22-slim

WORKDIR /app

RUN npm i -g bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
CMD ["npx", "next", "start"]
