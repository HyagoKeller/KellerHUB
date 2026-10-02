# Pacote completo de proteção do Keller Hub

## Resultado
- Identificar visualmente cada acesso com uma marca d’água discreta contendo usuário, data e identificador da sessão.
- Exigir aceite dos termos de uso e da licença antes de liberar a área autenticada.
- Registrar eventos importantes em uma trilha de auditoria protegida e consultável.
- Reforçar as fronteiras técnicas para reduzir exposição, automação de cópia e alterações não autorizadas.

## Experiência do usuário
- Exibir um termo obrigatório no primeiro acesso e sempre que a versão jurídica mudar.
- Manter a marca d’água em todas as telas autenticadas e também na impressão, sem impedir a leitura.
- Mostrar ao Administrador uma visão de segurança com usuário, ação, data, resultado e contexto, sem revelar senhas, chaves ou conteúdo sensível.
- Informar claramente que copiar, redistribuir, fazer engenharia reversa ou compartilhar credenciais viola a licença de uso.

## Proteção técnica
- Criar registros persistentes para aceite de termos e auditoria, com acesso protegido por usuário e administração.
- Validar no servidor a identidade e a permissão para aceitar termos, registrar eventos e consultar auditoria.
- Registrar acesso autenticado, aceite de termos, alterações de configuração, uso do assistente, exportações e ações administrativas relevantes.
- Adicionar limites contra repetição abusiva nas operações mais sensíveis, além de cabeçalhos de segurança contra incorporação em outros sites, interpretação indevida de conteúdo e vazamento de origem.
- Preservar no servidor as configurações de IA e demais segredos. O navegador nunca receberá chaves privadas.
- Revisar os pontos que ainda usam armazenamento local. Dados demonstrativos permanecerão locais nesta etapa, mas serão tratados como não sigilosos e identificados como uma limitação até a migração completa da carteira para o banco.
- Corrigir ou isolar dependências vulneráveis quando houver uma versão compatível disponível, validando que a aplicação continua funcional.

## Auditoria e privacidade
- Aplicar retenção mínima e evitar gravar senhas, tokens, prompts completos, dados financeiros detalhados ou informações pessoais desnecessárias.
- Restringir a consulta consolidada da auditoria ao responsável autorizado.
- Registrar endereço de rede somente de forma minimizada e contexto técnico sem identificação excessiva.
- Atualizar os manuais com responsabilidades do cliente, proibição de compartilhamento de conta e limites reais da proteção contra cópia.

## Validação
- Confirmar que um usuário sem aceite não acessa as telas internas.
- Confirmar que o aceite permanece após recarregar e que uma nova versão exige novo aceite.
- Confirmar que a marca d’água aparece em computador, celular e impressão.
- Confirmar que usuários comuns não conseguem ler a auditoria de terceiros.
- Testar tentativas sem sessão, repetição abusiva, incorporação em iframe e acesso direto às operações protegidas.
- Executar verificações de segurança, dependências, compilação e testes das principais jornadas autenticadas.

## Limite importante
Nenhum aplicativo web consegue impedir totalmente capturas de tela, fotografias ou cópia do código visual já entregue a um usuário autorizado. Este pacote aumenta dissuasão, rastreabilidade e controle de acesso. A proteção jurídica e contratual complementa a proteção técnica.
