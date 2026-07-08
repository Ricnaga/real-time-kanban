---
name: architecture-backend
description: Clean Architecture + DDD + SOLID — domínio puro, use cases, ports e infraestrutura
---

## Clean Architecture + Hexagonal (Ports & Adapters)

### Camadas (da mais interna para a externa)

```
domain/entities/      → Entidades ricas com comportamento de negócio
domain/use-cases/     → Casos de uso (um por operação)
ports/                → Interfaces (repositórios, event publisher, etc.)
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

- Entidades de domínio nunca vazam para fora da camada de domínio
- Use cases retornam/ recebem tipos próprios (ou DTOs simples)
- Controllers convertem entre DTOs de entrada/saída e tipos do use case
- Infra converte entre entidades de domínio e linhas do banco (row → entity)

### Tratamento de erros

- Erros de domínio: classes específicas (ex: `BoardNotFoundError`, `InvalidMoveError`)
- Use cases: retornam Result type ou lançam erros de domínio
- Controllers: capturam erros de domínio e traduzem para o formato do delivery (GraphQL errors, HTTP codes, etc.)

### DDD Tático

| Conceito       | Exemplo no projeto                                    |
| -------------- | ----------------------------------------------------- |
| Aggregate Root | `Board` (contém `Column[]` e `Card[]`)                |
| Entity         | `Board`, `Column`, `Card` (têm identidade)            |
| Value Object   | `Position` (sem identidade, comparado por valor)      |
| Domain Event   | `CardMoved`, `BoardUpdated`                           |
| Repository     | `BoardRepository` (interface em ports, impl em infra) |

### Eventos

- Use cases publicam eventos de domínio via `EventPublisher` (port)
- Infra implementa com Redis Pub/Sub (ou in-memory para dev)
- BFF escuta eventos e dispara subscriptions GraphQL

### Testes

- Use cases: testados com repositórios mockados (port fake)
- Entidades: testadas isoladamente (são funções puras)
- Repositórios: testados com banco real (integração)
