# Manual de governança de acessos

## 1. Objetivo

Este manual orienta concessão, validação, revisão e revogação de acessos no Keller Hub. A autorização combina perfil funcional, escopo de área, visibilidade do item e exceções individuais.

## 2. Conceitos

### 2.1 Perfil

O perfil define quais ações uma pessoa pode executar.

| Perfil | Finalidade |
| --- | --- |
| Técnico | Execução operacional de itens sob sua responsabilidade |
| Gestor | Gestão da carteira nas áreas das quais participa |
| Alta Administração | Supervisão estratégica transversal |
| Administrador/PMO | Administração da solução e da governança |

### 2.2 Área

A área define sobre quais dados o perfil pode atuar. Cada área possui nome, sigla, responsável, visibilidade e membros.

- **Aberta:** qualquer pessoa da organização pode conhecer a área e consultar itens públicos.
- **Restrita:** somente membros e perfis transversais conhecem a área.

A associação de uma pessoa à área usa um dos papéis:

- **Dono da área:** referência de governança da área.
- **Membro:** participante da área.

Na versão atual, os dois papéis registram o vínculo. A capacidade de edição também depende do perfil.

### 2.3 Visibilidade do item

- **Pública na área:** segue o alcance da área de origem.
- **Compartilhada:** permite leitura por áreas específicas.
- **Privada:** permite acesso somente a convidados e perfis transversais.

### 2.4 Convite individual

O convite individual cria uma exceção nominal com um nível explícito. Deve ser usado apenas quando o vínculo por área não atende à necessidade.

### 2.5 Níveis

| Nível | Definição funcional |
| --- | --- |
| Editar tudo | Alterar conteúdo, estrutura e configuração |
| Editar conteúdo | Alterar informações de trabalho sem governar estrutura |
| Editar só itens atribuídos a mim | Alterar o trabalho sob responsabilidade da pessoa |
| Somente leitura | Consultar sem modificar |

**Comportamento atual:** a interface diferencia leitura de edição. Os níveis Editar tudo e Editar conteúdo ainda não possuem bloqueios separados em todos os campos.

## 3. Fórmula da permissão efetiva

A decisão considera, nesta ordem:

1. O item está dentro de uma área conhecida pelo usuário?
2. O item ou algum item pai está privado?
3. Existe compartilhamento com uma das áreas da pessoa?
4. Existe convite individual na cadeia?
5. O perfil permite a ação solicitada?
6. O filtro Área mantém a área de origem selecionada?

A tela nunca deve usar a carteira bruta para listas, totais ou indicadores. O conjunto exibido é sempre a carteira filtrada pelas regras de acesso.

## 4. Herança

A cadeia é:

**Portfólio > Programa > Projeto**

- O portfólio define a área de origem.
- O programa herda a área do portfólio.
- O projeto herda a área do programa.
- Um filho pode ser mais restrito que o pai.
- Um filho nunca pode ser menos restrito que o pai.

Exemplo: se o portfólio é privado, um projeto não pode ser tornado público. A opção incompatível fica bloqueada.

## 5. Matriz operacional

| Recurso | Técnico | Gestor | Alta Administração | Administrador/PMO |
| --- | --- | --- | --- | --- |
| Carteira visível | Áreas próprias, áreas abertas e compartilhamentos | Áreas próprias, áreas abertas e compartilhamentos | Todas as áreas | Todas as áreas |
| Portfólios | Leitura | Edição nas áreas membro | Edição transversal | Edição transversal |
| Programas | Leitura ou edição por convite | Edição nas áreas membro | Leitura | Edição transversal |
| Projetos | Edição quando responsável ou convidado | Edição nas áreas membro | Leitura | Edição transversal |
| Riscos e indicadores | Matriz prevê edição dos próprios itens | Gestão no escopo | Leitura transversal | Gestão transversal |
| Valores monetários | Sem acesso | Visível | Visível | Visível |
| Áreas e membros | Sem acesso | Sem acesso | Sem acesso | Administrar |
| Integrações e portal | Sem acesso | Sem acesso | Sem acesso | Administrar |

## 6. Procedimento de concessão

### 6.1 Levantamento

1. Identifique a função da pessoa.
2. Determine o perfil mínimo necessário.
3. Liste as áreas necessárias.
4. Identifique itens privados que exigem exceção.
5. Registre a justificativa conforme a política institucional.

### 6.2 Vinculação à área

1. Entre em **Configurações**.
2. Localize **Áreas**.
3. Abra a área pelo ícone de edição.
4. Marque a pessoa na lista de membros ou busque no diretório.
5. Defina **Membro** ou **Dono da área**.
6. Selecione **Salvar área**.

### 6.3 Exceção por item

1. Abra Portfólios, Programas ou Projetos.
2. Selecione o cadeado do item.
3. Em **Membros da área e convidados**, escolha a pessoa.
4. Selecione **Convidar**.
5. Ajuste o nível necessário.
6. Confira a trilha de auditoria.

## 7. Configurar acesso de um item

O painel de acesso apresenta:

- **Área de origem:** editável no portfólio por quem pode gerir.
- **Seu nível:** resultado atual da autorização.
- **Visibilidade:** Pública na área, Compartilhada ou Privada.
- **Compartilhar com área:** áreas destinatárias em leitura.
- **Membros da área:** pessoas vinculadas à área de origem.
- **Convidados:** exceções individuais e seus níveis.

Toda alteração gera registro de auditoria na versão demonstrativa.

## 8. Cenários práticos

### 8.1 Gestor da TI edita projeto de TI

Condição: o Gestor é membro da área TI, o projeto não está privado contra ele e a área está no filtro. Resultado: Editar tudo.

### 8.2 Gestor da TI recebe projeto da Infraestrutura

Condição: o projeto foi compartilhado com TI. Resultado: Somente leitura. Para editar, é necessário convite individual com nível superior.

### 8.3 Técnico responsável por projeto

Condição: o Técnico é membro da área e seu nome corresponde ao gerente ou responsável do item. Resultado: Editar só itens atribuídos a mim. Os valores monetários continuam ocultos.

### 8.4 Alta Administração consulta área restrita

Resultado: acesso transversal de leitura. Em portfólios, o perfil pode editar priorização e dados do portfólio. Programas e projetos permanecem em leitura, salvo convite.

### 8.5 Administrador/PMO

Resultado: acesso transversal e Editar tudo. Pode administrar área, visibilidade, compartilhamento, convites, identidade e integrações.

## 9. Validação por simulação

1. Abra o controle do usuário no topo.
2. Selecione a pessoa que representa o perfil a testar.
3. Observe perfil e áreas exibidos.
4. Teste **Todas as minhas áreas**.
5. Teste uma área específica.
6. Verifique busca, listas, totais, valores e botões de edição.
7. Abra um item privado e um compartilhado.
8. Retorne ao usuário administrativo ao finalizar.

## 10. Revisão periódica

A revisão deve ocorrer em mudança de lotação, função, projeto, contrato ou desligamento.

Checklist:

- Perfil funcional continua adequado.
- Áreas vinculadas continuam necessárias.
- Donos de área continuam responsáveis.
- Convites individuais têm justificativa vigente.
- Itens privados ainda precisam dessa classificação.
- Compartilhamentos entre áreas continuam necessários.
- Permissões Editar tudo foram reduzidas quando possível.
- Eventos de auditoria não indicam alteração indevida.

## 11. Revogação

1. Remova a pessoa das áreas desnecessárias.
2. Remova convites individuais em portfólios, programas e projetos.
3. Transfira itens atribuídos e responsabilidades.
4. Confirme que não existem compartilhamentos indiretos relevantes.
5. Simule o usuário e valide que os dados deixaram de aparecer.
6. Registre a conclusão conforme a política institucional.

## 12. Proteção de dados

- Aplique finalidade, necessidade e menor privilégio.
- Não publique dados pessoais em link público.
- Não distribua conteúdo de área restrita fora dos canais autorizados.
- Trate relatórios exportados segundo sua classificação.
- O perfil Técnico não visualiza orçamento ou valor executado.
- Motores externos de IA exigem autorização expressa antes do envio de dados.
