import { createFileRoute, Link } from "@tanstack/react-router";
import { ContadorAtualizacoes, PainelAtualizacoes, type ContextoAtualizacao } from "@/components/AtualizacoesProjeto";
import { StatusReportsProjeto } from "@/components/StatusReports";
import { ElementosProjeto } from "@/components/ElementosProjeto";
import { Button } from "@/components/ui/button";
import { EtiquetaCelula } from "@/components/EtiquetaCelula";
import { FormProjeto } from "@/components/FormulariosCarteira";
import { carteira, portfolioDe, useCarteira } from "@/lib/carteira";
import { useState } from "react";
import { Moeda, PainelAcesso } from "@/components/Acesso";
import { useCarteiraVisivel } from "@/lib/acesso";
import { AppShell } from "@/components/AppShell";
import { Barra, Panel, PanelTitle, SaudeTag, Stat, Tag } from "@/components/ui-kit";
import {moeda,severidade,type Projeto} from "@/lib/ppm-types";

export const Route = createFileRoute("/_authenticated/projetos/$id")({
  head: () => {
    const t = `${"Projeto"} | Keller Hub`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `Elementos, subelementos, atualizações, cronograma, custo e riscos do projeto ${"selecionado"}.` },
        { property: "og:title", content: t },
        { property: "og:description", content: `Acompanhamento de elementos, subelementos e execução do projeto ${"selecionado"}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DetalheProjeto,
});

const abas = ["Visão geral", "Elementos", "Cronograma", "Kanban", "Riscos", "Relatórios de situação", "Acesso"] as const;

function DetalheProjeto() {
  const { id } = Route.useParams();
  const { projetos: lista } = useCarteiraVisivel();
  const projeto = lista.find((p) => p.id === id);
  if (!projeto) {
    return (
      <AppShell title="Projeto não encontrado" description="Ele pode ter sido excluído ou não está visível para o seu acesso.">
        <Link to="/projetos" className="text-sm text-primary hover:underline">Voltar para projetos</Link>
      </AppShell>
    );
  }
  return <Detalhe key={projeto.id} projeto={projeto} />;
}

function Detalhe({ projeto }: { projeto: Projeto }) {
  const { portfolios, programas } = useCarteira();
  const { ocultarValores, podeEditar, usuario, riscos,cronograma,tarefas,elementos } = useCarteiraVisivel();
  const [editar, setEditar] = useState(false);
  const [atualizacoes, setAtualizacoes] = useState<ContextoAtualizacao>();
  const [aba, setAba] = useState<(typeof abas)[number]>(
    projeto.metodologia === "Ágil" ? "Kanban" : "Cronograma",
  );
  const programa = programas.find((p) => p.id === projeto.programaId);
  const portfolio = portfolioDe(projeto, portfolios);
  const riscosProjeto = riscos.filter((r) => r.origem === portfolio?.nome || r.origem === projeto.nome).slice(0, 4);
  const tarefasKanban=Object.fromEntries(["Backlog","A fazer","Em andamento","Revisão","Concluído"].map(c=>[c,tarefas.filter(t=>t.projetoId===projeto.id&&t.status===c)]));
  const totalSemanas = Math.max(1,...cronograma.filter(f=>f.projetoId===projeto.id).map(f=>f.inicio+f.duracao));
  const cronogramaProjeto = cronograma.filter((fase) => fase.projetoId === projeto.id);

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
          <ContadorAtualizacoes projetoId={projeto.id} alvoTipo="projeto" alvoId={projeto.id} titulo={projeto.nome} onClick={() => setAtualizacoes({ projetoId: projeto.id, alvoTipo: "projeto", alvoId: projeto.id, titulo: projeto.nome })} />
          {podeEditar("projeto", projeto.id) && <Button
            variant="outline"
            onClick={() => setEditar(true)}
          >
            Editar projeto
          </Button>}

        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Progresso" value={`${projeto.progresso}%`} hint={projeto.status} />
        <Stat
          label="Custo executado"
          value={<Moeda v={projeto.executado} />}
          hint={ocultarValores ? "Valor restrito ao seu perfil" : `de ${moeda(projeto.orcamento)}`}
        />
        <Stat
          label="Prazo"
          value={new Date(projeto.fim).toLocaleDateString("pt-BR")}
          hint={`início ${new Date(projeto.inicio).toLocaleDateString("pt-BR")}`}
        />
        <div className="panel flex flex-col justify-center gap-2 p-5">
          <p className="text-xs text-muted-foreground">Saúde e metodologia</p>
          <div className="flex flex-wrap gap-2">
            <SaudeTag saude={projeto.saude} />
            <EtiquetaCelula
              disabled={!podeEditar("projeto",projeto.id)} coluna="metodologia"
              valor={projeto.metodologia}
              onChange={(v) => carteira.atualizarProjeto(projeto.id, { metodologia: v })}
            />
            <EtiquetaCelula
              disabled={!podeEditar("projeto",projeto.id)} coluna="status"
              valor={projeto.status}
              onChange={(v) => carteira.atualizarProjeto(projeto.id, { status: v })}
            />
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
                ? "rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground"
                : "rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            }
          >
            {a}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {aba === "Acesso" && (
          <Panel className="max-w-3xl">
            <PanelTitle title="Acesso" hint="área, visibilidade e convidados" />
            <PainelAcesso tipo="projeto" id={projeto.id} nome={projeto.nome} />
          </Panel>
        )}
        {aba === "Visão geral" && (
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <PanelTitle title="Escopo e entregas" />
              <ul className="space-y-3 text-sm">
                {elementos.filter(e=>e.projetoId===projeto.id).map(e=><li key={e.id}><p>{e.nome}</p><Barra valor={e.progresso}/></li>)}
              </ul>
            </Panel>
            <Panel>
              <PanelTitle title="Recursos e qualidade" />
              <dl className="space-y-3 text-sm">
                <p className="text-muted-foreground">Nenhum registro de recursos ou qualidade disponível.</p>
              </dl>
            </Panel>
          </div>
        )}

        {aba === "Elementos" && (
          <ElementosProjeto projetoId={projeto.id} podeEditar={podeEditar("projeto", projeto.id)} onAtualizacoes={setAtualizacoes} />
        )}

        {aba === "Cronograma" && (
          <Panel>
            <PanelTitle title="Cronograma (Gantt)" hint={cronogramaProjeto.length ? `${Math.ceil(totalSemanas)} semanas` : "sem fases cadastradas"} />
            {cronogramaProjeto.length ? <div className="space-y-3">
              {cronogramaProjeto.map((f) => (
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
            </div> : <p className="text-sm text-muted-foreground">Nenhuma fase cadastrada para este projeto.</p>}
          </Panel>
        )}

        {aba === "Kanban" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Object.entries(tarefasKanban).map(([coluna, itens]) => (
              <div key={coluna} className="panel p-4">
                <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate text-xs font-semibold ">{coluna}</p>
                  <span className="num shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
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

        {aba === "Relatórios de situação" && <StatusReportsProjeto projeto={projeto} podeEditar={podeEditar("projeto", projeto.id)} />}
      </div>
      <FormProjeto aberto={editar} projeto={projeto} onClose={() => setEditar(false)} />
      <PainelAtualizacoes contexto={atualizacoes} onClose={() => setAtualizacoes(undefined)} podePublicar={podeEditar("projeto", projeto.id)} autor={usuario.nome} />
    </AppShell>
  );
}
