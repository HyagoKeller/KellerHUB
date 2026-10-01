// Views personalizadas do usuário (protótipo: persistidas no navegador).
// A view padrão de cada tela nunca é alterada nem removida.
import { useCallback, useEffect, useState } from "react";
import type { Perfil } from "@/lib/mock-data";

export type EscopoView = "executiva" | "indicadores";

export type ViewPersonalizada = {
  id: string;
  nome: string;
  escopo: EscopoView;
  blocos: string[];
  perfis: Perfil[];
  /** Filtro de áreas salvo; nunca amplia o acesso de quem visualiza. */
  areas?: string[];
};

export const blocosPorEscopo: Record<EscopoView, { id: string; label: string }[]> = {
  executiva: [
    { id: "kpis", label: "Indicadores-chave" },
    { id: "execucao", label: "Execução orçamentária" },
    { id: "status", label: "Projetos por status" },
    { id: "portfolios", label: "Portfólios institucionais" },
    { id: "riscos", label: "Riscos em destaque" },
    { id: "progresso", label: "Progresso por portfólio" },
    { id: "auditoria", label: "Trilha de auditoria" },
  ],
  indicadores: [
    { id: "kpis", label: "Resumo de metas" },
    { id: "dashboard", label: "Dashboard parametrizável" },
    { id: "cards", label: "Cartões de indicadores" },
  ],
};

const STORAGE_KEY = "hepta.views.v1";

function ler(): ViewPersonalizada[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ViewPersonalizada[]) : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();

function notificar() {
  listeners.forEach((l) => l());
}

export function useViews(escopo?: EscopoView) {
  const [views, setViews] = useState<ViewPersonalizada[]>([]);

  const sync = useCallback(() => setViews(ler()), []);

  useEffect(() => {
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, [sync]);

  const salvar = useCallback((todas: ViewPersonalizada[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todas));
    notificar();
  }, []);

  const criar = useCallback(
    (view: Omit<ViewPersonalizada, "id">) => {
      salvar([...ler(), { ...view, id: `view-${Date.now()}` }]);
    },
    [salvar],
  );

  const remover = useCallback(
    (id: string) => {
      salvar(ler().filter((v) => v.id !== id));
    },
    [salvar],
  );

  return {
    views: escopo ? views.filter((v) => v.escopo === escopo) : views,
    criar,
    remover,
  };
}
