import type React from "react";
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
        "panel overflow-hidden p-6 backdrop-blur-2xl",
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
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
      <h2 className="truncate font-display text-base font-semibold text-foreground">{title}</h2>
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
  value: React.ReactNode;
  delta?: { texto: string; tom: "up" | "down" | "flat" };
  hint?: string;
}) {
  return (
    <div className="panel panel-rule @container relative min-h-32 min-w-0 overflow-hidden p-5 sm:p-6">
      <p className="eyebrow truncate text-muted-foreground">{label}</p>
      <p className="num mt-4 whitespace-nowrap text-[clamp(1.25rem,11cqi,2.375rem)] font-semibold leading-none text-foreground">
        {value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        {delta && (
          <span
            className={cn(
              "chip",
              delta.tom === "up" && "border-success/40 bg-success/15 text-success",
              delta.tom === "down" && "border-destructive/40 bg-destructive/15 text-destructive",
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

const saudeMap: Record<Saude, { label: string; cls: string; dot: string }> = {
  verde: {
    label: "Saudável",
    cls: "border-success/40 bg-success/15 text-success",
    dot: "bg-success",
  },
  amarelo: {
    label: "Atenção",
    cls: "border-warning/40 bg-warning/15 text-warning",
    dot: "bg-warning",
  },
  vermelho: {
    label: "Crítico",
    cls: "border-destructive/40 bg-destructive/15 text-destructive",
    dot: "bg-destructive",
  },
};

export function SaudeTag({ saude }: { saude: Saude }) {
  const s = saudeMap[saude];
  return (
    <span className={cn("chip", s.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function Tag({
  children,
  tom = "neutro",
}: {
  children: ReactNode;
  tom?: "neutro" | "accent" | "info" | "success" | "danger" | "warning";
}) {
  return (
    <span
      className={cn(
        "chip",
        tom === "neutro" && "border-border bg-muted text-muted-foreground",
        tom === "accent" && "border-primary/40 bg-primary/15 text-primary",
        tom === "info" && "border-info/40 bg-info/15 text-info",
        tom === "success" && "border-success/40 bg-success/15 text-success",
        tom === "warning" && "border-warning/40 bg-warning/15 text-warning",
        tom === "danger" && "border-destructive/40 bg-destructive/15 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function Barra({ valor, tom = "accent" }: { valor: number; tom?: "accent" | "info" }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full border border-border bg-muted">
      <div
        className={cn("h-full rounded-full transition-all duration-200", tom === "accent" ? "bg-foreground" : "bg-primary")}
        style={{ width: `${Math.min(100, Math.max(0, valor))}%` }}
      />
    </div>
  );
}
