// Controle de visibilidade por ÁREA (perfil × escopo de área), inspirado nos workspaces do monday.com.
// Dados de demonstração persistidos neste navegador.
import { useMemo, useSyncExternalStore } from "react";
import { useCarteira } from "@/lib/carteira";
import { indicadores, riscos, type Portfolio, type Programa, type Projeto } from "@/lib/mock-data";

export type PerfilAcesso = "Técnico" | "Gestor" | "Alta Administração" | "Administrador/PMO";
export type VisibilidadeArea = "Aberta" | "Restrita";
export type VisibilidadeObjeto = "publica" | "compartilhada" | "privada";
export type NivelPermissao = "Editar tudo" | "Editar conteúdo" | "Editar só itens atribuídos a mim" | "Somente leitura";
export type PapelArea = "Dono da área" | "Membro";
export type TipoObjeto = "portfolio" | "programa" | "projeto";

export const niveis: NivelPermissao[] = ["Editar tudo", "Editar conteúdo", "Editar só itens atribuídos a mim", "Somente leitura"];
export const rotuloVisibilidade: Record<VisibilidadeObjeto, string> = {
  publica: "Pública na área",
  compartilhada: "Compartilhada",
  privada: "Privada",
};
const peso: Record<VisibilidadeObjeto, number> = { publica: 0, compartilhada: 1, privada: 2 };

export type Usuario = { id: string; nome: string; perfil: PerfilAcesso; iniciais: string; email?: string; cargo?: string; origem?: string };
export type Area = {
  id: string;
  nome: string;
  sigla: string;
  responsavel: string;
  visibilidade: VisibilidadeArea;
  membros: { usuarioId: string; papel: PapelArea }[];
};
export type AcessoObjeto = {
  areaId?: string; // apenas portfólios definem a área; filhos herdam
  visibilidade: VisibilidadeObjeto;
  convidados: { usuarioId: string; nivel: NivelPermissao }[];
  compartilhadoCom: string[];
};
export type EventoAcesso = {
  id: string;
  quando: string;
  usuario: string;
  perfil: string;
  acao: string;
  entidade: string;
  detalhe: string;
};

export const usuarios: Usuario[] = [
  { id: "u-marina", nome: "Marina Alcântara", perfil: "Gestor", iniciais: "MA" },
  { id: "u-ana", nome: "Ana Beatriz Rocha", perfil: "Técnico", iniciais: "AR" },
  { id: "u-nina", nome: "Nina Corrêa", perfil: "Técnico", iniciais: "NC" },
  { id: "u-rodrigo", nome: "Rodrigo Prates", perfil: "Gestor", iniciais: "RP" },
  { id: "u-claudia", nome: "Cláudia Menezes", perfil: "Alta Administração", iniciais: "CM" },
  { id: "u-eduardo", nome: "Eduardo Lins", perfil: "Gestor", iniciais: "EL" },
  { id: "u-felipe", nome: "Felipe Andrade", perfil: "Administrador/PMO", iniciais: "FA" },
];

const areasIniciais: Area[] = [
  { id: "ar-ti", nome: "Tecnologia da Informação", sigla: "TI", responsavel: "Marina Alcântara", visibilidade: "Aberta", membros: [{ usuarioId: "u-marina", papel: "Dono da área" }, { usuarioId: "u-ana", papel: "Membro" }] },
  { id: "ar-infra", nome: "Infraestrutura e Resiliência", sigla: "INFRA", responsavel: "Rodrigo Prates", visibilidade: "Restrita", membros: [{ usuarioId: "u-rodrigo", papel: "Dono da área" }, { usuarioId: "u-nina", papel: "Membro" }] },
  { id: "ar-plan", nome: "Planejamento e Orçamento", sigla: "PLAN", responsavel: "Eduardo Lins", visibilidade: "Aberta", membros: [{ usuarioId: "u-eduardo", papel: "Dono da área" }, { usuarioId: "u-marina", papel: "Membro" }] },
  { id: "ar-gab", nome: "Gabinete", sigla: "GAB", responsavel: "Cláudia Menezes", visibilidade: "Restrita", membros: [{ usuarioId: "u-claudia", papel: "Dono da área" }] },
];

const objetosIniciais: Record<string, AcessoObjeto> = {
  "pf-1": { areaId: "ar-ti", visibilidade: "publica", convidados: [], compartilhadoCom: [] },
  "pf-2": { areaId: "ar-infra", visibilidade: "publica", convidados: [], compartilhadoCom: [] },
  "pf-3": { areaId: "ar-gab", visibilidade: "compartilhada", convidados: [], compartilhadoCom: ["ar-ti"] },
  "pf-4": { areaId: "ar-plan", visibilidade: "publica", convidados: [], compartilhadoCom: [] },
  "pg-3": { visibilidade: "privada", convidados: [{ usuarioId: "u-marina", nivel: "Editar tudo" }, { usuarioId: "u-ana", nivel: "Editar só itens atribuídos a mim" }], compartilhadoCom: [] },
  "pj-9": { visibilidade: "compartilhada", convidados: [], compartilhadoCom: ["ar-ti"] },
  "pj-6": { visibilidade: "privada", convidados: [{ usuarioId: "u-marina", nivel: "Editar conteúdo" }], compartilhadoCom: [] },
};

type Estado = {
  areas: Area[];
  objetos: Record<string, AcessoObjeto>;
  simuladoId: string;
  filtroAreas: string[];
  log: EventoAcesso[];
  importados?: Usuario[];
};
const inicial: Estado = { areas: areasIniciais, objetos: objetosIniciais, simuladoId: "u-marina", filtroAreas: [], log: [] };

const CHAVE = "acesso.areas.v1";
let estado: Estado = inicial;
let carregado = false;
const ouvintes = new Set<() => void>();
function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const b = localStorage.getItem(CHAVE);
    if (b) estado = { ...inicial, ...JSON.parse(b) };
  } catch {
    /* ignora */
  }
}
function definir(fn: (e: Estado) => Estado) {
  carregar();
  estado = fn(estado);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* indisponível */
  }
  ouvintes.forEach((o) => o());
}
function assinar(o: () => void) {
  carregar();
  ouvintes.add(o);
  return () => ouvintes.delete(o);
}
export function useAcessoEstado() {
  return useSyncExternalStore(assinar, () => (carregar(), estado), () => inicial);
}

const agora = () =>
  new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const nid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
export const usuarioPorId = (id: string) => usuarios.find((u) => u.id === id) ?? (carregar(), estado.importados ?? []).find((u) => u.id === id);
export const todosUsuarios = (e: Estado) => [...usuarios, ...(e.importados ?? [])];

function registrar(e: Estado, acao: string, entidade: string, anterior: string, novo: string): EventoAcesso {
  const u = usuarioPorId(e.simuladoId)!;
  return { id: nid("ev"), quando: agora(), usuario: u.nome, perfil: u.perfil, acao, entidade, detalhe: `${anterior || "Não se aplica"} → ${novo || "Não se aplica"}` };
}
const objetoPadrao: AcessoObjeto = { visibilidade: "publica", convidados: [], compartilhadoCom: [] };
export const acessoDe = (e: Estado, id: string): AcessoObjeto => e.objetos[id] ?? objetoPadrao;

export const acesso = {
  simular(usuarioId: string) {
    definir((e) => ({ ...e, simuladoId: usuarioId, filtroAreas: [] }));
  },
  importarUsuario(u: Usuario) {
    definir((e) => {
      if ([...usuarios, ...(e.importados ?? [])].some((x) => x.id === u.id)) return e;
      return { ...e, importados: [...(e.importados ?? []), u], log: [registrar(e, "Importou usuário do diretório", `Usuário · ${u.nome}`, "", `${u.email} · ${u.cargo} · ${u.origem}`), ...e.log] };
    });
  },
  filtrar(areas: string[]) {
    definir((e) => ({ ...e, filtroAreas: areas }));
  },
  salvarArea(a: Omit<Area, "id"> & { id?: string }) {
    definir((e) => {
      const antiga = a.id ? e.areas.find((x) => x.id === a.id) : undefined;
      const area = { ...a, id: a.id ?? nid("ar") } as Area;
      const log = antiga
        ? registrar(e, "Alterou área", `Área · ${area.nome}`, `${antiga.nome} · ${antiga.visibilidade} · ${antiga.membros.length} membros`, `${area.nome} · ${area.visibilidade} · ${area.membros.length} membros`)
        : registrar(e, "Criou área", `Área · ${area.nome}`, "", `${area.sigla} · ${area.visibilidade}`);
      return {
        ...e,
        areas: antiga ? e.areas.map((x) => (x.id === area.id ? area : x)) : [...e.areas, area],
        log: [log, ...e.log],
      };
    });
  },
  atualizarObjeto(id: string, nome: string, parcial: Partial<AcessoObjeto>) {
    definir((e) => {
      const atual = acessoDe(e, id);
      const novo = { ...atual, ...parcial };
      const logs: EventoAcesso[] = [];
      const nomeArea = (x: string) => e.areas.find((a) => a.id === x)?.sigla ?? x;
      const nomeU = (x: string) => usuarioPorId(x)?.nome ?? x;
      if (parcial.visibilidade && parcial.visibilidade !== atual.visibilidade)
        logs.push(registrar(e, "Mudou visibilidade", nome, rotuloVisibilidade[atual.visibilidade], rotuloVisibilidade[novo.visibilidade]));
      if (parcial.areaId && parcial.areaId !== atual.areaId)
        logs.push(registrar(e, "Mudou área de origem", nome, nomeArea(atual.areaId ?? ""), nomeArea(parcial.areaId)));
      if (parcial.compartilhadoCom)
        logs.push(registrar(e, "Compartilhou", nome, atual.compartilhadoCom.map(nomeArea).join(", "), novo.compartilhadoCom.map(nomeArea).join(", ")));
      if (parcial.convidados) {
        for (const c of novo.convidados) {
          const antes = atual.convidados.find((x) => x.usuarioId === c.usuarioId);
          if (!antes) logs.push(registrar(e, "Convidou", nome, "", `${nomeU(c.usuarioId)} · ${c.nivel}`));
          else if (antes.nivel !== c.nivel) logs.push(registrar(e, "Mudou nível de permissão", `${nome} · ${nomeU(c.usuarioId)}`, antes.nivel, c.nivel));
        }
        for (const c of atual.convidados)
          if (!novo.convidados.some((x) => x.usuarioId === c.usuarioId))
            logs.push(registrar(e, "Removeu convite", nome, `${nomeU(c.usuarioId)} · ${c.nivel}`, ""));
      }
      return { ...e, objetos: { ...e.objetos, [id]: novo }, log: [...logs, ...e.log] };
    });
  },
};

// ---------- Regras ----------
type Ctx = { e: Estado; u: Usuario; pf: Portfolio[]; pg: Programa[] };

export function areasDoUsuario(e: Estado, u: Usuario) {
  return e.areas.filter((a) => a.membros.some((m) => m.usuarioId === u.id));
}
const transversal = (u: Usuario) => u.perfil === "Alta Administração" || u.perfil === "Administrador/PMO";

/** Áreas cuja existência o usuário conhece. */
export function areasConhecidas(e: Estado, u: Usuario) {
  if (transversal(u)) return e.areas;
  return e.areas.filter((a) => a.visibilidade === "Aberta" || a.membros.some((m) => m.usuarioId === u.id));
}

function areaDoPortfolio(e: Estado, pfId?: string) {
  return acessoDe(e, pfId ?? "").areaId ?? "ar-ti";
}
function cadeia(c: Ctx, tipo: TipoObjeto, id: string): { ids: string[]; areaId: string } {
  if (tipo === "portfolio") return { ids: [id], areaId: areaDoPortfolio(c.e, id) };
  if (tipo === "programa") {
    const pg = c.pg.find((x) => x.id === id);
    return { ids: [pg?.portfolioId ?? "", id], areaId: areaDoPortfolio(c.e, pg?.portfolioId) };
  }
  return { ids: [], areaId: "" };
}
function cadeiaProjeto(c: Ctx, p: Projeto) {
  const base = cadeia(c, "programa", p.programaId);
  return { ids: [...base.ids, p.id], areaId: base.areaId };
}

function passa(c: Ctx, id: string, areaId: string) {
  const { e, u } = c;
  if (transversal(u)) return true;
  const o = acessoDe(e, id);
  if (o.convidados.some((x) => x.usuarioId === u.id)) return true;
  if (o.visibilidade === "privada") return false;
  const area = e.areas.find((a) => a.id === areaId);
  if (!area) return true;
  if (area.membros.some((m) => m.usuarioId === u.id)) return true;
  const minhas = areasDoUsuario(e, u).map((a) => a.id);
  if (o.visibilidade === "compartilhada" && o.compartilhadoCom.some((x) => minhas.includes(x))) return true;
  return area.visibilidade === "Aberta";
}
function concedido(c: Ctx, id: string) {
  const o = acessoDe(c.e, id);
  const minhas = areasDoUsuario(c.e, c.u).map((a) => a.id);
  return o.convidados.some((x) => x.usuarioId === c.u.id) || (o.visibilidade === "compartilhada" && o.compartilhadoCom.some((x) => minhas.includes(x)));
}
// Um compartilhamento/convite no item dá acesso de leitura ao caminho até ele, exceto se um pai for privado.
const visivel = (c: Ctx, ch: { ids: string[]; areaId: string }) =>
  ch.ids.every((id, i) => passa(c, id, ch.areaId) || (acessoDe(c.e, id).visibilidade !== "privada" && ch.ids.slice(i + 1).some((d) => concedido(c, d)))) &&
  (c.e.filtroAreas.length === 0 || c.e.filtroAreas.includes(ch.areaId));

/** Visibilidade efetiva: o filho nunca é menos restrito que o pai. */
export function visibilidadeEfetiva(e: Estado, ids: string[]): VisibilidadeObjeto {
  return ids.reduce<VisibilidadeObjeto>((m, id) => {
    const v = acessoDe(e, id).visibilidade;
    return peso[v] > peso[m] ? v : m;
  }, "publica");
}
export const maisRestritaQue = (v: VisibilidadeObjeto, pai: VisibilidadeObjeto) => peso[v] >= peso[pai];

function nivel(c: Ctx, ch: { ids: string[]; areaId: string }, tipo: TipoObjeto, responsavel: string): NivelPermissao {
  const { e, u } = c;
  if (u.perfil === "Administrador/PMO") return "Editar tudo";
  if (u.perfil === "Alta Administração") return tipo === "portfolio" ? "Editar tudo" : "Somente leitura";
  const conv = [...ch.ids].reverse().map((id) => acessoDe(e, id).convidados.find((x) => x.usuarioId === u.id)).find(Boolean);
  if (conv) return conv.nivel;
  const membro = e.areas.find((a) => a.id === ch.areaId)?.membros.some((m) => m.usuarioId === u.id);
  if (!membro) return "Somente leitura";
  if (u.perfil === "Gestor") return "Editar tudo";
  return responsavel === u.nome ? "Editar só itens atribuídos a mim" : "Somente leitura";
}
export const podeEditarNivel = (n: NivelPermissao) => n !== "Somente leitura";

/** Carteira filtrada pelo que o usuário atual (ou simulado) pode ver. */
export function useCarteiraVisivel() {
  const cart = useCarteira();
  const e = useAcessoEstado();
  return useMemo(() => {
    const u = usuarioPorId(e.simuladoId) ?? usuarios[0];
    const c: Ctx = { e, u, pf: cart.portfolios, pg: cart.programas };
    const portfolios = cart.portfolios.filter((p) => visivel(c, cadeia(c, "portfolio", p.id)));
    const programas = cart.programas.filter((p) => visivel(c, cadeia(c, "programa", p.id)));
    const projetos = cart.projetos.filter((p) => visivel(c, cadeiaProjeto(c, p)));
    const nomesVisiveis = new Set([...portfolios, ...programas].map((x) => x.nome));
    const nomesTodos = new Set([...cart.portfolios, ...cart.programas].map((x) => x.nome));
    const riscosVisiveis = riscos.filter((r) => !nomesTodos.has(r.origem) || nomesVisiveis.has(r.origem));
    const conhecidas = areasConhecidas(e, u);
    const areasExibidas = e.filtroAreas.length ? conhecidas.filter((a) => e.filtroAreas.includes(a.id)) : conhecidas;
    const idsExibidas = new Set(areasExibidas.map((a) => a.id));
    const areaPorResp = new Map(cart.portfolios.map((p) => [p.responsavel, areaDoPortfolio(e, p.id)]));
    const indicadoresVisiveis = indicadores.filter((i) => idsExibidas.has(areaPorResp.get(i.responsavel) ?? areaDoPortfolio(e, "pf-1")));

    const chave = (tipo: TipoObjeto, id: string) => {
      if (tipo === "projeto") {
        const p = cart.projetos.find((x) => x.id === id);
        return p ? cadeiaProjeto(c, p) : { ids: [id], areaId: "" };
      }
      return cadeia(c, tipo, id);
    };
    const responsavelDe = (tipo: TipoObjeto, id: string) =>
      tipo === "portfolio"
        ? cart.portfolios.find((x) => x.id === id)?.responsavel ?? ""
        : tipo === "programa"
          ? cart.programas.find((x) => x.id === id)?.gerente ?? ""
          : cart.projetos.find((x) => x.id === id)?.gerente ?? "";

    return {
      ...cart,
      portfolios,
      programas,
      projetos,
      riscos: riscosVisiveis,
      indicadores: indicadoresVisiveis,
      usuario: u,
      estado: e,
      areasExibidas,
      ocultarValores: u.perfil === "Técnico",
      podeCriar: u.perfil !== "Técnico",
      nivel: (tipo: TipoObjeto, id: string) => nivel(c, chave(tipo, id), tipo, responsavelDe(tipo, id)),
      podeEditar: (tipo: TipoObjeto, id: string) => podeEditarNivel(nivel(c, chave(tipo, id), tipo, responsavelDe(tipo, id))),
      cadeia: chave,
      areaDe: (tipo: TipoObjeto, id: string) => e.areas.find((a) => a.id === chave(tipo, id).areaId),
      podeAdministrar: u.perfil === "Administrador/PMO",
    };
  }, [cart, e]);
}
