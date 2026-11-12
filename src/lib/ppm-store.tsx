import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { obterCarteiraCompartilhada, alterarCarteiraCompartilhada, alterarAcessoCompartilhado } from './ppm.functions';
import type { Portfolio, Programa, Projeto, Risco, Indicador, Objetivo } from './ppm-types';
import type { Area, AcessoObjeto, Usuario, EventoAcesso } from './acesso';
import type { ElementoProjeto, AtualizacaoProjeto } from './trabalho-projetos';
import type { ViewPersonalizada } from './views';
import type { ColunaEtiqueta, Etiqueta } from './carteira';
import {carteiraQueryOptions} from './ppm-query';

export type Snapshot = {
  portfolios: Portfolio[]; programas: Programa[]; projetos: Projeto[]; riscos: Risco[]; indicadores: Indicador[]; objetivos: Objetivo[];
  areas: Area[]; objetos: Record<string, AcessoObjeto>; usuarios: Usuario[]; usuario: Usuario;
  log: EventoAcesso[]; elementos: ElementoProjeto[]; atualizacoes: AtualizacaoProjeto[]; views: ViewPersonalizada[];
  etiquetas: Record<ColunaEtiqueta, Etiqueta[]>;
  tarefas: {id:string;projetoId:string;titulo:string;responsavel:string;status:string;pontos:number}[];
  cronograma: {projetoId:string;fase:string;inicio:number;duracao:number;progresso:number}[];
  statusReports: {id:string;projetoId:string;periodo:string;autor:string;saude:Projeto['saude'];resumo:string}[];
  permissoes: Record<string,boolean>; capacidades: string[];
  totais: { portfolios:number;programas:number;projetos:number;orcamento:number;executado:number;progresso:number;riscos_criticos:number };
};

const Context = createContext<Snapshot | null>(null);
type Mutation = {tabela:'portfolios'|'programas'|'projetos'|'areas'|'projeto_elementos'|'projeto_subelementos'|'projeto_atualizacoes'|'views_usuario'|'etiquetas_carteira';acao:'salvar'|'remover';dados:Record<string,unknown>};
let executor: ((data: Mutation) => Promise<unknown>) | undefined;
let acessoExecutor: ((data: {id:string;parcial:Record<string,unknown>}) => Promise<unknown>) | undefined;
export let snapshotAtual: Snapshot | undefined;

export async function gravar(tabela: Mutation['tabela'], dados: Record<string, unknown>, acao: Mutation['acao'] = 'salvar') {
  if (!executor) throw new Error('Aguarde o carregamento dos dados.');
  return executor({tabela,dados,acao});
}
export async function gravarAcesso(id:string,parcial:Record<string,unknown>) {
  if (!acessoExecutor) throw new Error('Aguarde o carregamento dos dados.');
  return acessoExecutor({id,parcial});
}

export function CarteiraCompartilhadaProvider({children}: {children:ReactNode}) {
  const obter = useServerFn(obterCarteiraCompartilhada);
  const alterar = useServerFn(alterarCarteiraCompartilhada);
  const alterarAcesso = useServerFn(alterarAcessoCompartilhado);
  const client = useQueryClient();
  const { data } = useSuspenseQuery(carteiraQueryOptions());
  const atualizar = async () => { await client.invalidateQueries({queryKey:['ppm']}); };
  const mutation = useMutation({mutationFn:(data:Mutation)=>alterar({data}),onSuccess:atualizar,onError:()=>toast.error('Não foi possível salvar. Confira seus vínculos e permissões.')});
  const accessMutation = useMutation({mutationFn:(data:{id:string;parcial:Record<string,unknown>})=>alterarAcesso({data}),onSuccess:atualizar,onError:()=>toast.error('Alteração de acesso não autorizada.')});
  useEffect(()=>{
    executor=mutation.mutateAsync; acessoExecutor=accessMutation.mutateAsync; snapshotAtual=data;
    return ()=>{executor=undefined;acessoExecutor=undefined;snapshotAtual=undefined;};
  },[data,mutation.mutateAsync,accessMutation.mutateAsync]);
  useEffect(()=>{
    const channel=supabase.channel(`ppm-${crypto.randomUUID()}`);
    for (const table of ['portfolios','programas','projetos','riscos','indicadores','indicador_valores','status_reports','projeto_elementos','projeto_subelementos','projeto_atualizacoes','areas','area_membros','objetos_acesso','views_usuario','ppm_papeis','ppm_usuarios']) {
      channel.on('postgres_changes',{event:'*',schema:'public',table},()=>{void client.invalidateQueries({queryKey:['ppm']});});
    }
    channel.subscribe();
    return ()=>{void supabase.removeChannel(channel);};
  },[client]);
  return <Context.Provider value={data}>{children}</Context.Provider>;
}
export function useDadosCompartilhados() {
  const data=useContext(Context);
  if (!data) throw new Error('Os dados compartilhados ainda não estão disponíveis.');
  return data;
}