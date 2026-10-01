# Elementos, subelementos e atualizações dos projetos

## Objetivo

Ampliar o detalhamento operacional dos projetos com uma estrutura inspirada no monday.com: elementos agrupados, subelementos expansíveis e atualizações em balão. Cada projeto terá uma conversa geral, e cada elemento ou subelemento manterá seu próprio histórico.

## Experiência no Keller Hub

- Adicionar a aba **Elementos** ao detalhe do projeto, com grupos por status e linhas expansíveis.
- Exibir em cada linha: nome, responsável, status, prazo, progresso e quantidade de atualizações.
- Permitir expandir um elemento para consultar seus subelementos sem sair da tela.
- Permitir criar, editar e excluir elementos e subelementos quando o nível de acesso autorizar.
- Permitir alterar status e progresso diretamente na estrutura, preservando as etiquetas e o padrão visual atual.
- Adicionar o ícone de balão na lista de projetos e no detalhe do projeto.
- Ao selecionar o balão do projeto, abrir um painel lateral com a conversa geral desse projeto.
- Ao selecionar o balão de um elemento ou subelemento, abrir o mesmo painel contextualizado naquele item.
- Mostrar histórico cronológico com autor, data, hora e texto da atualização, além de um campo para publicar nova atualização.
- Atualizar imediatamente o contador do balão e manter os dados após recarregar a página.
- Em telas pequenas, manter a hierarquia legível e abrir as atualizações em painel adequado à largura disponível.

## Regras de acesso

- Elementos, subelementos e atualizações herdam área, visibilidade e nível de permissão do projeto.
- Usuários com somente leitura podem abrir o balão e consultar o histórico, mas não publicar nem alterar itens.
- Usuários com edição podem manter elementos, subelementos e publicar atualizações.
- O perfil Técnico continua sem acesso a valores financeiros.
- Todas as listas e ações continuarão usando a carteira filtrada por perfil e área.

## Dados demonstrativos

- Vincular cronograma, elementos, subelementos e atualizações ao identificador do projeto, evitando conteúdo igual em todos os projetos.
- Incluir exemplos coerentes para os projetos existentes.
- Persistir a nova estrutura no mesmo armazenamento demonstrativo da carteira, com migração segura dos dados atuais.
- Registrar autor e horário usando o usuário atualmente simulado.

## Documentação

Atualizar toda a coleção de manuais e o índice do repositório:

- Manual geral: lista de projetos, aba Elementos, expansão, campos, ações, balões e solução de problemas.
- Administrador/PMO: governança, permissões, validação por perfil, auditoria e manutenção dos novos dados.
- Técnico: consulta, atualização dos itens atribuídos e limites de edição.
- Gestor: criação, acompanhamento e uso das atualizações na gestão da execução.
- Alta Administração: consulta consolidada de elementos e históricos.
- Governança de acessos: herança das permissões para elementos, subelementos e atualizações.
- Glossário: Elemento, Subelemento, Atualização e ícone de balão.
- Índices e README: incluir a nova cobertura funcional.

## Detalhes técnicos

- Criar tipos e operações persistentes para elementos, subelementos e atualizações, associados por `projetoId`, `elementoId` e `subelementoId`.
- Criar componentes reutilizáveis para a estrutura hierárquica e para o painel de atualizações.
- Usar os componentes de interface existentes, ícones Lucide e tokens Liquid Glass, sem incorporar a imagem de referência.
- Centralizar a verificação de edição no acesso efetivo do projeto.
- Registrar a decisão estrutural no guia técnico do projeto.

## Validação

- Testar criação, edição, expansão e exclusão de elementos e subelementos.
- Testar publicação e persistência das atualizações do projeto, elemento e subelemento.
- Testar leitura e bloqueio de edição nos perfis Técnico, Gestor, Alta Administração e Administrador/PMO.
- Testar filtro de área, item privado e item compartilhado.
- Verificar desktop e celular, incluindo tabela sem sobreposição e painel de atualizações.
- Validar metadados, compilação, erros de execução e links internos dos manuais.
- Confirmar que a documentação não contém travessões e usa a terminologia Keller Hub.
