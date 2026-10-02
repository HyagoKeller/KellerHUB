# Configurações compartilhadas e fundo Glassmorphism estático

## O que será corrigido
- Transferir a identidade e as preferências do portal do navegador para o banco do Keller Hub, tornando nome, logos, mensagem, paleta, modo e demais opções iguais em todas as máquinas.
- Manter uma cópia local apenas como contingência de carregamento, nunca mais como fonte principal.
- Aproveitar automaticamente a configuração já salva no navegador do administrador quando ainda não existir uma configuração central.
- Mostrar estados claros de carregamento, salvamento e erro na tela de Configurações.

## Fundo visual
- Remover toda animação das formas e do reflexo dos painéis para eliminar os flashes.
- Manter o Glassmorphism com três formas ovais estáticas, suaves e responsivas, sem movimento em computador ou celular.

## Segurança e acesso
- Permitir leitura pública apenas da identidade necessária à tela de acesso.
- Permitir alterações somente a usuários autenticados com perfil Superadministrador.
- Registrar a alteração na auditoria existente.

## Validação
- Confirmar a identidade na tela de acesso em uma sessão limpa, sem dados locais.
- Confirmar salvamento e recarga em outra sessão.
- Verificar o fundo estático em computador e celular, sem animação, cintilação ou rolagem horizontal.
