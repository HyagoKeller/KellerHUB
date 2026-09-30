import { useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SeletorEtiqueta } from "@/components/EtiquetaCelula";
import { carteira, useCarteira } from "@/lib/carteira";
import { objetivos, programas, type Portfolio, type Projeto, type Saude } from "@/lib/mock-data";

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
    programaId: z.string().min(1),
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
  programaId: programas[0].id,
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
  const [d, setD] = useState<Omit<Projeto, "id"> & { id?: string }>(vazioProjeto());
  const [erros, setErros] = useState<Record<string, string>>({});
  useEffect(() => {
    if (aberto) {
      setD(projeto ? { ...projeto } : vazioProjeto());
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
          <Campo label="Programa">
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
