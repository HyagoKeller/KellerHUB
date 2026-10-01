import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Eye, Layers, Lock, Search, Share2, UserPlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  acesso,
  acessoDe,
  areasConhecidas,
  maisRestritaQue,
  niveis,
  rotuloVisibilidade,
  useAcessoEstado,
  useCarteiraVisivel,
  usuarioPorId,
  usuarios,
  visibilidadeEfetiva,
  type NivelPermissao,
  type TipoObjeto,
  type VisibilidadeObjeto,
} from "@/lib/acesso";
import { moeda } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Valor monetário: oculto ("Sem acesso" com cadeado) para o perfil Técnico. */
export function Moeda({ v }: { v: number }) {
  const e = useAcessoEstado();
  if (usuarioPorId(e.simuladoId)?.perfil === "Técnico")
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground" title="Valor restrito ao seu perfil">
        <Lock className="h-3 w-3" />Sem acesso
      </span>
    );
  return <>{moeda(v)}</>;
}

export function SeloAcesso({ tipo, id }: { tipo: TipoObjeto; id: string }) {
  const { estado, cadeia } = useCarteiraVisivel();
  const ch = cadeia(tipo, id);
  const v = visibilidadeEfetiva(estado, ch.ids);
  if (v === "publica") return null;
  if (v === "privada")
    return (
      <span title="Privado (somente convidados) veem" className="inline-flex shrink-0 text-warning">
        <Lock className="h-3.5 w-3.5" />
      </span>
    );
  const areas = [...new Set(ch.ids.flatMap((x) => acessoDe(estado, x).compartilhadoCom))]
    .map((a) => estado.areas.find((x) => x.id === a)?.nome)
    .filter(Boolean)
    .join(", ");
  return (
    <span title={`Compartilhado (somente leitura) com: ${areas || "nenhuma área"}`} className="inline-flex shrink-0 text-info">
      <Share2 className="h-3.5 w-3.5" />
    </span>
  );
}

export function AvisoAreas() {
  const { areasExibidas, usuario } = useCarteiraVisivel();
  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-border/70 bg-card/40 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
      <Eye className="h-3 w-3" />
      Exibindo dados de {areasExibidas.length} {areasExibidas.length === 1 ? "área" : "áreas"} · {usuario.perfil}
    </p>
  );
}

export function SeletorArea() {
  const e = useAcessoEstado();
  const u = usuarioPorId(e.simuladoId) ?? usuarios[0];
  const lista = areasConhecidas(e, u);
  const sel = e.filtroAreas;
  const alternar = (id: string) => acesso.filtrar(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  const rotulo = sel.length === 0 ? "Todas as minhas áreas" : sel.length === 1 ? lista.find((a) => a.id === sel[0])?.sigla : `${sel.length} áreas`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="glass-control flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium" aria-label="Filtrar por área">
          <Layers className="h-4 w-4 text-primary" />
          <span className="hidden max-w-36 truncate sm:inline">Área: {rotulo}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <button onClick={() => acesso.filtrar([])} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted">
          Todas as minhas áreas {sel.length === 0 && <Check className="h-4 w-4 text-primary" />}
        </button>
        <div className="my-1 h-px bg-border" />
        {lista.map((a) => (
          <button key={a.id} onClick={() => alternar(a.id)} className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted">
            <span className="min-w-0">
              <span className="block truncate">{a.nome}</span>
              <span className="text-[11px] text-muted-foreground">{a.sigla} · {a.visibilidade}</span>
            </span>
            {sel.includes(a.id) && <Check className="h-4 w-4 shrink-0 text-primary" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function SimularPerfil() {
  const e = useAcessoEstado();
  const u = usuarioPorId(e.simuladoId) ?? usuarios[0];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="glass-control flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:border-primary/50">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success text-[11px] font-semibold text-success-foreground">{u.iniciais}</div>
          <div className="hidden min-w-0 text-left leading-tight sm:block">
            <p className="truncate text-xs font-medium text-foreground">{u.nome}</p>
            <p className="eyebrow truncate text-muted-foreground">{u.perfil}</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2">
        <p className="eyebrow px-2 py-1.5 text-muted-foreground">Simular perfil/área</p>
        {usuarios.map((x) => {
          const areas = e.areas.filter((a) => a.membros.some((m) => m.usuarioId === x.id)).map((a) => a.sigla);
          return (
            <button key={x.id} onClick={() => acesso.simular(x.id)} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-[10px] font-semibold">{x.iniciais}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{x.nome}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{x.perfil} · {areas.join(", ") || "transversal"}</span>
              </span>
              {x.id === u.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function BuscaGlobal() {
  const { projetos, portfolios, programas, riscos } = useCarteiraVisivel();
  const [q, setQ] = useState("");
  const res = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    const m = (s: string) => s.toLowerCase().includes(t);
    return [
      ...portfolios.filter((p) => m(p.nome)).map((p) => ({ k: p.id, n: p.nome, t: "Portfólio", to: "/portfolios" as const })),
      ...programas.filter((p) => m(p.nome)).map((p) => ({ k: p.id, n: p.nome, t: "Programa", to: "/programas" as const })),
      ...projetos.filter((p) => m(p.nome)).map((p) => ({ k: p.id, n: p.nome, t: "Projeto", to: "/projetos/$id" as const, id: p.id })),
      ...riscos.filter((r) => m(r.nome)).map((r) => ({ k: r.id, n: r.nome, t: "Risco", to: "/riscos" as const })),
    ].slice(0, 8);
  }, [q, portfolios, programas, projetos, riscos]);
  return (
    <div className="relative hidden md:block md:w-80">
      <div className="glass-control flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 transition-colors focus-within:border-primary">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar projetos, riscos, indicadores…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        {q && <button onClick={() => setQ("")} aria-label="Limpar"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
      </div>
      {q.trim().length >= 2 && (
        <div className="panel absolute left-0 right-0 top-full z-30 mt-2 p-1.5">
          {res.length === 0 && <p className="px-2 py-2 text-xs text-muted-foreground">Nenhum item visível para o seu acesso.</p>}
          {res.map((r) => (
            <Link key={r.k} to={r.to} params={"id" in r ? { id: r.id } : undefined} onClick={() => setQ("")} className="flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
              <span className="truncate">{r.n}</span>
              <span className="eyebrow shrink-0 text-muted-foreground">{r.t}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const visOpcoes: VisibilidadeObjeto[] = ["publica", "compartilhada", "privada"];

/** Aba "Acesso" de Portfólio, Programa e Projeto. */
export function PainelAcesso({ tipo, id, nome }: { tipo: TipoObjeto; id: string; nome: string }) {
  const { estado, cadeia, nivel, usuario, areaDe } = useCarteiraVisivel();
  const ch = cadeia(tipo, id);
  const o = acessoDe(estado, id);
  const pai = visibilidadeEfetiva(estado, ch.ids.slice(0, -1));
  const area = areaDe(tipo, id);
  const podeGerir = nivel(tipo, id) === "Editar tudo" || usuario.perfil === "Administrador/PMO";
  const [convidar, setConvidar] = useState("");
  const rotulo = `${tipo === "portfolio" ? "Portfólio" : tipo === "programa" ? "Programa" : "Projeto"} · ${nome}`;
  const upd = (p: Parameters<typeof acesso.atualizarObjeto>[2]) => acesso.atualizarObjeto(id, rotulo, p);
  const membros = area?.membros ?? [];

  return (
    <div className="space-y-5 text-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-1.5 text-muted-foreground">Área de origem</p>
          {tipo === "portfolio" && podeGerir ? (
            <select value={o.areaId ?? area?.id} onChange={(e) => upd({ areaId: e.target.value })} className="h-9 w-full rounded-md border border-border bg-transparent px-2">
              {estado.areas.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          ) : (
            <p className="font-medium">{area?.nome} <span className="text-xs text-muted-foreground">· herdada</span></p>
          )}
        </div>
        <div>
          <p className="eyebrow mb-1.5 text-muted-foreground">Seu nível</p>
          <p className="font-medium">{nivel(tipo, id)}</p>
        </div>
      </div>

      <div>
        <p className="eyebrow mb-1.5 text-muted-foreground">Visibilidade</p>
        <div className="flex flex-wrap gap-2">
          {visOpcoes.map((v) => {
            const bloqueada = !maisRestritaQue(v, pai);
            return (
              <button key={v} disabled={!podeGerir || bloqueada} onClick={() => upd({ visibilidade: v })}
                title={bloqueada ? "O item não pode ser menos restrito que o pai" : undefined}
                className={cn("rounded-md border px-3 py-1.5 text-xs font-semibold disabled:opacity-40", o.visibilidade === v ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground")}>
                {rotuloVisibilidade[v]}
              </button>
            );
          })}
        </div>
        {pai !== "publica" && <p className="mt-1.5 text-[11px] text-muted-foreground">Herda do item pai: {rotuloVisibilidade[pai]}.</p>}
      </div>

      <div>
        <p className="eyebrow mb-1.5 text-muted-foreground">Compartilhar com área (somente leitura)</p>
        <div className="flex flex-wrap gap-2">
          {estado.areas.filter((a) => a.id !== area?.id).map((a) => {
            const on = o.compartilhadoCom.includes(a.id);
            return (
              <button key={a.id} disabled={!podeGerir} onClick={() => upd({ compartilhadoCom: on ? o.compartilhadoCom.filter((x) => x !== a.id) : [...o.compartilhadoCom, a.id], ...(on || o.visibilidade !== "publica" ? {} : { visibilidade: "compartilhada" }) })}
                className={cn("inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs disabled:opacity-50", on ? "border-info/50 bg-info/15 text-info" : "border-border text-muted-foreground")}>
                <Share2 className="h-3 w-3" />{a.sigla}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2 text-muted-foreground">Membros da área e convidados</p>
        <ul className="divide-y divide-border/60 rounded-lg border border-border">
          {membros.map((m) => (
            <li key={m.usuarioId} className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="truncate">{usuarioPorId(m.usuarioId)?.nome}</span>
              <span className="text-xs text-muted-foreground">{m.papel} · área</span>
            </li>
          ))}
          {o.convidados.map((c) => (
            <li key={c.usuarioId} className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="truncate">{usuarioPorId(c.usuarioId)?.nome} <span className="text-[11px] text-muted-foreground">convidado</span></span>
              <span className="flex items-center gap-1">
                <select disabled={!podeGerir} value={c.nivel} onChange={(e) => upd({ convidados: o.convidados.map((x) => x.usuarioId === c.usuarioId ? { ...x, nivel: e.target.value as NivelPermissao } : x) })} className="h-8 rounded-md border border-border bg-transparent px-1.5 text-xs">
                  {niveis.map((n) => <option key={n}>{n}</option>)}
                </select>
                {podeGerir && <button aria-label="Remover convite" onClick={() => upd({ convidados: o.convidados.filter((x) => x.usuarioId !== c.usuarioId) })} className="rounded p-1 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>}
              </span>
            </li>
          ))}
        </ul>
        {podeGerir && (
          <div className="mt-2 flex gap-2">
            <select value={convidar} onChange={(e) => setConvidar(e.target.value)} className="h-9 min-w-0 flex-1 rounded-md border border-border bg-transparent px-2">
              <option value="">Selecione um usuário…</option>
              {usuarios.filter((x) => !o.convidados.some((c) => c.usuarioId === x.id)).map((x) => <option key={x.id} value={x.id}>{x.nome} · {x.perfil}</option>)}
            </select>
            <button disabled={!convidar} onClick={() => { upd({ convidados: [...o.convidados, { usuarioId: convidar, nivel: "Somente leitura" }] }); setConvidar(""); }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50">
              <UserPlus className="h-3.5 w-3.5" /> Convidar
            </button>
          </div>
        )}
        {!podeGerir && <p className="mt-2 text-[11px] text-muted-foreground">Seu nível não permite alterar o acesso deste item.</p>}
      </div>
    </div>
  );
}

export function DialogoAcesso({ tipo, id, nome, onClose }: { tipo: TipoObjeto; id?: string; nome?: string; onClose: () => void }) {
  return (
    <Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Acesso · {nome}</DialogTitle>
          <DialogDescription>Área de origem, visibilidade, convidados e compartilhamentos. Toda alteração vai para a trilha de auditoria.</DialogDescription>
        </DialogHeader>
        {id && nome && <PainelAcesso tipo={tipo} id={id} nome={nome} />}
      </DialogContent>
    </Dialog>
  );
}

export function BotaoAcesso({ onClick, nome }: { onClick: () => void; nome: string }) {
  return (
    <button aria-label={`Acesso de ${nome}`} title="Acesso" onClick={onClick} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
      <Lock className="h-4 w-4" />
    </button>
  );
}
