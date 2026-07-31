import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Panel, PanelTitle, Stat, Tag } from "@/components/ui-kit";
import { evolucaoRiscos, riscos, severidade, type Risco } from "@/lib/mock-data";

export const Route = createFileRoute("/riscos")({
  head: () => ({
    meta: [
      { title: "Riscos Corporativos — Hepta Project PPM" },
      {
        name: "description",
        content:
          "Riscos estratégicos, operacionais e de projetos com matriz de calor, planos de resposta e monitoramento contínuo.",
      },
      { property: "og:title", content: "Riscos Corporativos — Hepta Project PPM" },
      {
        property: "og:description",
        content: "Matriz de probabilidade × impacto, severidade e planos de mitigação com responsáveis e prazos.",
      },
    ],
  }),
  component: Riscos,
});

const categorias = ["Todas", "Estratégico", "Operacional", "Projeto"] as const;

function celaTom(p: number, i: number) {
  const s = p * i;
  if (s >= 15) return "bg-destructive/25";
  if (s >= 9) return "bg-warning/30";
  if (s >= 4) return "bg-info/20";
  return "bg-success/20";
}

function Tendencia({ t }: { t: Risco["tendencia"] }) {
  if (t === "alta") return <ArrowUpRight className="h-4 w-4 text-destructive" />;
  if (t === "queda") return <ArrowDownRight className="h-4 w-4 text-success" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function Riscos() {
  const [cat, setCat] = useState<(typeof categorias)[number]>("Todas");
  const lista = riscos.filter((r) => cat === "Todas" || r.categoria === cat);

  return (
    <AppShell
      title="Riscos Corporativos"
      description="Riscos estratégicos, operacionais e de projetos com avaliação de probabilidade × impacto, planos de resposta e histórico de evolução."
      actions={
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Registrar risco
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(["Crítico", "Alto", "Médio", "Baixo"] as const).map((nivel) => (
          <Stat
            key={nivel}
            label={`Riscos ${nivel.toLowerCase()}s`}
            value={String(riscos.filter((r) => severidade(r.probabilidade, r.impacto).nivel === nivel).length)}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel>
          <PanelTitle title="Matriz de calor" hint="probabilidade × impacto" />
          <div className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1 text-[11px]">
            {[5, 4, 3, 2, 1].map((p) => (
              <Fragment key={`row-${p}`}>
                <div className="grid place-items-center pr-1 text-muted-foreground">
                  {p}
                </div>
                {[1, 2, 3, 4, 5].map((i) => {
                  const itens = riscos.filter((r) => r.probabilidade === p && r.impacto === i);
                  return (
                    <div
                      key={`${p}-${i}`}
                      className={`grid aspect-square place-items-center rounded-md ${celaTom(p, i)}`}
                      title={itens.map((r) => r.nome).join(", ")}
                    >
                      {itens.length > 0 && (
                        <span className="num font-display text-sm font-bold">{itens.length}</span>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
            <div />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={`b-${i}`} className="grid place-items-center pt-1 text-muted-foreground">
                {i}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
            <span>← Probabilidade (vertical)</span>
            <span>Impacto →</span>
          </div>
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelTitle title="Evolução da exposição a riscos" hint="monitoramento contínuo" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolucaoRiscos} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="periodo" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="critico" name="Crítico" stackId="1" stroke="var(--color-chart-4)" fill="var(--color-chart-4)" fillOpacity={0.5} />
                <Area type="monotone" dataKey="alto" name="Alto" stackId="1" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.45} />
                <Area type="monotone" dataKey="medio" name="Médio" stackId="1" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.35} />
                <Area type="monotone" dataKey="baixo" name="Baixo" stackId="1" stroke="var(--color-chart-3)" fill="var(--color-chart-3)" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              cat === c
                ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                : "rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {lista.map((r) => {
          const s = severidade(r.probabilidade, r.impacto);
          return (
            <Panel key={r.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{r.categoria}</Tag>
                    <Tag tom={s.nivel === "Crítico" ? "danger" : s.nivel === "Alto" ? "accent" : "info"}>
                      {s.nivel}
                    </Tag>
                    <Tag tom="neutro">{r.resposta}</Tag>
                  </div>
                  <p className="mt-2 font-medium">{r.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.origem}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Tendencia t={r.tendencia} />
                    <span className="num font-display text-lg font-bold">
                      {r.probabilidade * r.impacto}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    P{r.probabilidade} × I{r.impacto}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.plano}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Responsável: {r.responsavel} · Prazo: {new Date(r.prazo).toLocaleDateString("pt-BR")}
              </p>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
