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
