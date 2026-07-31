import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Layers,
  Boxes,
  FolderKanban,
  Target,
  Gauge,
  ShieldAlert,
  FileBarChart,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { usuarioAtual, organizacoes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Visão executiva", icon: LayoutDashboard, exact: true },
  { to: "/portfolios", label: "Portfólios", icon: Layers },
  { to: "/programas", label: "Programas", icon: Boxes },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/estrategia", label: "Estratégia", icon: Target },
  { to: "/indicadores", label: "Indicadores", icon: Gauge },
  { to: "/riscos", label: "Riscos", icon: ShieldAlert },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 px-3">
      {nav.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", active && "text-sidebar-primary")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar py-5">
      <div className="flex items-center gap-2.5 px-5 pb-6">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">
          H7
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-sidebar-accent-foreground">
            Hepta Project
          </p>
          <p className="truncate text-[11px] text-sidebar-foreground/60">Plataforma PPM · v2</p>
        </div>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto px-5 pt-6">
        <div className="rounded-md border border-sidebar-border/70 p-3">
          <p className="text-[11px] uppercase tracking-wide text-sidebar-foreground/50">
            Organização
          </p>
          <p className="mt-1 truncate text-sm text-sidebar-accent-foreground">
            {organizacoes[0].nome}
          </p>
          <p className="mt-2 text-[11px] text-sidebar-foreground/50">
            Perfil: {usuarioAtual.perfil}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border">
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
                className="shrink-0 rounded-md border border-border p-2 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="hidden min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 md:flex md:w-80">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  placeholder="Buscar projetos, riscos, indicadores…"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                aria-label="Notificações"
                className="relative rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </button>
              <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  MA
                </div>
                <div className="hidden min-w-0 leading-tight sm:block">
                  <p className="truncate text-xs font-medium">{usuarioAtual.nome}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{usuarioAtual.perfil}</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 pb-6 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{title}</h1>
              {description && (
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
