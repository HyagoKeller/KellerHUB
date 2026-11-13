import { ChevronLeft, ChevronRight } from "lucide-react";

export function Paginacao({ pagina, totalPaginas, total, inicio, tamanho, setPagina }: {
  pagina: number; totalPaginas: number; total: number; inicio: number; tamanho: number; setPagina: (p: number) => void;
}) {
  if (total <= tamanho) return null;
  const fim = Math.min(inicio + tamanho, total);
  const btn = "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted disabled:opacity-40";
  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs text-muted-foreground">
      <span>{inicio + 1} a {fim} de {total}</span>
      <span className="flex items-center gap-2">
        <button className={btn} aria-label="Página anterior" disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}><ChevronLeft className="h-4 w-4" /></button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button className={btn} aria-label="Próxima página" disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)}><ChevronRight className="h-4 w-4" /></button>
      </span>
    </nav>
  );
}
