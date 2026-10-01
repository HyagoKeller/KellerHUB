import { useSyncExternalStore } from "react";

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

type EstadoTrabalho = {
  elementos: ElementoProjeto[];
  atualizacoes: AtualizacaoProjeto[];
};

const elementosIniciais: ElementoProjeto[] = [
  {
    id: "el-pj1-1",
    projetoId: "pj-1",
    nome: "Catálogo de serviços digitais",
    responsavel: "Larissa Duarte",
    status: "Em execução",
    prazo: "2026-09-18",
    progresso: 68,
    subelementos: [
      { id: "sub-pj1-1", elementoId: "el-pj1-1", nome: "Revisar jornadas prioritárias", responsavel: "Bruno Sales", status: "Concluído", prazo: "2026-08-22", progresso: 100 },
      { id: "sub-pj1-2", elementoId: "el-pj1-1", nome: "Homologar catálogo com as áreas", responsavel: "Larissa Duarte", status: "Em execução", prazo: "2026-09-12", progresso: 55 },
    ],
  },
  {
    id: "el-pj1-2",
    projetoId: "pj-1",
    nome: "Integração com autenticação Gov.br",
    responsavel: "Tiago Ferraz",
    status: "Em risco",
    prazo: "2026-10-02",
    progresso: 42,
    subelementos: [
      { id: "sub-pj1-3", elementoId: "el-pj1-2", nome: "Executar testes de carga", responsavel: "Marcos Tenório", status: "Bloqueado", prazo: "2026-09-26", progresso: 30 },
    ],
  },
  {
    id: "el-pj3-1",
    projetoId: "pj-3",
    nome: "Ingestão das bases prioritárias",
    responsavel: "Tiago Ferraz",
    status: "Em execução",
    prazo: "2026-10-10",
    progresso: 48,
    subelementos: [
      { id: "sub-pj3-1", elementoId: "el-pj3-1", nome: "Validar qualidade cadastral", responsavel: "Helena Vaz", status: "Em risco", prazo: "2026-09-30", progresso: 36 },
    ],
  },
  {
    id: "el-pj7-1",
    projetoId: "pj-7",
    nome: "Migração do ambiente financeiro",
    responsavel: "Rodrigo Prates",
    status: "Em execução",
    prazo: "2026-09-25",
    progresso: 78,
    subelementos: [],
  },
];

const atualizacoesIniciais: AtualizacaoProjeto[] = [
  { id: "at-1", projetoId: "pj-1", alvoTipo: "projeto", alvoId: "pj-1", autor: "Larissa Duarte", criadaEm: "2026-09-29T14:20:00.000Z", texto: "A homologação da primeira onda foi concluída. A equipe iniciou os ajustes apontados pelas áreas participantes." },
  { id: "at-2", projetoId: "pj-1", alvoTipo: "elemento", alvoId: "el-pj1-1", autor: "Bruno Sales", criadaEm: "2026-09-30T17:10:00.000Z", texto: "As jornadas de maior demanda foram revisadas e encaminhadas para validação do gestor." },
  { id: "at-3", projetoId: "pj-1", alvoTipo: "subelemento", alvoId: "sub-pj1-3", autor: "Marcos Tenório", criadaEm: "2026-10-01T11:35:00.000Z", texto: "Os testes aguardam a liberação da nova versão do ambiente de homologação." },
  { id: "at-4", projetoId: "pj-3", alvoTipo: "projeto", alvoId: "pj-3", autor: "Tiago Ferraz", criadaEm: "2026-09-28T16:00:00.000Z", texto: "A curadoria identificou inconsistências em duas bases. O plano de correção está em execução." },
];

const inicial: EstadoTrabalho = { elementos: elementosIniciais, atualizacoes: atualizacoesIniciais };
const CHAVE = "keller-hub.trabalho-projetos.v1";
let estado = inicial;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) estado = { ...inicial, ...JSON.parse(salvo) };
  } catch {
    /* Mantém os dados demonstrativos quando o armazenamento estiver indisponível. */
  }
}

function definir(fn: (atual: EstadoTrabalho) => EstadoTrabalho) {
  carregar();
  estado = fn(estado);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* Mantém a sessão ativa quando o armazenamento estiver indisponível. */
  }
  ouvintes.forEach((ouvir) => ouvir());
}

function assinar(ouvir: () => void) {
  carregar();
  ouvintes.add(ouvir);
  return () => ouvintes.delete(ouvir);
}

const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function useTrabalhoProjetos() {
  return useSyncExternalStore(assinar, () => (carregar(), estado), () => inicial);
}

export const trabalhoProjetos = {
  salvarElemento(item: Omit<ElementoProjeto, "id" | "subelementos"> & { id?: string }) {
    definir((e) => {
      if (item.id) return { ...e, elementos: e.elementos.map((x) => x.id === item.id ? { ...x, ...item } : x) };
      return { ...e, elementos: [...e.elementos, { ...item, id: novoId("el"), subelementos: [] }] };
    });
  },
  removerElemento(id: string) {
    definir((e) => ({
      elementos: e.elementos.filter((x) => x.id !== id),
      atualizacoes: e.atualizacoes.filter((x) => x.alvoId !== id && !e.elementos.find((el) => el.id === id)?.subelementos.some((sub) => sub.id === x.alvoId)),
    }));
  },
  salvarSubelemento(elementoId: string, item: Omit<SubelementoProjeto, "id" | "elementoId"> & { id?: string }) {
    definir((e) => ({
      ...e,
      elementos: e.elementos.map((el) => el.id !== elementoId ? el : {
        ...el,
        subelementos: item.id
          ? el.subelementos.map((sub) => sub.id === item.id ? { ...sub, ...item, elementoId } : sub)
          : [...el.subelementos, { ...item, id: novoId("sub"), elementoId }],
      }),
    }));
  },
  removerSubelemento(elementoId: string, id: string) {
    definir((e) => ({
      elementos: e.elementos.map((el) => el.id === elementoId ? { ...el, subelementos: el.subelementos.filter((sub) => sub.id !== id) } : el),
      atualizacoes: e.atualizacoes.filter((x) => x.alvoId !== id),
    }));
  },
  publicarAtualizacao(dados: Omit<AtualizacaoProjeto, "id" | "criadaEm">) {
    definir((e) => ({ ...e, atualizacoes: [{ ...dados, id: novoId("at"), criadaEm: new Date().toISOString() }, ...e.atualizacoes] }));
  },
};

export const statusElementos: StatusElemento[] = ["Planejamento", "Em execução", "Em risco", "Bloqueado", "Concluído"];