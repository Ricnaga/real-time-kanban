---
name: architecture-frontend
description: Arquitetura frontend — componentes, estado, camadas e estrutura do projeto
---

## Estrutura de diretórios

```
src/
  app/              # App Router (pages, layouts, loading, error)
  components/       # Componentes reutilizáveis
  config/           # Environment variables (Zod validation)
  schemas/          # Schemas Zod + tipos derivados das entidades
  services/         # GraphQL ops, hooks, cliente urql
```

## Camadas

| Camada     | Responsabilidade                 | Onde          |
| ---------- | -------------------------------- | ------------- |
| **Rotas**  | Pages, layouts, loading, error   | `app/`        |
| **UI**     | Componentes React reutilizáveis  | `components/` |
| **Data**   | GraphQL ops, hooks, cliente urql | `services/`   |
| **Models** | Schemas Zod, tipos derivados     | `schemas/`    |
| **Config** | Environment variables, validação | `config/`     |

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
    use-<module>.ts   # Hooks que combinam useQuery + useSubscription
  urql-client.ts      # Cliente urql (graphcache + subscriptionExchange)
  urql-provider.tsx   # Provider React para o cliente urql
```

### Regras

- Operações GraphQL ficam em `services/graphql/` — um arquivo por tipo de operação
- Hooks combinam `useQuery` + `useSubscription` em um único hook por entidade
- O cliente urql usa `@urql/exchange-graphcache` para cache normalizada
- Subscriptions atualizam a cache via handler function no `useSubscription`

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

## Arquitetura de componentes

- Componentes de página em `app/` (server components por default)
- Componentes de UI em `components/` (client components quando necessário)
- Estilos via `tailwind-variants` em arquivos `.tv.ts`
- Componentes seguem o padrão: `component.tsx` + `component.tv.ts`

## Gerenciamento de estado

- Estado local com `useState` (agrupado em objeto quando 3+)
- Estado de servidor com fetch/server actions
- Estado global via urql (cache normalizada, sem React context custom)
- Evite contexto global desnecessário

## Code Conventions

### useState

- No máximo 3 estados por componente.
- Se 3 ou mais estados forem usados conjuntamente, agrupe-os em um único objeto tipado.

### Tipagem

- Todo estado, prop, e retorno de função deve ser fortemente tipado com TypeScript.
- Use `type` ou `interface` explicitamente — nunca `any`.
- Types das entidades vêm de `z.infer` nos schemas, não de `type` manual.

### Tailwind Variants

- Estilos com Tailwind devem ficar em arquivos separados no padrão `<nome-do-componente-ou-page>.tv.ts`.
- Use a biblioteca `tailwind-variants` para definir variantes e composições.

### Return Early

- Prefira return early a else.
- Evite aninhamento profundo de if/else.
