<div align="center">
  <img src="../../.github/logo.png" alt="Stoki API" width="50%" />


  # Stoki API

  API REST para gerenciamento de estoque construída com NestJS, Prisma e PostgreSQL.

</div>

## Tecnologias

**Backend:** NestJS · TypeScript · Prisma ORM · PostgreSQL · JWT

**Qualidade:** Jest · Supertest · ESLint · Prettier

**DevOps:** GitHub Actions · Docker

---

## Documentação

Com a API rodando, acesse o Swagger em `http://localhost:8000/api/docs`.

---

## Estrutura

```text
src/
├── auth/
├── users/
├── products/
├── categories/
├── locations/
├── stock-movement/
├── audit/
├── dashboard/
├── common/
│   ├── pagination/
│   ├── guards/
│   ├── decorators/
│   └── filters/
├── database/
└── app.module.ts
```

---

## Módulos

| Módulo         | Descrição                     |
| -------------- | ----------------------------- |
| Auth           | Autenticação e autorização    |
| Users          | Gerenciamento de usuários     |
| Products       | Gerenciamento de produtos     |
| Categories     | Categorias dos produtos       |
| Locations      | Localizações físicas          |
| Stock Movement | Entradas, saídas e ajustes    |
| Dashboard      | Métricas e indicadores        |
| Audit          | Histórico de ações do sistema |

---

## Autenticação

JWT com access token + refresh token.

```http
POST /api/auth/login
POST /api/auth/refresh

Authorization: Bearer <access_token>
```

---

## Movimentações de estoque

Registradas automaticamente a cada operação.

| Tipo         | Descrição            |
| ------------ | -------------------- |
| `IN`         | Entrada de estoque   |
| `OUT`        | Saída de estoque     |
| `ADJUSTMENT` | Ajuste administrativo|

---

## Paginação

Endpoints que suportam paginação aceitam `?page=1&limit=10`:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

---

## Instalação

```bash
git clone 'https://github.com/Ts-Joao/stoki.git'
pnpm install
```

Configure o `.env` em `apps/api/`:

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
```

Execute as migrações:

```bash
pnpm --filter @stoki/api exec prisma migrate dev
pnpm --filter @stoki/api exec prisma generate
```

---

## Rodando

**Desenvolvimento**
```bash
pnpm --filter @stoki/api dev
```

**Produção**
```bash
pnpm --filter @stoki/api build
pnpm --filter @stoki/api start:prod
```

**Docker**
```bash
docker compose up --build
```

---

## Testes

```bash
pnpm --filter @stoki/api test        # unitários
pnpm --filter @stoki/api test:cov    # cobertura
pnpm --filter @stoki/api test:e2e    # E2E
```

---

## Status

- [x] Autenticação JWT
- [x] CRUD de usuários, produtos, categorias e localizações
- [x] Controle de estoque
- [x] Dashboard, auditoria e paginação
- [x] Swagger, testes unitários, E2E e CI
- [x] Docker
- [ ] Deploy em produção
- [ ] Integração com frontend

---

## Autor

Desenvolvido por João Teixeira.