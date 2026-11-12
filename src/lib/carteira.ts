import { useDadosCompartilhados, gravar, snapshotAtual } from "./ppm-store";
import type {Portfolio,Programa,Projeto} from "./ppm-types";
export type TomEtiqueta = "azul" | "verde" | "amarelo" | "vermelho" | "roxo" | "cinza" | "ciano";
export type Etiqueta = { id: string; nome: string; tom: TomEtiqueta };
export type ColunaEtiqueta = "metodologia" | "status" | "tipo";

export const tonsEtiqueta: TomEtiqueta[] = ["azul", "verde", "amarelo", "vermelho", "roxo", "ciano", "cinza"];

export const classeTom: Record<TomEtiqueta, string> = {
  azul: "border-primary/45 bg-primary/20 text-primary",
  verde: "border-success/45 bg-success/20 text-success",
  amarelo: "border-warning/45 bg-warning/20 text-warning",
  vermelho: "border-destructive/45 bg-destructive/20 text-destructive",
  roxo: "border-accent/45 bg-accent/25 text-accent-foreground",
  ciano: "border-info/45 bg-info/20 text-info",
  cinza: "border-border bg-muted text-muted-foreground",
};

export const pontoTom: Record<TomEtiqueta, string> = {
  azul: "bg-primary",
  verde: "bg-success",
  amarelo: "bg-warning",
  vermelho: "bg-destructive",
  roxo: "bg-accent",
  ciano: "bg-info",
  cinza: "bg-muted-foreground",
};


export function useCarteira(){return useDadosCompartilhados();}
export const carteira={
 salvarProjeto:(p:Omit<Projeto,"id"> & {id?:string})=>gravar("projetos",p),
 atualizarProjeto:(id:string,parcial:Partial<Projeto>)=>gravar("projetos",{...snapshotAtual?.projetos.find(x=>x.id===id),...parcial,id}),
 removerProjeto:(id:string)=>gravar("projetos",{id},"remover"),
 salvarPortfolio:(p:Omit<Portfolio,"id"> & {id?:string})=>gravar("portfolios",p),
 atualizarPortfolio:(id:string,parcial:Partial<Portfolio>)=>gravar("portfolios",{...snapshotAtual?.portfolios.find(x=>x.id===id),...parcial,id}),
 removerPortfolio:(id:string)=>gravar("portfolios",{id},"remover"),
 salvarPrograma:(p:Omit<Programa,"id"> & {id?:string})=>gravar("programas",p),
 removerPrograma:(id:string)=>gravar("programas",{id},"remover"),
 salvarEtiquetas:(coluna:ColunaEtiqueta,lista:Etiqueta[],renomes:Record<string,string>)=>gravar("etiquetas_carteira",{coluna,lista,renomes}),
};
export const portfolioDe=(p:Projeto,lista:Portfolio[])=>lista.find(x=>x.id===snapshotAtual?.programas.find(g=>g.id===p.programaId)?.portfolioId);
export const novoIdEtiqueta=()=>crypto.randomUUID();
