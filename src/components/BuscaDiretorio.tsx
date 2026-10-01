import { useEffect, useState } from "react";
import { Check, Loader2, Search, UserPlus } from "lucide-react";
import { buscarDiretorio, fontesDiretorio, unidadesDiretorio, type EntradaDiretorio, type FonteDiretorio } from "@/lib/diretorio";

export function BuscaDiretorio({ jaMembros, onAdicionar }: { jaMembros: string[]; onAdicionar: (p: EntradaDiretorio, fonte: string) => void }) {
  const [fonte, setFonte] = useState<FonteDiretorio>("ad");
  const [ou, setOu] = useState("");
  const [termo, setTermo] = useState("");
  const [res, setRes] = useState<EntradaDiretorio[]>([]);
  const [carregando, setCarregando] = useState(false);
  const nomeFonte = fontesDiretorio.find((f) => f.id === fonte)!.nome;

  useEffect(() => {
    let vivo = true;
    setCarregando(true);
    const t = setTimeout(() => buscarDiretorio(fonte, termo, ou || undefined).then((r) => vivo && (setRes(r), setCarregando(false))), 250);
    return () => { vivo = false; clearTimeout(t); };
  }, [fonte, termo, ou]);

  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold">Buscar no diretório</p>
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Conectado (simulação)</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <select aria-label="Diretório" value={fonte} onChange={(e) => { setFonte(e.target.value as FonteDiretorio); setOu(""); }} className="h-8 rounded-md border border-border bg-transparent px-2 text-xs">
          {fontesDiretorio.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
        <select aria-label="Unidade organizacional" value={ou} onChange={(e) => setOu(e.target.value)} className="h-8 rounded-md border border-border bg-transparent px-2 text-xs">
          <option value="">Todas as unidades (OU)</option>
          {unidadesDiretorio(fonte).map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input aria-label="Pesquisar pessoa" maxLength={80} value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Pesquisar por nome, e-mail ou cargo…" className="h-8 w-full rounded-md border border-border bg-transparent pl-8 pr-3 text-xs" />
      </div>
      <ul className="mt-2 max-h-52 divide-y divide-border/60 overflow-y-auto rounded-md border border-border">
        {carregando ? (
          <li className="flex items-center gap-2 px-3 py-3 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Consultando {nomeFonte}…</li>
        ) : res.length === 0 ? (
          <li className="px-3 py-3 text-xs text-muted-foreground">Ninguém encontrado.</li>
        ) : (
          res.map((p) => {
            const ja = jaMembros.includes(p.id);
            return (
              <li key={p.id} className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{p.nome}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{p.email} · {p.cargo}</p>
                </div>
                <button disabled={ja} onClick={() => onAdicionar(p, nomeFonte)} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium hover:border-primary disabled:opacity-60">
                  {ja ? <><Check className="h-3 w-3" /> Na área</> : <><UserPlus className="h-3 w-3" /> Adicionar</>}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
