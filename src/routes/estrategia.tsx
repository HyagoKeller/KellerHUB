import { createFileRoute } from "@tanstack/react-router";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, Stat, Tag } from "@/components/ui-kit";
import { objetivos, portfolioDoProjeto, programas, projetos } from "@/lib/mock-data";

export const Route = createFileRoute("/estrategia")({
  head: () => ({
    meta: [
      { title: "Gestão Estratégica — Hepta Project PPM" },
      {
        name: "description",
        content:
          "Objetivos estratégicos institucionais, metas e alinhamento de projetos e programas ao planejamento.",
      },
      { property: "og:title", content: "Gestão Estratégica — Hepta Project PPM" },
      {
        property: "og:description",
        content: "Meça o quanto os objetivos estratégicos são atendidos pelos projetos vinculados.",
      },
    ],
  }),
  component: Estrategia,
});

function Estrategia() {
  const radar = objetivos.map((o) => ({ objetivo: o.codigo, aderencia: o.aderencia }));

  return (
    <AppShell
      title="Gestão Estratégica"
      description="Objetivos e metas institucionais com alinhamento rastreável dos projetos e programas que os sustentam."
      actions={
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Novo objetivo
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Objetivos estratégicos" value={String(objetivos.length)} />
        <Stat
          label="Aderência média"
          value={`${Math.round(objetivos.reduce((a, o) => a + o.aderencia, 0) / objetivos.length)}%`}
        />
        <Stat
          label="Iniciativas alinhadas"
          value={String(projetos.length + programas.length)}
          hint={`${projetos.length} projetos · ${programas.length} programas`}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelTitle title="Objetivos estratégicos" hint="aderência das iniciativas" />
          <ul className="space-y-3">
            {objetivos.map((o) => {
              const vinculados = projetos.filter((p) => p.objetivoId === o.id);
              return (
                <li key={o.id} className="rounded-lg border border-border p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tom="accent">{o.codigo}</Tag>
                        <Tag>{o.perspectiva}</Tag>
                      </div>
                      <p className="mt-2 truncate font-medium">{o.nome}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Meta: {o.meta} · Responsável: {o.responsavel}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num font-display text-xl font-bold">{o.aderencia}%</p>
                      <p className="text-[11px] text-muted-foreground">aderência</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Barra valor={o.aderencia} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {vinculados.map((p) => (
                      <span
                        key={p.id}
                        className="truncate rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground"
                      >
                        {p.nome} · {portfolioDoProjeto(p)?.nome}
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelTitle title="Desempenho estratégico" />
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar} outerRadius="72%">
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="objetivo" fontSize={11} />
                  <Radar
                    dataKey="aderencia"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel>
            <PanelTitle title="Perspectivas" />
            <ul className="space-y-2 text-sm">
              {["Cidadão", "Processos", "Governança", "Pessoas"].map((perspectiva) => {
                const grupo = objetivos.filter((o) => o.perspectiva === perspectiva);
                const media = grupo.length
                  ? Math.round(grupo.reduce((a, o) => a + o.aderencia, 0) / grupo.length)
                  : 0;
                return (
                  <li key={perspectiva} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate">{perspectiva}</p>
                      <div className="mt-1.5">
                        <Barra valor={media} tom="info" />
                      </div>
                    </div>
                    <span className="num shrink-0 text-xs text-muted-foreground">{media}%</span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
