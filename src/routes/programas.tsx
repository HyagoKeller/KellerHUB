import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import { FormPrograma } from "@/components/FormulariosCarteira";
import { useCarteira } from "@/lib/carteira";
import type { Programa } from "@/lib/ppm-types";
import { BotaoAcesso, DialogoAcesso, Moeda, SeloAcesso, AvisoAreas } from "@/components/Acesso";
import { useCarteiraVisivel } from "@/lib/acesso";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, SaudeTag, Stat } from "@/components/ui-kit";

export const Route = createFileRoute("/programas")({
  head: () => ({
    meta: [
      { title: "Programas | Keller Hub" },
      {
        name: "description",
        content:
          "Programas institucionais com metas, objetivos e hierarquia rastreável entre portfólio, programa e projetos.",
      },
      { property: "og:title", content: "Programas | Keller Hub" },
      {
        property: "og:description",
        content: "Acompanhe metas de programas e a hierarquia portfólio → programa → projeto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Programas,
});

function Programas() {
  const { portfolios, programas, projetos, podeEditar, podeCriar } = useCarteiraVisivel();
  const [acessoDe, setAcessoDe] = useState<Programa | undefined>();
  void useCarteira;
  const [form, setForm] = useState<{ aberto: boolean; programa?: Programa }>({ aberto: false });
  return (
    <AppShell
      title="Gestão de Programas"
      description="Metas, objetivos e projetos subordinados, com visualização hierárquica portfólio → programa → projeto."
      actions={
        podeCriar && <button onClick={() => setForm({ aberto: true })} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Novo programa
        </button>
      }
    >
      <AvisoAreas />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Programas ativos" value={String(programas.length)} />
        <Stat
          label="Metas acompanhadas"
          value={String(programas.reduce((a, p) => a + p.metas.length, 0))}
        />
        <Stat
          label="Progresso médio"
          value={`${Math.round(programas.reduce((a, p) => a + p.progresso, 0) / Math.max(1, programas.length))}%`}
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
                    <p className="truncate text-[11px] text-muted-foreground">
                      {pf?.nome}
                    </p>
                    <h3 className="flex items-center gap-2 truncate font-display text-lg font-semibold">{pg.nome} <SeloAcesso tipo="programa" id={pg.id} /></h3>
                    <p className="mt-1 text-sm text-muted-foreground">{pg.objetivo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SaudeTag saude={pg.saude} />
                    <BotaoAcesso nome={pg.nome} onClick={() => setAcessoDe(pg)} />
                    {podeEditar("programa", pg.id) && <button aria-label="Editar programa" onClick={() => setForm({ aberto: true, programa: pg })} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>}
                  </div>
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
                  <p className="mb-2 text-[11px] text-muted-foreground">
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
                          <span className="flex min-w-0 items-center gap-1.5 truncate text-sm">{p.nome} <SeloAcesso tipo="projeto" id={p.id} /></span>
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
      <DialogoAcesso tipo="programa" id={acessoDe?.id} nome={acessoDe?.nome} onClose={() => setAcessoDe(undefined)} />
      <FormPrograma aberto={form.aberto} programa={form.programa} onClose={() => setForm({ aberto: false })} />
    </AppShell>
  );
}
