import { createFileRoute } from "@tanstack/react-router";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowUpRight, CheckCircle2, CircleDot, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, Stat, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { objetivos, programas, projetos } from "@/lib/mock-data";

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
        <Button><Plus /> Novo objetivo</Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <Stat label="Objetivos no ritmo" value="4 de 6" delta={{ texto: "+1 no trimestre", tom: "up" }} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <Panel rule="primary" className="relative xl:col-span-8">
          <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Sparkles className="h-5 w-5" /></div>
          <p className="eyebrow text-primary">Objetivo prioritário</p>
          <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold sm:text-3xl">{objetivos[0].nome}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{objetivos[0].meta} · liderança de {objetivos[0].responsavel}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div><div className="mb-2 flex justify-between text-xs"><span className="font-semibold">Aderência consolidada</span><span className="num">{objetivos[0].aderencia}%</span></div><Barra valor={objetivos[0].aderencia} tom="info" /></div>
            <Button variant="outline">Abrir mapa <ArrowUpRight /></Button>
          </div>
        </Panel>

        <Panel className="xl:col-span-4">
            <PanelTitle title="Desempenho estratégico" />
            <div className="h-56">
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

        <Panel className="xl:col-span-5">
            <PanelTitle title="Perspectivas" />
            <ul className="space-y-4 text-sm">
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

        <section className="grid gap-4 xl:col-span-7 md:grid-cols-2">
          {objetivos.slice(1).map((o, index) => {
            const vinculados = projetos.filter((p) => p.objetivoId === o.id);
            const tones = ["success", "info", "warning", "danger", "accent"] as const;
            const tone = tones[index % tones.length];
            return (
              <article key={o.id} className="panel group p-5 surface-hover">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-full bg-${tone}/15 text-${tone}`}>
                    {o.aderencia >= 70 ? <CheckCircle2 className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0"><p className="eyebrow text-muted-foreground">{o.codigo} · {o.perspectiva}</p><h3 className="mt-1 line-clamp-2 font-display text-base font-semibold">{o.nome}</h3></div>
                  <Tag tom={tone}>{o.aderencia >= 70 ? "No ritmo" : o.aderencia < 45 ? "Atenção" : "Em progresso"}</Tag>
                </div>
                <p className="mt-5 line-clamp-1 text-xs text-muted-foreground">{o.meta}</p>
                <div className="mt-4"><div className="mb-2 flex justify-between text-xs"><span>{vinculados.length} iniciativas</span><span className="num font-semibold">{o.aderencia}%</span></div><Barra valor={o.aderencia} tom="info" /></div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
