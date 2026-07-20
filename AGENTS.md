<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Use `@context7/resolve-library-id` + `@context7/query-docs` with `next` to fetch current docs before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# real-time-kanban

## Stack

- **React 19** + **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** + `tailwind-variants`
- **URQL** + `@urql/exchange-graphcache` (GraphQL)
- **Radix UI** (primitivas de acessibilidade)
- **@dnd-kit** (drag and drop)
- **Fastify** + **GraphQL Yoga** + **Pothos** (server)
- **Drizzle ORM** + **PostgreSQL** (ORM + banco)
- **Inversify** (dependency injection no backend)
- **ioredis** (cache + pub/sub)
- **TypeScript** (tipagem forte, sem `any`)

## Agentes

- `@front-end-engineer` (`mode: primary`) — dono do frontend (`apps/client/`).
  React 19, Next.js 16, Tailwind CSS v4, componentes, performance.
  - Desenvolve telas: consulta `@ux-ui-designer` pra melhor tela e componentes.
  - Desenvolve lógica: consulta skills documentadas e `@software-engineer`.

- `@ux-ui-designer` (`mode: subagent`) — design de componentes e telas,
  posicionamento, acessibilidade e usabilidade. Invocado pelo `@front-end-engineer`.

- `@software-engineer` (`mode: subagent`) — BFF GraphQL (`apps/server/src/bff/`).
  Pothos, resolvers, adapters, connectors, context, subscriptions.
  Sem regra de negócio — só delivery mechanism. Invocado por `@front-end-engineer` ou `@backend-engineer`.

- `@backend-engineer` (`mode: primary`) — dono do backend (`apps/server/src/backend/`).
  Clean Architecture + DDD: domínio, use cases, controllers, infra.
  Regra de negócio, sem GraphQL. Pode invocar `@software-engineer` via task.

## Skills (carregar sob demanda)

- `.opencode/skills/design-rules/SKILL.md` — SOLID, SOC, DRY, YAGNI, KISS, Clean Code
- `.opencode/skills/architecture-frontend/SKILL.md` — arquitetura frontend
- `.opencode/skills/architecture-backend/SKILL.md` — arquitetura backend
- `.opencode/skills/architecture-bff/SKILL.md` — arquitetura BFF

## Commands

- `/lint` — roda `oxlint` no projeto
- `/format` — roda `prettier --write .`
- `/check` — roda `oxlint` + `prettier --check .`

## Regras de código

As code conventions estão documentadas na skill de arquitetura frontend:
`.opencode/skills/architecture-frontend/SKILL.md` — useState, tipagem, tailwind-variants, return early, convenções de componentes e providers.

### Convenções de Page (Next.js App Router)

Toda page deve seguir a estrutura:

- `page.tsx` — Server Component, busca dados via RSC, passa como props
- `loading.tsx` — Server Component, skeleton exibido durante fetch server-side
- `error.tsx` — Client Component, error boundary com `react-error-boundary`
- `_components/` — Client components da page
  - `<component>.tsx` + `<component>.tv.ts` — componente principal + estilos
  - `<component>-loading.tsx` — loading state client-side
  - `<component>-empty.tsx` — empty state
  - `<component>-error.tsx` — error state GraphQL
  - Sub-componentes reutilizáveis como arquivos soltos na pasta

### Recharts

- **`Cell` está deprecated** (recharts v3) — usar `shape` prop como função
- Pattern: `shape={(props) => <Sector {...props} fill={colors[props.index]} />}`

## Estrutura do projeto

```
real-time-kanban/
├── apps/
│   ├── client/                    # Next.js (frontend + urql)
│   │   └── src/
│   │       ├── app/               # App Router (pages, layout)
│   │       ├── components/        # Componentes reutilizáveis
│   │       ├── config/            # Environment config
│   │       ├── schemas/           # Zod validation schemas
│   │       └── services/          # GraphQL (queries, mutations, subscriptions), hooks, urql
│   │
│   └── server/                    # Fastify + GraphQL Yoga + Clean Arch
│       └── src/
│           ├── bff/               # GraphQL layer (Pothos)
│           │   ├── adapters/      # Adapters por domínio
│           │   ├── connectors/    # Connectors ao backend
│           │   ├── domain/        # Modelos BFF
│           │   ├── factories/     # Factory pattern por domínio
│           │   ├── plugins/       # Yoga plugins
│           │   └── pothos/        # Schema + resolvers Pothos
│           ├── backend/           # Clean Architecture + DDD
│           │   ├── modules/       # action, task, statistics
│           │   │   ├── controllers/
│           │   │   ├── dto/
│           │   │   ├── entities/
│           │   │   ├── infra/     # Drizzle, Redis cache
│           │   │   ├── repositories/  # Interfaces (ports)
│           │   │   ├── use-cases/
│           │   │   └── value-objects/
│           │   └── shared/        # DI, controllers base, infra
│           ├── config/
│           └── core/              # Server bootstrap (Fastify, WebSocket)
│
├── packages/
│   └── shared/            # DTOs e tipos compartilhados
│
├── docker-compose.yml     # PostgreSQL, Redis, Prometheus, Grafana
└── pnpm-workspace.yaml
```
