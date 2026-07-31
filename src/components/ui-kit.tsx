import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Saude } from "@/lib/mock-data";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("panel p-5", className)}>{children}</section>;
}

export function PanelTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
      <h2 className="truncate font-display text-sm font-semibold uppercase tracking-wide">
        {title}
      </h2>
      {hint && <span className="shrink-0 text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: { texto: string; tom: "up" | "down" | "flat" };
  hint?: string;
}) {
  return (
    <div className="panel p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="num mt-2 font-display text-2xl font-bold sm:text-[28px]">{value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              delta.tom === "up" && "bg-success/12 text-success",
              delta.tom === "down" && "bg-destructive/12 text-destructive",
              delta.tom === "flat" && "bg-muted text-muted-foreground",
            )}
          >
            {delta.texto}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

const saudeMap: Record<Saude, { label: string; cls: string }> = {
  verde: { label: "Saudável", cls: "bg-success/12 text-success" },
  amarelo: { label: "Atenção", cls: "bg-warning/18 text-warning-foreground" },
  vermelho: { label: "Crítico", cls: "bg-destructive/12 text-destructive" },
};

export function SaudeTag({ saude }: { saude: Saude }) {
  const s = saudeMap[saude];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.cls,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function Tag({
  children,
  tom = "neutro",
}: {
  children: ReactNode;
  tom?: "neutro" | "accent" | "info" | "success" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tom === "neutro" && "bg-muted text-muted-foreground",
        tom === "accent" && "bg-accent/20 text-accent-foreground",
        tom === "info" && "bg-info/12 text-info",
        tom === "success" && "bg-success/12 text-success",
        tom === "danger" && "bg-destructive/12 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function Barra({ valor, tom = "accent" }: { valor: number; tom?: "accent" | "info" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full", tom === "accent" ? "bg-accent" : "bg-info")}
        style={{ width: `${Math.min(100, Math.max(0, valor))}%` }}
      />
    </div>
  );
}
