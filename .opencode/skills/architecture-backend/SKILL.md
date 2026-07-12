---
name: architecture-backend
description: Clean Architecture + DDD + SOLID — domínio puro, use cases, ports e infraestrutura
---

## Clean Architecture + Hexagonal (Ports & Adapters)

### Camadas (da mais interna para a externa)

```
domain/entities/      → Entidades ricas com comportamento de negócio
domain/value-objects/ → Objetos de valor (sem identidade, comparados por valor)
domain/repositories/  → Interfaces (ports) dos repositórios
dto/                  → Data Transfer Objects para entrada/saída de dados
use-cases/            → Casos de uso (um por operação)
infra/                → Implementações concretas (Drizzle, Redis, etc.)
controllers/          → Orquestração entre delivery mechanism e use cases
```

### Regras de dependência

- **Domínio** não depende de nada externo (zero imports de framework, banco, GraphQL)
- **Ports** são interfaces definidas no domínio (ou junto dele)
- **Infra** implementa ports — depende do domínio, não o contrário
- **Controllers** orquestram use cases e traduzem entrada/saída
- As setas de dependência apontam sempre **para dentro** (em direção ao domínio)

### DTOs vs Entidades

- Entidades de domínio nunca vazem para fora da camada de domínio
- Use cases retornam/recebem tipos próprios (ou DTOs simples)
- Controllers convertem entre DTOs de entrada/saída e tipos do use case
- Infra converte entre entidades de domínio e linhas do banco (row → entity)

### Tratamento de erros

- Erros de domínio: classes específicas (ex: `BoardNotFoundError`, `InvalidMoveError`)
- Use cases: retornam Result type ou lançam erros de domínio
- Controllers: capturam erros de domínio e traduzem para o formato do delivery (GraphQL errors, HTTP codes, etc.)

### DDD Tático

| Conceito       | Exemplo no projeto                                              |
| -------------- | --------------------------------------------------------------- |
| Aggregate Root | `Board` (contém `Column[]` e `Card[]`)                          |
| Entity         | `Action`, `Task` (têm identidade)                               |
| Value Object   | `ActionId` (UUID com validação e igualdade por valor)           |
| Domain Event   | `CardMoved`, `BoardUpdated`                                     |
| Repository     | `IActionRepository` (port), `DrizzleActionRepository` (adapter) |

---

## Estrutura atual do backend

```
apps/server/src/backend/
├── instance.ts                          # Bootstrap: importa DI container, loga status
│
├── shared/                              # Infraestrutura compartilhada
│   ├── container/                       # Dependency Injection (Inversify)
│   │   ├── index.ts                     # Barrel: importa todos os módulos DI, re-exporta container
│   │   └── di/
│   │       ├── types.ts                 # Tokens Symbol para bindings de interface
│   │       ├── base.di.ts               # Container + bindings de infra (Database, Repositories)
│   │       └── action.di.ts             # Bindings do módulo action (use cases + controller)
│   │
│   └── infra/
│       └── database/
│           └── drizzle/
│               ├── drizzle.schema.ts    # Schemas Drizzle (actions, tasks)
│               └── drizzle.database.ts  # Cliente Drizzle (drizzleDB)
│
└── modules/                             # Módulos por bounded context
    ├── action/                          # ✅ Implementado
    │   ├── domain/
    │   │   ├── entities/action.ts       # Entidade Action + enum Step
    │   │   ├── value-objects/action-id.ts  # ActionId (UUID validation)
    │   │   └── repositories/action-repository.interface.ts  # Port
    │   ├── dto/
    │   │   ├── create.dto.ts            # CreateActionDTO { title, step }
    │   │   └── update.dto.ts            # UpdateActionDTO { id, title?, step? }
    │   ├── use-cases/
    │   │   ├── create-action.use-case.ts
    │   │   ├── find-action-by-id.use-case.ts
    │   │   ├── list-actions.use-case.ts
    │   │   ├── update-action.use-case.ts
    │   │   └── delete-action.use-case.ts
    │   ├── infra/
    │   │   └── action-repository.drizzle.ts  # Adapter (Drizzle)
    │   └── controllers/
    │       └── action.controller.ts     # Orquestra use cases
    │
    ├── task/                            # 🔨 Scaffolded (pastas vazias)
    │   ├── domain/{entities,repositories,value-objects}/
    │   ├── infra/
    │   └── use-cases/
    │
    └── statistics/                      # 🔨 Scaffolded (pasta vazia)
        └── use-cases/
```

---

## Módulo de referência: action

O módulo `action` é a implementação completa e serve de referência para novos módulos.

### Domain

- **Entidade** `Action`: `id` (ActionId), `title` (string), `step` (Step enum)
- **Value Object** `ActionId`: wrapper de UUID com validação via regex e método `equals()`
- **Port** `IActionRepository`: interface com `create`, `findAll`, `findById`, `findByName`, `update`, `delete`

### DTOs

- `CreateActionDTO`: `{ title: string; step: Step }`
- `UpdateActionDTO`: `{ id: string; title?: string; step?: Step }`

### Use Cases (um por arquivo, single responsibility)

| Use Case                | Responsabilidade                            |
| ----------------------- | ------------------------------------------- |
| `CreateActionUseCase`   | Cria entidade, persiste, retorna            |
| `FindActionByIdUseCase` | Busca por ID (lança erro se não encontrar)  |
| `ListActionsUseCase`    | Lista todas as actions                      |
| `UpdateActionUseCase`   | Busca, aplica updates parciais, persiste    |
| `DeleteActionUseCase`   | Busca (lança erro se não encontrar), deleta |

### Infra

`DrizzleActionRepository` implements `IActionRepository`:

- Recebe `NodePgDatabase` via construtor
- Converte rows do banco → entidades de domínio (hidrata `ActionId`)

### Controllers

`ActionController` injeta todos os 5 use cases via `@inject()`:

- `create(dto: CreateActionDTO)`
- `findAll()`
- `findById(actionId: string)`
- `update(dto: UpdateActionDTO)`
- `delete(actionId: string)`

---

## DI Container (Inversify)

### Configuração

1. `types.ts` — Define tokens `Symbol.for(...)` para interfaces (`TYPES.Repositories.Action`)
2. `base.di.ts` — Cria container, bind de infraestrutura (Database, Repositories)
3. `action.di.ts` — Bind de use cases e controllers do módulo action
4. `index.ts` — Barrel que importa todos os arquivos DI e re-exporta o container

### Regras

- Repositórios: bind por **token Symbol** (interface → implementação via `toDynamicValue`)
- Use cases e controllers: bind por **classe** (`toSelf().inSingletonScope()`)
- Todos os bindings são **singletons**

### Fluxo de bootstrap

```
instance.ts
  → import 'reflect-metadata'       # Necessário para decorators do Inversify
  → import '@/backend/shared/container'  # Registra todos os bindings
  → initInstance()                   # Log de status
```

---

## Database (Drizzle ORM)

### Schema

```typescript
actions:
  id       UUID (PK, defaultRandom)
  title    TEXT (notNull)
  step     TEXT (notNull)

tasks:
  id          UUID (PK, defaultRandom)
  title       TEXT (notNull)
  description TEXT (nullable)
  actionId    UUID (FK → actions.id, cascade delete)
  createdAt   TIMESTAMP (defaultNow)
  updatedAt   TIMESTAMP (defaultNow)
```

### Cliente

- `drizzle.database.ts` exporta `drizzleDB` (cliente Drizzle com schema)
- Configurado via `DATABASE_URL` do environment

---

## Fluxo de dependência

```
BFF (GraphQL resolvers)
    │
    ▼
Controllers  ← inject use-cases
    │
    ▼
Use-Cases   ← inject repository interface (port)
    │
    ▼
Infra       ← implements port, usa Drizzle DB
    │
    ▼
Database    (PostgreSQL via Drizzle ORM)
```

---

## Convenções para novos módulos

1. Criar estrutura de pastas seguindo o módulo `action` como referência
2. Domain não importa de framework externo
3. Um use case por arquivo, uma operação por use case
4. DTOs para entrada do controller (entidades nunca vazem)
5. Infra implementa a port (repository interface)
6. Bind no container DI (types.ts + module di.ts)
7. Registrar import no `container/index.ts`
