import {useDadosCompartilhados,gravar,snapshotAtual} from "./ppm-store";
export type StatusElemento = "Planejamento" | "Em execução" | "Em risco" | "Bloqueado" | "Concluído";

export type SubelementoProjeto = {
  id: string;
  elementoId: string;
  nome: string;
  responsavel: string;
  status: StatusElemento;
  prazo: string;
  progresso: number;
};

export type ElementoProjeto = {
  id: string;
  projetoId: string;
  nome: string;
  responsavel: string;
  status: StatusElemento;
  prazo: string;
  progresso: number;
  subelementos: SubelementoProjeto[];
};

export type AlvoAtualizacao = "projeto" | "elemento" | "subelemento";

export type AtualizacaoProjeto = {
  id: string;
  projetoId: string;
  alvoTipo: AlvoAtualizacao;
  alvoId: string;
  autor: string;
  criadaEm: string;
  texto: string;
};


export function useTrabalhoProjetos(){return useDadosCompartilhados();}
export const trabalhoProjetos={
 salvarElemento:(item:Omit<ElementoProjeto,"id"|"subelementos"> & {id?:string})=>gravar("projeto_elementos",item),
 removerElemento:(id:string)=>gravar("projeto_elementos",{id},"remover"),
 salvarSubelemento:(elementoId:string,item:Omit<SubelementoProjeto,"id"|"elementoId"> & {id?:string})=>gravar("projeto_subelementos",{...item,elementoId,projetoId:snapshotAtual?.elementos.find(e=>e.id===elementoId)?.projetoId}),
 removerSubelemento:(_elementoId:string,id:string)=>gravar("projeto_subelementos",{id},"remover"),
 publicarAtualizacao:(dados:Omit<AtualizacaoProjeto,"id"|"criadaEm">)=>gravar("projeto_atualizacoes",dados),
};
export const statusElementos:StatusElemento[]=["Planejamento","Em execução","Em risco","Bloqueado","Concluído"];
