import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SeletorEtiqueta } from "@/components/EtiquetaCelula";
import { carteira, useCarteira } from "@/lib/carteira";
import { objetivos, type Portfolio, type Programa, type Projeto, type Saude } from "@/lib/mock-data";

const saudes: { v: Saude; l: string }[] = [
  { v: "verde", l: "Saudável" },
  { v: "amarelo", l: "Atenção" },
  { v: "vermelho", l: "Crítico" },
];

function Campo({ label, children, erro }: { label: string; children: ReactNode; erro?: string }) {
  return (
    <label className="block min-w-0 space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {erro && <span className="block text-[11px] text-destructive">{erro}</span>}
    </label>
  );
}

const inputCls = "h-9 w-full rounded-md border border-border bg-transparent px-3 text-sm";

const esquemaProjeto = z
  .object({
    nome: z.string().trim().min(3, "Mínimo de 3 caracteres").max(120),
    gerente: z.string().trim().min(2, "Informe o gerente").max(80),
    programaId: z.string().min(1, "Cadastre ou selecione um programa"),
    metodologia: z.string().min(1, "Selecione"),
    status: z.string().min(1, "Selecione"),
    inicio: z.string().min(1, "Informe a data"),
    fim: z.string().min(1, "Informe a data"),
    orcamento: z.number().min(0).max(1e12),
    executado: z.number().min(0).max(1e12),
    progresso: z.number().min(0).max(100),
  })
  .refine((d) => d.fim >= d.inicio, { path: ["fim"], message: "Término antes do início" });

const vazioProjeto = (): Omit<Projeto, "id"> => ({
  nome: "",
  programaId: "",
  gerente: "",
  metodologia: "Ágil",
  status: "Planejamento",
  progresso: 0,
  saude: "verde",
  inicio: new Date().toISOString().slice(0, 10),
  fim: new Date(Date.now() + 180 * 864e5).toISOString().slice(0, 10),
  orcamento: 0,
  executado: 0,
  objetivoId: objetivos[0]?.id ?? "",
});

export function FormProjeto({
  aberto,
  onClose,
  projeto,
}: {
  aberto: boolean;
  onClose: () => void;
  projeto?: Projeto;
}) {
  const { programas } = useCarteira();
  const [d, setD] = useState<Omit<Projeto, "id"> & { id?: string }>(vazioProjeto());
  const [erros, setErros] = useState<Record<string, string>>({});
  useEffect(() => {
    if (aberto) {
      setD(projeto ? { ...projeto } : { ...vazioProjeto(), programaId: programas[0]?.id ?? "" });
      setErros({});
    }
  }, [aberto, projeto]);
  const set = <K extends keyof Projeto>(k: K, v: Projeto[K]) => setD((x) => ({ ...x, [k]: v }));

  const salvar = () => {
    const r = esquemaProjeto.safeParse(d);
    if (!r.success) {
      setErros(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    carteira.salvarProjeto({ ...d, ...r.data });
    toast.success(projeto ? "Projeto atualizado" : "Projeto cadastrado");
    onClose();
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="panel max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{projeto ? "Editar projeto" : "Novo projeto"}</DialogTitle>
          <DialogDescription>Escopo, prazo, custo e etiquetas do projeto.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo label="Nome do projeto" erro={erros.nome}>
              <input className={inputCls} value={d.nome} maxLength={120} onChange={(e) => set("nome", e.target.value)} />
            </Campo>
          </div>
          <Campo label="Programa" erro={erros.programaId}>
            <select className={inputCls} value={d.programaId} onChange={(e) => set("programaId", e.target.value)}>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Gerente" erro={erros.gerente}>
            <input className={inputCls} value={d.gerente} maxLength={80} onChange={(e) => set("gerente", e.target.value)} />
          </Campo>
          <Campo label="Metodologia" erro={erros.metodologia}>
            <SeletorEtiqueta coluna="metodologia" valor={d.metodologia} onChange={(v) => set("metodologia", v)} />
          </Campo>
          <Campo label="Status" erro={erros.status}>
            <SeletorEtiqueta coluna="status" valor={d.status} onChange={(v) => set("status", v)} />
          </Campo>
          <Campo label="Início" erro={erros.inicio}>
            <input type="date" className={inputCls} value={d.inicio} onChange={(e) => set("inicio", e.target.value)} />
          </Campo>
          <Campo label="Término" erro={erros.fim}>
            <input type="date" className={inputCls} value={d.fim} onChange={(e) => set("fim", e.target.value)} />
          </Campo>
          <Campo label="Orçamento (R$)" erro={erros.orcamento}>
            <input type="number" min={0} className={inputCls} value={d.orcamento} onChange={(e) => set("orcamento", Number(e.target.value))} />
          </Campo>
          <Campo label="Executado (R$)" erro={erros.executado}>
            <input type="number" min={0} className={inputCls} value={d.executado} onChange={(e) => set("executado", Number(e.target.value))} />
          </Campo>
          <Campo label={`Progresso: ${d.progresso}%`}>
            <input type="range" min={0} max={100} className="w-full" value={d.progresso} onChange={(e) => set("progresso", Number(e.target.value))} />
          </Campo>
          <Campo label="Saúde">
            <select className={inputCls} value={d.saude} onChange={(e) => set("saude", e.target.value as Saude)}>
              {saudes.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </Campo>
        </div>
        <Rodape onCancel={onClose} onSave={salvar} onDelete={projeto ? () => { carteira.removerProjeto(projeto.id); toast.success("Projeto excluído"); onClose(); } : undefined} />
      </DialogContent>
    </Dialog>
  );
}

const esquemaPortfolio = z.object({
  nome: z.string().trim().min(3, "Mínimo de 3 caracteres").max(120),
  responsavel: z.string().trim().min(2, "Informe o responsável").max(80),
  tipo: z.string().min(1, "Selecione"),
  orcamento: z.number().min(0).max(1e12),
  executado: z.number().min(0).max(1e12),
  progresso: z.number().min(0).max(100),
  score: z.number().min(0).max(100),
});

export function FormPortfolio({
  aberto,
  onClose,
  portfolio,
}: {
  aberto: boolean;
  onClose: () => void;
  portfolio?: Portfolio;
}) {
  const { portfolios } = useCarteira();
  const vazio = (): Omit<Portfolio, "id"> => ({
    nome: "", tipo: "Institucional", responsavel: "", orcamento: 0, executado: 0, progresso: 0,
    saude: "verde", prioridade: portfolios.length + 1, score: 50, programas: 0, projetos: 0, riscosCriticos: 0,
  });
  const [d, setD] = useState<Omit<Portfolio, "id"> & { id?: string }>(vazio());
  const [erros, setErros] = useState<Record<string, string>>({});
  useEffect(() => {
    if (aberto) {
      setD(portfolio ? { ...portfolio } : vazio());
      setErros({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, portfolio]);
  const set = <K extends keyof Portfolio>(k: K, v: Portfolio[K]) => setD((x) => ({ ...x, [k]: v }));

  const salvar = () => {
    const r = esquemaPortfolio.safeParse(d);
    if (!r.success) {
      setErros(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    carteira.salvarPortfolio({ ...d, ...r.data });
    toast.success(portfolio ? "Portfólio atualizado" : "Portfólio cadastrado");
    onClose();
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="panel max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{portfolio ? "Editar portfólio" : "Novo portfólio"}</DialogTitle>
          <DialogDescription>Dados de priorização, orçamento e responsabilidade.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo label="Nome do portfólio" erro={erros.nome}>
              <input className={inputCls} value={d.nome} maxLength={120} onChange={(e) => set("nome", e.target.value)} />
            </Campo>
          </div>
          <Campo label="Responsável" erro={erros.responsavel}>
            <input className={inputCls} value={d.responsavel} maxLength={80} onChange={(e) => set("responsavel", e.target.value)} />
          </Campo>
          <Campo label="Tipo" erro={erros.tipo}>
            <SeletorEtiqueta coluna="tipo" valor={d.tipo} onChange={(v) => set("tipo", v)} />
          </Campo>
          <Campo label="Orçamento (R$)">
            <input type="number" min={0} className={inputCls} value={d.orcamento} onChange={(e) => set("orcamento", Number(e.target.value))} />
          </Campo>
          <Campo label="Executado (R$)">
            <input type="number" min={0} className={inputCls} value={d.executado} onChange={(e) => set("executado", Number(e.target.value))} />
          </Campo>
          <Campo label={`Progresso: ${d.progresso}%`}>
            <input type="range" min={0} max={100} className="w-full" value={d.progresso} onChange={(e) => set("progresso", Number(e.target.value))} />
          </Campo>
          <Campo label={`Score de priorização: ${d.score}`}>
            <input type="range" min={0} max={100} className="w-full" value={d.score} onChange={(e) => set("score", Number(e.target.value))} />
          </Campo>
          <Campo label="Saúde">
            <select className={inputCls} value={d.saude} onChange={(e) => set("saude", e.target.value as Saude)}>
              {saudes.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </Campo>
          <Campo label="Riscos críticos">
            <input type="number" min={0} className={inputCls} value={d.riscosCriticos} onChange={(e) => set("riscosCriticos", Math.max(0, Number(e.target.value)))} />
          </Campo>
        </div>
        <Rodape onCancel={onClose} onSave={salvar} onDelete={portfolio ? () => { carteira.removerPortfolio(portfolio.id); toast.success("Portfólio excluído"); onClose(); } : undefined} />
      </DialogContent>
    </Dialog>
  );
}

const esquemaPrograma = z.object({
  nome: z.string().trim().min(3, "Mínimo de 3 caracteres").max(120),
  gerente: z.string().trim().min(2, "Informe o gerente").max(80),
  portfolioId: z.string().min(1, "Selecione o portfólio"),
  objetivo: z.string().trim().min(3, "Descreva o objetivo").max(300),
  progresso: z.number().min(0).max(100),
});

type Meta = Programa["metas"][number];

export function FormPrograma({ aberto, onClose, programa }: { aberto: boolean; onClose: () => void; programa?: Programa }) {
  const { portfolios } = useCarteira();
  const vazio = (): Omit<Programa, "id"> => ({
    nome: "", portfolioId: portfolios[0]?.id ?? "", gerente: "", objetivo: "", progresso: 0, saude: "verde", metas: [],
  });
  const [d, setD] = useState<Omit<Programa, "id"> & { id?: string }>(vazio());
  const [erros, setErros] = useState<Record<string, string>>({});
  useEffect(() => {
    if (aberto) {
      setD(programa ? { ...programa, metas: programa.metas.map((m) => ({ ...m })) } : vazio());
      setErros({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, programa]);
  const set = <K extends keyof Programa>(k: K, v: Programa[K]) => setD((x) => ({ ...x, [k]: v }));
  const setMeta = (i: number, parcial: Partial<Meta>) =>
    setD((x) => ({ ...x, metas: x.metas.map((m, j) => (j === i ? { ...m, ...parcial } : m)) }));

  const salvar = () => {
    const r = esquemaPrograma.safeParse(d);
    if (!r.success) {
      setErros(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    const metas = d.metas
      .filter((m) => m.nome.trim())
      .map((m) => ({ ...m, nome: m.nome.trim().slice(0, 80), alvo: Math.max(1, m.alvo), atual: Math.max(0, m.atual) }));
    carteira.salvarPrograma({ ...d, ...r.data, metas });
    toast.success(programa ? "Programa atualizado" : "Programa cadastrado");
    onClose();
  };

  return (
    <Dialog open={aberto} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="panel max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{programa ? "Editar programa" : "Novo programa"}</DialogTitle>
          <DialogDescription>Objetivo, responsável, portfólio e metas do programa.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo label="Nome do programa" erro={erros.nome}>
              <input className={inputCls} value={d.nome} maxLength={120} onChange={(e) => set("nome", e.target.value)} />
            </Campo>
          </div>
          <Campo label="Portfólio" erro={erros.portfolioId}>
            <select className={inputCls} value={d.portfolioId} onChange={(e) => set("portfolioId", e.target.value)}>
              {portfolios.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </Campo>
          <Campo label="Gerente" erro={erros.gerente}>
            <input className={inputCls} value={d.gerente} maxLength={80} onChange={(e) => set("gerente", e.target.value)} />
          </Campo>
          <div className="sm:col-span-2">
            <Campo label="Objetivo" erro={erros.objetivo}>
              <input className={inputCls} value={d.objetivo} maxLength={300} onChange={(e) => set("objetivo", e.target.value)} />
            </Campo>
          </div>
          <Campo label={`Progresso: ${d.progresso}%`}>
            <input type="range" min={0} max={100} className="w-full" value={d.progresso} onChange={(e) => set("progresso", Number(e.target.value))} />
          </Campo>
          <Campo label="Saúde">
            <select className={inputCls} value={d.saude} onChange={(e) => set("saude", e.target.value as Saude)}>
              {saudes.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </Campo>
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Metas</span>
              <button type="button" onClick={() => set("metas", [...d.metas, { nome: "", alvo: 100, atual: 0, unidade: "" }])} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
                Adicionar meta
              </button>
            </div>
            {d.metas.map((m, i) => (
              <div key={i} className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto] gap-2">
                <input className={inputCls} placeholder="Meta" value={m.nome} maxLength={80} onChange={(e) => setMeta(i, { nome: e.target.value })} />
                <input type="number" min={0} className={inputCls} placeholder="Atual" value={m.atual} onChange={(e) => setMeta(i, { atual: Number(e.target.value) })} />
                <input type="number" min={1} className={inputCls} placeholder="Alvo" value={m.alvo} onChange={(e) => setMeta(i, { alvo: Number(e.target.value) })} />
                <input className={inputCls} placeholder="Unidade" value={m.unidade} maxLength={20} onChange={(e) => setMeta(i, { unidade: e.target.value })} />
                <button type="button" aria-label="Remover meta" onClick={() => set("metas", d.metas.filter((_, j) => j !== i))} className="rounded-md px-2 text-sm text-destructive hover:bg-destructive/10">×</button>
              </div>
            ))}
          </div>
        </div>
        <Rodape onCancel={onClose} onSave={salvar} onDelete={programa ? () => { carteira.removerPrograma(programa.id); toast.success("Programa excluído"); onClose(); } : undefined} />
      </DialogContent>
    </Dialog>
  );
}

function Rodape({ onCancel, onSave, onDelete }: { onCancel: () => void; onSave: () => void; onDelete?: () => void }) {
  const [confirmar, setConfirmar] = useState(false);
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
      <div>
        {onDelete && (
          <button
            type="button"
            onClick={() => (confirmar ? onDelete() : setConfirmar(true))}
            className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            {confirmar ? "Confirmar exclusão" : "Excluir"}
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
          Cancelar
        </button>
        <button type="button" onClick={onSave} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Salvar
        </button>
      </div>
    </div>
  );
}
