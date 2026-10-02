# Proteger a configuração do Gemini interno

## Resultado
- Manter o Gemini como opção interna do Keller Hub, com endpoint e modelo definidos no servidor.
- Usar `GEMINI_API_KEY` somente no ambiente seguro, sem expor a chave no navegador ou no código.
- Exigir a senha atual do Superadministrador antes de salvar qualquer alteração no motor de IA.

## Implementação
- Remover do navegador os campos de endpoint, modelo e nome do segredo quando o Gemini interno estiver selecionado.
- Criar uma operação protegida que confirma a sessão, o papel Superadministrador e a senha atual antes de persistir a configuração.
- Guardar a configuração ativa no banco com acesso restrito e trilha mínima de atualização.
- Fazer o assistente ler a configuração persistida no servidor, sem aceitar parâmetros de provedor enviados pelo navegador.
- Tratar chave ausente ou inválida com mensagem segura e objetiva.

## Validação
- Confirmar que senha incorreta não salva alterações.
- Confirmar que a senha correta salva e permanece após recarregar.
- Testar uma resposta real do Gemini interno e verificar que nenhuma credencial aparece no navegador.
- Validar a tela em computador e celular, além das verificações de segurança e compilação.
