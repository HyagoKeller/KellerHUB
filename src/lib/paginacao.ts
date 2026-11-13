import { useEffect, useMemo, useState } from "react";

/** Calcula a fatia de uma página; páginas fora do intervalo são ajustadas. */
export function paginar<T>(itens: T[], pagina: number, tamanho: number) {
  const totalPaginas = Math.max(1, Math.ceil(itens.length / tamanho));
  const atual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (atual - 1) * tamanho;
  return { itens: itens.slice(inicio, inicio + tamanho), pagina: atual, totalPaginas, total: itens.length, inicio };
}

export function usePaginacao<T>(itens: T[], tamanho = 20, reiniciarCom: unknown = undefined) {
  const [pagina, setPagina] = useState(1);
  useEffect(() => setPagina(1), [reiniciarCom]);
  const r = useMemo(() => paginar(itens, pagina, tamanho), [itens, pagina, tamanho]);
  return { ...r, tamanho, setPagina };
}
