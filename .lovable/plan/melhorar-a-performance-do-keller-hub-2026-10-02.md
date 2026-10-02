# Melhorar a performance do Keller Hub

## Objetivo
Reduzir o tempo de abertura e tornar navegação, rolagem e redimensionamento mais fluidos, preservando o Liquid Glass e todas as funções atuais.

## Implementação
- Carregar o assistente flutuante e suas bibliotecas de IA somente quando necessário, evitando esse custo em todas as páginas.
- Dividir melhor o código por página e ajustar a antecipação de navegação para reduzir esperas sem baixar conteúdo desnecessário.
- Evitar verificações duplicadas de sessão e permissão durante o acesso.
- Reduzir o custo gráfico dos efeitos Liquid Glass em telas menores, preservando sua aparência.
- Memorizar cálculos repetidos da carteira visível e dos indicadores quando os dados não mudarem.

## Validação
- Comparar carregamento e tamanho dos recursos antes e depois.
- Testar acesso, página inicial, navegação, assistente, redimensionamento e celular.
- Confirmar ausência de erros de compilação, execução e rolagem horizontal.
