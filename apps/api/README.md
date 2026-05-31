# Stoki — API

Backend do sistema de gerenciamento de estoque, construído com NestJS e Prisma ORM.

## Tecnologias

- **NestJS** com TypeScript
- **Prisma ORM** com PostgreSQL
- **JWT** para autenticação
- **class-validator** para validação de DTOs

## Estrutura

```
api/
├── src/
│   ├── auth/             → Autenticação (JWT, guards, estratégias)
│   ├── users/            → Módulo de usuários
│   ├── products/         → Módulo de produtos
│   ├── entries/          → Módulo de entradas de estoque
│   ├── exits/            → Módulo de saídas de estoque
│   ├── common/           → Guards, decorators e utils compartilhados
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
└── tsconfig.json
```

## Variáveis de ambiente

Crie um `.env` baseado no `.env.example`:

```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/stoki"

# JWT
JWT_ACCESS_SECRET=sua_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=sua_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3001
```

## Instalação e uso

```bash
# A partir da raiz do monorepo
pnpm --filter @stoki/api dev

# Ou dentro da pasta
cd apps/api
pnpm dev
```

A API roda em `http://localhost:3001/api` por padrão.

## Banco de dados

```bash
# Rodar migrations
pnpm --filter @stoki/api prisma migrate dev

# Abrir Prisma Studio
pnpm --filter @stoki/api prisma studio

# Gerar client após alterações no schema
pnpm --filter @stoki/api prisma generate
```

## Rotas principais

| Método | Rota                   | Descrição                        |
|--------|------------------------|----------------------------------|
| POST   | `/api/auth/login`      | Autenticação do usuário          |
| POST   | `/api/auth/refresh`    | Renovação do access token        |
| POST   | `/api/auth/logout`     | Encerramento de sessão           |
| GET    | `/api/products`        | Listagem de produtos             |
| POST   | `/api/products`        | Cadastro de produto              |
| PATCH  | `/api/products/:id`    | Atualização de produto           |
| DELETE | `/api/products/:id`    | Remoção de produto               |
| GET    | `/api/entries`         | Listagem de entradas de estoque  |
| POST   | `/api/entries`         | Registrar entrada                |
| GET    | `/api/exits`           | Listagem de saídas de estoque    |
| POST   | `/api/exits`           | Registrar saída                  |

## Scripts

| Comando              | Descrição                          |
|----------------------|------------------------------------|
| `pnpm dev`           | Servidor em modo watch             |
| `pnpm build`         | Build de produção                  |
| `pnpm start`         | Inicia o build (`node dist/main`)  |
| `pnpm lint`          | ESLint                             |
| `pnpm type-check`    | Verificação de tipos               |
| `pnpm prisma migrate dev` | Roda migrations             |
| `pnpm prisma studio` | Interface visual do banco          |