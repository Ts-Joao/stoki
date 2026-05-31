# Stoki

Sistema de gerenciamento de estoque com controle de produtos, entradas e saídas. Construído como monorepo com Next.js, NestJS e Prisma.

## Estrutura do projeto

```
stoki/
├── apps/
│   ├── web/          → Frontend (Next.js)
│   └── api/          → Backend (NestJS + Prisma)
├── packages/
│   └── shared/       → Tipos e utilitários compartilhados
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## Tecnologias

| Camada    | Tecnologia                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind  |
| Backend   | NestJS, TypeScript, Prisma ORM    |
| Banco     | PostgreSQL                        |
| Monorepo  | Turborepo, pnpm workspaces        |

## Pré-requisitos

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/stoki.git
cd stoki

# Instalar dependências
pnpm install
```

## Configuração das variáveis de ambiente

Cada app possui seu próprio `.env`. Copie os arquivos de exemplo:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Rodando o projeto

```bash
# Todos os apps em paralelo
pnpm dev

# App específico
pnpm --filter @stoki/web dev
pnpm --filter @stoki/api dev
```

## Scripts disponíveis

| Comando         | Descrição                                 |
|-----------------|-------------------------------------------|
| `pnpm dev`      | Inicia todos os apps em modo desenvolvimento |
| `pnpm build`    | Gera build de todos os apps               |
| `pnpm lint`     | Roda lint em todos os apps                |
| `pnpm type-check` | Verifica tipos em todos os apps         |

## Apps

- [`apps/web`](./apps/web/README.md) — Interface do usuário
- [`apps/api`](./apps/api/README.md) — API REST

## Licença

MIT