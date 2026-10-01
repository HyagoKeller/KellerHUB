import { Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUpRight, MessageSquarePlus, PanelRightClose, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AssistenteMarca, type EstiloAssistente } from "@/components/AssistenteMarca";
import { Button } from "@/components/ui/button";
import { useConversas } from "@/lib/assistente-conversas";
import { useMotorIA } from "@/lib/ai-provedores";
import { usuarioAtual } from "@/lib/mock-data";
import { usePortal } from "@/lib/portal";
import { cn } from "@/lib/utils";

const sugestoes = [
  "Resuma os riscos críticos do portfólio.",
  "Quais projetos precisam de atenção hoje?",
  "Prepare um resumo executivo dos indicadores.",
];

function ChatFlutuante({ id, rascunho, setRascunho }: { id: string; rascunho: string; setRascunho: (valor: string) => void }) {
  const { conversas, salvarMensagens } = useConversas();
  const conversa = conversas.find((item) => item.id === id);
  const iniciais = useMemo<UIMessage[]>(() => conversa?.mensagens ?? [], [conversa?.id]);
  const { config: motorConfig } = useMotorIA();
  const [erro, setErro] = useState<string | null>(null);
  const transporte = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: { perfil: usuarioAtual.perfil, motor: motorConfig } }), [motorConfig]);
  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: iniciais,
    transport: transporte,
    onError: (falha) => setErro(falha.message || "Não foi possível concluir a consulta."),
  });
  const ocupado = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!ocupado && messages.length > 0) salvarMensagens(id, messages);
  }, [id, messages, ocupado, salvarMensagens]);

  const enviar = async (texto: string) => {
    const limpo = texto.trim();
    if (!limpo || ocupado) return;
    setErro(null);
    setRascunho("");
    await sendMessage({ text: limpo });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-4 px-4 py-5 sm:px-6">
          {messages.length === 0 && (
            <div className="grid gap-4 py-4">
              <div className="glass-control rounded-xl p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Consulta protegida pelo seu perfil</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">O assistente usa somente os dados liberados para {usuarioAtual.perfil}.</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {sugestoes.map((item) => <Button key={item} variant="outline" onClick={() => void enviar(item)} className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2 text-left text-xs">{item}</Button>)}
              </div>
            </div>
          )}
          {messages.map((mensagem) => (
            <Message key={mensagem.id} from={mensagem.role}>
              <MessageContent className="break-words"><MessageResponse>{mensagem.parts.map((parte) => parte.type === "text" ? parte.text : "").join("")}</MessageResponse></MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Shimmer>Analisando os dados da plataforma…</Shimmer>}
          {erro && <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{erro}</p>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="border-t border-border/60 p-3 sm:p-4">
        <PromptInput onSubmit={(mensagem) => void enviar(mensagem.text ?? "")}>
          <PromptInputTextarea value={rascunho} onChange={(evento) => setRascunho(evento.target.value)} autoFocus placeholder="Pergunte sobre riscos, projetos ou indicadores…" />
          <PromptInputFooter className="justify-end"><PromptInputSubmit status={status} onStop={stop} /></PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

export function AssistenteFlutuante() {
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState("");
  const { conversas, criar } = useConversas();
  const { config } = usePortal();
  const nome = config.nomeAssistente || "Assistente de Governança";
  const estilo = (config.estiloAssistente || "orbita") as EstiloAssistente;

  const abrir = () => {
    setAtivo((atual) => atual ?? conversas[0]?.id ?? criar());
    setAberto(true);
  };

  useEffect(() => {
    if (!aberto) return;
    const fechar = (evento: KeyboardEvent) => { if (evento.key === "Escape") setAberto(false); };
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [aberto]);

  return (
    <>
      <Button onClick={abrir} aria-label={`Abrir ${nome}`} className={cn("fixed bottom-5 right-5 z-40 h-14 rounded-full px-3 shadow-2xl shadow-primary/30", aberto && "pointer-events-none opacity-0")}>
        <AssistenteMarca estilo={estilo} imagem={config.iconeAssistente} className="h-9 w-9 shrink-0 rounded-full" />
        <span className="hidden max-w-44 truncate pr-2 sm:block">{nome}</span>
      </Button>
      {aberto && (
        <div className="fixed inset-0 z-50">
          <Button type="button" variant="ghost" aria-label="Fechar assistente" onClick={() => setAberto(false)} className="absolute inset-0 h-auto w-auto cursor-default rounded-none bg-foreground/20 p-0 backdrop-blur-[2px] hover:bg-foreground/20" />
          <aside role="dialog" aria-modal="true" aria-label={nome} className="panel absolute inset-y-2 right-2 flex w-[calc(100%-1rem)] max-w-[820px] flex-col overflow-hidden rounded-xl border-border/80 p-0 shadow-2xl sm:inset-y-4 sm:right-4 sm:w-[min(58vw,820px)]">
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <AssistenteMarca estilo={estilo} imagem={config.iconeAssistente} className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="min-w-0"><h2 className="truncate font-display text-sm font-semibold">{nome}</h2><p className="truncate text-[11px] text-muted-foreground">Perfil ativo: {usuarioAtual.perfil}</p></div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => { const id = criar(); setAtivo(id); }} aria-label="Nova consulta" title="Nova consulta"><MessageSquarePlus /></Button>
                {ativo && <Button variant="ghost" size="icon-sm" asChild title="Abrir página completa"><Link to="/assistente/$id" params={{ id: ativo }}><ArrowUpRight /></Link></Button>}
                <Button variant="ghost" size="icon-sm" onClick={() => setAberto(false)} aria-label="Fechar assistente" title="Fechar"><X /></Button>
              </div>
            </header>
            {ativo ? <ChatFlutuante key={ativo} id={ativo} rascunho={rascunho} setRascunho={setRascunho} /> : <div className="grid flex-1 place-items-center"><PanelRightClose className="h-6 w-6 text-muted-foreground" /></div>}
          </aside>
        </div>
      )}
    </>
  );
}