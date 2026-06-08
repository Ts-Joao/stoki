FROM node:24-alpine

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

RUN pnpm install --frozen-lockfile --unsafe-perm

COPY apps/api apps/api

WORKDIR /app/apps/api

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 8000

CMD ["node", "dist/src/main.js"]