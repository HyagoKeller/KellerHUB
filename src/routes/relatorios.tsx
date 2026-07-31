import { createFileRoute } from "@tanstack/react-router";
import { Download, FileJson, FileSpreadsheet, Share2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel, PanelTitle, Stat, Tag } from "@/components/ui-kit";
import { auditoria, relatorios } from "@/lib/mock-data";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios e Publicação — Hepta Project PPM" },
      {
        name: "description",
        content:
          "Publicação de painéis e relatórios gerenciais com acesso por perfil, exportação em CSV, XLSX e JSON e trilha de auditoria.",
      },
      { property: "og:title", content: "Relatórios e Publicação — Hepta Project PPM" },
      {
        property: "og:description",
        content: "Compartilhe resultados com stakeholders respeitando o nível de detalhe de cada perfil.",
      },
    ],
  }),
  component: Relatorios,
});

const perfis = [
  { nome: "Técnico", detalhe: "Dados operacionais completos das iniciativas sob sua responsabilidade.", itens: ["Tarefas e entregas", "Riscos do projeto", "Base bruta de indicadores"] },
  { nome: "Gestor", detalhe: "Visão gerencial de portfólios, programas e riscos da sua área.", itens: ["Status reports", "Execução orçamentária", "Matriz de riscos"] },
  { nome: "Alta Administração", detalhe: "Visão agregada e estratégica, sem detalhe operacional.", itens: ["Painel executivo", "Aderência estratégica", "Riscos críticos"] },
];

function Relatorios() {
  return (
    <AppShell
      title="Relatórios e Publicação"
      description="Painéis interativos, relatórios gerenciais e exportação em formatos abertos, com controle de acesso granular por perfil."
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
        <Stat label="Relatórios publicados" value={String(relatorios.filter((r) => r.compartilhado).length)} />
        <Stat label="Modelos disponíveis" value={String(relatorios.length)} />
        <Stat label="Eventos auditados (30d)" value="1.482" hint="usuário, data/hora e ação" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2 overflow-x-auto p-0">
          <div className="p-5 pb-3">
            <PanelTitle title="Relatórios e painéis" hint="acesso por perfil" />
          </div>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Relatório</th>
                <th className="px-5 py-3 font-medium">Público</th>
                <th className="px-5 py-3 font-medium">Formato</th>
                <th className="px-5 py-3 font-medium">Atualizado</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map((r) => (
                <tr key={r.id} className="border-b border-border/70 last:border-0 hover:bg-muted/40">
                  <td className="max-w-[260px] truncate px-5 py-3 font-medium">{r.nome}</td>
                  <td className="px-5 py-3">
                    <Tag tom={r.publico === "Alta Administração" ? "accent" : r.publico === "Gestor" ? "info" : "neutro"}>
                      {r.publico}
                    </Tag>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.formato}</td>
                  <td className="num px-5 py-3 text-muted-foreground">{r.atualizado}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button
                        aria-label="Baixar"
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label="Compartilhar"
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <PanelTitle title="Perfis de acesso (RBAC)" />
          <ul className="space-y-3">
            {perfis.map((p) => (
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
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2 overflow-x-auto p-0">
          <div className="p-5 pb-3">
            <PanelTitle title="Trilha de auditoria" hint="quem, quando e o quê" />
          </div>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Data/hora</th>
                <th className="px-5 py-3 font-medium">Usuário</th>
                <th className="px-5 py-3 font-medium">Ação</th>
                <th className="px-5 py-3 font-medium">Entidade</th>
                <th className="px-5 py-3 font-medium">Detalhe</th>
              </tr>
            </thead>
            <tbody>
              {auditoria.map((a) => (
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

        <Panel>
          <PanelTitle title="Privacidade e conformidade" hint="LGPD · POSIC" />
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Minimização: apenas dados necessários à gestão das iniciativas são coletados.</li>
            <li>Autenticação individual, sem contas compartilhadas, com perfis RBAC.</li>
            <li>Criptografia de dados sensíveis em trânsito e em repouso.</li>
            <li>Direito de exportação e exclusão de dados pessoais mediante solicitação.</li>
            <li>Portabilidade garantida em CSV, XLSX e JSON, sem lock-in tecnológico.</li>
          </ul>
          <button className="mt-4 w-full rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
            Exportar meus dados pessoais
          </button>
        </Panel>
      </div>
    </AppShell>
  );
}
