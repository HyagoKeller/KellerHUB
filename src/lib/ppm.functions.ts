import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const obterCarteiraCompartilhada = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc('ppm_snapshot');
    if (error) throw new Error('Não foi possível carregar os dados compartilhados.');
    return data;
  });

export const alterarCarteiraCompartilhada = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    tabela: z.enum(['portfolios', 'programas', 'projetos', 'areas', 'projeto_elementos', 'projeto_subelementos', 'projeto_atualizacoes', 'views_usuario', 'etiquetas_carteira']),
    acao: z.enum(['salvar', 'remover']),
    dados: z.record(z.unknown()),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc('ppm_mutar', {
      tabela: data.tabela, acao: data.acao, dados: data.dados as never,
    });
    if (error) throw new Error(error.code === '42501' ? 'Seu perfil não permite esta alteração.' : 'Não foi possível salvar. Confira os campos, vínculos e permissões.');
    return result;
  });

export const alterarAcessoCompartilhado = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), parcial: z.record(z.unknown()) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc('ppm_alterar_acesso', { objeto: data.id, parcial: data.parcial as never });
    if (error) throw new Error('Seu perfil não permite alterar este acesso ou o vínculo informado é inválido.');
    return { saved: true };
  });