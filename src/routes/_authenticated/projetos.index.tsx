import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Paginacao } from "@/components/Paginacao";
import { usePaginacao } from "@/lib/paginacao";
import { ContadorAtualizacoes, PainelAtualizacoes, type ContextoAtualizacao } from "@/components/AtualizacoesProjeto";
import { BotaoAcesso, DialogoAcesso, Moeda, SeloAcesso, AvisoAreas } from "@/components/Acesso";
import { useCarteiraVisivel } from "@/lib/acesso";
import { AppShell } from "@/components/AppShell";
import { Pencil } from "lucide-react";
import { Barra, Panel, SaudeTag, Stat } from "@/components/ui-kit";
import { EtiquetaCelula } from "@/components/EtiquetaCelula";
import { FormProjeto } from "@/components/FormulariosCarteira";
import { carteira, portfolioDe, useCarteira } from "@/lib/carteira";
import { moeda, type Projeto } from "@/lib/ppm-types";

export const Route = createFileRoute("/_authenticated/projetos/")({
  head: () => ({
    meta: [
      { title: "Projetos | Keller Hub" },
      {
        name: "description",
        content:
          "Carteira de projetos com elementos, subelementos, atualizações, prazo, custo, escopo e riscos.",
      },
      { property: "og:title", content: "Projetos | Keller Hub" },
      {
        property: "og:description",
        content: "Acompanhe elementos, atualizações, prazo, custo, progresso e saúde da carteira de projetos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projetos,
});

function Projetos() {
  const { projetos, portfolios, etiquetas, programas, podeEditar, podeCriar, usuario } = useCarteiraVisivel();
  const [acessoDe, setAcessoDe] = useState<Projeto | undefined>();
  const [atualizacoes, setAtualizacoes] = useState<ContextoAtualizacao>();
  void useCarteira;
  const filtros = ["Todas", ...etiquetas.metodologia.map((e) => e.nome)];
  const [filtro, setFiltro] = useState<string>("Todas");
  const [form, setForm] = useState<{ aberto: boolean; projeto?: Projeto }>({ aberto: false });
  const lista = projetos.filter((p) => filtro === "Todas" || p.metodologia === filtro);
  const pag = usePaginacao(lista, 20, filtro);

  return (
    <AppShell
      title="Gestão de Projetos"
      description="Carteira completa com controle de escopo, prazo, custo, qualidade, riscos e recursos, por metodologia."
      actions={
        podeCriar && <button
          onClick={() => setForm({ aberto: true })}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Novo projeto
        </button>
      }
    >
      <AvisoAreas />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Projetos" value={String(projetos.length)} />
        <Stat label="Em execução" value={String(projetos.filter((p) => p.status === "Em execução").length)} />
        <Stat
          label="Em risco ou suspensos"
          value={String(projetos.filter((p) => ["Em risco", "Suspenso"].includes(p.status)).length)}
          delta={{ texto: "requer ação", tom: "down" }}
        />
        <Stat label="Custo executado" value={<Moeda v={projetos.reduce((a, p) => a + p.executado, 0)} />} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={
              filtro === f
                ? "rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                : "rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            }
          >
            {f}
          </button>
        ))}
      </div>

      <Panel className="mt-4 overflow-x-auto p-0">
        <table className="w-full min-w-[1040px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
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
            {pag.itens.map((p) => {
              const pg = programas.find((x) => x.id === p.programaId);
              return (
                <tr key={p.id} className="border-b border-border/70 last:border-0 hover:bg-muted/40">
                  <td className="max-w-[260px] px-5 py-3">
                    <Link to="/projetos/$id" params={{ id: p.id }} className="block min-w-0">
                      <span className="flex min-w-0 items-center gap-1.5"><span className="truncate font-medium hover:underline">{p.nome}</span><SeloAcesso tipo="projeto" id={p.id} /></span>
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
                      disabled={!podeEditar("projeto",p.id)} coluna="metodologia"
                      valor={p.metodologia}
                      onChange={(v) => carteira.atualizarProjeto(p.id, { metodologia: v })}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <EtiquetaCelula
                      disabled={!podeEditar("projeto",p.id)} coluna="status"
                      valor={p.status}
                      onChange={(v) => carteira.atualizarProjeto(p.id, { status: v })}
                    />
                  </td>
                  <td className="num whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">
                    {new Date(p.inicio).toLocaleDateString("pt-BR")} →{" "}
                    {new Date(p.fim).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="num whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">
                    <Moeda v={p.executado} /> / <Moeda v={p.orcamento} />
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
                    <div className="flex items-center">
                    <ContadorAtualizacoes projetoId={p.id} alvoTipo="projeto" alvoId={p.id} titulo={p.nome} onClick={() => setAtualizacoes({ projetoId: p.id, alvoTipo: "projeto", alvoId: p.id, titulo: p.nome })} />
                    <BotaoAcesso nome={p.nome} onClick={() => setAcessoDe(p)} />
                    {podeEditar("projeto", p.id) && <button
                      aria-label={`Editar ${p.nome}`}
                      onClick={() => setForm({ aberto: true, projeto: p })}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Paginacao {...pag} />
      </Panel>
      <DialogoAcesso tipo="projeto" id={acessoDe?.id} nome={acessoDe?.nome} onClose={() => setAcessoDe(undefined)} />
      <FormProjeto aberto={form.aberto} projeto={form.projeto} onClose={() => setForm({ aberto: false })} />
      <PainelAtualizacoes contexto={atualizacoes} onClose={() => setAtualizacoes(undefined)} podePublicar={Boolean(atualizacoes && podeEditar("projeto", atualizacoes.projetoId))} autor={usuario.nome} />
    </AppShell>
  );
}
