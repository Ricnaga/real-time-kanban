---
name: architecture-backend
description: Clean Architecture + DDD + SOLID — domínio puro, use cases, ports e infraestrutura
---

## Clean Architecture + Hexagonal (Ports & Adapters)

### Camadas (da mais interna para a externa)

```
entities/           → Objetos de dados com validação via VOs (sem regra de negócio)
value-objects/      → Validam e retornam primitivos (string, number, etc.)
repositories/       → Interfaces (ports) dos repositórios
dto/                → Data Transfer Objects para entrada/saída de dados
use-cases/          → Regras de negócio (um por operação)
infra/              → Implementações concretas (Drizzle, Redis, etc.)
controllers/        → Orquestração entre delivery mechanism e use cases
```

### Regras de dependência

- **Domínio** não depende de nada externo (zero imports de framework, banco, GraphQL)
- **Ports** são interfaces definidas no domínio (ou junto dele)
- **Infra** implementa ports — depende do domínio, não o contrário
- **Controllers** orquestram use cases e traduzem entrada/saída
- As setas de dependência apontam sempre **para dentro** (em direção ao domínio)

### Entity vs Value Object vs Use Case

| Componente       | Responsabilidade                                                          | Exemplo                                               |
| ---------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Entity**       | Instanciar objeto, validar dados via VOs no constructor, expor primitivos | `new Task({ title: "Foo" })` — valida via `TaskTitle` |
| **Value Object** | Validar um dado específico, retornar primitivo                            | `new TaskTitle("Foo").value` → `"Foo"`                |
| **Use Case**     | Regras de negócio, usar `AppError` para erros                             | `if (!task) throw new AppError(404, ...)`             |

### Entity (padrão)

```typescript
export class Task {
  public readonly id: string; // nunca muda
  public title: string; // mutável (update)
  public description: string | null; // mutável (update)
  public position: number; // mutável (move)
  public actionId: string; // mutável (move)
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(data: ITaskCreate) {
    this.id = new TaskId(data.id).value; // VO valida → retorna string
    this.title = new TaskTitle(data.title).value; // VO valida → retorna string
    this.description = new TaskDescription(data.description).value;
    this.position = data.position;
    this.actionId = data.actionId;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}
```

### Value Object (padrão)

```typescript
export class TaskTitle {
  public static readonly MAX_LENGTH = 150;
  public readonly value: string; // ← retorna primitivo

  constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0)
      throw new AppError(400, 'Título não pode ser vazio');
    if (trimmed.length > TaskTitle.MAX_LENGTH) throw new AppError(400, '...');
    this.value = trimmed;
  }
}
```

### Use Case (padrão)

```typescript
export class CreateTaskUseCase {
  async execute(data: CreateTaskDTO) {
    // Entity valida dados via VOs
    const task = new Task({ title: data.title, ... });

    // Use case valida regras de negócio
    const existing = await this.taskRepo.findByTitle(data.title);
    if (existing) throw new AppError(409, 'Task já existe');

    await this.taskRepo.create(task);
    return task;
  }
}
```

### DTOs vs Entidades

- Entidades de domínio nunca vazem para fora da camada de domínio
- Use cases retornam/recebem tipos próprios (ou DTOs simples)
- Controllers convertem entre DTOs de entrada/saída e tipos do use case
- Infra converte entre entidades de domínio e linhas do banco (row → entity)

### Tratamento de erros

- **AppError** — classe base para erros com `statusCode` e `message`, garantindo shape uniforme
- **BaseController** — wrapper `execute()` que captura erros: `AppError` é re-lançado, erros desconhecidos viram 500
- Use cases: lançam `AppError` com código e mensagem apropriados
- Controllers: delegam tudo via `execute()`, sem try/catch manual

### DDD Tático

| Conceito     | Exemplo no projeto                                              |
| ------------ | --------------------------------------------------------------- |
| Entity       | `Action` (tem identidade via `ActionId`)                        |
| Value Object | `ActionId` (herda de `Uuid`), `ActionTitle`, `StepValue`        |
| Repository   | `IActionRepository` (port), `DrizzleActionRepository` (adapter) |

### Value Objects

| Tipo            | Local                           | Herança                           |
| --------------- | ------------------------------- | --------------------------------- |
| **Genéricos**   | `shared/value-objects/`         | Base para todos os módulos        |
| **Específicos** | `modules/<name>/value-objects/` | Herdam de shared quando aplicável |

**Regra:** Se o VO será usado em 3+ módulos, crie em `shared/`. Exemplo: `Uuid` → `ActionId`, `TaskId`, `BoardId`.

### Checklist ao criar Value Object

1. **Verificar `shared/value-objects/`** — existe algo que possa servir de base?
2. **Se sim** — herde de shared (ex: `ActionId extends Uuid`)
3. **Se não** — crie VO específico no módulo
4. **Se será reutilizável** — considere mover para `shared/` para uso futuro

---

## Shared layer

Infraestrutura compartilhada por todos os módulos. **Registra lógica reutilizável** que se repete 3+ vezes ou será usada em todos os módulos.

### Regra de Extração para Shared

> **Se uma lógica se repete pelo menos 3 vezes ou será usada em todos os módulos, extraia para `shared/`.**

| Critério                     | Exemplo                                               |
| ---------------------------- | ----------------------------------------------------- |
| Lógica repetida 3+ vezes     | Validação de UUID → `Uuid` em `shared/value-objects/` |
| Usado em todos os módulos    | `BaseController`, `AppError`                          |
| Infraestrutura compartilhada | Database, DI Container, Schemas Drizzle               |
| Value Objects genéricos      | `Uuid` (base para `ActionId`, `TaskId`, etc.)         |

### Estrutura

```
shared/
├── container/                        # Dependency Injection (Inversify)
│   ├── index.ts                      # Barrel: importa todos os módulos DI, re-exporta container
│   └── di/
│       ├── types.ts                  # Tokens Symbol para bindings de interface
│       ├── base.di.ts                # Container + bindings de infra (Database, Repositories)
│       └── action.di.ts             # Bindings do módulo action (use cases + controller)
│
├── controllers/
│   ├── base.controller.ts            # Classe abstrata com execute() wrapper para try/catch
│   └── index.ts                      # Barrel export
│
├── errors/
│   ├── app-error.ts                  # AppError: Error com statusCode
│   └── index.ts                      # Barrel export
│
├── value-objects/                    # Value Objects reutilizáveis
│   ├── uuid.ts                       # Uuid: classe base para IDs (validação, auto-gera)
│   └── index.ts                      # Barrel export
│
└── infra/
    └── database/
        └── drizzle/
            ├── drizzle.schema.ts     # Schemas Drizzle (actions, tasks)
            ├── drizzle.database.ts   # Cliente Drizzle (drizzleDB)
            └── seed/
                ├── action.seed.ts    # Seeds do módulo action
                └── index.ts          # Runner de seeds (executa todos)
```

### Value Objects Shared

#### Uuid

Classe base para identificadores. **Todos os IDs de entidades devem herdar de `Uuid`**.

```typescript
// shared/value-objects/uuid.ts
import { v4 as uuid } from 'uuid';
import { AppError } from '@/backend/shared/errors';

export class Uuid {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  public readonly value: string;

  constructor(value?: string) {
    if (!value) {
      this.value = uuid();
      return;
    }

    if (!Uuid.UUID_REGEX.test(value)) {
      throw new AppError(400, 'UUID inválido');
    }

    this.value = value;
  }

  equals(other: Uuid): boolean {
    return this.value === other.value;
  }
}
```

**Uso nos módulos:**

```typescript
// modules/action/value-objects/action-id.ts
import { Uuid } from '@/backend/shared/value-objects/uuid';

export class ActionId extends Uuid {
  constructor(value?: string) {
    super(value);
  }
}

// modules/task/value-objects/task-id.ts
import { Uuid } from '@/backend/shared/value-objects/uuid';

export class TaskId extends Uuid {
  constructor(value?: string) {
    super(value);
  }
}
```

### BaseController

Classe abstrata que padroniza o tratamento de erros em todos os controllers:

```typescript
abstract class BaseController {
  protected async execute<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Internal server error');
    }
  }
}
```

- `AppError` é re-lançado intacto (código e mensagem preservados)
- Erros desconhecidos viram `AppError(500, 'Internal server error')`
- Controllers nunca escrevem try/catch — apenas delegam via `this.execute(() => ...)`

### AppError

```typescript
class AppError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string);
}
```

Shape uniforme para todos os erros do backend. Usado por controllers, use cases e infra.

### Seeds

Scripts para popular o banco com dados padrão. Úteis para desenvolvimento local e testes.

- `action.seed.ts` — insere 5 actions nos 5 steps do kanban (BACKLOG, IN_PROGRESS, REVIEW, DEPLOY, DONE)
- `seed/index.ts` — runner standalone que conecta ao banco e executa todos os seeds
- Os steps são string livre — o seed mostra colunas padrão, mas o usuário pode adicionar/modificar qualquer coluna

---

## Estrutura atual do backend

```
apps/server/src/backend/
├── instance.ts                          # Health check: valida Database, Redis, Prometheus, Grafana
│
├── shared/                              # Infraestrutura compartilhada
│   ├── container/                       # Dependency Injection (Inversify)
│   │   ├── index.ts                     # Barrel: importa todos os módulos DI, re-exporta container
│   │   └── di/
│   │       ├── types.ts                 # Tokens Symbol para bindings de interface
│   │       ├── base.di.ts              # Container + bindings de infra (Database, Repositories)
│   │       └── action.di.ts            # Bindings do módulo action (use cases + controller)
│   │
│   ├── controllers/
│   │   ├── base.controller.ts           # Classe abstrata execute() wrapper
│   │   └── index.ts
│   │
│   ├── errors/
│   │   ├── app-error.ts                 # AppError (statusCode + message)
│   │   └── index.ts
│   │
│   ├── value-objects/                   # Value Objects reutilizáveis
│   │   ├── uuid.ts                      # Uuid: classe base para IDs (validação, auto-gera)
│   │   └── index.ts                     # Barrel export
│   │
│   └── infra/
│       └── database/
│           └── drizzle/
│               ├── drizzle.schema.ts    # Schemas Drizzle (actions, tasks)
│               ├── drizzle.database.ts  # Cliente Drizzle (drizzleDB)
│               └── seed/
│                   ├── action.seed.ts   # Seeds do módulo action
│                   └── index.ts         # Runner de seeds
│
└── modules/                             # Módulos por bounded context
    ├── action/                          # ✅ Implementado
    │   ├── entities/
    │   │   └── action.ts                # Entidade Action (usa value objects)
    │   ├── value-objects/
    │   │   ├── action-id.ts             # ActionId (herda de Uuid)
    │   │   ├── action-title.ts          # ActionTitle (max 100 chars)
    │   │   └── step-value.ts            # StepValue (string livre, max 50 chars)
    │   ├── repositories/
    │   │   └── action-repository.interface.ts  # Port (9 métodos)
    │   ├── dto/
    │   │   ├── create.dto.ts            # CreateActionDTO { title, step }
    │   │   ├── update.dto.ts            # UpdateActionDTO { id, title?, step?, position? }
    │   │   └── move.dto.ts              # MoveActionDTO { actionId, newPosition }
    │   ├── use-cases/
    │   │   ├── create-action.use-case.ts
    │   │   ├── find-action-by-id.use-case.ts
    │   │   ├── list-actions.use-case.ts
    │   │   ├── update-action.use-case.ts
    │   │   ├── delete-action.use-case.ts
    │   │   └── move-action.use-case.ts
    │   ├── infra/
    │   │   └── action-repository.drizzle.ts  # Adapter (Drizzle)
    │   └── controllers/
    │       └── action.controller.ts     # 6 métodos, extende BaseController
    │
    ├── task/                            # ✅ Implementado
    │   ├── entities/
    │   │   └── task.ts                  # Entidade Task (campos públicos, VOs no constructor)
    │   ├── value-objects/
    │   │   ├── task-id.ts               # TaskId (herda de Uuid)
    │   │   ├── task-title.ts            # TaskTitle (max 150 chars)
    │   │   └── task-description.ts      # TaskDescription (nullable, max 500 chars)
    │   ├── repositories/
    │   │   └── task-repository.interface.ts  # Port (9 métodos)
    │   ├── dto/
    │   │   ├── create.dto.ts            # CreateTaskDTO { title, description?, actionId }
    │   │   ├── update.dto.ts            # UpdateTaskDTO { id, title?, description?, position?, actionId? }
    │   │   └── move.dto.ts              # MoveTaskDTO { taskId, newPosition, newActionId? }
    │   ├── use-cases/
    │   │   ├── create-task.use-case.ts
    │   │   ├── find-task-by-id.use-case.ts
    │   │   ├── list-tasks-by-action.use-case.ts
    │   │   ├── update-task.use-case.ts
    │   │   ├── delete-task.use-case.ts
    │   │   └── move-task.use-case.ts
    │   ├── infra/
    │   │   └── task-repository.drizzle.ts  # Adapter (Drizzle)
    │   └── controllers/
    │       └── task.controller.ts       # 6 métodos, extende BaseController
    │
    └── statistics/                      # 🔨 Scaffolded (pasta vazia)
        └── use-cases/
```

---

## Módulo de referência: action

O módulo `action` é a implementação completa e serve de referência para novos módulos.

### Entity

**Action** — dados públicos, validação via VOs no constructor:

- `public readonly id: string` — UUID (ActionId valida)
- `public title: string` — max 100 chars (ActionTitle valida)
- `public step: string` — string livre, max 50 chars (StepValue valida)
- `public position: number` — posição no board

Sem métodos de negócio — regras ficam nos use cases.

### Value Objects

| VO            | Validacao                                            | Uso                           |
| ------------- | ---------------------------------------------------- | ----------------------------- |
| `ActionId`    | Herda de `Uuid` (validação UUID, auto-gera se vazio) | Identificador da action       |
| `ActionTitle` | não vazio, max 100 chars, trim                       | Título da action              |
| `StepValue`   | não vazio, max 50 chars, trim                        | Nome da coluna (string livre) |

### Port (Repository Interface)

`IActionRepository` — 9 métodos:

| Método                    | Responsabilidade                         |
| ------------------------- | ---------------------------------------- |
| `create(action)`          | Persiste nova action                     |
| `findAll()`               | Lista todas (ordenado por position)      |
| `findById(id)`            | Busca por UUID                           |
| `findByName(name)`        | Busca por título                         |
| `update(action)`          | Atualiza action existente                |
| `delete(id)`              | Deleta por UUID                          |
| `updatePositions(items)`  | Batch update de posições (SQL CASE/WHEN) |
| `reindexAfterDelete(pos)` | Decrementa posições acima da removida    |
| `count()`                 | Retorna total de actions                 |

### DTOs

- `CreateActionDTO`: `{ title: string; step: string }` — position é auto-computed via `count()`
- `UpdateActionDTO`: `{ id: string; title?: string; step?: string; position?: number }`
- `MoveActionDTO`: `{ actionId: string; newPosition: number }`
- `MoveTaskDTO`: `{ taskId: string; newPosition: number; newActionId?: string }`

### Use Cases (um por arquivo, single responsibility)

| Use Case                | Responsabilidade                                                           |
| ----------------------- | -------------------------------------------------------------------------- |
| `CreateActionUseCase`   | Auto-computa position (count), cria entidade, persiste                     |
| `FindActionByIdUseCase` | Busca por ID, lança 404 se não encontrar                                   |
| `ListActionsUseCase`    | Lista todas as actions                                                     |
| `UpdateActionUseCase`   | Busca, aplica updates parciais diretamente nos campos públicos, persiste   |
| `DeleteActionUseCase`   | Busca, deleta, reindexa posições                                           |
| `MoveActionUseCase`     | Clamp posição, remove da lista, reinsere, batch update, retorna reordenada |

### Infra

`DrizzleActionRepository` implements `IActionRepository`:

- Recebe `NodePgDatabase` via construtor
- Converte rows do banco → entidades de domínio (hidrata value objects)
- `updatePositions` usa raw SQL `CASE/WHEN` para batch update
- `reindexAfterDelete` decrementa todas posições acima da removida
- `findAll` ordena por `position ASC`

### Controllers

`ActionController` extende `BaseController`, injeta 6 use cases via `@inject()`:

- `create(dto: CreateActionDTO)`
- `findAll()`
- `findById(actionId: string)`
- `update(dto: UpdateActionDTO)`
- `delete(actionId: string)`
- `move(dto: MoveActionDTO)`

Todos os métodos delegam via `this.execute(() => ...)`.

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
- Todos os bindings são **singletons`

### Fluxo de bootstrap

```
instance.ts
  → validateDatabase()      # Drizzle: SELECT 1
  → validateRedis()         # ioredis: conectar e sair
  → validateService()       # HTTP check para Prometheus/Grafana
  → retorna StatusLine[]    # Array com label/status/url de cada serviço
```

---

## instance.ts — Health Check

Ao iniciar o backend, `initInstance()` valida a conectividade de cada serviço:

| Serviço    | Método de validação                  | Obrigatório?                            |
| ---------- | ------------------------------------ | --------------------------------------- |
| Database   | `drizzleDB.execute(sql\`SELECT 1\`)` | Sim                                     |
| Redis      | `ioredis` conectar + quit            | Opcional (se `REDIS_URL` definido)      |
| Prometheus | `fetch(url)` com timeout             | Opcional (se `PROMETHEUS_URL` definido) |
| Grafana    | `fetch(url)` com timeout             | Opcional (se `GRAFANA_URL` definido)    |

Retorna um array de `StatusLine` com o status de cada serviço. O backend **não** trava se um serviço estiver offline — o health check é informativo.

---

## Database (Drizzle ORM)

### Schema

```typescript
actions:
  id       UUID (PK, defaultRandom)
  title    TEXT (notNull)
  step     TEXT (notNull)       // string livre, ex: BACKLOG, IN_PROGRESS, etc.
  position INTEGER (notNull, default 0)  // posição no board para ordenação

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

## Cache (Redis + Decorator Pattern)

O Redis já está presente no stack para Pub/Sub e **também é usado para cache** de operações de leitura de alta frequência. O cache é implementado via **Decorator Pattern** na camada de infraestrutura, transparente para use cases e controllers — o domínio não sabe que cache existe.

### Arquitetura

```
UseCase
    ↓
IActionRepository / ITaskRepository (port)
    ↓
Cached*Repository (decorator) ← ICacheService (port)
    ↓
Drizzle*Repository (puro, só persistência)
    ↓
Database (PostgreSQL)
```

### Princípios SOLID respeitados

| Princípio | Como                                                                 |
| --------- | -------------------------------------------------------------------- |
| **SRP**   | `Drizzle*Repository` só persiste; `Cached*Repository` só cacheia     |
| **OCP**   | Cache pode ser ligado/desligado no DI sem alterar código existente   |
| **DIP**   | Ambos dependem de `IActionRepository`/`ITaskRepository` (abstrações) |

### Interface (Port)

Definida em `shared/interfaces/cache.interface.ts`:

```typescript
interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}
```

### Implementações

| Implementação        | Local                         | Quando usar             |
| -------------------- | ----------------------------- | ----------------------- |
| `RedisCacheService`  | `infra/cache/redis-cache.ts`  | `REDIS_URL` configurado |
| `MemoryCacheService` | `infra/cache/memory-cache.ts` | Fallback sem Redis      |

A factory `createCache()` em `infra/cache/index.ts` escolhe automaticamente baseada em `REDIS_URL`.

### Chaves de cache

| Chave                          | Conteúdo                                | TTL segurança |
| ------------------------------ | --------------------------------------- | ------------- |
| `actions:list:all`             | `Action[]` serializada (findAll)        | 60s           |
| `actions:detail:{actionId}`    | `Action` única (findById)               | 30s           |
| `tasks:list:action:{actionId}` | `Task[]` de uma coluna (findByActionId) | 60s           |
| `tasks:detail:{taskId}`        | `Task` única (findById)                 | 30s           |

### Invalidação

Cada operação de escrita no decorator invalida as chaves afetadas **após** delegar ao repositório puro:

| Operação de escrita               | Chaves invalidadas                                         |
| --------------------------------- | ---------------------------------------------------------- |
| `CreateActionUseCase`             | `actions:list:all`                                         |
| `UpdateActionUseCase`             | `actions:list:all`, `actions:detail:{id}`                  |
| `DeleteActionUseCase`             | `actions:list:all`, `actions:detail:{id}`                  |
| `MoveActionUseCase`               | `actions:list:all`                                         |
| `CreateTaskUseCase`               | `tasks:list:action:{actionId}`                             |
| `UpdateTaskUseCase`               | `tasks:list:action:{actionId}`, `tasks:detail:{id}`        |
| `DeleteTaskUseCase`               | `tasks:list:action:{actionId}`, `tasks:detail:{id}`        |
| `MoveTaskUseCase` (mesma coluna)  | `tasks:list:action:{actionId}`                             |
| `MoveTaskUseCase` (entre colunas) | `tasks:list:action:{oldAId}`, `tasks:list:action:{newAId}` |

### Regras

1. **Cache apenas leitura** — apenas resultados de queries `SELECT`
2. **TTL é segurança, não expiração primária** — invalidação é event-driven
3. **Serialização explícita** — decorators serializam/deserializam entidades (dates viram ISO strings)
4. **Cache opcional** — `MemoryCacheService` é fallback se `REDIS_URL` não configurada
5. **Sem cache em `findAll` de task** — método não usado por nenhum use case
6. **Decorator delega ao repositório puro** — o decorator nunca contorna o `inner`

### DI Wiring (Decorator Composition)

No container Inversify, o **decorator envolve o repositório puro**:

```typescript
// base.di.ts

// 1. Cache service — instância única, reusada por todos os decorators
const cacheService = createCache();

// 2. Repository puro (só banco)
const actionRepo = new DrizzleActionRepository(drizzleDB);

// 3. Decorator envolve o repositório puro com cache
container
  .bind<IActionRepository>(TYPES.Repositories.Action)
  .toConstantValue(new CachedActionRepository(actionRepo, cacheService));

// 4. Use cases recebem IActionRepository — não sabem que cache existe
// 5. Se quiser injetar ICacheService em outro lugar:
container.bind<ICacheService>(TYPES.Cache).toConstantValue(cacheService);
```

### O que NÃO é cacheado

- `findByName(name)` — chamada infrequente, sem cache
- `count()` / `countByActionId()` — chamada só no create position, sem cache
- `findAll()` de task — método não usado por use cases
- Operações de reordenação internas — usam dados frescos

---

## Fluxo de dependência

```
BFF (GraphQL resolvers)
    │
    ▼
Controllers  ← inject use-cases (via BaseController.execute())
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

1. Criar estrutura de pastas seguindo o módulo `action` como referência (sem subpasta `domain/`)
2. Domain não importa de framework externo
3. Um use case por arquivo, uma operação por use case
4. DTOs para entrada do controller (entidades nunca vazem)
5. Infra implementa a port (repository interface)
6. Bind no container DI (types.ts + module di.ts)
7. Registrar import no `container/index.ts`
8. Controllers devem estender `BaseController` e delegar via `execute()`
9. **Funções com 3+ parâmetros devem receber um objeto tipado** (Clean Code)
10. **Prefira return early a else** — reduz aninhamento e melhora clareza
11. **Extraia lógica reutilizável para `shared/`** se repete 3+ vezes ou será usada em todos os módulos
12. **Value Objects de ID herdam de `Uuid`** (shared/value-objects/uuid.ts)
13. **Ao criar VO, verifique `shared/value-objects/`** — se existir algo reutilizável, herde em vez de reescrever
14. **Use barrel exports dentro das subpastas** (`value-objects/index.ts`, `entities/index.ts`, etc.)
15. **NÃO crie barrel export no nível do módulo** (`modules/<name>/index.ts`) — viola regra de dependência e causa circular imports
16. **Tipagem forte** — use `type` ou `interface` explicitamente, nunca `any`

```typescript
// ❌ Errado — aninhamento desnecessário
if (action) {
  if (action.isActive()) {
    return action;
  } else {
    throw new AppError(400, 'Action inativa');
  }
} else {
  throw new AppError(404, 'Não encontrada');
}

// ✅ Correto — return early
if (!action) throw new AppError(404, 'Não encontrada');
if (!action.isActive()) throw new AppError(400, 'Action inativa');
return action;
```

```typescript
// ❌ Errado
function move(params: MoveParams) {
  if (params.reorder) {
    // ... lógica de reorder
  } else {
    return;
  }
}

// ✅ Correto
function move(params: MoveParams) {
  if (!params.reorder) return;
  // ... lógica de reorder
}
```
