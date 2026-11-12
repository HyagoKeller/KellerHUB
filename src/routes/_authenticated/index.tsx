import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { ViewTabs } from "@/components/ViewTabs";
import { useViews } from "@/lib/views";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, SaudeTag, Stat, Tag } from "@/components/ui-kit";
import {
  moeda,
  severidade,
} from "@/lib/ppm-types";
import { useCarteiraVisivel, useAcessoEstado } from "@/lib/acesso";
import { AvisoAreas, Moeda, SeloAcesso } from "@/components/Acesso";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Visão Executiva | Keller Hub" },
      {
        name: "description",
        content:
          "Painel executivo consolidado de portfólios, programas, projetos, indicadores e riscos institucionais.",
      },
      { property: "og:title", content: "Visão Executiva | Keller Hub" },
      {
        property: "og:description",
        content: "Gestão institucional de portfólios, programas e projetos em uma única plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});


const cores = [
  "var(--color-chart-2)",
  "var(--color-chart-4)",
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

function Dashboard() {
  const { views } = useViews("executiva");
  const [ativa, setAtiva] = useState("padrao");
  const view = views.find((v) => v.id === ativa);
  const show = (bloco: string) => !view || view.blocos.includes(bloco);
  const { portfolios, projetos, riscos, ocultarValores, estado } = useCarteiraVisivel();
  const logAcesso = useAcessoEstado().log;
  const trilha = logAcesso;
  const execucaoMensal=portfolios.map(p=>({periodo:p.nome,planejado:p.orcamento/1000000,realizado:p.executado/1000000}));
  void estado;
  const statusDist = [
    { nome: "Em execução", valor: projetos.filter((p) => p.status === "Em execução").length },
    { nome: "Em risco", valor: projetos.filter((p) => p.status === "Em risco").length },
    { nome: "Planejamento", valor: projetos.filter((p) => p.status === "Planejamento").length },
    { nome: "Concluído", valor: projetos.filter((p) => p.status === "Concluído").length },
    { nome: "Suspenso", valor: projetos.filter((p) => p.status === "Suspenso").length },
  ];
    const orcamento = portfolios.reduce((a, p) => a + p.orcamento, 0);

  const executado = portfolios.reduce((a, p) => a + p.executado, 0);
  const criticos = riscos
    .map((r) => ({ ...r, sev: severidade(r.probabilidade, r.impacto) }))
    .filter((r) => r.sev.nivel === "Crítico" || r.sev.nivel === "Alto")
    .sort((a, b) => b.probabilidade * b.impacto - a.probabilidade * a.impacto)
    .slice(0, 5);

  return (
    <AppShell
      title="Visão executiva"
      description="Consolidação institucional de portfólios, execução orçamentária, riscos corporativos e desempenho dos projetos."
      actions={
        <>
          <Link
            to="/relatorios"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Exportar dados
          </Link>
          <Link
            to="/riscos"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Riscos críticos
          </Link>
        </>
      }
    >
      <AvisoAreas />
      <ViewTabs views={views} ativa={ativa} onChange={setAtiva} />

      {show("kpis") && (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat label="Portfólios ativos" value={String(portfolios.length)} hint={`${portfolios.filter((p) => p.tipo === "Institucional").length} institucionais · ${portfolios.filter((p) => p.tipo !== "Institucional").length} temáticos`} />
        <Stat
          label="Projetos em carteira"
          value={String(projetos.length)}
          delta={{ texto: `${projetos.filter((p) => p.saude === "vermelho").length} críticos`, tom: "down" }}
        />
        <Stat
          label="Orçamento executado"
          value={orcamento ? `${Math.round((executado / orcamento) * 100)}%` : "Não se aplica"}
          hint={ocultarValores ? "Valores em R$ restritos ao seu perfil" : `${moeda(executado)} de ${moeda(orcamento)}`}
        />
        <Stat
          label="Riscos altos e críticos"
          value={String(
            riscos.filter((r) => ["Alto", "Crítico"].includes(severidade(r.probabilidade, r.impacto).nivel)).length,
          )}

        />
      </div>
      )}


      {(show("execucao") || show("status")) && (
      <div className={`mt-4 grid gap-4 ${show("execucao") && show("status") ? "xl:grid-cols-3" : ""}`}>
        {show("execucao") && (
        <Panel className={show("status") ? "xl:col-span-2" : ""}>

          {ocultarValores ? (<><PanelTitle title="Execução orçamentária por portfólio" hint="restrito" /><p className="flex items-center gap-2 py-16 text-sm text-muted-foreground"><Lock className="h-4 w-4" /> Valores em R$ ocultos para o seu perfil.</p></>) : (<><PanelTitle title="Execução orçamentária por portfólio" hint="R$ milhões" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={execucaoMensal} margin={{ left: -18, right: 8, top: 8 }}>
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
                <Line
                  type="monotone"
                  dataKey="planejado"
                  name="Planejado"
                  stroke="var(--color-chart-5)"
                  strokeDasharray="5 4"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="realizado"
                  name="Realizado"
                  stroke="var(--color-chart-1)"
                  dot={false}
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}
        </Panel>
        )}

        {show("status") && (
        <Panel>

          <PanelTitle title="Projetos por status" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDist} dataKey="valor" nameKey="nome" innerRadius={52} outerRadius={82} paddingAngle={2}>
                  {statusDist.map((_, i) => (
                    <Cell key={i} fill={cores[i % cores.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        )}
      </div>
      )}


      {(show("portfolios") || show("riscos")) && (
      <div className={`mt-4 grid gap-4 ${show("portfolios") && show("riscos") ? "xl:grid-cols-3" : ""}`}>
        {show("portfolios") && (
        <Panel className={show("riscos") ? "xl:col-span-2" : ""}>

          <PanelTitle title="Portfólios institucionais" hint="progresso e execução" />
          <div className="space-y-4">
            {portfolios.map((p) => (
              <Link
                key={p.id}
                to="/portfolios"
                className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-medium">{p.nome} <SeloAcesso tipo="portfolio" id={p.id} /></p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.programas} programas · {p.projetos} projetos · {p.responsavel}
                    </p>
                  </div>
                  <SaudeTag saude={p.saude} />
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <Barra valor={p.progresso} />
                  <span className="num shrink-0 text-xs text-muted-foreground">
                    {p.progresso}% · <Moeda v={p.executado} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
        )}

        {show("riscos") && (
        <Panel>

          <PanelTitle title="Riscos em destaque" hint="severidade" />
          <ul className="space-y-3">
            {criticos.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="min-w-0 text-sm font-medium">{r.nome}</p>
                  <Tag tom={r.sev.nivel === "Crítico" ? "danger" : "accent"}>{r.sev.nivel}</Tag>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {r.origem} · {r.responsavel}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
        )}
      </div>
      )}


      {(show("progresso") || show("auditoria")) && (
      <div className={`mt-4 grid gap-4 ${show("progresso") && show("auditoria") ? "xl:grid-cols-3" : ""}`}>
        {show("progresso") && (
        <Panel className={show("auditoria") ? "xl:col-span-2" : ""}>

          <PanelTitle title="Progresso médio por portfólio" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolios} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="nome" tickLine={false} axisLine={false} fontSize={11} interval={0} height={48} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="progresso" name="Progresso (%)" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        )}

        {show("auditoria") && (
        <Panel>

          <PanelTitle title="Trilha de auditoria" hint="últimos eventos" />
          <ul className="space-y-3">
            {trilha.slice(0, 5).map((a) => (
              <li key={a.id} className="border-l-2 border-border pl-3">
                <p className="text-sm">
                  <span className="font-medium">{a.usuario}</span>{" "}
                  <span className="text-muted-foreground">{a.acao.toLowerCase()}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">{a.entidade}</p>
                <p className="num text-[11px] text-muted-foreground/80">{a.quando}</p>
              </li>
            ))}
          </ul>
        </Panel>
        )}
      </div>
      )}

    </AppShell>
  );
}
