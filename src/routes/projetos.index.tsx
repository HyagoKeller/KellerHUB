import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Pencil } from "lucide-react";
import { Barra, Panel, SaudeTag, Stat } from "@/components/ui-kit";
import { EtiquetaCelula } from "@/components/EtiquetaCelula";
import { FormProjeto } from "@/components/FormulariosCarteira";
import { carteira, portfolioDe, useCarteira } from "@/lib/carteira";
import { moeda, type Projeto } from "@/lib/mock-data";

export const Route = createFileRoute("/projetos/")({
  head: () => ({
    meta: [
      { title: "Projetos — Plataforma PPM" },
      {
        name: "description",
        content:
          "Carteira de projetos com metodologias PMBOK, Ágil e híbrida, controle de prazo, custo, escopo e riscos.",
      },
      { property: "og:title", content: "Projetos — Plataforma PPM" },
      {
        property: "og:description",
        content: "Acompanhe prazo, custo, progresso e saúde de toda a carteira de projetos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projetos,
});

function Projetos() {
  const { projetos, portfolios, etiquetas, programas } = useCarteira();
  const filtros = ["Todas", ...etiquetas.metodologia.map((e) => e.nome)];
  const [filtro, setFiltro] = useState<string>("Todas");
  const [form, setForm] = useState<{ aberto: boolean; projeto?: Projeto }>({ aberto: false });
  const lista = projetos.filter((p) => filtro === "Todas" || p.metodologia === filtro);

  return (
    <AppShell
      title="Gestão de Projetos"
      description="Carteira completa com controle de escopo, prazo, custo, qualidade, riscos e recursos, por metodologia."
      actions={
        <button
          onClick={() => setForm({ aberto: true })}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Novo projeto
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Projetos" value={String(projetos.length)} />
        <Stat label="Em execução" value={String(projetos.filter((p) => p.status === "Em execução").length)} />
        <Stat
          label="Em risco ou suspensos"
          value={String(projetos.filter((p) => ["Em risco", "Suspenso"].includes(p.status)).length)}
          delta={{ texto: "requer ação", tom: "down" }}
        />
        <Stat label="Custo executado" value={moeda(projetos.reduce((a, p) => a + p.executado, 0))} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={
              filtro === f
                ? "rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                : "rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            }
          >
            {f}
          </button>
        ))}
      </div>

      <Panel className="mt-4 overflow-x-auto p-0">
        <table className="w-full min-w-[1040px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Projeto</th>
              <th className="px-5 py-3 font-medium">Portfólio</th>
              <th className="px-5 py-3 font-medium">Metodologia</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Prazo</th>
              <th className="px-5 py-3 font-medium">Custo</th>
              <th className="px-5 py-3 font-medium">Progresso</th>
              <th className="px-5 py-3 font-medium">Saúde</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => {
              const pg = programas.find((x) => x.id === p.programaId);
              return (
                <tr key={p.id} className="border-b border-border/70 last:border-0 hover:bg-muted/40">
                  <td className="max-w-[260px] px-5 py-3">
                    <Link to="/projetos/$id" params={{ id: p.id }} className="block min-w-0">
                      <span className="block truncate font-medium hover:underline">{p.nome}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {pg?.nome} · {p.gerente}
                      </span>
                    </Link>
                  </td>
                  <td className="max-w-[160px] truncate px-5 py-3 text-muted-foreground">
                    {portfolioDe(p, portfolios)?.nome}
                  </td>
                  <td className="px-5 py-3">
                    <EtiquetaCelula
                      coluna="metodologia"
                      valor={p.metodologia}
                      onChange={(v) => carteira.atualizarProjeto(p.id, { metodologia: v })}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <EtiquetaCelula
                      coluna="status"
                      valor={p.status}
                      onChange={(v) => carteira.atualizarProjeto(p.id, { status: v })}
                    />
                  </td>
                  <td className="num whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">
                    {new Date(p.inicio).toLocaleDateString("pt-BR")} →{" "}
                    {new Date(p.fim).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="num whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">
                    {moeda(p.executado)} / {moeda(p.orcamento)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex w-32 items-center gap-2">
                      <Barra valor={p.progresso} />
                      <span className="num text-xs">{p.progresso}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <SaudeTag saude={p.saude} />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      aria-label={`Editar ${p.nome}`}
                      onClick={() => setForm({ aberto: true, projeto: p })}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
      <FormProjeto aberto={form.aberto} projeto={form.projeto} onClose={() => setForm({ aberto: false })} />
    </AppShell>
  );
}
