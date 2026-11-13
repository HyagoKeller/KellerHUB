import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Panel, PanelTitle, SaudeTag } from "@/components/ui-kit";
import type { Projeto, Saude } from "@/lib/ppm-types";

export type StatusReport = {
  id: string; periodo: string; autor: string; saude: Saude; resumo: string;
  realizacoes: string; proximos_passos: string; pontos_atencao: string; created_at: string; updated_at: string;
};
type Rascunho = Omit<StatusReport, "id" | "autor" | "created_at" | "updated_at"> & { id?: string };

const vazio = (): Rascunho => ({
  periodo: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  saude: "verde", resumo: "", realizacoes: "", proximos_passos: "", pontos_atencao: "",
});
const secoes: { campo: keyof Rascunho; rotulo: string }[] = [
  { campo: "resumo", rotulo: "Resumo executivo" },
  { campo: "realizacoes", rotulo: "Realizações do período" },
  { campo: "proximos_passos", rotulo: "Próximos passos" },
  { campo: "pontos_atencao", rotulo: "Pontos de atenção" },
];
const dataHora = (s: string) => new Date(s).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });

export function StatusReportsProjeto({ projeto, podeEditar }: { projeto: Projeto; podeEditar: boolean }) {
  const client = useQueryClient();
  const chave = ["status-reports", projeto.id];
  const { data: lista = [], isLoading } = useQuery({
    queryKey: chave,
    queryFn: async () => {
      const { data, error } = await supabase.from("status_reports")
        .select("id,periodo,autor,saude,resumo,realizacoes,proximos_passos,pontos_atencao,created_at,updated_at")
        .eq("projeto_id", projeto.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data as StatusReport[];
    },
  });
  const [form, setForm] = useState<Rascunho>();
  const [impressao, setImpressao] = useState<StatusReport>();

  const salvar = useMutation({
    mutationFn: async (r: Rascunho) => {
      const campos = { periodo: r.periodo.trim(), saude: r.saude, resumo: r.resumo, realizacoes: r.realizacoes, proximos_passos: r.proximos_passos, pontos_atencao: r.pontos_atencao };
      const q = r.id
        ? supabase.from("status_reports").update(campos).eq("id", r.id)
        : supabase.from("status_reports").insert({ ...campos, projeto_id: projeto.id });
      const { error } = await q;
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Relatório salvo.");
      setForm(undefined);
      await Promise.all([client.invalidateQueries({ queryKey: chave }), client.invalidateQueries({ queryKey: ["ppm"] })]);
    },
    onError: () => toast.error("Não foi possível salvar. Confira se você pode editar este projeto."),
  });

  const imprimir = (r: StatusReport) => {
    setImpressao(r);
    requestAnimationFrame(() => {
      document.body.classList.add("imprimindo-relatorio");
      const fim = () => { document.body.classList.remove("imprimindo-relatorio"); window.removeEventListener("afterprint", fim); };
      window.addEventListener("afterprint", fim);
      window.print();
    });
  };

  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1"><PanelTitle title="Relatórios de situação" hint={`${lista.length} no histórico`} /></div>
        {podeEditar && <Button size="sm" onClick={() => setForm(vazio())}>Novo relatório</Button>}
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Carregando relatórios.</p>
        : lista.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum relatório registrado para este projeto.</p>
        : <ul className="space-y-3">
          {lista.map((s) => (
            <li key={s.id} className="rounded-lg border border-border p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <p className="truncate font-medium">{s.periodo}</p>
                <SaudeTag saude={s.saude} />
              </div>
              {secoes.map(({ campo, rotulo }) => s[campo as keyof StatusReport] ? (
                <div key={campo} className="mt-2">
                  <p className="text-xs font-medium text-foreground">{rotulo}</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{String(s[campo as keyof StatusReport])}</p>
                </div>
              ) : null)}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Registrado por {s.autor} em {dataHora(s.created_at)}{s.updated_at !== s.created_at && ` · atualizado em ${dataHora(s.updated_at)}`}
                </p>
                <div className="flex gap-2">
                  {podeEditar && <Button size="sm" variant="outline" onClick={() => setForm({ ...s })}>Editar</Button>}
                  <Button size="sm" variant="outline" onClick={() => imprimir(s)}>Imprimir ou salvar PDF</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>}

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{form?.id ? "Editar relatório" : "Novo relatório de situação"}</DialogTitle></DialogHeader>
          {form && (
            <form id="form-status" className="grid gap-4" onSubmit={(e) => { e.preventDefault(); if (!form.periodo.trim()) { toast.error("Informe o período."); return; } salvar.mutate(form); }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5"><Label htmlFor="sr-periodo">Período</Label>
                  <Input id="sr-periodo" maxLength={80} value={form.periodo} onChange={(e) => setForm({ ...form, periodo: e.target.value })} /></div>
                <div className="grid gap-1.5"><Label htmlFor="sr-saude">Saúde</Label>
                  <select id="sr-saude" className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.saude} onChange={(e) => setForm({ ...form, saude: e.target.value as Saude })}>
                    <option value="verde">Saudável</option><option value="amarelo">Atenção</option><option value="vermelho">Crítico</option>
                  </select></div>
              </div>
              {secoes.map(({ campo, rotulo }) => (
                <div key={campo} className="grid gap-1.5"><Label htmlFor={`sr-${campo}`}>{rotulo}</Label>
                  <Textarea id={`sr-${campo}`} rows={3} maxLength={4000} value={String(form[campo] ?? "")} onChange={(e) => setForm({ ...form, [campo]: e.target.value })} /></div>
              ))}
            </form>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(undefined)}>Cancelar</Button>
            <Button type="submit" form="form-status" disabled={salvar.isPending}>{salvar.isPending ? "Salvando" : "Salvar relatório"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {impressao && typeof document !== "undefined" && createPortal(
        <div className="relatorio-impressao">
          <h1>Relatório de situação: {projeto.nome}</h1>
          <p>Período: {impressao.periodo} · Saúde: {{ verde: "Saudável", amarelo: "Atenção", vermelho: "Crítico" }[impressao.saude]}</p>
          <p>Gerente: {projeto.gerente} · Registrado por {impressao.autor} em {dataHora(impressao.created_at)}</p>
          {secoes.map(({ campo, rotulo }) => (
            <section key={campo}><h2>{rotulo}</h2><p>{String(impressao[campo as keyof StatusReport] || "Não informado.")}</p></section>
          ))}
        </div>, document.body)}
    </Panel>
  );
}
