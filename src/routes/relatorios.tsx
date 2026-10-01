import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileJson,
  FileSpreadsheet,
  Globe,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel, PanelTitle, Stat, Tag } from "@/components/ui-kit";
import { auditoria, relatorios } from "@/lib/mock-data";
import { useAcessoEstado } from "@/lib/acesso";
import type { Perfil } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios e Publicação | Plataforma PPM" },
      {
        name: "description",
        content:
          "Publicação de painéis com link público ou link autenticado restrito a perfis liberados, exportação em CSV, XLSX e JSON e trilha de auditoria.",
      },
      { property: "og:title", content: "Relatórios e Publicação | Plataforma PPM" },
      {
        property: "og:description",
        content:
          "Escolha entre link público, link autenticado ou acesso restrito por perfil, com permissões granulares por ação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Relatorios,
});

const perfis: Perfil[] = ["Técnico", "Gestor", "Alta Administração"];

const perfisInfo = [
  {
    nome: "Técnico",
    detalhe: "Dados operacionais completos das iniciativas sob sua responsabilidade.",
    itens: ["Tarefas e entregas", "Riscos do projeto", "Base bruta de indicadores"],
  },
  {
    nome: "Gestor",
    detalhe: "Visão gerencial de portfólios, programas e riscos da sua área.",
    itens: ["Status reports", "Execução orçamentária", "Matriz de riscos"],
  },
  {
    nome: "Alta Administração",
    detalhe: "Visão agregada e estratégica, sem detalhe operacional.",
    itens: ["Painel executivo", "Aderência estratégica", "Riscos críticos"],
  },
];

type Acesso = "publico" | "autenticado" | "restrito";

const acessoInfo: Record<
  Acesso,
  { label: string; hint: string; icon: typeof Globe; cls: string }
> = {
  publico: {
    label: "Link público",
    hint: "Qualquer pessoa com o link visualiza, sem login.",
    icon: Globe,
    cls: "border-warning/40 bg-warning/15 text-warning",
  },
  autenticado: {
    label: "Link autenticado",
    hint: "Exige login institucional; qualquer usuário da organização acessa.",
    icon: Lock,
    cls: "border-info/40 bg-info/15 text-info",
  },
  restrito: {
    label: "Perfis liberados",
    hint: "Exige login e libera apenas os perfis marcados.",
    icon: Users,
    cls: "border-success/40 bg-success/15 text-success",
  },
};

type Publicacao = {
  acesso: Acesso;
  perfis: Perfil[];
  publicado: boolean;
  acoes: Record<Perfil, { ver: boolean; exportar: boolean; compartilhar: boolean }>;
};

const acoesPadrao = (
  ver: Perfil[],
  exportar: Perfil[],
  compartilhar: Perfil[],
): Publicacao["acoes"] =>
  perfis.reduce(
    (acc, p) => {
      acc[p] = {
        ver: ver.includes(p),
        exportar: exportar.includes(p),
        compartilhar: compartilhar.includes(p),
      };
      return acc;
    },
    {} as Publicacao["acoes"],
  );

const publicacaoInicial: Record<string, Publicacao> = {
  "rl-1": {
    acesso: "restrito",
    perfis: ["Alta Administração"],
    publicado: true,
    acoes: acoesPadrao(["Alta Administração", "Gestor"], ["Alta Administração"], ["Alta Administração"]),
  },
  "rl-2": {
    acesso: "autenticado",
    perfis: ["Gestor", "Alta Administração"],
    publicado: true,
    acoes: acoesPadrao(["Técnico", "Gestor", "Alta Administração"], ["Gestor", "Alta Administração"], ["Gestor"]),
  },
  "rl-3": {
    acesso: "restrito",
    perfis: ["Gestor"],
    publicado: false,
    acoes: acoesPadrao(["Gestor"], ["Gestor"], []),
  },
  "rl-4": {
    acesso: "autenticado",
    perfis: ["Técnico", "Gestor"],
    publicado: true,
    acoes: acoesPadrao(["Técnico", "Gestor"], ["Técnico", "Gestor"], []),
  },
  "rl-5": {
    acesso: "publico",
    perfis: [],
    publicado: false,
    acoes: acoesPadrao(["Alta Administração"], ["Alta Administração"], ["Alta Administração"]),
  },
};

const linkDe = (id: string, acesso: Acesso) =>
  acesso === "publico"
    ? `hepta.gov.br/p/${id}`
    : `hepta.gov.br/app/relatorios/${id}`;

function Relatorios() {
  const logAcesso = useAcessoEstado().log;
  const [pub, setPub] = useState(publicacaoInicial);
  const [selecionado, setSelecionado] = useState(relatorios[0].id);
  const [copiado, setCopiado] = useState<string | null>(null);

  const atual = pub[selecionado];
  const relatorioAtual = relatorios.find((r) => r.id === selecionado)!;

  const definirAcesso = (id: string, acesso: Acesso) =>
    setPub((p) => ({ ...p, [id]: { ...p[id], acesso } }));

  const alternarPerfil = (id: string, perfil: Perfil) =>
    setPub((p) => ({
      ...p,
      [id]: {
        ...p[id],
        perfis: p[id].perfis.includes(perfil)
          ? p[id].perfis.filter((x) => x !== perfil)
          : [...p[id].perfis, perfil],
      },
    }));

  const alternarAcao = (
    id: string,
    perfil: Perfil,
    acao: "ver" | "exportar" | "compartilhar",
  ) =>
    setPub((p) => ({
      ...p,
      [id]: {
        ...p[id],
        acoes: {
          ...p[id].acoes,
          [perfil]: { ...p[id].acoes[perfil], [acao]: !p[id].acoes[perfil][acao] },
        },
      },
    }));

  const alternarPublicado = (id: string) =>
    setPub((p) => ({ ...p, [id]: { ...p[id], publicado: !p[id].publicado } }));

  const copiar = async (id: string) => {
    const link = `https://${linkDe(id, pub[id].acesso)}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard indisponível no preview */
    }
    setCopiado(id);
    setTimeout(() => setCopiado(null), 1600);
  };

  const publicados = Object.values(pub).filter((p) => p.publicado).length;
  const publicos = Object.values(pub).filter((p) => p.publicado && p.acesso === "publico").length;

  return (
    <AppShell
      title="Relatórios e Publicação"
      description="Publique painéis com link público, link autenticado ou acesso restrito aos perfis liberados, com permissões granulares por ação."
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
            <FileSpreadsheet className="h-4 w-4" /> XLSX
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
            <FileJson className="h-4 w-4" /> JSON
          </button>
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Publicar relatório
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Painéis publicados" value={String(publicados)} hint={`${publicos} com link público`} />
        <Stat label="Modelos disponíveis" value={String(relatorios.length)} />
        <Stat label="Eventos auditados (30d)" value="1.482" hint="usuário, data/hora e ação" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2 overflow-x-auto p-0" rule="primary">
          <div className="p-5 pb-3">
            <PanelTitle title="Publicação de painéis" hint="selecione para gerenciar o acesso" />
          </div>
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase  text-muted-foreground">
                <th className="px-5 py-3 font-medium">Relatório</th>
                <th className="px-5 py-3 font-medium">Acesso</th>
                <th className="px-5 py-3 font-medium">Perfis liberados</th>
                <th className="px-5 py-3 font-medium">Link</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map((r) => {
                const p = pub[r.id];
                const info = acessoInfo[p.acesso];
                const Icone = info.icon;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelecionado(r.id)}
                    className={cn(
                      "cursor-pointer border-b border-border/70 last:border-0 hover:bg-muted/40",
                      selecionado === r.id && "bg-muted/60",
                    )}
                  >
                    <td className="max-w-[240px] px-5 py-3">
                      <span className="block truncate font-medium">{r.nome}</span>
                      <span className="num block text-xs text-muted-foreground">
                        {r.formato} · {r.atualizado}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("chip", info.cls)}>
                        <Icone className="h-3 w-3" /> {info.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.acesso === "restrito" ? (
                        <div className="flex flex-wrap gap-1.5">
                          {p.perfis.length ? (
                            p.perfis.map((x) => <Tag key={x}>{x}</Tag>)
                          ) : (
                            <span className="text-xs text-destructive">nenhum perfil</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {p.acesso === "publico" ? "Aberto ao público" : "Toda a organização"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="num block max-w-[190px] truncate text-xs text-muted-foreground">
                        {p.publicado ? linkDe(r.id, p.acesso) : "não publicado"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        <button
                          aria-label="Copiar link"
                          onClick={(e) => {
                            e.stopPropagation();
                            copiar(r.id);
                          }}
                          disabled={!p.publicado}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                        >
                          {copiado === r.id ? (
                            <Check className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          aria-label="Baixar"
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel rule="accent">
          <PanelTitle title="Gestão de acesso" hint={relatorioAtual.nome} />
          <div className="space-y-4">
            <div>
              <p className="eyebrow mb-2 text-muted-foreground">Forma de publicação</p>
              <div className="space-y-2">
                {(Object.keys(acessoInfo) as Acesso[]).map((a) => {
                  const info = acessoInfo[a];
                  const Icone = info.icon;
                  return (
                    <button
                      key={a}
                      onClick={() => definirAcesso(selecionado, a)}
                      className={cn(
                        "w-full rounded-xl border p-3 text-left transition-colors",
                        atual.acesso === a
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Icone className="h-4 w-4 shrink-0" /> {info.label}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">{info.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {atual.acesso === "restrito" && (
              <div>
                <p className="eyebrow mb-2 text-muted-foreground">Perfis com acesso ao link</p>
                <div className="flex flex-wrap gap-2">
                  {perfis.map((p) => (
                    <button
                      key={p}
                      onClick={() => alternarPerfil(selecionado, p)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                        atual.perfis.includes(p)
                          ? "border-success/50 bg-success/15 text-success"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card/60 p-3">
              <p className="eyebrow text-muted-foreground">Link de publicação</p>
              <p className="num mt-1.5 break-all text-xs text-foreground">
                https://{linkDe(selecionado, atual.acesso)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => alternarPublicado(selecionado)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90",
                    atual.publicado
                      ? "border border-border text-muted-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {atual.publicado ? "Despublicar" : "Publicar link"}
                </button>
                <button
                  onClick={() => copiar(selecionado)}
                  disabled={!atual.publicado}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiado === selecionado ? "Copiado" : "Copiar link"}
                </button>
              </div>
              {atual.acesso === "publico" && (
                <p className="mt-3 text-[11px] leading-relaxed text-warning">
                  Link público não exige login: publique apenas painéis sem dados pessoais ou
                  sensíveis.
                </p>
              )}
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4" rule="primary">
        <PanelTitle title="Permissões granulares por ação" hint={relatorioAtual.nome} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="eyebrow pb-3 pr-4 text-muted-foreground">Perfil</th>
                {(["ver", "exportar", "compartilhar"] as const).map((a) => (
                  <th key={a} className="eyebrow pb-3 pr-4 text-muted-foreground">
                    {a === "ver" ? "Visualizar" : a === "exportar" ? "Exportar" : "Compartilhar"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perfis.map((p) => (
                <tr key={p} className="border-b border-border/60">
                  <td className="py-3 pr-4 text-sm">{p}</td>
                  {(["ver", "exportar", "compartilhar"] as const).map((a) => (
                    <td key={a} className="py-3 pr-4">
                      <button
                        role="switch"
                        aria-checked={atual.acoes[p][a]}
                        aria-label={`${a}: ${p}`}
                        onClick={() => alternarAcao(selecionado, p, a)}
                        className={cn(
                          "inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-semibold transition-colors",
                          atual.acoes[p][a]
                            ? "border-success/50 bg-success/15 text-success"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {atual.acoes[p][a] ? <Check className="h-3 w-3" /> : null}
                        {atual.acoes[p][a] ? "Liberado" : "Bloqueado"}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Perfis sem visualização liberada não abrem o painel mesmo com o link autenticado em mãos.
        </p>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2 overflow-x-auto p-0">
          <div className="p-5 pb-3">
            <PanelTitle title="Trilha de auditoria" hint="quem, quando e o quê" />
          </div>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase  text-muted-foreground">
                <th className="px-5 py-3 font-medium">Data/hora</th>
                <th className="px-5 py-3 font-medium">Usuário</th>
                <th className="px-5 py-3 font-medium">Ação</th>
                <th className="px-5 py-3 font-medium">Entidade</th>
                <th className="px-5 py-3 font-medium">Detalhe</th>
              </tr>
            </thead>
            <tbody>
              {[...logAcesso, ...auditoria].map((a) => (
                <tr key={a.id} className="border-b border-border/70 last:border-0">
                  <td className="num whitespace-nowrap px-5 py-3 text-muted-foreground">{a.quando}</td>
                  <td className="px-5 py-3">
                    <span className="block truncate font-medium">{a.usuario}</span>
                    <span className="block truncate text-xs text-muted-foreground">{a.perfil}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Tag tom={a.acao === "Excluiu" ? "danger" : a.acao === "Criou" ? "success" : "neutro"}>
                      {a.acao}
                    </Tag>
                  </td>
                  <td className="max-w-[240px] truncate px-5 py-3 text-muted-foreground">{a.entidade}</td>
                  <td className="max-w-[200px] truncate px-5 py-3 text-muted-foreground">{a.detalhe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelTitle title="Perfis de acesso (RBAC)" />
            <ul className="space-y-3">
              {perfisInfo.map((p) => (
                <li key={p.nome} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
                    <p className="truncate font-medium">{p.nome}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.detalhe}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.itens.map((i) => (
                      <Tag key={i}>{i}</Tag>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelTitle title="Privacidade e conformidade" hint="LGPD · POSIC" />
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Links públicos exigem revisão prévia e não expõem dados pessoais.</li>
              <li>Links autenticados registram cada acesso na trilha de auditoria.</li>
              <li>Autenticação individual, sem contas compartilhadas, com perfis RBAC.</li>
              <li>Criptografia de dados sensíveis em trânsito e em repouso.</li>
              <li>Portabilidade em CSV, XLSX e JSON, sem lock-in tecnológico.</li>
            </ul>
            <button className="mt-4 w-full rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
              Exportar meus dados pessoais
            </button>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
