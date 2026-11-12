# Keller Hub: preparação para a prova de conceito ANA

## Objetivo

Transformar o protótipo em uma aplicação multiusuário com dados compartilhados, permissões verificadas no servidor e auditoria real, preservando o visual Glass e a identidade configurável da organização.

O documento recebido será o roteiro das seis fases. A primeira entrega será a Fase 1 completa, incluindo as proteções de acesso necessárias para que ela já seja segura. As fases seguintes terão entregas próprias, sem declarar funcionalidades futuras como concluídas.

## Situação atual confirmada

- Portfólios, programas e projetos partem de dados fictícios e são alterados apenas no navegador.
- Áreas, permissões simuladas, elementos, subelementos e painéis personalizados também dependem do navegador.
- A autenticação, as configurações compartilhadas, os termos e parte da auditoria já usam Lovable Cloud.
- Há autorização baseada em e-mails fixos e uma auditoria consolidada restrita por e-mail. Essas restrições serão substituídas por papéis e capacidades explícitas, preservando os acessos existentes.

## Regras de todas as entregas

- Dados de negócio e painéis salvos ficam no Lovable Cloud. O navegador guarda somente preferências visuais pessoais.
- Listas, busca, assistente, exportações e totais respeitam o mesmo acesso efetivo.
- Nenhum botão ficará apresentado como funcional sem executar sua ação. Integrações inexistentes não serão anunciadas como ativas.
- Interface em português do Brasil, adaptada a computador, tablet e celular.
- Atualização dos manuais e testes de permissões a cada fase.
- Demonstração identificada como tal, com registros persistidos, nunca como fonte fictícia em execução.

## Fase 1: base compartilhada e fim dos dados fictícios

### Dados e segurança

1. Criar áreas, membros, perfis de usuário e estrutura protegida de papéis. Aproveitar os perfis existentes para nome e cargo, sem colocar privilégios em campos editáveis do perfil.
2. Criar portfólios, programas, metas de programas e projetos, vinculados a áreas e responsáveis reais.
3. Criar elementos, subelementos, atualizações e tarefas de projeto, com acesso herdado do projeto.
4. Criar objetivos, metas estratégicas, iniciativas, alinhamentos, indicadores, valores por período, riscos, planos de resposta e status reports.
5. Persistir painéis personalizados e parametrizações de etiquetas que hoje estão no navegador.
6. Aplicar permissões por papel e área desde a criação das tabelas. Validar também convidados, compartilhamentos e a restrição herdada dos pais.
7. Transferir as contas existentes para papéis explícitos antes de remover as autorizações por e-mail. A capacidade de configurar IA continuará exclusiva ao responsável autorizado, com confirmação da senha atual, sem conferir essa capacidade a todo superadministrador.

### Telas e cálculos

1. Substituir os quatro armazenamentos locais apontados no documento por consultas e gravações compartilhadas.
2. Remover leituras de dados fictícios de todas as telas, inclusive gráficos, estratégia, relatórios e contexto do assistente. Separar os tipos de dados do arquivo de demonstração.
3. Usar agregados autorizados para totais institucionais, por portfólio e por programa: contagens, riscos críticos, orçamento, execução e progresso médio.
4. Definir denominadores, tratamento de valores ausentes e agrupamentos em um único lugar, para evitar números diferentes entre telas.
5. Implantar atualização entre usuários, paginação, índices e estados de erro nas consultas.
6. Persistir os registros demonstrativos em uma migração de criação, com correspondência entre os identificadores antigos e os novos UUIDs. Não criar usuários fictícios de autenticação nem atribuir pessoas fictícias a contas reais.
7. Manter os dados locais anteriores intactos até a troca ser validada, mas não lê-los como contingência depois da migração. Os dados particulares já cadastrados em navegadores não serão enviados automaticamente para uma base compartilhada.

### Critérios de aceite

- Criar um portfólio em uma sessão e vê-lo em outra sessão autorizada, sem recarregar manualmente.
- Conferir os mesmos totais em Visão executiva, Portfólios, Projetos e Riscos, sob o mesmo escopo.
- Alterar um elemento ou subelemento e ler a alteração em outra sessão autorizada.
- Um Técnico não lê nem altera uma área restrita alheia, inclusive por chamada direta e manipulação do armazenamento do navegador.
- Auditor e Alta Administração não ganham edição por estarem em uma área.
- Nenhuma fonte fictícia de negócio nem armazenamento local de negócio permanece em execução.

## Fase 2: ações completas nos módulos

- Status reports com formulário, histórico e impressão/PDF.
- Qualidade com critérios, entregas e checklist; Recursos com alocação, horas e custos.
- Objetivos, metas, iniciativas e vínculos estratégicos com comparação entre períodos.
- Indicadores manuais e calculados, valores por período, agregação e exportações reais.
- Riscos com planos de mitigação, reavaliações, filtros e matriz calculada.
- Publicações públicas, autenticadas ou por perfis, com permissões de visualizar, exportar e compartilhar. Links usam o domínio atual.
- Conteúdo ajustado ao perfil e nenhuma simulação de integração ativa.

## Fase 3: administração e acesso efetivo

- Nome e perfil reais do usuário logado, sem Felipe Andrade como identidade padrão.
- Convites, definição de papéis e áreas, ativação e desativação.
- Retirar simulação de perfil em produção. Se mantido, “Visualizar como” será exclusivamente leitura, auditado e sem ampliação do acesso do administrador.
- Revisar todas as funções e endpoints para autenticação, autorização, atribuições e escopo.
- Confirmar que desativação e mudanças de papel retiram acesso, sem depender do estado antigo do navegador.

## Fase 4: auditoria completa

- Auditar alterações de todas as tabelas de negócio com antes/depois, autor, perfil, resultado e contexto de acesso.
- Registrar autenticação, falhas, logout, troca de senha, negativas de acesso, administração, exportações, publicação e erros relevantes.
- Retirar a inserção direta de eventos pelo navegador e manter a imutabilidade dos registros.
- Disponibilizar Trilha de auditoria a Auditor e Administrador/PMO, com filtros, paginação e CSV/JSON.
- Substituir a trilha e o contador fictícios por registros reais.
- Não prometer recuperação retroativa de eventos que nunca foram registrados. Falhas de login e metadados terão a cobertura confirmada no serviço de autenticação.

## Fase 5: portabilidade e integrações

- CSV, XLSX e JSON por módulo, apenas dos dados autorizados, com registro de exportação.
- Exportação administrativa integral em ZIP, com dados, dicionário e configurações, sem segredos, senhas ou tokens.
- Importação assistida com mapeamento, prévia, validação e relatório de erros para migração do Metalink.
- API somente leitura com filtros, paginação, ordenação e tokens armazenados apenas como hash, com escopo e revogação.
- OpenAPI e página de documentação, com orientações para Power BI e Excel. Não anunciar OData sem implementá-lo.

## Fase 6: assistente, suporte e ajuda

- Contexto do assistente consultado com a identidade autenticada e limitado às permissões reais, incluindo riscos de contratos e contratações.
- Assistente disponível aos perfis previstos, mantendo limites e auditoria; configuração de IA continua restrita à capacidade específica.
- Texto transparente sobre o envio de contexto ao serviço de IA, sem afirmar que os dados nunca saem do ambiente.
- Suporte com número único, anexos, interações, prioridades, estados, SLA, solução e referência ao STI Atende, sem exclusão dos registros.
- Manuais dentro da aplicação, busca e ajuda contextual por módulo.

## Detalhes técnicos

- Alterações de estrutura somente pela ferramenta de migrações, com privilégios explícitos, RLS e funções auxiliares criadas antes das políticas que as utilizam.
- Relações de usuários em tabelas de negócio apontam para perfis públicos ou usam UUIDs. Apenas perfis e papéis podem referenciar diretamente usuários de autenticação.
- Papéis ficam exclusivamente em tabelas protegidas, não no perfil editável. As categorias de acesso solicitadas serão papéis ou atribuições protegidas.
- Consultas iniciais usam loaders com TanStack Query e funções de servidor autenticadas; telas protegidas ficam sob o layout autenticado e páginas públicas têm somente consultas públicas seguras.
- Agregados usam segurança do invocador, respeitando RLS. Nenhum cliente administrativo é usado para ler dados comuns de usuários.
- A camada central de acesso permanece em `src/lib/acesso.ts`, refletindo permissões verificadas no servidor, sem decidir privilégios a partir do navegador.
- Atualizações em tempo real invalidam as consultas relacionadas e não criam canais duplicados.
- Auditoria e tarefas usam índices e paginação; paginação de chamados será adicionada com o módulo Suporte.
- Endpoints externos precisam ficar sob o prefixo público permitido pela hospedagem, verificando o token no próprio endpoint. Os endereços `/api/v1` serão compatibilizados com essa restrição antes da implementação, sem expor dados ou criar uma API apenas aparente.
- Cada página de conteúdo terá título e descrição próprios. Novas rotas com consultas terão apresentação de erros e de conteúdo inexistente.

## Validação e documentação

Em cada fase, executar testes de regras com valores concretos, negativas de acesso por perfil e verificações completas de criação e leitura em sessões distintas. Conferir computador, tablet e celular, atualizar os manuais e marcar no roteiro somente o que tiver sido comprovado.

Não haverá publicação automática, exclusão de tabelas existentes ou migração silenciosa de dados particulares de navegadores durante essa preparação.