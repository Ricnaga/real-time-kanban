# Real-time Kanban

Kanban em tempo real com Next.js 16, GraphQL, WebSocket (subscriptions) e gráficos.

## Stack

| Camada         | Tecnologia                                      |
| -------------- | ----------------------------------------------- |
| **Frontend**   | Next.js 16 (App Router), React 19, TypeScript   |
| **Estilos**    | Tailwind CSS v4, `tailwind-variants` (`.tv.ts`) |
| **Gráficos**   | recharts                                        |
| **API**        | GraphQL (urql / Apollo)                         |
| **Tempo real** | graphql-ws (subscriptions)                      |
| **Backend**    | SOLID + Clean Architecture                      |
| **Padrões**    | SOLID, SOC, DRY, YAGNI, KISS, Clean Code        |

## Estrutura

```
src/
├── app/          # App Router (layouts, páginas, loading, error)
├── components/   # Componentes de UI e negócio
│   └── ui/       # Componentes base (shadcn/ui)
├── lib/          # Utilitários, hooks, lógica
└── styles/       # Arquivos .tv.ts (tailwind-variants)
```

## Pré-requisitos

- Node.js 20+
- pnpm

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando             | Descrição                            |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Inicia servidor de desenvolvimento   |
| `pnpm build`        | Build de produção                    |
| `pnpm start`        | Inicia servidor de produção          |
| `pnpm lint`         | Verifica código com Oxlint           |
| `pnpm lint:fix`     | Corrige erros automáticos com Oxlint |
| `pnpm format`       | Formata código com Prettier          |
| `pnpm format:check` | Verifica formatação                  |

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

# real-time-kanban
