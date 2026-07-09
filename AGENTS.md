<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# real-time-kanban

## Agentes

- `@front-end-engineer` (`mode: primary`) — dono do frontend (`apps/client/`).
  React, Next, Tailwind, componentes, performance.
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

## Regras de código (sempre em contexto)

Leia `.opencode/rules/code-conventions.md` — useState, tipagem, tailwind-variants, return early
