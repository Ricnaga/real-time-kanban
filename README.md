# Real-time Kanban

Kanban em tempo real com Next.js 16, GraphQL Yoga, Pothos, Drizzle, WebSocket e Redis.

## Stack

| Camada         | Tecnologia                                        |
| -------------- | ------------------------------------------------- |
| **Frontend**   | Next.js 16 (App Router, Turbopack), React 19      |
| **Estilos**    | Tailwind CSS v4, `tailwind-variants` (`.tv.ts`)   |
| **API**        | Fastify + GraphQL Yoga + Pothos (code-first)      |
| **Cliente**    | urql + `@urql/exchange-graphcache` + `graphql-ws` |
| **Tempo real** | Subscriptions Yoga (WebSocket + Redis Pub/Sub)    |
| **ORM**        | Drizzle ORM + PostgreSQL 16                       |
| **Backend**    | Clean Architecture + DDD + SOLID                  |
| **DI**         | Inversify (dependency injection)                  |
| **Cache**      | ioredis (Redis) + memory fallback                 |
| **Mensageria** | Redis (Pub/Sub para eventos de domínio)           |
| **Validação**  | Zod (schemas compartilhados)                      |
| **Métricas**   | prom-client (Prometheus) + Grafana                |
| **Padrões**    | SOLID, SOC, DRY, YAGNI, KISS, Clean Code          |

## Estrutura

```
real-time-kanban/
├── apps/
│   ├── client/                        # Next.js (frontend + urql)
│   │   └── src/
│   │       ├── app/                   # App Router (pages, layout)
│   │       │   ├── board/             # /board route
│   │       │   │   ├── _components/   # board-column, card-task, dialogs
│   │       │   │   └── _providers/    # board-dnd-context
│   │       │   └── _components/       # statistics-dashboard
│   │       ├── components/            # Componentes reutilizáveis
│   │       │   ├── skeleton/
│   │       │   ├── topbar/
│   │       │   └── typography/
│   │       ├── config/                # Environment config
│   │       ├── schemas/               # Zod validation schemas
│   │       └── services/              # GraphQL, hooks, urql
│   │           ├── graphql/           # Documents GraphQL (queries, mutations, subscriptions)
│   │           ├── hooks/             # Hooks que combinam useQuery + lógica
│   │           ├── cache-exchange.ts  # Config do graphcache (keys + subscription handlers)
│   │           ├── urql-client.ts     # Cliente urql (WebSocket + exchanges)
│   │           ├── urql-provider.tsx  # Provider React para o cliente urql
│   │           └── urql-rsc.ts        # Registro RSC para server-side fetching
│   │
│   └── server/                        # Fastify + GraphQL Yoga + Clean Arch
│       └── src/
│           ├── bff/                   # GraphQL layer (Pothos)
│           │   ├── adapters/          # Adapters por domínio
│           │   ├── connectors/        # Connectors ao backend
│           │   ├── domain/            # Modelos BFF
│           │   ├── factories/         # Factory pattern por domínio
│           │   ├── plugins/           # Yoga plugins
│           │   └── pothos/            # Schema + resolvers Pothos
│           ├── backend/               # Clean Architecture + DDD
│           │   ├── modules/           # action, task, statistics
│           │   │   ├── controllers/
│           │   │   ├── dto/
│           │   │   ├── entities/
│           │   │   ├── infra/         # Drizzle, Redis cache
│           │   │   ├── repositories/  # Interfaces (ports)
│           │   │   ├── use-cases/
│           │   │   └── value-objects/
│           │   └── shared/            # DI, controllers base, infra
│           ├── config/
│           └── core/                  # Server bootstrap (Fastify, WebSocket)
│
├── packages/
│   └── shared/                        # DTOs e tipos compartilhados
│
├── docker-compose.yml                 # PostgreSQL, Redis, Prometheus, Grafana
└── pnpm-workspace.yaml
```

## Arquitetura

```
Client (urql) ──HTTP──→ Fastify :4000 → GraphQL Yoga
              ──WS────→ Fastify :4000 → WebSocket (subscriptions)

Server:
  Yoga → Pothos resolver → Adapter → Connector → Controller
                                              └──→ Use Case → Drizzle/DB
                                              └──→ Redis Pub/Sub → Subscription

Backend (Clean Architecture):
  Controller → Use Case → Repository Interface → Drizzle/Redis
  Inversify injeta dependências entre as camadas
```

## Pré-requisitos

- Node.js 20+
- pnpm 11+
- Docker (PostgreSQL, Redis, Prometheus, Grafana)

## Desenvolvimento

```bash
# Infra
docker compose up -d

# Server (terminal 1)
pnpm start:server   # GraphQL API em :4000

# Client (terminal 2)
pnpm start:client   # Next.js em :3000

# Migrations (primeira vez)
pnpm --filter @kanban/server db:push
```

Abra [http://localhost:3000](http://localhost:3000) e [http://localhost:4000/graphql](http://localhost:4000/graphql) (GraphiQL).

## Scripts

| Comando                                  | Descrição                            |
| ---------------------------------------- | ------------------------------------ |
| `pnpm start`                             | Inicia client e server (turbo dev)   |
| `pnpm start:server`                      | Inicia GraphQL Yoga (server)         |
| `pnpm start:client`                      | Inicia Next.js (client)              |
| `pnpm build`                             | Build de produção                    |
| `pnpm lint`                              | Verifica código com Oxlint           |
| `pnpm lint:fix`                          | Corrige erros automáticos com Oxlint |
| `pnpm format`                            | Formata código com Prettier          |
| `pnpm format:check`                      | Verifica formatação                  |
| `pnpm db:push`                           | Push schema Drizzle ao banco         |
| `pnpm db:generate`                       | Gera migrations Drizzle              |
| `pnpm db:migrate`                        | Aplica migrations pendentes          |
| `pnpm db:seed`                           | Popula banco com dados iniciais      |
| `pnpm --filter @kanban/server typecheck` | Type check server                    |
| `pnpm --filter @kanban/client typecheck` | Type check client                    |

## Qualidade

- **Oxlint** — linter rápido (Rust) com regras para TypeScript, React e Next.js
- **Prettier** — formatação consistente (single quotes, sem semi, trailing commas)
- **Husky + lint-staged** — oxlint e prettier rodam automaticamente no pré-commit

## OpenCode

Este projeto usa [OpenCode](https://opencode.ai) como assistente de desenvolvimento. Agentes e skills estão configurados em `.opencode/`:

| Agente                | Modo     | Domínio                                       |
| --------------------- | -------- | --------------------------------------------- |
| `@front-end-engineer` | primary  | `apps/client/` — React/Next/Tailwind          |
| `@ux-ui-designer`     | subagent | Design de componentes e telas                 |
| `@software-engineer`  | subagent | `apps/server/src/bff/` — GraphQL              |
| `@backend-engineer`   | primary  | `apps/server/src/backend/` — Clean Arch + DDD |

Skills: `design-rules`, `architecture-frontend`, `architecture-backend`, `architecture-bff`.

Comandos customizados: `/lint`, `/format`, `/check`.

## Licença

MIT
