import { useSyncExternalStore } from "react";
import {
  portfolios as portfoliosIniciais,
  programas as programasIniciais,
  type Programa,
  projetos as projetosIniciais,
  type Portfolio,
  type Projeto,
} from "@/lib/mock-data";

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

type Estado = {
  projetos: Projeto[];
  portfolios: Portfolio[];
  programas: Programa[];
  etiquetas: Record<ColunaEtiqueta, Etiqueta[]>;
};

const et = (nome: string, tom: TomEtiqueta): Etiqueta => ({ id: nome, nome, tom });

const inicial: Estado = {
  projetos: projetosIniciais,
  portfolios: portfoliosIniciais,
  programas: programasIniciais,
  etiquetas: {
    metodologia: [et("PMBOK", "cinza"), et("Ágil", "ciano"), et("Híbrida", "roxo")],
    status: [
      et("Planejamento", "cinza"),
      et("Em execução", "azul"),
      et("Em risco", "vermelho"),
      et("Suspenso", "amarelo"),
      et("Concluído", "verde"),
    ],
    tipo: [et("Institucional", "azul"), et("Temático", "roxo")],
  },
};

const CHAVE = "carteira.v1";
let estado: Estado = inicial;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) estado = { ...inicial, ...JSON.parse(bruto) };
  } catch {
    /* ignora dados corrompidos */
  }
}

function definir(fn: (e: Estado) => Estado) {
  carregar();
  estado = fn(estado);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* armazenamento indisponível */
  }
  ouvintes.forEach((o) => o());
}

function assinar(o: () => void) {
  carregar();
  ouvintes.add(o);
  return () => ouvintes.delete(o);
}

export function useCarteira() {
  return useSyncExternalStore(
    assinar,
    () => {
      carregar();
      return estado;
    },
    () => inicial,
  );
}

const novoId = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const carteira = {
  salvarProjeto(p: Omit<Projeto, "id"> & { id?: string }) {
    definir((e) => {
      if (p.id && e.projetos.some((x) => x.id === p.id))
        return { ...e, projetos: e.projetos.map((x) => (x.id === p.id ? (p as Projeto) : x)) };
      return { ...e, projetos: [...e.projetos, { ...p, id: novoId("pj") } as Projeto] };
    });
  },
  atualizarProjeto(id: string, parcial: Partial<Projeto>) {
    definir((e) => ({ ...e, projetos: e.projetos.map((x) => (x.id === id ? { ...x, ...parcial } : x)) }));
  },
  removerProjeto(id: string) {
    definir((e) => ({ ...e, projetos: e.projetos.filter((x) => x.id !== id) }));
  },
  salvarPortfolio(p: Omit<Portfolio, "id"> & { id?: string }) {
    definir((e) => {
      if (p.id && e.portfolios.some((x) => x.id === p.id))
        return { ...e, portfolios: e.portfolios.map((x) => (x.id === p.id ? (p as Portfolio) : x)) };
      return { ...e, portfolios: [...e.portfolios, { ...p, id: novoId("pf") } as Portfolio] };
    });
  },
  atualizarPortfolio(id: string, parcial: Partial<Portfolio>) {
    definir((e) => ({ ...e, portfolios: e.portfolios.map((x) => (x.id === id ? { ...x, ...parcial } : x)) }));
  },
  removerPortfolio(id: string) {
    definir((e) => ({ ...e, portfolios: e.portfolios.filter((x) => x.id !== id) }));
  },
  salvarPrograma(p: Omit<Programa, "id"> & { id?: string }) {
    definir((e) => {
      if (p.id && e.programas.some((x) => x.id === p.id))
        return { ...e, programas: e.programas.map((x) => (x.id === p.id ? (p as Programa) : x)) };
      return { ...e, programas: [...e.programas, { ...p, id: novoId("pg") } as Programa] };
    });
  },
  removerPrograma(id: string) {
    definir((e) => ({ ...e, programas: e.programas.filter((x) => x.id !== id) }));
  },
  salvarEtiquetas(coluna: ColunaEtiqueta, lista: Etiqueta[], renomes: Record<string, string>) {
    definir((e) => {
      const campo = coluna;
      const ren = (v: string) => renomes[v] ?? v;
      return {
        ...e,
        etiquetas: { ...e.etiquetas, [coluna]: lista },
        projetos:
          campo === "tipo"
            ? e.projetos
            : e.projetos.map((p) => ({ ...p, [campo]: ren(p[campo]) })),
        portfolios: campo === "tipo" ? e.portfolios.map((p) => ({ ...p, tipo: ren(p.tipo) })) : e.portfolios,
      };
    });
  },
};

export const portfolioDe = (p: Projeto, lista: Portfolio[]) => {
  carregar();
  const pg = estado.programas.find((x) => x.id === p.programaId);
  return lista.find((x) => x.id === pg?.portfolioId);
};

export const novoIdEtiqueta = () => novoId("et");
