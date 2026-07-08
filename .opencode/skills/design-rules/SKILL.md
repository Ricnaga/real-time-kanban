---
name: design-rules
description: Princípios de design de código — SOLID, SOC, DRY, YAGNI, KISS, Clean Code
---

## SOLID

- **S**ingle Responsibility: cada classe/módulo tem uma única responsabilidade
- **O**pen/Closed: aberto para extensão, fechado para modificação
- **L**iskov Substitution: subtipos devem ser substituíveis por seus tipos base
- **I**nterface Segregation: interfaces específicas são melhores que uma genérica
- **D**ependency Inversion: dependa de abstrações, não de implementações

## SOC (Separation of Concerns)

- Separe lógica de negócio, apresentação e dados em camadas distintas
- Cada módulo trata de um concern específico

## DRY (Don't Repeat Yourself)

- Extraia lógica repetida em funções, hooks ou componentes reutilizáveis
- Evite duplicação de código

## YAGNI (You Ain't Gonna Need It)

- Não implemente funcionalidades antes de serem necessárias
- Mantenha o código mínimo para atender o requisito atual

## KISS (Keep It Simple, Stupid)

- Soluções simples são melhores que complexas
- Prefira legibilidade e clareza a sofisticação desnecessária

## Clean Code

- Nomes significativos para variáveis, funções e componentes
- Funções pequenas e com propósito único
- Comentários explicam o "porquê", não o "como"
