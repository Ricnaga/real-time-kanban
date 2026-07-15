---
name: architecture-bff
description: BFF (Backend for Frontend) — camada GraphQL entre frontend e backend
---

## BFF — Backend for Frontend

### Papel no sistema

O BFF é a camada de entrega (delivery mechanism) do backend. Ele:

- Expõe uma API GraphQL desenhada **para as necessidades do frontend**
- Traduz chamadas GraphQL em chamadas para controllers/use cases
- Gerencia subscriptions em tempo real (via PubSub) — **não implementado ainda**
- Implementa autenticação e autorização (contexto)

### Estrutura

```
bff/
  graphql.ts              # Yoga (GraphQL server) factory entry point
  context.ts              # GraphQL context (injects adapters into resolvers)

  pothos/                 # Schema definition — tudo que é Pothos vive aqui
    builder.ts            # Pothos SchemaBuilder instance + query/mutation types
    schema.ts             # Assembles the final GraphQL schema (side-effect imports)
    resolvers/            # GraphQL operation definitions (queries, mutations)
      index.ts            # Barrel: imports all resolver modules
      <module>/
        <module>.types.ts   # Pothos object type (objectRef + expose*)
        <module>.queries.ts # Query fields
        <module>.mutations.ts # Mutation fields
        index.ts            # Barrel: imports types, queries, mutations (order matters)

  domain/                 # BFF-level domain objects (not backend domain)
    base.domain.ts        # Relay global ID helpers (BaseDomain)
    <module>/
      <module>.domain.ts  # Domain class (maps connector models → domain)
      index.ts            # Barrel export

  adapters/               # Port/Adapter pattern: interface (port) + implementation
    index.ts              # Creates all adapter instances via factories
    <module>/
      <module>-port.ts    # Interface (port) for the module
      <module>.adapter.ts # Adapter: wraps connector, returns domain objects
      index.ts            # Barrel export

  connectors/             # Direct communication bridge to the backend
    index.ts              # Barrel: re-exports all connectors
    <module>/
      <module>.connector.ts # Calls backend controller via DI container
      <module>.model.ts     # Plain DTO type (entity unwrapped to primitives)
      index.ts              # Barrel export

  factories/              # Factory functions for creating adapters
    index.ts              # Barrel: re-exports all factories
    <module>/
      <module>.factory.ts # Creates connector + wraps it with adapter
      index.ts            # Barrel export

  plugins/                # GraphQL Yoga plugins
    index.ts              # Prometheus + GraphQL Hive plugins
    use-error-handling.ts # Error masking (AppError → GraphQLError)
```

### Regras

1. **Resolvers são finos** — delegam tudo ao adapter via `ctx.adapters.<module>`, sem lógica de negócio
2. **Tipos GraphQL espelham modelos do connector** — mapeados via Domain class (com Relay global IDs)
3. **Mutações** chamam use cases via connector/adapter e retornam o resultado
4. **Subscriptions** escutam eventos publicados pelos use cases e reemitem para o cliente — **não implementado ainda**
5. **Contexto** carrega instâncias dos adapters (um por módulo)

### Data Flow

```
Client GraphQL request
  → Fastify routes to graphql-yoga
    → Resolver: ctx.adapters.<module>.<method>()
      → IModulePort (adapter interface)
        → ModuleAdapter (implementation) calls ModuleConnector
          → ModuleConnector calls BackendController via Inversify DI
            → BaseController.execute() delegates to UseCase
              → UseCase reads/writes via Repository → Drizzle → PostgreSQL
            ← Returns domain entities (unwrapped to primitives)
          ← Connector maps to ModuleModel (plain DTO)
        ← Adapter maps to ModuleDomain (BFF domain with Relay IDs)
      ← Resolver returns ModuleDomain (Pothos exposes fields)
    ← GraphQL JSON response to client
```

### Camadas do BFF (por módulo)

| Camada        | Arquivo                                           | Responsabilidade                             |
| ------------- | ------------------------------------------------- | -------------------------------------------- |
| **Resolver**  | `pothos/resolvers/<module>/<module>.queries.ts`   | Define query fields (Pothos)                 |
| **Resolver**  | `pothos/resolvers/<module>/<module>.mutations.ts` | Define mutation fields (Pothos)              |
| **Type**      | `pothos/resolvers/<module>/<module>.types.ts`     | Pothos object type (`objectRef` + `expose*`) |
| **Domain**    | `domain/<module>/<module>.domain.ts`              | Relay global IDs (`BaseDomain`)              |
| **Port**      | `adapters/<module>/<module>-port.ts`              | Interface `I<Module>Port`                    |
| **Adapter**   | `adapters/<module>/<module>.adapter.ts`           | Connector → Domain mapping                   |
| **Connector** | `connectors/<module>/<module>.connector.ts`       | Chama `BackendController` via DI             |
| **Model**     | `connectors/<module>/<module>.model.ts`           | DTO type (primitivos)                        |
| **Factory**   | `factories/<module>/<module>.factory.ts`          | Cria connector + adapter                     |

### Exemplo de fluxo (createAction)

```
Mutation createAction(title: "Meu Board", step: "BACKLOG")
  → Pothos resolver (pothos/resolvers/action/action.mutations.ts)
    → ctx.adapters.action.create({ title, step })
      → actionAdapter (adapters/action/action.adapter.ts)
        → ActionConnector.create({ title, step })
          → ActionController.create({ title, step })  [Inversify DI]
            → CreateActionUseCase.execute(dto)
              → ActionRepository.create(entity)
            ← Action entity (unwrapped)
          ← ActionModel { id, title, step, position }
        ← ActionDomain { id: relayId, title, step, position }
      ← ActionDomain
    ← Pothos exposes fields
  ← GraphQL response
```

### Relay Global IDs

O BFF usa **Relay global IDs** para identificadores. A classe `BaseDomain` fornece helpers:

```typescript
// base.domain.ts
class BaseDomain {
  static uuidToRelay(id: string): string {
    return toGlobalId(this.__typename, id); // Base64 encode
  }
  static relayToUuid(id: string): string {
    return fromGlobalId(id).id; // Base64 decode
  }
}
```

- **Domain classes** (`ActionDomain`, etc.) herdam `BaseDomain`
- **Resolvers** usam `t.exposeID('id')` que retorna o Relay ID
- **Connectors** recebem UUIDs do backend e convertem para `ActionModel`
- **Domains** convertem UUID → Relay ID no construtor

### Tratamento de erros

O BFF herda o tratamento de erros do backend (`AppError` → `GraphQLError`). Veja `architecture-backend/SKILL.md` para detalhes sobre `AppError` e `BaseController`.

O plugin `use-error-handling.ts` mascara erros do backend para o cliente GraphQL.

### Plugins

- **Prometheus**: métricas GraphQL em `/metrics`
- **GraphQL Hive**: analytics de schema (condicional via `HIVE_TOKEN`)

### Exemplo de módulo completo (action)

```
bff/
  pothos/resolvers/action/
    action.types.ts          # builder.objectRef<ActionDomain>('Action')
    action.queries.ts        # actions query
    action.mutations.ts      # createAction, moveAction mutations
    index.ts                 # barrel (types → queries → mutations)
  domain/action/
    action.domain.ts         # ActionDomain extends BaseDomain
    index.ts
  adapters/action/
    action-port.ts           # IActionPort interface
    action.adapter.ts        # actionAdapter(connector) → IActionPort
    index.ts
  connectors/action/
    action.connector.ts      # ActionConnector (calls ActionController)
    action.model.ts          # ActionModel type
    index.ts
  factories/action/
    action.factory.ts        # createActionAdapter()
    index.ts
```

### Convenções para novos módulos

1. Criar estrutura de pastas seguindo o módulo `action` como referência
2. **Um arquivo por operação** (query, mutation, type)
3. **Barrel imports** em ordem: types → queries → mutations (no `pothos/resolvers/<module>/index.ts`)
4. Resolvers delegam para `ctx.adapters.<module>` — nunca para o controller diretamente
5. Connectors são a **única camada** que toca o backend (via Inversify DI)
6. Adapters mapeiam Model → Domain (com Relay IDs)
7. Atualizar `context.ts` para incluir novo adapter
8. Atualizar `adapters/index.ts` para criar novo adapter via factory
9. Atualizar `connectors/index.ts` para exportar novo connector
10. Atualizar `factories/index.ts` para exportar nova factory
11. Atualizar `pothos/resolvers/index.ts` para importar novo módulo

### Exemplo de fluxo (moveAction)

```
Mutation moveAction(actionId: "base64id", newPosition: 2)
  → Pothos resolver (pothos/resolvers/action/action.mutations.ts)
    → ctx.adapters.action.move(actionId, newPosition)
      → actionAdapter.move()
        → ActionConnector.move()
          → ActionController.move(uuid, 2)
            → MoveActionUseCase.execute()
              → Clamp position, remove from list, splice, batch update
            ← Action[] (reordered)
          ← ActionModel[]
        ← ActionDomain[]
      ← ActionDomain[]
    ← Pothos exposes [Action]
  ← GraphQL response (all actions reordered)
```

### Considerações

- Publique apenas campos que o frontend realmente consome
- Subscriptions devem ser granulares (eventos específicos, não "tudo mudou")
- Mantenha compatibilidade retroativa no schema ou versione queries
- Connectors mapeiam entidades de domínio → modelos planos (primitivos)
- Adapters mapeiam modelos → domains (com Relay IDs)
- O BFF e backend compartilham o mesmo processo Node.js (chamadas diretas via DI)
- `pothos/` é a única camada acoplada à lib de schema — se trocar Pothos por outra lib (Nexus, TypeGraphQL, SDL-first), substitua só essa pasta; connectors, adapters, domain, factories e plugins permanecem intactos
