import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Saude } from "@/lib/mock-data";

export function Panel({
  className,
  children,
  rule = "ink",
}: {
  className?: string;
  children: ReactNode;
  rule?: "ink" | "primary" | "accent" | "none";
}) {
  return (
    <section
      className={cn(
        "panel p-5",
        rule === "ink" && "panel-rule",
        rule === "primary" && "panel-rule-primary",
        rule === "accent" && "panel-rule-accent",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border pb-3">
      <h2 className="eyebrow truncate text-foreground">{title}</h2>
      {hint && <span className="shrink-0 text-[11px] text-muted-foreground">{hint}</span>}
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
    <div className="panel panel-rule relative overflow-hidden p-5">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="num mt-3 text-[30px] font-semibold leading-none text-foreground sm:text-[34px]">
        {value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center border px-1.5 py-0.5 font-medium uppercase tracking-wide",
              delta.tom === "up" && "border-success/40 bg-success/10 text-success",
              delta.tom === "down" && "border-destructive/40 bg-destructive/8 text-destructive",
              delta.tom === "flat" && "border-border bg-muted text-muted-foreground",
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
  verde: { label: "Saudável", cls: "border-success/40 bg-success/10 text-success" },
  amarelo: { label: "Atenção", cls: "border-foreground/25 bg-accent/35 text-foreground" },
  vermelho: { label: "Crítico", cls: "border-destructive/40 bg-destructive/10 text-destructive" },
};

export function SaudeTag({ saude }: { saude: Saude }) {
  const s = saudeMap[saude];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        s.cls,
      )}
    >
      <span className="h-1.5 w-1.5 bg-current" />
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
        "inline-flex shrink-0 items-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        tom === "neutro" && "border-border bg-muted text-muted-foreground",
        tom === "accent" && "border-foreground/25 bg-accent/35 text-foreground",
        tom === "info" && "border-info/40 bg-info/10 text-info",
        tom === "success" && "border-success/40 bg-success/10 text-success",
        tom === "danger" && "border-destructive/40 bg-destructive/10 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function Barra({ valor, tom = "accent" }: { valor: number; tom?: "accent" | "info" }) {
  return (
    <div className="h-2 w-full overflow-hidden border border-border bg-muted">
      <div
        className={cn("h-full", tom === "accent" ? "bg-foreground" : "bg-primary")}
        style={{ width: `${Math.min(100, Math.max(0, valor))}%` }}
      />
    </div>
  );
}
