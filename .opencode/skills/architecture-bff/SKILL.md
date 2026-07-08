---
name: architecture-bff
description: BFF (Backend for Frontend) — camada GraphQL entre frontend e backend
---

## BFF — Backend for Frontend

### Papel no sistema

O BFF é a camada de entrega (delivery mechanism) do backend. Ele:

- Expõe uma API GraphQL desenhada **para as necessidades do frontend**
- Traduz chamadas GraphQL em chamadas para controllers/use cases
- Gerencia subscriptions em tempo real (via PubSub)
- Implementa autenticação e autorização (contexto)

### Estrutura

```
bff/
  builder.ts        # SchemaBuilder + tipo do Context
  schema.ts         # Agrega todos os módulos no schema final
  objects/          # GraphQL type definitions (code-first Pothos)
    board.object.ts
    column.object.ts
    card.object.ts
    scalars.ts
  queries/          # Queries GraphQL
    board.queries.ts
  mutations/        # Mutations GraphQL
    board.mutations.ts
  subscriptions/    # Subscriptions GraphQL
    board.subscriptions.ts
```

### Regras

1. **Resolvers são finos** — delegam tudo ao controller, sem lógica de negócio
2. **Tipos GraphQL espelham contratos do `@kanban/shared`** — sem duplicar definições
3. **Mutações** chamam use cases via controller e retornam o resultado
4. **Subscriptions** escutam eventos publicados pelos use cases e reemitem para o cliente
5. **Contexto** carrega informações de autenticação e instâncias dos controllers

### Exemplo de fluxo

```
Mutation createBoard(title: "Meu Board")
  → Pothos resolver (bff/mutations/board.mutations.ts)
    → boardController.createBoard(title)
      → CreateBoardUseCase.execute(title)
        → boardRepo.save(new Board(title))
          → DrizzleBoardRepository (infra)
```

### Considerações

- Publique apenas campos que o frontend realmente consome
- Use `@kanban/shared` como fonte da verdade para tipos de input/output
- Subscriptions devem ser granulares (eventos específicos, não "tudo mudou")
- Mantenha compatibilidade retroativa no schema ou versione queries
