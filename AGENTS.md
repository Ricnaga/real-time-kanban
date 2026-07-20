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
- **TypeScript** (tipagem forte, sem `any`)

## Agentes

- `@front-end-engineer` (`mode: primary`) — dono do frontend (`apps/client/`).
  React 19, Next.js 16, Tailwind CSS v4, componentes, performance.
  - Desenvolve telas: consulta `@ux-ui-designer` pra melhor tela e componentes.
  - Desenvolve lógica: consulta skills documentadas e `@software-engineer`.

- `@ux-ui-designer` (`mode: subagent`) — design de componentes e telas,
  posicionamento, acessibilidade e usabilidade. Invocar com `@ux-ui-designer`.

- `@software-engineer` (`mode: primary`) — dono do BFF (`apps/server/src/bff/`).
  GraphQL, Pothos, queries, mutations, subscriptions.
  Só delivery mechanism — sem regra de negócio.
  - Consulta `@backend-engineer` para melhorar arquitetura e lógica do BFF.

- `@backend-engineer` (`mode: primary`) — dono do backend (`apps/server/src/backend/`).
  Clean Architecture + DDD: domínio, use cases, ports, infra, controllers.
  Regra de negócio, sem GraphQL.
  - Consulta `@software-engineer` para melhorar arquitetura e lógica do backend.

## Skills (carregar sob demanda)

- `.opencode/skills/design-rules/SKILL.md` — SOLID, SOC, DRY, YAGNI, KISS, Clean Code
- `.opencode/skills/architecture-frontend/SKILL.md` — arquitetura frontend
- `.opencode/skills/architecture-backend/SKILL.md` — arquitetura backend
- `.opencode/skills/architecture-bff/SKILL.md` — arquitetura BFF

## Regras de código

As code conventions estão documentadas na skill de arquitetura frontend:
`.opencode/skills/architecture-frontend/SKILL.md` — useState, tipagem, tailwind-variants, return early, convenções de componentes e providers.
