import { useState } from "react";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  carteira,
  classeTom,
  novoIdEtiqueta,
  pontoTom,
  tonsEtiqueta,
  useCarteira,
  type ColunaEtiqueta,
  type Etiqueta,
} from "@/lib/carteira";
import { cn } from "@/lib/utils";

/** Célula de etiqueta estilo quadro: clique para trocar, "Editar etiquetas" para renomear, recolorir, criar ou excluir. */
export function EtiquetaCelula({
  coluna,
  valor,
  onChange,
  className,
}: {
  coluna: ColunaEtiqueta;
  valor: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const { etiquetas } = useCarteira();
  const lista = etiquetas[coluna];
  const atual = lista.find((e) => e.nome === valor);
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState<(Etiqueta & { original?: string })[]>([]);

  const iniciarEdicao = () => {
    setRascunho(lista.map((e) => ({ ...e, original: e.nome })));
    setEditando(true);
  };

  const aplicar = () => {
    const limpa = rascunho
      .map((e) => ({ ...e, nome: e.nome.trim().slice(0, 40) }))
      .filter((e, i, arr) => e.nome && arr.findIndex((x) => x.nome === e.nome) === i);
    const renomes: Record<string, string> = {};
    limpa.forEach((e) => {
      if (e.original && e.original !== e.nome) renomes[e.original] = e.nome;
    });
    carteira.salvarEtiquetas(
      coluna,
      limpa.map(({ id, nome, tom }) => ({ id, nome, tom })),
      renomes,
    );
    setEditando(false);
  };

  return (
    <Popover
      open={aberto}
      onOpenChange={(o) => {
        setAberto(o);
        if (!o) setEditando(false);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "chip min-w-24 justify-center transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring",
            atual ? classeTom[atual.tom] : classeTom.cinza,
            className,
          )}
        >
          {valor || "—"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="panel w-64 p-3" align="start">
        {!editando ? (
          <div className="space-y-1.5">
            {lista.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => {
                  onChange(e.nome);
                  setAberto(false);
                }}
                className={cn("chip w-full justify-between", classeTom[e.tom])}
              >
                {e.nome}
                {e.nome === valor && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
            <button
              type="button"
              onClick={iniciarEdicao}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-muted"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar etiquetas
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {rascunho.map((e, i) => (
              <div key={e.id} className="space-y-1.5 rounded-md border border-border p-2">
                <div className="flex items-center gap-1.5">
                  <input
                    value={e.nome}
                    maxLength={40}
                    onChange={(ev) =>
                      setRascunho((r) => r.map((x, j) => (j === i ? { ...x, nome: ev.target.value } : x)))
                    }
                    className="h-7 min-w-0 flex-1 rounded border border-border bg-transparent px-2 text-xs"
                    aria-label="Nome da etiqueta"
                  />
                  <button
                    type="button"
                    aria-label="Excluir etiqueta"
                    onClick={() => setRascunho((r) => r.filter((_, j) => j !== i))}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {tonsEtiqueta.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-label={`Cor ${t}`}
                      onClick={() => setRascunho((r) => r.map((x, j) => (j === i ? { ...x, tom: t } : x)))}
                      className={cn(
                        "h-4 w-4 rounded-full",
                        pontoTom[t],
                        e.tom === t && "ring-2 ring-foreground ring-offset-1 ring-offset-background",
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setRascunho((r) => [...r, { id: novoIdEtiqueta(), nome: "Nova etiqueta", tom: "azul" }])
              }
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-1.5 text-xs text-muted-foreground hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" /> Nova etiqueta
            </button>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="flex-1 rounded-md border border-border py-1.5 text-xs hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={aplicar}
                className="flex-1 rounded-md bg-primary py-1.5 text-xs font-medium text-primary-foreground"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** Seletor de etiqueta para formulários (mesmas etiquetas editáveis). */
export function SeletorEtiqueta(props: { coluna: ColunaEtiqueta; valor: string; onChange: (v: string) => void }) {
  return <EtiquetaCelula {...props} className="h-9 w-full justify-start px-3" />;
}
