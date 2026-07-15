---
name: architecture-frontend
description: Arquitetura frontend — componentes, estado, camadas e estrutura do projeto
---

## Estrutura de diretórios

```
app/          # App Router (pages, layouts, loading, error)
components/   # Componentes reutilizáveis
lib/          # Lógica de negócio, utilitários, hooks
```

## Arquitetura de componentes

- Componentes de página em `app/` (server components por default)
- Componentes de UI em `components/` (client components quando necessário)
- Estilos via `tailwind-variants` em arquivos `.tv.ts`

## Gerenciamento de estado

- Estado local com `useState` (agrupado em objeto quando 3+)
- Estado de servidor com fetch/server actions
- Evite contexto global desnecessário

## Camadas

- **UI Layer**: componentes React (apresentação)
- **Logic Layer**: hooks, funções puras, utilitários
- **Data Layer**: server actions, API calls, banco

## Code Conventions

### useState

- No máximo 3 estados por componente.
- Se 3 ou mais estados forem usados conjuntamente, agrupe-os em um único objeto tipado.

### Tipagem

- Todo estado, prop, e retorno de função deve ser fortemente tipado com TypeScript.
- Use `type` ou `interface` explicitamente — nunca `any`.

### Tailwind Variants

- Estilos com Tailwind devem ficar em arquivos separados no padrão `<nome-do-componente-ou-page>.tv.ts`.
- Use a biblioteca `tailwind-variants` para definir variantes e composições.

### Return Early

- Prefira return early a else.
- Evite aninhamento profundo de if/else.
