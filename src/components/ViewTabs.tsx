import { Link } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewPersonalizada } from "@/lib/views";
import { acesso } from "@/lib/acesso";

export function ViewTabs({
  views,
  ativa,
  onChange,
}: {
  views: ViewPersonalizada[];
  ativa: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange("padrao")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
          ativa === "padrao"
            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "border-border bg-card text-muted-foreground hover:text-foreground",
        )}
      >
        <Star className="h-3.5 w-3.5" /> Visão padrão
      </button>
      {views.map((v) => (
        <button
          key={v.id}
          onClick={() => {
            if (v.areas?.length) acesso.filtrar(v.areas);
            onChange(v.id);
          }}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
            ativa === v.id
              ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {v.nome}
        </button>
      ))}
      <Link
        to="/configuracoes"
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" /> Nova view
      </Link>
    </div>
  );
}
