# Stoki — Web

Interface do sistema de gerenciamento de estoque, construída com Next.js 14 e App Router.

## Tecnologias

- **Next.js 14** com App Router
- **TypeScript**
- **Tailwind CSS**
- **Axios** para comunicação com a API

## Estrutura

```
web/
├── src/
│   └── app/
│       ├── (auth)/           → Rotas de autenticação (login, registro)
│       ├── (dashboard)/      → Rotas protegidas (produtos, movimentações)
│       │   ├── products/
│       │   ├── entries/
│       │   └── exits/
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Variáveis de ambiente

Crie um `.env.local` baseado no `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Instalação e uso

```bash
# A partir da raiz do monorepo
pnpm --filter @stoki/web dev

# Ou dentro da pasta
cd apps/web
pnpm dev
```

O app roda em `http://localhost:3000` por padrão.

## Build

```bash
pnpm --filter @stoki/web build
pnpm --filter @stoki/web start
```

## Scripts

| Comando          | Descrição                        |
|------------------|----------------------------------|
| `pnpm dev`       | Servidor de desenvolvimento      |
| `pnpm build`     | Build de produção                |
| `pnpm start`     | Inicia o build de produção       |
| `pnpm lint`      | ESLint                           |
| `pnpm type-check`| Verificação de tipos             |