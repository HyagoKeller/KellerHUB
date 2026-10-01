# Glossário e referência rápida

## Glossário

| Termo | Definição |
| --- | --- |
| Área | Espaço de dados que reúne membros e define o alcance da carteira |
| Área aberta | Área conhecida pela organização, com leitura de itens públicos |
| Área restrita | Área conhecida apenas por membros e perfis transversais |
| Atualização | Mensagem registrada no histórico de um projeto, elemento ou subelemento |
| Carteira | Conjunto autorizado de portfólios, programas e projetos |
| Convidado | Pessoa com exceção individual de acesso a um item |
| Dono da área | Papel de referência e governança da área |
| Escopo | Conjunto de dados alcançado pela permissão |
| Elemento | Unidade de trabalho vinculada diretamente a um projeto |
| Herança | Propagação de área e restrição de portfólio para programa e projeto |
| Indicador | Medida acompanhada por fórmula, meta, periodicidade e responsável |
| Item privado | Registro visível para convidados e perfis transversais |
| Link autenticado | Publicação que exige identificação da pessoa |
| Link público | Publicação que não exige autenticação |
| Membro | Pessoa vinculada a uma área |
| Motor de IA | Serviço usado pelo Assistente para processar consultas |
| Portfólio | Agrupamento de programas e iniciativas priorizadas |
| Programa | Agrupamento coordenado de projetos relacionados |
| Projeto | Esforço temporário com objetivo, prazo, custo e entregas |
| RBAC | Controle de acesso baseado em perfis |
| Score | Pontuação usada para apoiar a priorização |
| Status report | Registro periódico da situação de um projeto |
| Subelemento | Detalhamento operacional subordinado a um elemento |
| View | Composição personalizada de blocos de uma tela |

## Referência de símbolos

| Símbolo | Uso |
| --- | --- |
| Cadeado | Item privado ou acesso |
| Balão | Abre as atualizações do projeto, elemento ou subelemento e mostra a quantidade registrada |
| Compartilhamento | Leitura concedida a outra área |
| Lápis | Editar registro |
| Lixeira | Remover item ou configuração |
| Check | Opção selecionada ou ação concluída |
| Sem acesso | Valor oculto pelo perfil |

## Hierarquia

```text
Área
└── Portfólio
    └── Programa
        └── Projeto
```

## Decisão rápida de acesso

```text
O perfil permite a ação?
├── Não: bloquear
└── Sim
    └── A área está no escopo?
        ├── Não: verificar compartilhamento ou convite
        └── Sim
            └── O item está privado?
                ├── Sim: exigir convite ou perfil transversal
                └── Não: aplicar o nível efetivo
```

## Cores de saúde e risco

- Verde: condição saudável ou risco baixo.
- Amarelo: atenção ou risco médio.
- Vermelho: condição crítica ou risco alto.
- Azul: informação, seleção ou ação principal.
- Cinza: estado neutro, inativo ou informativo.

## Onde realizar cada atividade

| Atividade | Menu |
| --- | --- |
| Analisar carteira consolidada | Visão executiva |
| Criar e priorizar portfólio | Portfólios |
| Manter objetivos e metas de programa | Programas |
| Manter projeto, cronograma e status | Projetos |
| Manter elementos, subelementos e atualizações | Projetos, aba Elementos e balões |
| Consultar alinhamento institucional | Estratégia |
| Consultar metas e resultados | Indicadores |
| Avaliar probabilidade e impacto | Riscos |
| Publicar painel e auditar acessos | Relatórios |
| Fazer consulta em linguagem natural | Assistente |
| Configurar portal, áreas e integrações | Configurações |
