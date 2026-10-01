import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { trabalhoProjetos, useTrabalhoProjetos, type AlvoAtualizacao } from "@/lib/trabalho-projetos";
import { cn } from "@/lib/utils";

export type ContextoAtualizacao = {
  projetoId: string;
  alvoTipo: AlvoAtualizacao;
  alvoId: string;
  titulo: string;
};

export function ContadorAtualizacoes({
  projetoId,
  alvoTipo,
  alvoId,
  onClick,
  className,
}: ContextoAtualizacao & { onClick: () => void; className?: string }) {
  const { atualizacoes } = useTrabalhoProjetos();
  const total = atualizacoes.filter((a) => a.projetoId === projetoId && a.alvoTipo === alvoTipo && a.alvoId === alvoId).length;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      className={cn("relative text-muted-foreground hover:text-primary", className)}
      aria-label={`Abrir atualizações de ${alvoTipo === "projeto" ? "projeto" : "item"}. ${total} registradas`}
      title="Atualizações"
    >
      <MessageCircle />
      {total > 0 && <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">{total}</span>}
    </Button>
  );
}

export function PainelAtualizacoes({
  contexto,
  onClose,
  podePublicar,
  autor,
}: {
  contexto?: ContextoAtualizacao;
  onClose: () => void;
  podePublicar: boolean;
  autor: string;
}) {
  const { atualizacoes } = useTrabalhoProjetos();
  const [texto, setTexto] = useState("");
  const lista = contexto
    ? atualizacoes
        .filter((a) => a.projetoId === contexto.projetoId && a.alvoTipo === contexto.alvoTipo && a.alvoId === contexto.alvoId)
        .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))
    : [];

  const publicar = () => {
    if (!contexto || texto.trim().length < 2) return;
    trabalhoProjetos.publicarAtualizacao({
      projetoId: contexto.projetoId,
      alvoTipo: contexto.alvoTipo,
      alvoId: contexto.alvoId,
      autor,
      texto: texto.trim(),
    });
    setTexto("");
    toast.success("Atualização publicada");
  };

  return (
    <Sheet open={Boolean(contexto)} onOpenChange={(aberto) => !aberto && onClose()}>
      <SheetContent className="panel flex w-[min(100vw,520px)] max-w-none flex-col border-l border-border p-0 sm:max-w-[520px]">
        <SheetHeader className="border-b border-border px-5 py-5 pr-12">
          <SheetTitle>Atualizações</SheetTitle>
          <SheetDescription className="break-words">{contexto?.titulo}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {lista.length === 0 ? (
            <div className="grid min-h-48 place-items-center text-center">
              <div>
                <MessageCircle className="mx-auto h-7 w-7 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">Nenhuma atualização registrada</p>
                <p className="mt-1 text-xs text-muted-foreground">O histórico deste item aparecerá aqui.</p>
              </div>
            </div>
          ) : (
            <ol className="space-y-4">
              {lista.map((atualizacao) => (
                <li key={atualizacao.id} className="rounded-xl border border-border bg-card/40 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {atualizacao.autor.split(" ").slice(0, 2).map((parte) => parte[0]).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-medium">{atualizacao.autor}</p>
                        <time className="text-[11px] text-muted-foreground" dateTime={atualizacao.criadaEm}>
                          {new Date(atualizacao.criadaEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground/90">{atualizacao.texto}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="border-t border-border bg-card/30 p-4">
          {podePublicar ? (
            <div className="space-y-3">
              <Textarea value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={2000} placeholder="Escreva uma atualização" className="min-h-24 resize-none" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">{texto.length}/2000</span>
                <Button type="button" onClick={publicar} disabled={texto.trim().length < 2}>
                  <Send /> Publicar atualização
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Seu nível permite consultar este histórico, sem publicar atualizações.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}