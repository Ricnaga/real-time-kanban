---
name: architecture-frontend
description: Arquitetura frontend — componentes, estado, camadas e estrutura do projeto
---

## Stack

- **React 19** — Server Components por default, `'use client'` explícito quando necessário
- **Next.js 16** — App Router, Turbopack
- **Tailwind CSS v4** — Utility-first com `tailwind-variants` para estilos
- **URQL** — GraphQL client com `@urql/exchange-graphcache` para cache normalizada
- **Radix UI** — Primitivas de acessibilidade (`radix-ui` umbrella package)
- **@dnd-kit** — Drag and drop (core + sortable + utilities)
- **TypeScript** — Tipagem forte, sem `any`

## Estrutura de diretórios

```
src/
  app/              # App Router (pages, layouts, loading, error)
    <route>/
      page.tsx            # Server component (page)
      loading.tsx         # Loading state
      error.tsx           # Error boundary
      _components/        # Componentes da page (client components)
        <component>/
          <component>.tsx     # Componente
          <component>.tv.ts   # Estilos (tailwind-variants)
          <sub-component>/
            <sub-component>.tsx
            <sub-component>.tv.ts
      _providers/         # Contextos da page (se necessário)
        <context>.tsx
  components/       # Componentes reutilizáveis (globais)
    typography/     # Componentes tipográficos (Heading, Text, Label)
    skeleton/       # Componente de carregamento visual
    topbar/         # Barra de navegação
  config/           # Environment variables (Zod validation)
  schemas/          # Schemas Zod + tipos derivados das entidades
  services/         # GraphQL ops, hooks, cliente urql
  providers/        # Contextos globais (se necessário)
```

## Camadas

| Camada     | Responsabilidade                 | Onde          |
| ---------- | -------------------------------- | ------------- |
| **Rotas**  | Pages, layouts, loading, error   | `app/`        |
| **UI**     | Componentes React reutilizáveis  | `components/` |
| **Data**   | GraphQL ops, hooks, cliente urql | `services/`   |
| **Models** | Schemas Zod, tipos derivados     | `schemas/`    |
| **Config** | Environment variables, validação | `config/`     |

## Convenções de componentes

### Estrutura por componente

Cada componente e seus sub-componentes ficam em pastas próprias:

```
card-task/
  card-task.tsx              # Componente principal
  card-task.tv.ts            # Estilos do componente principal
  card-task-actions/         # Sub-componente em pasta própria
    card-task-actions.tsx
    card-task-actions.tv.ts
  dialog-edit-task/
    dialog-edit-task.tsx
    dialog-edit-task.tv.ts
  dialog-delete-task/
    dialog-delete-task.tsx
    dialog-delete-task.tv.ts
```

### Regras

- Cada componente tem sua pasta: `<componente>/<componente>.tsx` + `<componente>/<componente>.tv.ts`
- Sub-componentes seguem o mesmo padrão em pastas próprias dentro do componente pai
- Prefira `type` sobre `interface` para props
- Props são tipadas com tipo nomeado antes do componente
- `useState` com no máximo 3 estados; 3+ estados são agrupados em objeto tipado
- Return early para evitar else/switch aninhado
- Usar `useCallback`/`useMemo` apenas quando há benefício mensurável (evitar premature optimization)

### Providers (contextos)

- **Contextos de page/componente**: ficam em `_providers/` dentro da page ou componente pai
- **Contextos globais**: ficam em `providers/` dentro de `src/`
- Contextos usam `createContext` + custom hook para acesso
- Valores do contexto devem ser memoizados com `useMemo` para evitar re-renders desnecessários

## Schemas layer

```
schemas/
  action.schema.ts    → actionModelSchema + ActionModel
  task.schema.ts      → taskModelSchema + TaskModel
  index.ts            → barrel export
```

### Regras

- Cada entidade tem um arquivo `<entity>.schema.ts`
- Schema Zod é a fonte da verdade (`actionModelSchema`, `taskModelSchema`)
- Types são derivados via `z.infer<typeof schema>` (`ActionModel`, `TaskModel`)
- Schemas podem ser usados em components para validação runtime
- Input schemas para mutations podem ser derivados dos models (ex: `actionModelSchema.partial()`)

## Services layer

```
services/
  graphql/
    queries.ts        # Documents das queries (gql)
    mutations.ts      # Documents das mutations (gql)
    subscriptions.ts  # Documents das subscriptions (gql)
  hooks/
    use-<module>.ts   # Hooks que combinam useQuery + lógica
  urql-client.ts      # Cliente urql (graphcache + subscriptionExchange)
  urql-provider.tsx   # Provider React para o cliente urql
```

### Regras

- Operações GraphQL ficam em `services/graphql/` — um arquivo por tipo de operação
- Hooks combinam `useQuery` + lógica em um único hook por entidade
- O cliente urql usa `@urql/exchange-graphcache` para cache normalizada
- Subscriptions atualizam a cache via `updates.Subscription` no `cacheExchange` (não via `useSubscription` com handler)

## Config layer

```
config/
  environment.ts    → loadEnvironment() com Zod schema
  index.ts          → barrel export
```

### Regras

- Environment variables são validadas via Zod no build/runtime
- Singleton pattern — `loadEnvironment()` retorna a mesma instância
- Variables `NEXT_PUBLIC_*` ficam expostas ao client

## Code Conventions

### useState

- No máximo 3 estados por componente.
- Se 3 ou mais estados forem usados conjuntamente, agrupe-os em um único objeto tipado.

### Tipagem

- Todo estado, prop, e retorno de função deve ser fortemente tipado com TypeScript.
- Use `type` explicitamente — nunca `any`.
- Types das entidades vêm de `z.infer` nos schemas, não de `type` manual.

### Tailwind Variants

- Estilos com Tailwind devem ficar em arquivos separados no padrão `<nome-do-componente>.tv.ts`.
- Use a biblioteca `tailwind-variants` para definir variantes e composições.
- O arquivo `.tv.ts` fica na mesma pasta do componente.

### Return Early

- Prefira return early a else.
- Evite aninhamento profundo de if/else.

### React 19

- Server Components são o default em `app/`.
- Use `'use client'` apenas quando o componente precisa de interatividade (events, hooks, browser APIs).
- Prefira composição de Server Components sobre Client Components.
- `use()` pode ser usado para ler promises diretamente em Server Components.
- Form handling com `<form action={}>` para Server Actions quando aplicável.
