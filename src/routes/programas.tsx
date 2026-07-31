import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, SaudeTag, Stat } from "@/components/ui-kit";
import { portfolios, programas, projetos } from "@/lib/mock-data";

export const Route = createFileRoute("/programas")({
  head: () => ({
    meta: [
      { title: "Programas — Hepta Project PPM" },
      {
        name: "description",
        content:
          "Programas institucionais com metas, objetivos e hierarquia rastreável entre portfólio, programa e projetos.",
      },
      { property: "og:title", content: "Programas — Hepta Project PPM" },
      {
        property: "og:description",
        content: "Acompanhe metas de programas e a hierarquia portfólio → programa → projeto.",
      },
    ],
  }),
  component: Programas,
});

function Programas() {
  return (
    <AppShell
      title="Gestão de Programas"
      description="Metas, objetivos e projetos subordinados, com visualização hierárquica portfólio → programa → projeto."
      actions={
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Novo programa
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Programas ativos" value={String(programas.length)} />
        <Stat
          label="Metas acompanhadas"
          value={String(programas.reduce((a, p) => a + p.metas.length, 0))}
        />
        <Stat
          label="Progresso médio"
          value={`${Math.round(programas.reduce((a, p) => a + p.progresso, 0) / programas.length)}%`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {programas.map((pg) => {
            const pf = portfolios.find((p) => p.id === pg.portfolioId);
            const filhos = projetos.filter((p) => p.programaId === pg.id);
            return (
              <Panel key={pg.id}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                      {pf?.nome}
                    </p>
                    <h3 className="truncate font-display text-lg font-semibold">{pg.nome}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{pg.objetivo}</p>
                  </div>
                  <SaudeTag saude={pg.saude} />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Barra valor={pg.progresso} />
                  <span className="num shrink-0 text-xs text-muted-foreground">{pg.progresso}%</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {pg.metas.map((m) => (
                    <div key={m.nome} className="rounded-lg border border-border p-3">
                      <p className="truncate text-xs text-muted-foreground">{m.nome}</p>
                      <p className="num mt-1 font-display text-base font-semibold">
                        {m.atual.toLocaleString("pt-BR")}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          / {m.alvo.toLocaleString("pt-BR")} {m.unidade}
                        </span>
                      </p>
                      <div className="mt-2">
                        <Barra valor={(m.atual / m.alvo) * 100} tom="info" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-border pt-3">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    Projetos subordinados ({filhos.length})
                  </p>
                  <ul className="space-y-1.5">
                    {filhos.map((p) => (
                      <li key={p.id}>
                        <Link
                          to="/projetos/$id"
                          params={{ id: p.id }}
                          className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                        >
                          <span className="truncate text-sm">{p.nome}</span>
                          <span className="num shrink-0 text-xs text-muted-foreground">
                            {p.progresso}%
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Panel>
            );
          })}
        </div>

        <Panel className="h-fit">
          <PanelTitle title="Hierarquia" hint="portfólio → programa → projeto" />
          <ul className="space-y-4 text-sm">
            {portfolios.map((pf) => (
              <li key={pf.id}>
                <p className="truncate font-medium">{pf.nome}</p>
                <ul className="mt-1.5 space-y-1.5 border-l border-border pl-3">
                  {programas
                    .filter((pg) => pg.portfolioId === pf.id)
                    .map((pg) => (
                      <li key={pg.id}>
                        <p className="truncate text-muted-foreground">{pg.nome}</p>
                        <ul className="mt-1 space-y-0.5 border-l border-border pl-3 text-xs">
                          {projetos
                            .filter((p) => p.programaId === pg.id)
                            .map((p) => (
                              <li key={p.id} className="truncate text-muted-foreground/80">
                                {p.nome}
                              </li>
                            ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
