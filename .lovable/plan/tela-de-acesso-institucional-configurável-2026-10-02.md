# Tela de acesso institucional configurável

## O que será construído
- Reorganizar a página inicial de acesso seguindo a composição da referência: identidade e mensagem à esquerda, formulário de acesso à direita, em uma superfície central Liquid Glass.
- Manter o fundo e a linguagem visual do Keller Hub, sem reutilizar a imagem da referência.
- Adaptar a composição para celular, com identidade acima do formulário.

## Configurações refletidas na tela
- Aplicar automaticamente o nome da organização, a logo da organização, a logo de início de sessão, a mensagem de boas-vindas, a paleta e o modo claro ou escuro já salvos.
- Adicionar a configuração do tipo de acesso: Local, Active Directory ou Microsoft 365.
- Para Local e Active Directory, exibir usuário ou e-mail e senha.
- Para Microsoft 365, ocultar o formulário local e exibir um botão institucional cujo texto poderá ser personalizado nas configurações.
- Manter Local como método ativo agora e deixar Microsoft 365 apenas preparado, sem habilitar autenticação real.

## Validação
- Confirmar salvamento e persistência das novas opções.
- Verificar a tela de acesso em computador e celular, incluindo logos, textos longos e alternância simulada entre os três métodos.
- Confirmar que o acesso local atual continua funcionando e que a publicação permanece pausada.

## Detalhes técnicos
- As preferências continuarão no armazenamento de demonstração já usado pela identidade do portal.
- A opção Microsoft 365 preparada mostrará seu estado de configuração, mas não fará autenticação até a integração ser habilitada futuramente.
