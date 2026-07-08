# Code Conventions

## useState

- No máximo 3 estados por componente.
- Se 3 ou mais estados forem usados conjuntamente, agrupe-os em um único objeto tipado.

## Tipagem

- Todo estado, prop, e retorno de função deve ser fortemente tipado com TypeScript.
- Use `type` ou `interface` explicitamente — nunca `any`.

## Tailwind Variants

- Estilos com Tailwind devem ficar em arquivos separados no padrão `<nome-do-componente-ou-page>.tv.ts`.
- Use a biblioteca `tailwind-variants` para definir variantes e composições.

## Return Early

- Prefira return early a else.
- Evite aninhamento profundo de if/else.
