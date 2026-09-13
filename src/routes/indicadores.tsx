import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { ViewTabs } from "@/components/ViewTabs";
import { Barra, Panel, PanelTitle, Stat, Tag } from "@/components/ui-kit";
import { indicadores } from "@/lib/mock-data";
import { useViews } from "@/lib/views";


export const Route = createFileRoute("/indicadores")({
  head: () => ({
    meta: [
      { title: "Indicadores de Desempenho — Hepta Project PPM" },
      {
        name: "description",
        content:
          "Cadastro de KPIs com fórmula, meta, periodicidade, histórico de valores e exportação em formatos abertos.",
      },
      { property: "og:title", content: "Indicadores de Desempenho — Hepta Project PPM" },
      {
        property: "og:description",
        content: "Dashboards parametrizáveis de KPIs com exportação CSV/XLSX para Power BI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Indicadores,
});

function atingimento(i: (typeof indicadores)[number]) {
  return i.polaridade === "maior"
    ? Math.round((i.atual / i.meta) * 100)
    : Math.round((i.meta / i.atual) * 100);
}

function Indicadores() {
  const [selecionados, setSelecionados] = useState<string[]>(["kpi-1", "kpi-3", "kpi-5"]);
  const [periodo, setPeriodo] = useState("Últimos 6 meses");
  const { views } = useViews("indicadores");
  const [ativa, setAtiva] = useState("padrao");
  const view = views.find((v) => v.id === ativa);
  const show = (bloco: string) => !view || view.blocos.includes(bloco);


  const toggle = (id: string) =>
    setSelecionados((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const serie = indicadores[0].historico.map((h, idx) => {
    const linha: Record<string, string | number> = { periodo: h.periodo };
    indicadores
      .filter((i) => selecionados.includes(i.id))
      .forEach((i) => {
        linha[i.nome] = i.historico[idx].valor;
      });
    return linha;
  });

  const cores = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <AppShell
      title="Indicadores de Desempenho"
      description="KPIs institucionais com fórmula de cálculo, meta, periodicidade, responsável e histórico de valores."
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
            <Download className="h-4 w-4" /> CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
            <Download className="h-4 w-4" /> XLSX
          </button>
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Novo indicador
          </button>
        </>
      }
    >
      <ViewTabs views={views} ativa={ativa} onChange={setAtiva} />

      {show("kpis") && (
      <div className="grid gap-4 sm:grid-cols-3">

        <Stat label="Indicadores cadastrados" value={String(indicadores.length)} />
        <Stat
          label="Dentro da meta"
          value={String(indicadores.filter((i) => atingimento(i) >= 100).length)}
          delta={{ texto: "meta atingida", tom: "up" }}
        />
        <Stat
          label="Abaixo da meta"
          value={String(indicadores.filter((i) => atingimento(i) < 100).length)}
          delta={{ texto: "requer atenção", tom: "down" }}
        />
      </div>
      )}

      {show("dashboard") && (
      <Panel className="mt-4">

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4">
          <h2 className="truncate font-display text-sm font-semibold uppercase tracking-wide">
            Dashboard parametrizável
          </h2>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="shrink-0 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
          >
            <option>Últimos 6 meses</option>
            <option>Ano corrente</option>
            <option>Últimos 12 meses</option>
          </select>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {indicadores.map((i) => (
            <button
              key={i.id}
              onClick={() => toggle(i.id)}
              className={
                selecionados.includes(i.id)
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  : "rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
              }
            >
              {i.nome}
            </button>
          ))}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serie} margin={{ left: -18, right: 8, top: 8 }}>
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
              {indicadores
                .filter((i) => selecionados.includes(i.id))
                .map((i, idx) => (
                  <Line
                    key={i.id}
                    type="monotone"
                    dataKey={i.nome}
                    stroke={cores[idx % cores.length]}
                    strokeWidth={2.5}
                    dot={false}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      )}

      {show("cards") && (
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {indicadores.map((i) => {
          const pct = atingimento(i);
          return (
            <Panel key={i.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="min-w-0 truncate font-medium">{i.nome}</p>
                <Tag tom={pct >= 100 ? "success" : pct >= 80 ? "accent" : "danger"}>{pct}%</Tag>
              </div>
              <p className="num mt-2 font-display text-2xl font-bold">
                {i.atual.toLocaleString("pt-BR")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {i.unidade} · meta {i.meta.toLocaleString("pt-BR")}
                </span>
              </p>
              <div className="mt-3">
                <Barra valor={Math.min(pct, 100)} />
              </div>
              <p className="mt-3 truncate text-xs text-muted-foreground">Fórmula: {i.formula}</p>
              <p className="truncate text-xs text-muted-foreground">
                {i.periodicidade} · {i.responsavel}
              </p>
            </Panel>
          );
        })}
      </div>
      )}

    </AppShell>
  );
}
