import type {Perfil} from "./ppm-types";
import {useDadosCompartilhados,gravar} from "./ppm-store";
export type EscopoView = "executiva" | "indicadores";

export type ViewPersonalizada = {
  id: string;
  nome: string;
  escopo: EscopoView;
  blocos: string[];
  perfis: Perfil[];
  /** Filtro de áreas salvo; nunca amplia o acesso de quem visualiza. */
  areas?: string[];
};

export const blocosPorEscopo: Record<EscopoView, { id: string; label: string }[]> = {
  executiva: [
    { id: "kpis", label: "Indicadores-chave" },
    { id: "execucao", label: "Execução orçamentária" },
    { id: "status", label: "Projetos por status" },
    { id: "portfolios", label: "Portfólios institucionais" },
    { id: "riscos", label: "Riscos em destaque" },
    { id: "progresso", label: "Progresso por portfólio" },
    { id: "auditoria", label: "Trilha de auditoria" },
  ],
  indicadores: [
    { id: "kpis", label: "Resumo de metas" },
    { id: "dashboard", label: "Dashboard parametrizável" },
    { id: "cards", label: "Cartões de indicadores" },
  ],
};

export function useViews(escopo?:EscopoView){const {views}=useDadosCompartilhados();return {views:escopo?views.filter(v=>v.escopo===escopo):views,criar:(view:Omit<ViewPersonalizada,"id">)=>gravar("views_usuario",view),remover:(id:string)=>gravar("views_usuario",{id},"remover")};}
