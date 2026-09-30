import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, SaudeTag, Stat, Tag } from "@/components/ui-kit";
import {
  cronograma,
  moeda,
  portfolioDoProjeto,
  programas,
  projetos,
  riscos,
  severidade,
  statusReports,
  tarefasKanban,
} from "@/lib/mock-data";

export const Route = createFileRoute("/projetos/$id")({
  loader: ({ params }) => {
    const projeto = projetos.find((p) => p.id === params.id);
    if (!projeto) throw notFound();
    return { projeto };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Projeto indisponível — Plataforma PPM" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.projeto.nome} — Plataforma PPM`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `Escopo, cronograma, custo, riscos e status reports do projeto ${loaderData.projeto.nome}.` },
        { property: "og:title", content: t },
        { property: "og:description", content: `Acompanhamento detalhado do projeto ${loaderData.projeto.nome}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DetalheProjeto,
});

const abas = ["Visão geral", "Cronograma", "Kanban", "Riscos", "Status reports"] as const;

function DetalheProjeto() {
  const { projeto } = Route.useLoaderData();
  const [aba, setAba] = useState<(typeof abas)[number]>(
    projeto.metodologia === "Ágil" ? "Kanban" : "Cronograma",
  );
  const programa = programas.find((p) => p.id === projeto.programaId);
  const portfolio = portfolioDoProjeto(projeto);
  const riscosProjeto = riscos.filter((r) => r.origem === portfolio?.nome || r.categoria === "Projeto").slice(0, 4);
  const totalSemanas = 90;

  return (
    <AppShell
      title={projeto.nome}
      description={`${portfolio?.nome} · ${programa?.nome} · Gerente: ${projeto.gerente}`}
      actions={
        <>
          <Link
            to="/projetos"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Voltar
          </Link>
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Novo status report
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Progresso" value={`${projeto.progresso}%`} hint={projeto.status} />
        <Stat
          label="Custo executado"
          value={moeda(projeto.executado)}
          hint={`de ${moeda(projeto.orcamento)}`}
        />
        <Stat
          label="Prazo"
          value={new Date(projeto.fim).toLocaleDateString("pt-BR")}
          hint={`início ${new Date(projeto.inicio).toLocaleDateString("pt-BR")}`}
        />
        <div className="panel flex flex-col justify-center gap-2 p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Saúde e metodologia</p>
          <div className="flex flex-wrap gap-2">
            <SaudeTag saude={projeto.saude} />
            <Tag tom="accent">{projeto.metodologia}</Tag>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {abas.map((a) => (
          <button
            key={a}
            onClick={() => setAba(a)}
            className={
              aba === a
                ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                : "rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            }
          >
            {a}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {aba === "Visão geral" && (
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <PanelTitle title="Escopo e entregas" />
              <ul className="space-y-3 text-sm">
                {["Descoberta e mapeamento de jornadas", "Plataforma base e design system", "Integração com autenticação federada", "Catálogo de serviços digitais", "Homologação assistida e publicação"].map(
                  (e, i) => (
                    <li key={e} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <div className="min-w-0">
                        <p className="truncate">{e}</p>
                        <div className="mt-1.5">
                          <Barra valor={Math.max(0, 100 - i * 22)} />
                        </div>
                      </div>
                      <span className="num shrink-0 text-xs text-muted-foreground">
                        {Math.max(0, 100 - i * 22)}%
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </Panel>
            <Panel>
              <PanelTitle title="Recursos e qualidade" />
              <dl className="space-y-3 text-sm">
                {[
                  ["Equipe alocada", "14 pessoas"],
                  ["Alocação média", "78%"],
                  ["Defeitos abertos", "9"],
                  ["Cobertura de testes", "72%"],
                  ["Aceite de entregas", "5 de 7"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                    <dt className="truncate text-muted-foreground">{k}</dt>
                    <dd className="num shrink-0 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        )}

        {aba === "Cronograma" && (
          <Panel>
            <PanelTitle title="Cronograma (Gantt)" hint="90 semanas" />
            <div className="space-y-3">
              {cronograma.map((f) => (
                <div key={f.fase} className="grid grid-cols-[minmax(0,1fr)] gap-1.5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-3">
                  <p className="truncate text-sm">{f.fase}</p>
                  <div className="relative h-7 rounded-md bg-muted">
                    <div
                      className="absolute top-0 h-7 rounded-md bg-primary/15"
                      style={{ left: `${(f.inicio / totalSemanas) * 100}%`, width: `${(f.duracao / totalSemanas) * 100}%` }}
                    >
                      <div
                        className="h-full rounded-md bg-accent"
                        style={{ width: `${f.progresso}%` }}
                      />
                      <span className="num absolute inset-y-0 right-1.5 flex items-center text-[10px] text-foreground/70">
                        {f.progresso}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {aba === "Kanban" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Object.entries(tarefasKanban).map(([coluna, itens]) => (
              <div key={coluna} className="panel p-4">
                <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate text-xs font-semibold uppercase tracking-wide">{coluna}</p>
                  <span className="num shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {itens.length}
                  </span>
                </div>
                <ul className="space-y-2">
                  {itens.map((t) => (
                    <li key={t.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm">{t.titulo}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                          {t.responsavel}
                        </span>
                        <Tag>{t.pontos} pts</Tag>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {aba === "Riscos" && (
          <Panel>
            <PanelTitle title="Riscos do projeto" />
            <ul className="space-y-3">
              {riscosProjeto.map((r) => {
                const s = severidade(r.probabilidade, r.impacto);
                return (
                  <li key={r.id} className="rounded-lg border border-border p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <p className="min-w-0 font-medium">{r.nome}</p>
                      <Tag tom={s.nivel === "Crítico" ? "danger" : s.nivel === "Alto" ? "accent" : "info"}>
                        {s.nivel}
                      </Tag>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.plano}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {r.responsavel} · prazo {new Date(r.prazo).toLocaleDateString("pt-BR")}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Panel>
        )}

        {aba === "Status reports" && (
          <Panel>
            <PanelTitle title="Status reports periódicos" hint="atualização colaborativa" />
            <ul className="space-y-3">
              {statusReports.map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="truncate font-medium">{s.periodo}</p>
                    <SaudeTag saude={s.saude} />
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.resumo}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Registrado por {s.autor}</p>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
