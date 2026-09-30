import { createFileRoute, Link } from "@tanstack/react-router";
import { GripVertical } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, SaudeTag, Stat, Tag } from "@/components/ui-kit";
import { moeda, portfolios, programas } from "@/lib/mock-data";

export const Route = createFileRoute("/portfolios")({
  head: () => ({
    meta: [
      { title: "Portfólios — Plataforma PPM" },
      {
        name: "description",
        content:
          "Cadastro, priorização e visão consolidada de portfólios institucionais e temáticos com indicadores agregados.",
      },
      { property: "og:title", content: "Portfólios — Plataforma PPM" },
      {
        property: "og:description",
        content: "Priorize portfólios por score e acompanhe orçamento, progresso e riscos consolidados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolios,
});

function Portfolios() {
  const total = portfolios.reduce((a, p) => a + p.orcamento, 0);

  return (
    <AppShell
      title="Gestão de Portfólios"
      description="Portfólios institucionais e temáticos, com priorização por score e indicadores agregados de orçamento, progresso e riscos."
      actions={
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Novo portfólio
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Portfólios" value={String(portfolios.length)} hint="2 institucionais · 2 temáticos" />
        <Stat label="Orçamento total" value={moeda(total)} />
        <Stat
          label="Progresso médio"
          value={`${Math.round(portfolios.reduce((a, p) => a + p.progresso, 0) / portfolios.length)}%`}
        />
        <Stat
          label="Riscos críticos"
          value={String(portfolios.reduce((a, p) => a + p.riscosCriticos, 0))}
          delta={{ texto: "monitoramento ativo", tom: "flat" }}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelTitle title="Priorização do portfólio" hint="arraste para reordenar" />
          <ul className="space-y-3">
            {[...portfolios]
              .sort((a, b) => a.prioridade - b.prioridade)
              .map((p) => (
                <li key={p.id} className="rounded-lg border border-border p-4">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{p.nome}</p>
                        <Tag tom={p.tipo === "Institucional" ? "info" : "neutro"}>{p.tipo}</Tag>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        Responsável: {p.responsavel} · {p.programas} programas · {p.projetos} projetos
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num font-display text-lg font-bold">{p.score}</p>
                      <p className="text-[11px] text-muted-foreground">score</p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase text-muted-foreground">Progresso</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Barra valor={p.progresso} />
                        <span className="num text-xs">{p.progresso}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-muted-foreground">Execução</p>
                      <p className="num mt-1 text-sm">
                        {moeda(p.executado)}{" "}
                        <span className="text-xs text-muted-foreground">/ {moeda(p.orcamento)}</span>
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <SaudeTag saude={p.saude} />
                      {p.riscosCriticos > 0 && <Tag tom="danger">{p.riscosCriticos} riscos críticos</Tag>}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelTitle title="Matriz de priorização" hint="valor × esforço" />
            <div className="relative aspect-square rounded-lg border border-border bg-muted/30">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                {["Avaliar", "Prioritário", "Descartar", "Rápida vitória"].map((q) => (
                  <div
                    key={q}
                    className="flex items-start justify-end border border-border/60 p-2 text-[10px] uppercase text-muted-foreground"
                  >
                    {q}
                  </div>
                ))}
              </div>
              {portfolios.map((p, i) => (
                <div
                  key={p.id}
                  title={p.nome}
                  className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
                  style={{ left: `${20 + i * 21}%`, top: `${75 - p.score / 2}%` }}
                >
                  P{i + 1}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              P1 Transformação Digital · P2 Infraestrutura · P3 Atendimento · P4 Capacitação
            </p>
          </Panel>

          <Panel>
            <PanelTitle title="Programas vinculados" />
            <ul className="space-y-2">
              {programas.slice(0, 6).map((pg) => (
                <li key={pg.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <Link to="/programas" className="truncate text-sm hover:underline">
                    {pg.nome}
                  </Link>
                  <span className="num shrink-0 text-xs text-muted-foreground">{pg.progresso}%</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
