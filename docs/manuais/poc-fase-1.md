# Prova de conceito ANA: situação da primeira etapa

## Cadastros compartilhados

Portfólios, programas e projetos passam a usar registros compartilhados, não a carteira particular do navegador. Elementos, subelementos, atualizações e painéis personalizados também são gravados no Lovable Cloud. Os registros iniciais são exemplos de demonstração e não representam informação oficial da ANA.

Para cadastrar um portfólio, abra Portfólios, selecione Novo portfólio, preencha os campos e salve. Aguarde a confirmação. Uma segunda conta autorizada pode consultar o registro na mesma lista. Não há importação automática dos antigos cadastros particulares de cada máquina.

Para detalhar um projeto, abra sua página, selecione Elementos e depois Novo elemento. Informe nome, responsável e prazo antes de salvar. Aguarde a confirmação e o fechamento do formulário. O nome digitado do responsável não concede acesso nem cria uma conta.

## Identidade e acesso

A interface usa o perfil da conta autenticada. Filtros de área apenas reduzem os registros apresentados e não ampliam acesso. A configuração de IA continua exigindo o papel específico do responsável e a confirmação da senha atual. Administrador/PMO não recebe automaticamente esse papel.

Sair da aplicação limpa os dados consultados da sessão. Para testar outro perfil, use a conta correspondente, não uma alteração do armazenamento do navegador.

## Evidências verificadas

- Cadastro de um portfólio em uma conta e leitura em outra conta autorizada.
- Gravação de elemento e confirmação de sua existência no armazenamento compartilhado.
- Abertura das telas principais com sessão autorizada, sem erros de execução observados.
- Apresentação em celular de 390 pixels, sem rolagem horizontal da página executiva.

## Pendências para aceite completo da etapa

- Comprovar atualização simultânea entre duas contas sem recarregar manualmente.
- Complementar a matriz automatizada com navegação e gravação pela interface em contas reais Técnico, Auditor e Alta Administração. Os testes isolados de regras passaram, mas não substituem essa validação.
- Completar a migração versionada dos registros demonstrativos. A carga aplicada isoladamente não substitui a migração de demonstração reproduzível.
- Conferir todos os totais sob o mesmo filtro, incluindo indicadores calculados.
- Implementar paginação das listas grandes e revisar o volume da consulta compartilhada.
- Atualizar os procedimentos específicos dos manuais de cada perfil após essa validação.

A primeira etapa ainda não deve ser considerada aceita integralmente. Qualidade, Recursos, importação, API, suporte e demais funcionalidades das fases posteriores permanecem no roteiro.

## Validação de permissões em 13/11/2026

Foram aprovados 13 cenários automatizados (38 verificações) em PostgreSQL isolado, carregando as migrações reais da aplicação. Nenhuma conta ou registro do cliente foi alterado para simular perfis. Dois testes adicionais contra o Lovable Cloud confirmaram bloqueio de consulta anônima.

| Perfil ou condição | Resultado verificado |
| --- | --- |
| Técnico e Gestor | Área externa restrita não aparece na lista, nos objetos nem nas permissões retornadas |
| Técnico | Pode alterar progresso de elemento atribuído, não de outro responsável; não reatribui, exclui ou cria projeto |
| Técnico e Gestor | Não podem mover subelementos entre elementos |
| Gestor | Edita conteúdo na própria área, não concede acesso; compartilhamento externo permite somente leitura |
| Auditor e Alta Administração | Leitura transversal sem edição, criação de elementos, exclusão ou concessão de acesso |
| Administrador/PMO | Pode alterar vínculo de subelemento, sem receber automaticamente o papel de responsável de IA |
| Conta inativa | Não lê carteira nem consulta o snapshot |
| Herança | Pai privado bloqueia acesso ao projeto e seus elementos, mesmo com convite apenas no filho |
| Elevação de privilégios | Técnico não consegue inserir papel administrativo ou de IA nem gravar configuração de IA diretamente |

Falha reproduzida antes da correção: Técnico e Gestor podiam modificar o elemento pai de um subelemento no mesmo projeto. A proteção agora verifica esse vínculo no servidor, inclusive em alterações diretas, mantendo a operação disponível ao Administrador/PMO. A presença da proteção no Lovable Cloud foi conferida após aplicação.

Conferência visual com a conta do responsável: lista de 14 projetos e aba Elementos do projeto Portal de Serviços 2.0 abertas, com quatro elementos persistidos. Nenhum erro de execução observado; página sem transbordamento horizontal em 507 pixels.

Limites desta evidência: autenticação e operações pela interface dos demais perfis ainda não foram testadas. O banco isolado usa auxiliares equivalentes de identidade e remove somente instruções de publicação Realtime. Não comprova entrega simultânea de eventos. A consulta principal ainda entrega valores financeiros de registros autorizados ao Técnico; o texto antigo do manual que prometia ocultação foi corrigido, sem afirmar proteção inexistente. O ajuste de controles por item atribuído na interface e a revisão granular de campos permanecem pendentes.

Execução: `bun test tests/ppm-role-matrix.test.ts` e `python3 tests/ppm_permissions.py`.