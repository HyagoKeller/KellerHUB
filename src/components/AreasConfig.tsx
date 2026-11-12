import { useState } from "react";
import { Lock, Pencil, Plus, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelTitle, Tag } from "@/components/ui-kit";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BuscaDiretorio } from "@/components/BuscaDiretorio";
import { acesso, acessoDe, todosUsuarios, useAcessoEstado, useCarteiraVisivel, usuarioPorId, type Area, type PapelArea } from "@/lib/acesso";
import { useCarteira } from "@/lib/carteira";

const matriz: { recurso: string; tecnico: string; gestor: string; alta: string; pmo: string }[] = [
  { recurso: "Projetos e cronogramas", tecnico: "Editar · próprios itens", gestor: "Editar · minhas áreas", alta: "Ler · todas as áreas", pmo: "Editar · todas as áreas" },
  { recurso: "Portfólios e priorização", tecnico: "Ler · minhas áreas", gestor: "Editar · minhas áreas", alta: "Editar · todas as áreas", pmo: "Editar · todas as áreas" },
  { recurso: "Indicadores e metas", tecnico: "Editar · próprios itens", gestor: "Editar · minhas áreas", alta: "Ler · todas as áreas", pmo: "Editar · todas as áreas" },
  { recurso: "Riscos e planos de resposta", tecnico: "Editar · próprios itens", gestor: "Editar · minhas áreas", alta: "Ler · todas as áreas", pmo: "Editar · todas as áreas" },
  { recurso: "Itens compartilhados com minha área", tecnico: "Ler · áreas compartilhadas", gestor: "Ler · áreas compartilhadas", alta: "Ler · todas as áreas", pmo: "Ler · todas as áreas" },
  { recurso: "Orçamento e valores em R$", tecnico: "Oculto", gestor: "Ler · minhas áreas", alta: "Ler · todas as áreas", pmo: "Ler · todas as áreas" },
  { recurso: "Relatórios executivos e exportações", tecnico: "Sem acesso", gestor: "Gerar · minhas áreas", alta: "Gerar · todas as áreas", pmo: "Gerar · todas as áreas" },
  { recurso: "Trilha de auditoria e LGPD", tecnico: "Sem acesso", gestor: "Ler · minhas áreas", alta: "Ler · todas as áreas", pmo: "Ler · todas as áreas" },
  { recurso: "Áreas, membros e visibilidade", tecnico: "Sem acesso", gestor: "Sem acesso", alta: "Sem acesso", pmo: "Administrar" },
  { recurso: "Integrações e configurações", tecnico: "Sem acesso", gestor: "Sem acesso", alta: "Sem acesso", pmo: "Administrar" },
];

function Celula({ v }: { v: string }) {
  const [acao, escopo] = v.split(" · ");
  if (!escopo) return <span className="text-xs text-muted-foreground">{acao}</span>;
  return (
    <span className="flex flex-col gap-1">
      <span className="text-xs font-medium text-foreground">{acao}</span>
      <span className="w-fit rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{escopo}</span>
    </span>
  );
}

export function SegmentacaoPerfil() {
  return (
    <Panel className="mt-4" rule="accent">
      <PanelTitle title="Segmentação por perfil" hint="permissão efetiva = perfil × escopo de área" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Recurso", "Técnico", "Gestor", "Alta Administração", "Administrador/PMO"].map((h) => (
                <th key={h} className="eyebrow pb-3 pr-4 text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matriz.map((r) => (
              <tr key={r.recurso} className="border-b border-border/60">
                <td className="py-3 pr-4 text-sm">{r.recurso}</td>
                <td className="py-3 pr-4"><Celula v={r.tecnico} /></td>
                <td className="py-3 pr-4"><Celula v={r.gestor} /></td>
                <td className="py-3 pr-4"><Celula v={r.alta} /></td>
                <td className="py-3 pr-4"><Celula v={r.pmo} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

type Rascunho = Omit<Area, "id"> & { id?: string };
const vazio: Rascunho = { nome: "", sigla: "", responsavel: "", visibilidade: "Aberta", membros: [] };

export function AreasConfig() {
  const e = useAcessoEstado();
  const cart = useCarteira();
  const { podeAdministrar } = useCarteiraVisivel();
  const [form, setForm] = useState<Rascunho | null>(null);

  const projetosDaArea = (areaId: string) =>
    cart.projetos.filter((p) => {
      const pg = cart.programas.find((x) => x.id === p.programaId);
      return (acessoDe(e, pg?.portfolioId ?? "").areaId ?? "ar-ti") === areaId;
    }).length;

  const salvar = async () => {
    if (!form) return;
    if (form.nome.trim().length < 3 || form.sigla.trim().length < 2 || !form.responsavel) {
      toast.error("Informe nome, sigla e responsável.");
      return;
    }
    try { await acesso.salvarArea({ ...form, nome: form.nome.trim(), sigla: form.sigla.trim().toUpperCase().slice(0, 10) });
    toast.success("Área salva e registrada na auditoria.");
    setForm(null); } catch {toast.error("Não foi possível salvar a área.");}
  };
  const alternarMembro = (uid: string) =>
    form && setForm({ ...form, membros: form.membros.some((m) => m.usuarioId === uid) ? form.membros.filter((m) => m.usuarioId !== uid) : [...form.membros, { usuarioId: uid, papel: "Membro" }] });
  const adicionarDoDiretorio = (p: { id: string; nome: string; email: string; cargo: string }, origem: string) => {
    if (!form) return;
    acesso.importarUsuario({ id: p.id, nome: p.nome, email: p.email, cargo: p.cargo, origem, perfil: "Técnico", iniciais: p.nome.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase() });
    if (!form.membros.some((m) => m.usuarioId === p.id)) setForm({ ...form, membros: [...form.membros, { usuarioId: p.id, papel: "Membro" }] });
    toast.success(`${p.nome} adicionado(a) à área.`);
  };
  const usuarios = todosUsuarios(e);
  const mudarPapel = (uid: string, papel: PapelArea) =>
    form && setForm({ ...form, membros: form.membros.map((m) => (m.usuarioId === uid ? { ...m, papel } : m)) });

  return (
    <Panel className="mt-4" rule="accent">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <PanelTitle title="Áreas" hint="workspaces de visibilidade" />
        {podeAdministrar ? (
          <button onClick={() => setForm(vazio)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Nova área
          </button>
        ) : (
          <span className="text-[11px] text-muted-foreground">Somente o Administrador/PMO cria e edita áreas.</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Área", "Sigla", "Responsável", "Visibilidade", "Membros", "Projetos", ""].map((h) => (
                <th key={h} className="eyebrow pb-3 pr-4 text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.areas.map((a) => (
              <tr key={a.id} className="border-b border-border/60">
                <td className="py-3 pr-4 font-medium">{a.nome}</td>
                <td className="py-3 pr-4 text-xs text-muted-foreground">{a.sigla}</td>
                <td className="py-3 pr-4 text-xs">{a.responsavel}</td>
                <td className="py-3 pr-4">
                  <Tag tom={a.visibilidade === "Aberta" ? "success" : "accent"}>
                    <span className="inline-flex items-center gap-1">{a.visibilidade === "Aberta" ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}{a.visibilidade}</span>
                  </Tag>
                </td>
                <td className="num py-3 pr-4 text-xs">{a.membros.length}</td>
                <td className="num py-3 pr-4 text-xs">{projetosDaArea(a.id)}</td>
                <td className="py-3 pr-2">
                  {podeAdministrar && (
                    <button aria-label={`Editar ${a.nome}`} onClick={() => setForm(a)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form?.id ? "Editar área" : "Nova área"}</DialogTitle>
            <DialogDescription>Defina quem pertence à área e se ela é aberta à organização ou restrita aos membros.</DialogDescription>
          </DialogHeader>
          {form && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <label className="space-y-1.5"><span className="text-xs text-muted-foreground">Nome</span>
                  <input maxLength={80} value={form.nome} onChange={(ev) => setForm({ ...form, nome: ev.target.value })} className="h-9 w-full rounded-md border border-border bg-transparent px-3" /></label>
                <label className="space-y-1.5"><span className="text-xs text-muted-foreground">Sigla</span>
                  <input maxLength={10} value={form.sigla} onChange={(ev) => setForm({ ...form, sigla: ev.target.value })} className="h-9 w-full rounded-md border border-border bg-transparent px-3" /></label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5"><span className="text-xs text-muted-foreground">Responsável</span>
                  <select value={form.responsavel} onChange={(ev) => setForm({ ...form, responsavel: ev.target.value })} className="h-9 w-full rounded-md border border-border bg-transparent px-2">
                    <option value="">Selecione…</option>
                    {usuarios.map((u) => <option key={u.id}>{u.nome}</option>)}
                  </select></label>
                <div className="space-y-1.5"><span className="text-xs text-muted-foreground">Visibilidade</span>
                  <div className="flex gap-2">
                    {(["Aberta", "Restrita"] as const).map((v) => (
                      <button key={v} onClick={() => setForm({ ...form, visibilidade: v })} className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${form.visibilidade === v ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{v}</button>
                    ))}
                  </div></div>
              </div>

              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">Membros</p>
                <ul className="max-h-60 divide-y divide-border/60 overflow-y-auto rounded-lg border border-border">
                  {usuarios.map((u) => {
                    const m = form.membros.find((x) => x.usuarioId === u.id);
                    return (
                      <li key={u.id} className="flex items-center justify-between gap-2 px-3 py-2">
                        <label className="flex min-w-0 items-center gap-2">
                          <input type="checkbox" checked={!!m} onChange={() => alternarMembro(u.id)} />
                          <span className="min-w-0"><span className="block truncate">{u.nome}</span>
                            {u.email && <span className="block truncate text-[11px] text-muted-foreground">{u.email} · {u.cargo}</span>}</span>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{u.perfil}</span>
                        </label>
                        {m && (
                          <select value={m.papel} onChange={(ev) => mudarPapel(u.id, ev.target.value as PapelArea)} className="h-8 rounded-md border border-border bg-transparent px-1.5 text-xs">
                            <option>Dono da área</option>
                            <option>Membro</option>
                          </select>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setForm(null)} className="rounded-md border border-border px-3 py-2 text-xs">Cancelar</button>
                <button onClick={salvar} className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Salvar área</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {usuarioPorId(e.simuladoId) && null}
    </Panel>
  );
}
