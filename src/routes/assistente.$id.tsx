import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Cpu, MessageSquarePlus, ShieldCheck, Trash2, Lock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Panel, PanelTitle, Tag } from "@/components/ui-kit";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useConversas } from "@/lib/assistente-conversas";
import {useCarteiraVisivel} from "@/lib/acesso";
import { useMotorIA } from "@/lib/ai-provedores";
import { usePortal } from "@/lib/portal";
import { AssistenteMarca, type EstiloAssistente } from "@/components/AssistenteMarca";

import { cn } from "@/lib/utils";
import { authenticatedFetch } from "@/lib/auth";

export const Route = createFileRoute("/assistente/$id")({
  head: () => ({
    meta: [
      { title: "Assistente de Governança | Keller Hub" },
      {
        name: "description",
        content:
          "Consulte riscos, indicadores, portfólios e projetos em linguagem natural. O assistente respeita o perfil de acesso e gera sumários e relatórios executivos.",
      },
      { property: "og:title", content: "Assistente de Governança | Keller Hub" },
      {
        property: "og:description",
        content:
          "Inteligência artificial aplicada aos dados da própria plataforma, com segmentação por perfil e trilha de consultas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistente,
});

const sugestoes = [
  "Consolide os riscos críticos por portfólio e proponha respostas prioritárias.",
  "Gere um sumário executivo do desempenho dos indicadores neste trimestre.",
  "Quais projetos estão em risco de prazo e o que explica o desvio?",
  "Aponte riscos relevantes para as próximas contratações e contratos.",
];

function Assistente() {
  const {usuario:usuarioAtual}=useCarteiraVisivel();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { conversas, criar, remover, salvarMensagens } = useConversas();
  const [erro, setErro] = useState<string | null>(null);

  const conversa = useMemo(() => conversas.find((c) => c.id === id), [conversas, id]);
  const iniciais = useMemo<UIMessage[]>(() => conversa?.mensagens ?? [], [conversa?.id]);
  const { config: motorConfig, motor } = useMotorIA();
  const { config: portalConfig } = usePortal();
  const nomeAssistente = portalConfig.nomeAssistente || "Assistente de Governança";
  const estiloAssistente = (portalConfig.estiloAssistente || "orbita") as EstiloAssistente;

  const transporte = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { perfil: usuarioAtual.perfil, motor: motorConfig },
        fetch: authenticatedFetch,
      }),
    [motorConfig],
  );

  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: iniciais,
    transport: transporte,
    onError: (e) => setErro(e.message || "Falha ao consultar o assistente."),
  });


  const carregando = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!carregando && messages.length > 0) salvarMensagens(id, messages);
  }, [messages, carregando, id, salvarMensagens]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const area = document.querySelector<HTMLTextAreaElement>("textarea[data-assistente]");
    area?.focus();
  }, [id, carregando]);

  const enviar = async (texto: string) => {
    const limpo = texto.trim();
    if (!limpo || carregando) return;
    setErro(null);
    await sendMessage({ text: limpo });
  };

  const novaConversa = () => {
    const novo = criar();
    navigate({ to: "/assistente/$id", params: { id: novo } });
  };

  const excluir = (alvo: string) => {
    remover(alvo);
    if (alvo === id) {
      const restante = conversas.find((c) => c.id !== alvo);
      navigate({
        to: "/assistente/$id",
        params: { id: restante?.id ?? criar() },
        replace: true,
      });
    }
  };

  return (
    <AppShell
      title={nomeAssistente}
      description="Consultas em linguagem natural sobre os dados da plataforma, respeitando o seu perfil de acesso."
      actions={
        <button
          type="button"
          onClick={novaConversa}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Nova consulta
        </button>
      }
    >
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="grid min-w-0 content-start gap-5">
          <Panel className="min-w-0" rule="primary">
            <PanelTitle title="Suas consultas" hint="neste navegador" />
            <div className="grid min-w-0 gap-1.5">

              {conversas.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhuma consulta registrada ainda.
                </p>
              )}
              {conversas.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "flex min-w-0 items-center gap-1 rounded-xl border border-transparent px-1 transition",
                    c.id === id ? "border-primary/40 bg-primary/10" : "hover:bg-muted/40",
                  )}
                >

                  <Link
                    to="/assistente/$id"
                    params={{ id: c.id }}
                    className="min-w-0 flex-1 truncate px-2 py-2 text-left text-xs text-foreground"
                  >
                    {c.titulo}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Excluir consulta ${c.titulo}`}
                    onClick={() => excluir(c.id)}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelTitle title={nomeAssistente} />
            <div className="grid gap-3 text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>
                  As respostas usam apenas os registros da plataforma liberados para o perfil{" "}
                  <strong className="text-foreground">{usuarioAtual.perfil}</strong>.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                <span>
                  Dados sensíveis não são compartilhados fora da plataforma e as consultas ficam
                  registradas na trilha de auditoria.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Motor em uso:{" "}
                  <strong className="text-foreground">{motor.nome}</strong>
                  {motor.tipo === "externo" ? " (serviço externo autorizado)" : " (interno)"}. Pode
                  ser trocado em Configurações, sem mudar nada na plataforma.
                </span>
              </p>

              <div className="flex flex-wrap gap-1.5">
                <Tag tom="info">Riscos</Tag>
                <Tag tom="accent">Indicadores</Tag>
                <Tag tom="success">Sumários executivos</Tag>
              </div>

            </div>
          </Panel>
        </div>

        <Panel className="flex min-h-[70vh] min-w-0 flex-col p-0" rule="none">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
            <AssistenteMarca estilo={estiloAssistente} imagem={portalConfig.iconeAssistente} className="h-9 w-9 rounded-xl" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-foreground">
                {conversa?.titulo ?? "Nova consulta"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Perfil ativo: {usuarioAtual.perfil}
              </p>
            </div>
          </div>

          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-5">
              {messages.length === 0 && (
                <div className="grid gap-4 py-6">
                  <p className="text-sm text-muted-foreground">
                    Pergunte em linguagem natural. O assistente lê portfólios, programas, projetos,
                    riscos, indicadores e a trilha de auditoria disponíveis ao seu perfil.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sugestoes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void enviar(s)}
                        className="rounded-xl border border-border/70 bg-muted/20 p-3 text-left text-xs text-foreground transition hover:border-primary/50 hover:bg-primary/10"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent className="break-words">
                    <MessageResponse>
                      {m.parts
                        .map((p) => (p.type === "text" ? p.text : ""))
                        .join("")}
                    </MessageResponse>
                  </MessageContent>

                </Message>
              ))}

              {status === "submitted" && <Shimmer>Analisando os dados da plataforma…</Shimmer>}
              {erro && (
                <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                  {erro}
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border/60 p-4">
            <PromptInput
              onSubmit={(message) => {
                void enviar(message.text ?? "");
              }}
            >
              <PromptInputTextarea
                data-assistente=""
                autoFocus
                placeholder="Ex.: consolide os riscos críticos e gere um sumário para o comitê."
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} onStop={stop} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
