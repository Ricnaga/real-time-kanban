# Real-time Kanban

Kanban em tempo real com Next.js 16, GraphQL Yoga, Pothos, Drizzle, WebSocket e Redis.

## Stack

| Camada         | Tecnologia                                        |
| -------------- | ------------------------------------------------- |
| **Frontend**   | Next.js 16 (App Router), React 19, TypeScript     |
| **Estilos**    | Tailwind CSS v4, `tailwind-variants` (`.tv.ts`)   |
| **API**        | GraphQL Yoga + Pothos (code-first)                |
| **Cliente**    | urql + graphql-ws                                 |
| **Tempo real** | Subscriptions Yoga (WebSocket + Redis Pub/Sub)    |
| **ORM**        | Drizzle ORM + PostgreSQL                          |
| **Backend**    | Clean Architecture + Hexagonal (Ports & Adapters) |
| **Mensageria** | Redis (Pub/Sub para eventos de domínio)           |
| **Padrões**    | SOLID, SOC, DRY, YAGNI, KISS, Clean Code          |

## Estrutura

```
real-time-kanban/
├── apps/
│   ├── client/            # Next.js (frontend + urql)
│   │   ├── src/app/           (pages, layout)
│   │   └── src/lib/           (urql client, provider)
│   │
│   └── server/            # GraphQL Yoga + Pothos + Clean Arch
│       ├── src/
│       │   ├── bff/           # GraphQL layer (Pothos)
│       │   │   ├── objects/       (Board, Column, Card)
│       │   │   ├── queries/
│       │   │   ├── mutations/
│       │   │   └── subscriptions/
│       │   ├── backend/        # Clean Architecture
│       │   │   ├── controllers/   (orquestradores)
│       │   │   ├── domain/        (entities, use-cases)
│       │   │   ├── ports/         (interfaces)
│       │   │   └── infra/         (Drizzle, Redis)
│       │   └── index.ts         (Yoga server entry)
│       └── drizzle.config.ts
│
├── packages/
│   └── shared/            # DTOs e tipos compartilhados
│
├── docker-compose.yml     # PostgreSQL + Redis
└── pnpm-workspace.yaml
```

## Arquitetura

```
Client (urql) ──HTTP──→ Server Yoga :4000
              ──WS────→ Server Yoga :4000 (subscriptions)

Server:
  Yoga → Pothos resolver → Controller → Use Case → Drizzle/DB
                                             └──→ Redis Pub/Sub → Subscription
```

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker (PostgreSQL + Redis)

## Desenvolvimento

```bash
# Infra
docker compose up -d

# Server
pnpm server         # GraphQL API em :4000

# Client (outro terminal)
pnpm dev            # Next.js em :3000

# Migrations (primeira vez)
pnpm --filter @kanban/server db:push
```

Abra [http://localhost:3000](http://localhost:3000) e [http://localhost:4000/graphql](http://localhost:4000/graphql) (GraphiQL).

## Scripts

| Comando                                  | Descrição                            |
| ---------------------------------------- | ------------------------------------ |
| `pnpm dev`                               | Inicia Next.js (client)              |
| `pnpm server`                            | Inicia GraphQL Yoga (server)         |
| `pnpm build`                             | Build de produção                    |
| `pnpm lint`                              | Verifica código com Oxlint           |
| `pnpm lint:fix`                          | Corrige erros automáticos com Oxlint |
| `pnpm format`                            | Formata código com Prettier          |
| `pnpm format:check`                      | Verifica formatação                  |
| `pnpm db:push`                           | Push schema Drizzle ao banco         |
| `pnpm db:generate`                       | Gera migrations Drizzle              |
| `pnpm db:migrate`                        | Aplica migrations pendentes          |
| `pnpm --filter @kanban/server typecheck` | Type check server                    |
| `pnpm --filter @kanban/client typecheck` | Type check client                    |

## Qualidade

- **Oxlint** — linter rápido (Rust) com regras para TypeScript, React e Next.js
- **Prettier** — formatação consistente (single quotes, sem semi, trailing commas)
- **Husky + lint-staged** — oxlint e prettier rodam automaticamente no pré-commit

## OpenCode

Este projeto usa [OpenCode](https://opencode.ai) como assistente de desenvolvimento. Agentes e skills estão configurados em `.opencode/`:

- `@front-end-engineer` — engenheiro frontend React/Next/Tailwind/Performance
- `@ux-ui-designer` — designer de componentes e telas

Comandos customizados: `/lint`, `/format`, `/check`.

## Licença

MIT
