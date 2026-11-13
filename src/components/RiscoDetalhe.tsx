import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tag } from "@/components/ui-kit";
import { severidade, type Risco } from "@/lib/ppm-types";

const statusPlano = ["Pendente", "Em andamento", "Concluído", "Cancelado"] as const;
const data = (s: string | null) => (s ? new Date(s + (s.length === 10 ? "T12:00:00" : "")).toLocaleDateString("pt-BR") : "Não se aplica");
const sel = "h-9 rounded-md border border-input bg-background px-3 text-sm";

export function RiscoDetalhe({ risco, podeEditar, onClose }: { risco: Risco; podeEditar: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const k = ["risco-detalhe", risco.id];
  const { data: d } = useQuery({
    queryKey: k,
    queryFn: async () => {
      const [p, r] = await Promise.all([
        supabase.from("risco_planos").select("id,acao,responsavel,prazo,status").eq("risco_id", risco.id).order("created_at"),
        supabase.from("risco_reavaliacoes").select("id,probabilidade,impacto,prob_anterior,impacto_anterior,justificativa,autor,created_at").eq("risco_id", risco.id).order("created_at", { ascending: false }),
      ]);
      if (p.error) throw p.error;
      if (r.error) throw r.error;
      return { planos: p.data, reav: r.data };
    },
  });
  const atualizar = () => Promise.all([qc.invalidateQueries({ queryKey: k }), qc.invalidateQueries({ queryKey: ["ppm"] })]);
  const erro = () => toast.error("Não foi possível salvar. Confira se você pode editar este risco.");

  const [plano, setPlano] = useState({ acao: "", responsavel: "", prazo: "" });
  const addPlano = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("risco_planos").insert({ risco_id: risco.id, acao: plano.acao.trim(), responsavel: plano.responsavel.trim(), prazo: plano.prazo || null });
      if (error) throw error;
    },
    onSuccess: async () => { setPlano({ acao: "", responsavel: "", prazo: "" }); toast.success("Ação adicionada."); await atualizar(); },
    onError: erro,
  });
  const mudarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("risco_planos").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: atualizar, onError: erro,
  });
  const [rv, setRv] = useState<{ probabilidade: number; impacto: number; justificativa: string }>({ probabilidade: risco.probabilidade, impacto: risco.impacto, justificativa: "" });
  const reavaliar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("risco_reavaliacoes").insert({ risco_id: risco.id, ...rv, justificativa: rv.justificativa.trim() });
      if (error) throw error;
    },
    onSuccess: async () => { setRv((v) => ({ ...v, justificativa: "" })); toast.success("Reavaliação registrada."); await atualizar(); },
    onError: erro,
  });
  const s = severidade(risco.probabilidade, risco.impacto);
  const novo = severidade(rv.probabilidade, rv.impacto);
  const concluidas = d?.planos.filter((p) => p.status === "Concluído").length ?? 0;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{risco.nome}</DialogTitle></DialogHeader>
        <div className="flex flex-wrap gap-2 text-sm">
          <Tag>{risco.categoria}</Tag><Tag tom={s.nivel === "Crítico" ? "danger" : s.nivel === "Alto" ? "accent" : "info"}>{s.nivel}: {risco.probabilidade * risco.impacto}</Tag>
          <Tag tom="neutro">P{risco.probabilidade} × I{risco.impacto}</Tag>
        </div>

        <section className="mt-2">
          <h3 className="font-display font-semibold">Plano de mitigação</h3>
          <p className="text-xs text-muted-foreground">{concluidas} de {d?.planos.length ?? 0} ações concluídas</p>
          <ul className="mt-2 space-y-2">
            {d?.planos.length === 0 && <li className="text-sm text-muted-foreground">Nenhuma ação cadastrada.</li>}
            {d?.planos.map((p) => (
              <li key={p.id} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0"><p className="text-sm font-medium">{p.acao}</p>
                  <p className="text-xs text-muted-foreground">Responsável: {p.responsavel || "Não se aplica"} · Prazo: {data(p.prazo)}</p></div>
                <select aria-label="Situação da ação" className={sel} disabled={!podeEditar} value={p.status} onChange={(e) => mudarStatus.mutate({ id: p.id, status: e.target.value })}>
                  {statusPlano.map((x) => <option key={x}>{x}</option>)}
                </select>
              </li>
            ))}
          </ul>
          {podeEditar && (
            <form className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto_auto]" onSubmit={(e) => { e.preventDefault(); if (!plano.acao.trim()) return toast.error("Descreva a ação."); addPlano.mutate(); }}>
              <Input aria-label="Ação" placeholder="Nova ação" maxLength={500} value={plano.acao} onChange={(e) => setPlano({ ...plano, acao: e.target.value })} />
              <Input aria-label="Responsável" placeholder="Responsável" maxLength={120} value={plano.responsavel} onChange={(e) => setPlano({ ...plano, responsavel: e.target.value })} />
              <Input aria-label="Prazo" type="date" value={plano.prazo} onChange={(e) => setPlano({ ...plano, prazo: e.target.value })} />
              <Button type="submit" size="sm" disabled={addPlano.isPending}>Adicionar</Button>
            </form>
          )}
        </section>

        <section className="mt-4">
          <h3 className="font-display font-semibold">Reavaliações</h3>
          {podeEditar && (
            <form className="mt-2 grid gap-2 rounded-lg border border-border p-3" onSubmit={(e) => { e.preventDefault(); reavaliar.mutate(); }}>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1"><Label htmlFor="rv-p">Probabilidade</Label>
                  <select id="rv-p" className={sel} value={rv.probabilidade} onChange={(e) => setRv({ ...rv, probabilidade: +e.target.value })}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></div>
                <div className="grid gap-1"><Label htmlFor="rv-i">Impacto</Label>
                  <select id="rv-i" className={sel} value={rv.impacto} onChange={(e) => setRv({ ...rv, impacto: +e.target.value })}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></div>
              </div>
              <p className="text-xs text-muted-foreground">Nova severidade calculada: {rv.probabilidade * rv.impacto} ({novo.nivel})</p>
              <Textarea aria-label="Justificativa" placeholder="Justificativa" rows={2} maxLength={2000} value={rv.justificativa} onChange={(e) => setRv({ ...rv, justificativa: e.target.value })} />
              <Button type="submit" size="sm" className="justify-self-end" disabled={reavaliar.isPending}>Registrar reavaliação</Button>
            </form>
          )}
          <ul className="mt-2 space-y-2">
            {d?.reav.length === 0 && <li className="text-sm text-muted-foreground">Nenhuma reavaliação registrada.</li>}
            {d?.reav.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-3 text-sm">
                <p className="font-medium">P{r.prob_anterior} × I{r.impacto_anterior} ({(r.prob_anterior ?? 0) * (r.impacto_anterior ?? 0)}) para P{r.probabilidade} × I{r.impacto} ({r.probabilidade * r.impacto})</p>
                {r.justificativa && <p className="text-muted-foreground">{r.justificativa}</p>}
                <p className="text-xs text-muted-foreground">{r.autor} em {new Date(r.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })}</p>
              </li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}
