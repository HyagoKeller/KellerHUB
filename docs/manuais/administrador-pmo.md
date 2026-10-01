# Manual do Administrador e PMO

## Finalidade do perfil

O perfil **Administrador/PMO** governa a estrutura do Keller Hub. Ele administra áreas, membros, visibilidade, integrações, identidade do portal, views e o motor do Assistente.

## Acesso concedido

- Visão transversal de todas as áreas, inclusive as restritas.
- Visualização de todos os portfólios, programas e projetos.
- Edição completa dos itens da carteira.
- Criação de portfólios, programas e projetos.
- Visualização dos valores orçamentários e executados.
- Administração de áreas, membros e integrações.
- Consulta da trilha de auditoria.

## Configuração inicial recomendada

### 1. Configurar a identidade do portal

1. Abra **Configurações**.
2. Informe o nome da organização.
3. Selecione ou envie a logo institucional.
4. Defina a mensagem e a logo da tela de início de sessão.
5. Escolha paleta, modo claro ou escuro e preferências regionais.
6. Clique em **Salvar**. Se sair sem salvar ou clicar em **Cancelar**, o Keller Hub mantém os valores anteriores.

### 2. Configurar segurança de conteúdo

Em **Configurações**, revise:

- tamanho máximo de arquivo em MB;
- extensões proibidas;
- sites permitidos, inclusive padrões com curingas;
- idioma, fuso horário, localização e formato monetário.

### 3. Criar uma área

1. Abra **Configurações** e acesse **Áreas**.
2. Selecione **Nova área**.
3. Informe nome, sigla e responsável.
4. Defina a visibilidade:
   - **Aberta:** qualquer pessoa da organização pode identificar a área e ler seus itens públicos;
   - **Restrita:** somente membros e perfis transversais sabem que a área existe.
5. Inclua os membros e defina quem será **Dono da área**.
6. Salve a área.

### 4. Buscar pessoas no diretório

1. Abra uma área para edição.
2. Em **Buscar no diretório**, escolha **Active Directory** ou **Google Workspace**.
3. Se necessário, filtre pela unidade organizacional.
4. Pesquise por nome, e-mail ou cargo.
5. Confira nome, e-mail e cargo do resultado.
6. Selecione **Adicionar**.
7. Ajuste o papel da pessoa para **Membro** ou **Dono da área**.
8. Salve a área.

Na versão demonstrativa, a consulta usa pessoas e unidades simuladas. A conexão institucional exige acesso administrativo ao diretório correspondente.

### 5. Vincular a carteira às áreas

1. Abra um portfólio.
2. Use o controle de acesso para definir a área de origem.
3. Revise a visibilidade do portfólio.
4. Confira os programas e projetos subordinados, que herdam esse escopo.
5. Restrinja um filho somente quando houver necessidade formal.

## Controle de acesso de um item

No cadeado do portfólio, programa ou projeto, o administrador pode:

- manter o item público na área;
- torná-lo privado para convidados;
- compartilhá-lo com áreas específicas em somente leitura;
- convidar uma pessoa individualmente;
- conceder **Editar tudo**, **Editar conteúdo**, **Editar só itens atribuídos a mim** ou **Somente leitura**.

O Keller Hub impede que um item filho fique menos restrito que seu item pai.

## Integrações e Assistente

Em **Configurações**, o administrador pode ativar integrações institucionais, selecionar o motor do Assistente e optar por credenciais próprias. Alterações do motor somente entram em vigor após **Salvar**. O uso de serviço externo exige autorização expressa para envio de dados e uma credencial guardada de forma segura.

## Views personalizadas

O administrador pode criar views para a Visão executiva e para Indicadores. A view padrão não é alterada. Uma view personalizada nunca amplia a permissão de quem a consulta.

## Auditoria

A trilha registra operações de governança, incluindo:

- criação e alteração de áreas;
- importação de usuários do diretório;
- mudança de área de origem;
- mudança de visibilidade;
- compartilhamentos;
- convites, remoções e alteração de nível.

Revise periodicamente os eventos, com atenção a áreas restritas, itens privados e permissões de edição completa.

## Checklist de concessão de acesso

- Confirmar o perfil funcional da pessoa.
- Vincular somente as áreas necessárias.
- Usar convite individual apenas para exceções justificadas.
- Preferir somente leitura em compartilhamentos entre áreas.
- Validar o resultado usando a simulação de perfil e área.
- Conferir a trilha de auditoria após a alteração.
