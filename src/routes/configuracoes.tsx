import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Check,
  Bot,
  Cpu,
  Globe2,
  HardDrive,
  ImageUp,
  Link2,
  Moon,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  Sun,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AreasConfig, SegmentacaoPerfil } from "@/components/AreasConfig";
import { useAcessoEstado } from "@/lib/acesso";
import { Panel, PanelTitle, Tag } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { AssistenteMarca, estilosAssistente, type EstiloAssistente } from "@/components/AssistenteMarca";
import { cn } from "@/lib/utils";
import type { Perfil } from "@/lib/mock-data";
import { organizacoes } from "@/lib/mock-data";
import { blocosPorEscopo, useViews, type EscopoView } from "@/lib/views";
import { motoresIA, useMotorIA } from "@/lib/ai-provedores";
import { paletas, usePortal, type ConfigPortal, type PaletaId } from "@/lib/portal";



export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações e Integrações — Plataforma PPM" },
      {
        name: "description",
        content:
          "Integrações com Microsoft 365, Google Workspace e Power BI, segmentação por perfil de acesso e criação de views personalizadas.",
      },
      { property: "og:title", content: "Configurações e Integrações — Plataforma PPM" },
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

const idiomas = [
  "Español", "English (US)", "English (UK)", "Português", "Français", "Deutsch",
  "Català", "Italiano", "Nederlands", "Ελληνικά",
];

const fusosHorarios = [
  ["America/Sao_Paulo", "Brasília · São Paulo"],
  ["America/Manaus", "Manaus"],
  ["America/Belem", "Belém"],
  ["America/Fortaleza", "Fortaleza"],
  ["America/Recife", "Recife"],
  ["America/Bahia", "Salvador"],
  ["America/Cuiaba", "Cuiabá"],
  ["America/Rio_Branco", "Rio Branco"],
  ["America/Noronha", "Fernando de Noronha"],
  ["America/New_York", "Nova York"],
  ["America/Los_Angeles", "Los Angeles"],
  ["Europe/London", "Londres"],
  ["Europe/Lisbon", "Lisboa"],
  ["Europe/Madrid", "Madri"],
  ["Europe/Paris", "Paris"],
  ["Europe/Berlin", "Berlim"],
  ["Asia/Tokyo", "Tóquio"],
  ["Asia/Dubai", "Dubai"],
  ["Australia/Sydney", "Sydney"],
  ["UTC", "UTC"],
] as const;

const localizacoes = [
  "Brasil", "Argentina", "Chile", "Colômbia", "México", "Estados Unidos", "Canadá",
  "Portugal", "Espanha", "França", "Alemanha", "Itália", "Países Baixos", "Bélgica",
  "Reino Unido", "Irlanda", "Suíça", "Grécia", "Japão", "Austrália",
];

const formatosMonetarios = ["1,000.00", "1.000,00", "1000.00", "1000,00", "1 000.00", "1 000,00"];


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
  const { config: motorConfig, salvar: salvarMotor, motor } = useMotorIA();
  const { config: portalConfig, salvar: salvarPortal } = usePortal();

  const [rascunhoMotor, setRascunhoMotor] = useState(motorConfig);
  useEffect(() => setRascunhoMotor(motorConfig), [motorConfig]);
  const motorAlterado = JSON.stringify(rascunhoMotor) !== JSON.stringify(motorConfig);
  const motorRascunho = motoresIA.find((m) => m.id === rascunhoMotor.motorId) ?? motoresIA[0];

  const [rascunhoPortal, setRascunhoPortal] = useState<ConfigPortal>(portalConfig);
  useEffect(() => setRascunhoPortal(portalConfig), [portalConfig]);
  const portalAlterado = JSON.stringify(rascunhoPortal) !== JSON.stringify(portalConfig);




  const [escopo, setEscopo] = useState<EscopoView>("executiva");
  const [nome, setNome] = useState("");
  const [blocos, setBlocos] = useState<string[]>([]);
  const [perfisView, setPerfisView] = useState<Perfil[]>(["Gestor"]);
  const estadoAcesso = useAcessoEstado();

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
    criar({ nome: nome.trim(), escopo, blocos, perfis: perfisView, areas: estadoAcesso.filtroAreas });
    setNome("");
    setBlocos([]);
  };

  const carregarImagem = (arquivo: File, campo: "logo" | "logoInicioSessao" | "iconeAssistente") => {
    const leitor = new FileReader();
    leitor.onload = () => setRascunhoPortal((r) => ({ ...r, [campo]: String(leitor.result) }));
    leitor.readAsDataURL(arquivo);
  };

  const carregarIconeAssistente = (arquivo: File) => {
    const formatos = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!formatos.includes(arquivo.type) || arquivo.size > 1024 * 1024) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      const url = String(leitor.result);
      const imagem = new Image();
      imagem.onload = () => {
        const proporcao = imagem.width / imagem.height;
        if (proporcao < 0.8 || proporcao > 1.25) return;
        setRascunhoPortal((r) => ({ ...r, iconeAssistente: url, estiloAssistente: "personalizado" }));
      };
      imagem.src = url;
    };
    leitor.readAsDataURL(arquivo);
  };

  return (
    <AppShell
      title="Configurações"
      description="Integrações institucionais, segmentação de acesso por perfil e criação de views personalizadas sem alterar as visões padrão."
    >
      <Panel rule="primary">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-semibold text-foreground">
              Identidade do portal
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {portalAlterado
                ? "Alterações não salvas — clique em Salvar para aplicar."
                : "Nome, logo, paleta e modo de exibição da organização."}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setRascunhoPortal(portalConfig)}
              disabled={!portalAlterado}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Cancelar
            </button>
            <button
              type="button"
              onClick={() => salvarPortal(rascunhoPortal)}
              disabled={!portalAlterado}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" /> Salvar
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <label className="grid gap-1.5 text-xs">
              <span className="eyebrow text-muted-foreground">Nome da organização</span>
              <input
                value={rascunhoPortal.organizacao}
                onChange={(e) =>
                  setRascunhoPortal((r) => ({ ...r, organizacao: e.target.value }))
                }
                placeholder={organizacoes[0].nome}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>

            <div className="grid gap-2 text-xs">
              <span className="eyebrow text-muted-foreground">Logo da organização</span>
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-card">
                  {rascunhoPortal.logo ? (
                    <img
                      src={rascunhoPortal.logo}
                      alt="Logo carregada"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ImageUp className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                  <ImageUp className="h-3.5 w-3.5" /> Enviar imagem
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const arquivo = e.target.files?.[0];
                      if (!arquivo) return;
                      const leitor = new FileReader();
                      leitor.onload = () =>
                        setRascunhoPortal((r) => ({ ...r, logo: String(leitor.result) }));
                      leitor.readAsDataURL(arquivo);
                    }}
                  />
                </label>
                {rascunhoPortal.logo && (
                  <button
                    type="button"
                    onClick={() => setRascunhoPortal((r) => ({ ...r, logo: "" }))}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                A imagem fica guardada apenas neste navegador, em PNG, JPG, SVG ou WEBP.
              </p>
            </div>

            <div className="grid gap-2 text-xs">
              <span className="eyebrow text-muted-foreground">Modo de exibição</span>
              <div className="flex gap-2">
                {(["claro", "escuro"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRascunhoPortal((r) => ({ ...r, modo: m }))}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                      rascunhoPortal.modo === m
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "claro" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    Modo {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-2 text-xs">
            <span className="eyebrow text-muted-foreground">Paleta de cores</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {paletas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setRascunhoPortal((r) => ({ ...r, paleta: p.id as PaletaId }))
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                    rascunhoPortal.paleta === p.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/60 hover:border-primary/40",
                  )}
                >
                  <span className="flex shrink-0 gap-1">
                    {p.amostra.map((c) => (
                      <span
                        key={c}
                        className="h-6 w-3 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm font-semibold">
                      {p.nome}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {p.descricao}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              As paletas alteram apenas a cor de marca; neutros e cores de status (verde, amarelo,
              vermelho) permanecem os mesmos para não mudar a leitura dos painéis.
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="mt-4" rule="primary">
        <PanelTitle title="Experiência de acesso e assistente" hint="identidade institucional" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid content-start gap-4">
            <label className="grid gap-1.5 text-xs">
              <span className="eyebrow text-muted-foreground">Mensagem de início de sessão</span>
              <textarea
                value={rascunhoPortal.mensagemInicioSessao}
                onChange={(e) => setRascunhoPortal((r) => ({ ...r, mensagemInicioSessao: e.target.value }))}
                rows={3}
                className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <div className="grid gap-2 text-xs">
              <span className="eyebrow text-muted-foreground">Logo de início de sessão</span>
              <div className="flex items-center gap-3">
                <div className="glass-control grid h-14 w-24 shrink-0 place-items-center overflow-hidden rounded-xl">
                  {rascunhoPortal.logoInicioSessao ? <img src={rascunhoPortal.logoInicioSessao} alt="Logo de início de sessão" className="h-full w-full object-contain p-1" /> : <ImageUp className="h-5 w-5 text-muted-foreground" />}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer"><ImageUp /> Enviar logo<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(e) => { const arquivo = e.target.files?.[0]; if (arquivo) carregarImagem(arquivo, "logoInicioSessao"); }} /></label>
                </Button>
                {rascunhoPortal.logoInicioSessao && <Button variant="ghost" size="sm" onClick={() => setRascunhoPortal((r) => ({ ...r, logoInicioSessao: "" }))} className="text-destructive"><Trash2 /> Remover</Button>}
              </div>
            </div>
          </div>

          <div className="grid content-start gap-4">
            <label className="grid gap-1.5 text-xs">
              <span className="eyebrow text-muted-foreground">Nome do assistente de governança</span>
              <div className="relative"><Bot className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={rascunhoPortal.nomeAssistente} onChange={(e) => setRascunhoPortal((r) => ({ ...r, nomeAssistente: e.target.value }))} className="w-full rounded-xl border border-border py-2 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div>
            </label>
            <div className="grid gap-2 text-xs">
              <span className="eyebrow text-muted-foreground">Identidade visual do assistente</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {estilosAssistente.map((item) => {
                  const selecionado = (rascunhoPortal.estiloAssistente || "orbita") === item.id;
                  const personalizadoIndisponivel = item.id === "personalizado" && !rascunhoPortal.iconeAssistente;
                  return <Button key={item.id} type="button" variant="outline" disabled={personalizadoIndisponivel} onClick={() => setRascunhoPortal((r) => ({ ...r, estiloAssistente: item.id as EstiloAssistente }))} className={cn("h-auto min-w-0 justify-start whitespace-normal rounded-xl p-3 text-left", selecionado && "border-primary bg-primary/10")}>
                    <AssistenteMarca estilo={item.id} imagem={rascunhoPortal.iconeAssistente} className="h-10 w-10 shrink-0 rounded-xl" />
                    <span className="min-w-0"><span className="block truncate text-xs font-semibold">{item.nome}</span><span className="block text-[10px] font-normal text-muted-foreground">{item.descricao}</span></span>
                  </Button>;
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button variant="outline" size="sm" asChild><label className="cursor-pointer"><ImageUp /> Enviar marca própria<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(e) => { const arquivo = e.target.files?.[0]; if (arquivo) carregarIconeAssistente(arquivo); }} /></label></Button>
                {rascunhoPortal.iconeAssistente && <Button variant="ghost" size="sm" onClick={() => setRascunhoPortal((r) => ({ ...r, iconeAssistente: "", estiloAssistente: "orbita" }))} className="text-destructive"><Trash2 /> Remover marca própria</Button>}
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">Marca quadrada, PNG, JPG, WEBP ou SVG, com até 1 MB. Proporções fora do padrão não são aplicadas.</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="mt-4" rule="accent">
        <PanelTitle title="Preferências regionais e segurança de conteúdo" hint="aplicadas ao portal" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs"><span className="eyebrow text-muted-foreground">Idioma</span><select value={rascunhoPortal.idioma} onChange={(e) => setRascunhoPortal((r) => ({ ...r, idioma: e.target.value }))} className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary">{idiomas.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-1.5 text-xs"><span className="eyebrow text-muted-foreground">Localização geográfica</span><select value={rascunhoPortal.localizacao} onChange={(e) => setRascunhoPortal((r) => ({ ...r, localizacao: e.target.value }))} className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary">{localizacoes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-1.5 text-xs sm:col-span-2"><span className="eyebrow text-muted-foreground">Fuso horário</span><select value={rascunhoPortal.fusoHorario} onChange={(e) => setRascunhoPortal((r) => ({ ...r, fusoHorario: e.target.value }))} className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary">{fusosHorarios.map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo} · {valor}</option>)}</select></label>
            <label className="grid gap-1.5 text-xs sm:col-span-2"><span className="eyebrow text-muted-foreground">Formato de valores monetários</span><select value={rascunhoPortal.formatoMonetario} onChange={(e) => setRascunhoPortal((r) => ({ ...r, formatoMonetario: e.target.value }))} className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary">{formatosMonetarios.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="grid content-start gap-4">
            <label className="grid gap-1.5 text-xs"><span className="eyebrow flex items-center gap-2 text-muted-foreground"><HardDrive className="h-3.5 w-3.5" /> Tamanho máximo de arquivos em MB</span><input type="number" min={1} max={2048} value={rascunhoPortal.tamanhoMaximoArquivoMb} onChange={(e) => setRascunhoPortal((r) => ({ ...r, tamanhoMaximoArquivoMb: Number(e.target.value) }))} className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary" /></label>
            <label className="grid gap-1.5 text-xs"><span className="eyebrow text-muted-foreground">Extensões proibidas</span><input value={rascunhoPortal.extensoesProibidas} onChange={(e) => setRascunhoPortal((r) => ({ ...r, extensoesProibidas: e.target.value }))} placeholder="exe, bat, msi" className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary" /><span className="text-[11px] text-muted-foreground">Separe as extensões por vírgulas.</span></label>
            <label className="grid gap-1.5 text-xs"><span className="eyebrow flex items-center gap-2 text-muted-foreground"><Globe2 className="h-3.5 w-3.5" /> Sites permitidos</span><textarea value={rascunhoPortal.sitesPermitidos} onChange={(e) => setRascunhoPortal((r) => ({ ...r, sitesPermitidos: e.target.value }))} rows={3} placeholder="*.gov.br, portal.exemplo.org/*" className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary" /><span className="text-[11px] text-muted-foreground">Aceita curingas nos endereços. Separe cada padrão por vírgula.</span></label>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <p className="text-xs text-muted-foreground">{portalAlterado ? "Há alterações não salvas nestas preferências." : "Todas as preferências estão salvas."}</p>
          <div className="flex gap-2"><Button variant="outline" size="sm" disabled={!portalAlterado} onClick={() => setRascunhoPortal(portalConfig)}><RotateCcw /> Cancelar</Button><Button size="sm" disabled={!portalAlterado} onClick={() => salvarPortal(rascunhoPortal)}><Save /> Salvar preferências</Button></div>
        </div>
      </Panel>

      <Panel className="mt-4" rule="primary">

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

      <Panel className="mt-4" rule="primary">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-semibold text-foreground">
              Motor de IA
            </h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {motorAlterado
                ? "Alterações não salvas — clique em Salvar para aplicar."
                : `Em uso: ${motor.nome}`}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setRascunhoMotor(motorConfig)}
              disabled={!motorAlterado}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Cancelar
            </button>
            <button
              type="button"
              onClick={() => salvarMotor(rascunhoMotor)}
              disabled={!motorAlterado}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <Save className="h-3.5 w-3.5" /> Salvar
            </button>
          </div>
        </div>
        <p className="mb-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          O assistente é independente do fornecedor: troque o motor sem alterar módulos, dados ou
          telas da plataforma. Os motores internos (IA nativa, ChatGPT e Gemini) rodam pela conta de IA
          da própria plataforma: o consumo entra no plano contratado, sem cobrança separada por
          consulta para a organização. Se preferir, conecte a sua própria conta OpenAI ou Google —
          aí o consumo passa a ser cobrado diretamente pelo fornecedor.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {motoresIA.map((m) => {
            const ativo = m.id === rascunhoMotor.motorId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setRascunhoMotor((r) => ({ ...r, motorId: m.id, credencialPropria: false }))}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  ativo
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card/60 hover:border-primary/40",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Cpu className={cn("h-4 w-4", ativo ? "text-primary" : "text-muted-foreground")} />
                  <p className="font-display text-sm font-semibold">{m.nome}</p>
                  <Tag tom={m.tipo === "interno" ? "success" : "info"}>
                    {m.tipo === "interno" ? "Interno" : "Externo"}
                  </Tag>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {m.descricao}
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {m.fornecedor}
                  {m.incluidoNoContrato ? (m.contaPropria ? " · incluído no plano ou conta própria" : " · incluído no plano") : " · credencial da organização"}
                </p>
              </button>
            );
          })}
        </div>

        {motorRascunho?.contaPropria && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4">
            <div>
              <p className="text-sm font-medium">Conectar minha própria conta {motorRascunho.fornecedor}</p>
              <p className="text-[11px] text-muted-foreground">
                Use a chave de API da sua organização. O consumo é cobrado pela {motorRascunho.fornecedor} diretamente.
              </p>
            </div>
            <Toggle
              on={rascunhoMotor.credencialPropria}
              onClick={() =>
                setRascunhoMotor((r) => {
                  const cp = motorRascunho.contaPropria!;
                  return r.credencialPropria
                    ? { ...r, credencialPropria: false }
                    : { ...r, credencialPropria: true, endpoint: cp.endpoint, segredo: cp.segredo, modelo: cp.modelo };
                })
              }
              label="Usar conta própria"
            />
          </div>
        )}

        {(motorRascunho?.tipo === "externo" || rascunhoMotor.credencialPropria) && (
          <div className="mt-4 grid gap-4 rounded-2xl border border-warning/40 bg-warning/5 p-4">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <span>
                É vedado enviar dados pessoais, sensíveis, restritos ou sigilosos a ferramentas
                externas de IA sem autorização prévia e expressa da contratante. Os dados também não
                podem ser usados para treinamento de modelos de terceiros.
              </span>
            </p>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-foreground">
                Autorização expressa registrada para uso do motor externo
              </p>
              <Toggle
                on={rascunhoMotor.autorizacaoExterna}
                onClick={() =>
                  setRascunhoMotor((r) => ({ ...r, autorizacaoExterna: !r.autorizacaoExterna }))
                }
                label="Autorizar motor externo de IA"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-1.5 text-xs">
                <span className="eyebrow text-muted-foreground">Endpoint do serviço</span>
                <input
                  value={rascunhoMotor.endpoint}
                  onChange={(e) => setRascunhoMotor((r) => ({ ...r, endpoint: e.target.value }))}
                  placeholder="https://api.fornecedor.com/v1"
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="grid gap-1.5 text-xs">
                <span className="eyebrow text-muted-foreground">Modelo</span>
                <input
                  value={rascunhoMotor.modelo}
                  onChange={(e) => setRascunhoMotor((r) => ({ ...r, modelo: e.target.value }))}
                   placeholder={motorRascunho.modelo || "nome-do-modelo"}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="grid gap-1.5 text-xs">
                <span className="eyebrow text-muted-foreground">Segredo com a credencial</span>
                <input
                  value={rascunhoMotor.segredo}
                  onChange={(e) => setRascunhoMotor((r) => ({ ...r, segredo: e.target.value }))}
                  placeholder="IA_EXTERNA_API_KEY"
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              A credencial fica guardada apenas no cofre de segredos do ambiente; nunca é gravada
              nesta tela nem enviada ao navegador.
            </p>
          </div>
        )}
      </Panel>




      <AreasConfig />
      <SegmentacaoPerfil />

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
