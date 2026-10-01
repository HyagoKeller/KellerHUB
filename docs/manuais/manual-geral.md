# Manual geral do Keller Hub

## 1. Finalidade

O Keller Hub é uma solução de gestão de portfólios, programas e projetos. A plataforma reúne planejamento estratégico, carteira de projetos, indicadores, riscos, relatórios, publicação de painéis, auditoria e governança de acesso por perfil e área.

Este manual descreve a navegação e os recursos comuns. Para procedimentos de administração ou limites específicos, consulte também o manual do seu perfil.

## 2. Estrutura da navegação

O menu principal contém:

1. **Visão executiva**
2. **Portfólios**
3. **Programas**
4. **Projetos**
5. **Estratégia**
6. **Indicadores**
7. **Riscos**
8. **Relatórios**
9. **Assistente**
10. **Configurações**

Em telas menores, abra o menu pelo botão localizado no canto superior. Selecione um item para navegar. O menu é fechado automaticamente após a seleção.

## 3. Barra superior

### 3.1 Seletor Área

O seletor **Área** controla quais dados autorizados aparecem em listas, indicadores, busca e totais.

1. Selecione **Área**.
2. Marque uma ou mais áreas.
3. Selecione novamente uma área para removê-la do filtro.
4. Use **Todas as minhas áreas** para retirar o filtro específico.

**Todas as minhas áreas** não significa acesso irrestrito. A opção reúne somente as áreas conhecidas pelo perfil conectado.

### 3.2 Busca global

A busca pesquisa portfólios, programas, projetos e riscos visíveis.

1. Digite pelo menos dois caracteres.
2. Confira o tipo de cada resultado.
3. Selecione o resultado para abrir o módulo correspondente.
4. Use o botão de limpar para apagar a consulta.

Quando nenhum registro autorizado corresponde à pesquisa, o sistema informa que não há item visível para o acesso atual.

### 3.3 Perfil e simulação

O controle do usuário mostra nome e perfil. Na versão demonstrativa, ele permite simular pessoas e áreas para conferir o resultado das permissões.

A simulação deve ser usada pelo Administrador/PMO para validar concessões. Ela não substitui homologação formal nem evidência de auditoria em produção.

### 3.4 Tema e identidade

O portal pode operar em modo claro ou escuro. A organização pode configurar nome, logo, paleta e preferências regionais. A marca do produto permanece Keller Hub.

## 4. Convenções visuais

| Elemento | Significado |
| --- | --- |
| Cadeado | Item privado ou controle de acesso |
| Compartilhamento | Item compartilhado com outra área em somente leitura |
| Sem acesso | Campo protegido para o perfil atual |
| Não se aplica | Informação inexistente para o registro |
| Saúde verde | Situação saudável |
| Saúde amarela | Situação que exige atenção |
| Saúde vermelha | Situação crítica |

## 5. Visão executiva

A Visão executiva consolida a carteira dentro do filtro de área atual.

### 5.1 Indicadores principais

- Portfólios ativos, separados entre institucionais e temáticos.
- Projetos em carteira, com indicação de criticidade.
- Orçamento executado, quando o perfil pode ver valores.
- Riscos altos e críticos.

### 5.2 Painéis

- **Execução orçamentária acumulada:** compara planejado e realizado.
- **Projetos por status:** distribui a carteira pelos estados cadastrados.
- **Portfólios institucionais:** apresenta progresso e execução.
- **Riscos em destaque:** lista os riscos de maior severidade.
- **Progresso médio por portfólio:** permite comparar o avanço.
- **Trilha de auditoria:** apresenta os eventos mais recentes.

### 5.3 Views

As abas de views permitem alternar entre a visão padrão e visões personalizadas autorizadas. Uma view muda a composição dos blocos, mas nunca amplia o acesso aos dados.

## 6. Portfólios

O módulo Portfólios organiza e prioriza grandes agrupamentos de iniciativas.

### 6.1 Resumo

A tela apresenta quantidade de portfólios, orçamento total, progresso médio e riscos críticos. Para o perfil Técnico, valores monetários aparecem como **Sem acesso**.

### 6.2 Tabela de priorização

A tabela apresenta nome, responsável, programas, projetos, score, progresso, execução orçamentária e saúde. O score apoia a ordenação da prioridade.

### 6.3 Criar ou editar

1. Selecione **Novo portfólio** ou o ícone de edição.
2. Informe **Nome do portfólio** e **Responsável**.
3. Escolha o **Tipo**.
4. Informe **Orçamento** e **Executado**.
5. Ajuste **Progresso**, **Score de priorização**, **Saúde** e **Riscos críticos**.
6. Selecione **Salvar**.

Nome e responsável são obrigatórios. Valores numéricos não podem ser negativos. Na edição, **Excluir** exige uma segunda confirmação.

### 6.4 Acesso

Use o cadeado para definir área de origem, visibilidade, compartilhamentos e convidados. Programas e projetos subordinados herdam a área do portfólio.

## 7. Programas

Programas agrupam projetos relacionados a um objetivo comum.

### 7.1 Conteúdo da tela

- Total de programas ativos.
- Quantidade de metas acompanhadas.
- Progresso médio.
- Cards com objetivo, gerente, progresso, saúde e metas.
- Hierarquia de portfólio, programa e projeto.

### 7.2 Criar ou editar

1. Selecione **Novo programa** ou o ícone de edição.
2. Informe **Nome do programa**.
3. Selecione o **Portfólio**.
4. Informe **Gerente** e **Objetivo**.
5. Ajuste **Progresso** e **Saúde**.
6. Em **Metas**, selecione **Adicionar meta**.
7. Para cada meta, informe nome, valor atual, alvo e unidade.
8. Selecione **Salvar**.

O programa herda área e restrições do portfólio. Uma meta sem nome não é gravada. O alvo mínimo é 1.

## 8. Projetos

### 8.1 Lista de projetos

A tela apresenta totais da carteira, projetos em execução, projetos em risco ou suspensos e custo executado. O filtro de metodologia permite alternar entre todas, PMBOK, Ágil e Híbrida, além das etiquetas cadastradas.

A tabela mostra nome, portfólio, metodologia, status, prazo, custo, progresso, saúde e ações.

O ícone de balão abre as atualizações gerais do projeto. O número sobre o ícone informa quantas atualizações existem nesse contexto.

### 8.2 Criar ou editar

1. Selecione **Novo projeto** ou **Editar projeto**.
2. Informe um nome com pelo menos três caracteres.
3. Selecione o programa.
4. Informe o gerente.
5. Selecione metodologia e status.
6. Informe início e término.
7. Informe orçamento e valor executado.
8. Ajuste progresso e saúde.
9. Selecione **Salvar**.

A data de término não pode ser anterior à data de início. Progresso aceita valores de 0 a 100.

### 8.3 Etiquetas editáveis

Metodologia, status e tipo de portfólio usam etiquetas configuráveis.

1. Selecione a etiqueta atual.
2. Escolha outra opção ou selecione **Editar etiquetas**.
3. Para renomear, altere o texto.
4. Para mudar a cor, selecione uma amostra.
5. Para criar, selecione **Nova etiqueta**.
6. Para remover, use o ícone de exclusão.
7. Selecione **Aplicar**.

Nomes vazios e duplicados são descartados. Renomear uma etiqueta atualiza os registros que usavam o nome anterior.

### 8.4 Detalhe do projeto

O detalhe possui as abas:

- **Visão geral:** escopo, entregas, recursos e qualidade.
- **Elementos:** estrutura operacional agrupada por status, com elementos e subelementos expansíveis.
- **Cronograma:** fases, duração e percentual realizado.
- **Kanban:** tarefas em Para fazer, Em curso, Revisão, Bloqueado e Concluído.
- **Riscos:** riscos relacionados, severidade, plano, responsável e prazo.
- **Status reports:** histórico de atualizações periódicas.
- **Acesso:** área, visibilidade, compartilhamento e convidados.

Os botões superiores permitem voltar, editar o projeto quando autorizado e iniciar um novo status report.

### 8.5 Elementos e subelementos

Elementos representam unidades de trabalho do projeto. Subelementos detalham partes menores de um elemento e permanecem vinculados ao mesmo projeto.

Cada linha apresenta nome, responsável, status, prazo, progresso e ações. Os elementos são agrupados por status. Use a seta no início da linha para mostrar ou ocultar os subelementos.

Para criar um elemento:

1. Abra o projeto e selecione **Elementos**.
2. Selecione **Novo elemento**.
3. Informe nome, responsável, status e prazo.
4. Ajuste o progresso entre 0 e 100.
5. Selecione **Salvar**.

Para criar um subelemento:

1. Localize o elemento principal.
2. Selecione o ícone de adição na coluna Ações.
3. Informe os dados do subelemento.
4. Selecione **Salvar**.
5. Expanda o elemento para conferir a nova linha.

Use o lápis para editar. Na edição, **Excluir** remove o item e as atualizações vinculadas. A opção não aparece para acesso somente leitura.

### 8.6 Atualizações em balão

O balão mantém uma conversa separada para cada contexto:

- projeto, para decisões e comunicações gerais;
- elemento, para acompanhamento da unidade de trabalho;
- subelemento, para detalhes da execução.

Para publicar:

1. Selecione o balão correspondente.
2. Confira o título no painel lateral.
3. Leia o histórico em ordem cronológica, com autor, data e hora.
4. Digite a mensagem no campo **Escreva uma atualização**.
5. Selecione **Publicar atualização**.

O contador é atualizado imediatamente. Pessoas com somente leitura consultam o histórico, mas não recebem o campo de publicação.

## 9. Estratégia

O módulo apresenta objetivos estratégicos, aderência e iniciativas vinculadas.

- **Objetivo prioritário:** destaca o objetivo principal e sua aderência.
- **Desempenho estratégico:** radar por dimensão.
- **Perspectivas:** cidadão, processos, governança e pessoas.
- **Objetivos:** metas, iniciativas e situação.

O botão **Novo objetivo** e o botão **Abrir mapa** representam os pontos de entrada para cadastro e análise estratégica disponíveis na interface demonstrativa.

## 10. Indicadores

A tela apresenta indicadores cadastrados, quantidade dentro da meta e quantidade abaixo da meta.

### 10.1 Análise

1. Escolha o período: últimos 6 meses, ano corrente ou últimos 12 meses.
2. Marque os indicadores que devem aparecer no gráfico.
3. Consulte fórmula, meta, periodicidade, responsável e atingimento nos cards.
4. Use as views autorizadas para mudar a composição da tela.

### 10.2 Exportação

Os comandos de exportação disponibilizados são CSV e XLSX. A autorização depende do perfil e da política do relatório.

## 11. Riscos

A tela consolida riscos corporativos por severidade e categoria.

- **Matriz de calor:** cruza probabilidade e impacto em uma grade 5 por 5.
- **Evolução da exposição:** apresenta histórico de riscos críticos, altos, médios e baixos.
- **Filtro por categoria:** limita os cards exibidos.
- **Card do risco:** apresenta origem, categoria, severidade, resposta, plano, responsável, prazo e tendência.

Passe o ponteiro sobre uma célula da matriz para consultar os riscos nela posicionados.

## 12. Relatórios e publicação

A tela centraliza modelos, links publicados e permissões.

### 12.1 Selecionar um relatório

Selecione uma linha da tabela. O painel **Gestão de acesso** passa a editar o relatório escolhido.

### 12.2 Formas de publicação

- **Link público:** não exige autenticação. Deve conter somente dados aprovados para divulgação.
- **Link autenticado:** exige identificação da pessoa.
- **Perfis liberados:** exige autenticação e perfil autorizado.

### 12.3 Publicar

1. Escolha a forma de publicação.
2. Quando o acesso for restrito, marque os perfis autorizados.
3. Na matriz, libere ou bloqueie Visualizar, Exportar e Compartilhar para cada perfil.
4. Selecione **Publicar link**.
5. Use **Copiar link** para distribuição controlada.
6. Para interromper o acesso, selecione **Despublicar**.

Um perfil sem permissão de visualização não abre o painel, mesmo que possua o endereço.

### 12.4 Auditoria e conformidade

A tabela de auditoria informa data e hora, usuário, perfil, ação, entidade e detalhe. Links públicos exigem revisão prévia para impedir exposição de dados pessoais ou sensíveis.

## 13. Assistente

O Assistente pode ser aberto pelo item do menu ou pelo painel flutuante no canto direito.

1. Inicie uma nova consulta.
2. Digite a pergunta em linguagem natural.
3. Confira a resposta e as referências ao contexto da carteira.
4. Para uma sessão longa, abra a página completa.
5. Consulte o histórico para retomar uma conversa.

O Assistente recebe somente dados permitidos para o perfil e para as áreas atuais. Respostas devem ser verificadas antes de decisões formais.

## 14. Configurações

Configurações reúne identidade do portal, experiência de acesso, preferências regionais, segurança de conteúdo, integrações, motor de IA, áreas, matriz de perfil e views personalizadas. O procedimento completo está no [Manual do Administrador/PMO](administrador-pmo.md).

## 15. Limitações da versão demonstrativa

- Os dados da carteira e as configurações são mantidos no navegador.
- A busca em Active Directory e Google Workspace usa registros simulados.
- Alguns botões demonstram pontos de entrada, mas não concluem um fluxo persistente.
- Os links de publicação são demonstrativos.
- Os níveis **Editar tudo** e **Editar conteúdo** são apresentados na governança, mas a interface atual usa a mesma verificação geral de edição para ambos.
- Edição específica de riscos e indicadores atribuídos ao Técnico aparece na matriz de permissões, mas não possui fluxo completo de edição nas respectivas telas.

## 16. Solução de problemas

| Situação | Verificação |
| --- | --- |
| Um item não aparece | Confira o filtro Área, a área de origem, a visibilidade e convites |
| Um valor mostra Sem acesso | Confirme se o perfil atual é Técnico |
| Não é possível editar | Confira perfil, vínculo com a área, convite e nível |
| Não consigo publicar uma atualização | O projeto está em somente leitura para o perfil atual |
| O subelemento não aparece | Expanda o elemento pela seta no início da linha |
| Uma opção de visibilidade está bloqueada | O item pai possui restrição maior |
| A busca não retorna resultado | Digite dois caracteres e confira se o item está no escopo autorizado |
| Configuração voltou ao valor anterior | A alteração não foi salva ou foi cancelada |
| Relatório não abre | Confira publicação, autenticação, perfil e permissão Visualizar |
| Assistente não apresenta um dado | O registro pode estar fora do escopo do perfil ou do filtro de área |
