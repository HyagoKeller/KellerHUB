import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Link2, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel, PanelTitle, Tag } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import type { Perfil } from "@/lib/mock-data";
import { blocosPorEscopo, useViews, type EscopoView } from "@/lib/views";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações e Integrações — Hepta Project PPM" },
      {
        name: "description",
        content:
          "Integrações com Microsoft 365, Google Workspace e Power BI, segmentação por perfil de acesso e criação de views personalizadas.",
      },
      { property: "og:title", content: "Configurações e Integrações — Hepta Project PPM" },
      {
        property: "og:description",
        content:
          "Conecte Microsoft 365 e Google Workspace, defina permissões por perfil e monte views próprias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Configuracoes,
});

type Integracao = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  conectado: boolean;
  conta?: string;
};

const integracoesIniciais: Integracao[] = [
  {
    id: "m365",
    nome: "Microsoft 365",
    descricao: "Calendário, Outlook, Teams e arquivos do SharePoint vinculados a projetos.",
    categoria: "Produtividade",
    conectado: true,
    conta: "seinov.onmicrosoft.com",
  },
  {
    id: "google",
    nome: "Google Workspace",
    descricao: "Login único, Google Agenda e documentos do Drive nas entregas.",
    categoria: "Produtividade",
    conectado: true,
    conta: "orgao.gov.br",
  },
  {
    id: "teams",
    nome: "Microsoft Teams",
    descricao: "Notificações de riscos críticos e marcos em canais de programa.",
    categoria: "Comunicação",
    conectado: false,
  },
  {
    id: "powerbi",
    nome: "Power BI",
    descricao: "Publicação automática dos conjuntos de dados de indicadores.",
    categoria: "Análise",
    conectado: true,
    conta: "Workspace institucional",
  },
  {
    id: "slack",
    nome: "Slack",
    descricao: "Alertas de desvio de cronograma e aprovações pendentes.",
    categoria: "Comunicação",
    conectado: false,
  },
  {
    id: "jira",
    nome: "Jira Software",
    descricao: "Sincronização de sprints e backlog com os projetos ágeis.",
    categoria: "Execução",
    conectado: false,
  },
  {
    id: "kiro",
    nome: "Kiro",
    descricao: "Assistente de especificações e tarefas técnicas vinculado às entregas dos projetos.",
    categoria: "Execução",
    conectado: false,
  },

  {
    id: "sso",
    nome: "SSO SAML / Entra ID",
    descricao: "Autenticação corporativa com provisionamento automático de usuários.",
    categoria: "Segurança",
    conectado: true,
    conta: "Entra ID · SCIM ativo",
  },
];

const perfis: Perfil[] = ["Técnico", "Gestor", "Alta Administração"];

const permissoes = [
  { recurso: "Cadastro de projetos e cronogramas", tecnico: "Editar", gestor: "Editar", alta: "Ler" },
  { recurso: "Portfólios e priorização", tecnico: "Ler", gestor: "Editar", alta: "Editar" },
  { recurso: "Indicadores e metas", tecnico: "Lançar valores", gestor: "Editar", alta: "Ler" },
  { recurso: "Riscos e planos de resposta", tecnico: "Editar", gestor: "Editar", alta: "Ler" },
  { recurso: "Relatórios executivos e exportações", tecnico: "—", gestor: "Gerar", alta: "Gerar" },
  { recurso: "Trilha de auditoria e LGPD", tecnico: "—", gestor: "Ler", alta: "Ler" },
  { recurso: "Integrações e configurações", tecnico: "—", gestor: "—", alta: "Administrar" },
];

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
        on ? "border-success/50 bg-success/80" : "border-border bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all",
          on ? "left-6" : "left-0.5",
        )}
      />
    </button>
  );
}

function Configuracoes() {
  const [integracoes, setIntegracoes] = useState(integracoesIniciais);
  const { views, criar, remover } = useViews();

  const [escopo, setEscopo] = useState<EscopoView>("executiva");
  const [nome, setNome] = useState("");
  const [blocos, setBlocos] = useState<string[]>([]);
  const [perfisView, setPerfisView] = useState<Perfil[]>(["Gestor"]);

  const alternar = (id: string) =>
    setIntegracoes((atual) =>
      atual.map((i) => (i.id === id ? { ...i, conectado: !i.conectado } : i)),
    );

  const alternarBloco = (id: string) =>
    setBlocos((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));

  const alternarPerfil = (p: Perfil) =>
    setPerfisView((v) => (v.includes(p) ? v.filter((x) => x !== p) : [...v, p]));

  const salvarView = () => {
    if (!nome.trim() || blocos.length === 0) return;
    criar({ nome: nome.trim(), escopo, blocos, perfis: perfisView });
    setNome("");
    setBlocos([]);
  };

  return (
    <AppShell
      title="Configurações"
      description="Integrações institucionais, segmentação de acesso por perfil e criação de views personalizadas sem alterar as visões padrão."
    >
      <Panel rule="primary">
        <PanelTitle title="Integrações" hint="conexões institucionais" />
        <div className="grid gap-3 md:grid-cols-2">
          {integracoes.map((i) => (
            <div
              key={i.id}
              className="rounded-2xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display text-sm font-semibold">{i.nome}</p>
                    <Tag tom="neutro">{i.categoria}</Tag>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {i.descricao}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    {i.conectado ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success" />
                        <span className="truncate">{i.conta ?? "Conectado"}</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5" /> Não conectado
                      </>
                    )}
                  </p>
                </div>
                <Toggle
                  on={i.conectado}
                  onClick={() => alternar(i.id)}
                  label={`Conectar ${i.nome}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-4" rule="accent">
        <PanelTitle title="Segmentação por perfil" hint="controle de acesso" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="eyebrow pb-3 pr-4 text-muted-foreground">Recurso</th>
                {perfis.map((p) => (
                  <th key={p} className="eyebrow pb-3 pr-4 text-muted-foreground">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissoes.map((r) => (
                <tr key={r.recurso} className="border-b border-border/60">
                  <td className="py-3 pr-4 text-sm">{r.recurso}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{r.tecnico}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{r.gestor}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{r.alta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelTitle title="Nova view personalizada" hint="a visão padrão permanece" />
          <div className="space-y-4">
            <div>
              <p className="eyebrow mb-2 text-muted-foreground">Tela</p>
              <div className="flex flex-wrap gap-2">
                {(["executiva", "indicadores"] as EscopoView[]).map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setEscopo(e);
                      setBlocos([]);
                    }}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      escopo === e
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {e === "executiva" ? "Visão executiva" : "Indicadores"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2 text-muted-foreground">Nome da view</p>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Comitê de Riscos"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <p className="eyebrow mb-2 text-muted-foreground">Blocos exibidos</p>
              <div className="flex flex-wrap gap-2">
                {blocosPorEscopo[escopo].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => alternarBloco(b.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      blocos.includes(b.id)
                        ? "border-info/50 bg-info/15 text-info"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2 text-muted-foreground">Perfis com acesso</p>
              <div className="flex flex-wrap gap-2">
                {perfis.map((p) => (
                  <button
                    key={p}
                    onClick={() => alternarPerfil(p)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      perfisView.includes(p)
                        ? "border-success/50 bg-success/15 text-success"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={salvarView}
              disabled={!nome.trim() || blocos.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Criar view
            </button>
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="Views personalizadas" hint={`${views.length} criadas`} />
          {views.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma view personalizada ainda. As telas continuam exibindo a visão padrão.
            </p>
          ) : (
            <ul className="space-y-3">
              {views.map((v) => (
                <li key={v.id} className="rounded-2xl border border-border p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{v.nome}</p>
                        <Tag tom="accent">
                          {v.escopo === "executiva" ? "Visão executiva" : "Indicadores"}
                        </Tag>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {v.blocos
                          .map(
                            (b) =>
                              blocosPorEscopo[v.escopo].find((x) => x.id === b)?.label ?? b,
                          )
                          .join(" · ")}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Perfis: {v.perfis.length ? v.perfis.join(", ") : "todos"}
                      </p>
                    </div>
                    <button
                      onClick={() => remover(v.id)}
                      aria-label={`Remover ${v.nome}`}
                      className="shrink-0 rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
