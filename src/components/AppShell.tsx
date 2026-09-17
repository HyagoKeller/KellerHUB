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
  BrainCircuit,
  FileBarChart,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { usuarioAtual, organizacoes } from "@/lib/mock-data";
import { usePortal } from "@/lib/portal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const nav = [
  { to: "/", label: "Visão executiva", icon: LayoutDashboard, exact: true },
  { to: "/portfolios", label: "Portfólios", icon: Layers },
  { to: "/programas", label: "Programas", icon: Boxes },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/estrategia", label: "Estratégia", icon: Target },
  { to: "/indicadores", label: "Indicadores", icon: Gauge },
  { to: "/riscos", label: "Riscos", icon: ShieldAlert },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart },
  { to: "/assistente", label: "Assistente IA", icon: BrainCircuit },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;


function Logo({ className, logo, nome }: { className?: string; logo?: string; nome?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {logo ? (
        <img
          src={logo}
          alt={`Logo de ${nome || "organização"}`}
          className="h-10 w-10 shrink-0 rounded-xl object-contain"
        />
      ) : (
        <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            aria-label="Hepta logo"
          >
            <path
              d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 7V17M7 10V17M17 10V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-display text-base font-bold text-sidebar-accent-foreground">
          {nome || "Hepta"}
        </p>
        <p className="eyebrow truncate text-sidebar-foreground/50">Project PPM</p>
      </div>
    </div>
  );
}


function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1.5 px-3">
      {nav.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20"
                : "text-sidebar-foreground/75 hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
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
      <div className="px-5 pb-5">
        <Logo />
      </div>
      <div className="px-3 pb-3">
        <div className="h-px bg-sidebar-border/60" />
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto px-5 pt-6">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-4">
          <p className="eyebrow text-sidebar-foreground/50">Organização</p>
          <p className="mt-1.5 truncate text-sm font-medium text-sidebar-accent-foreground">
            {organizacoes[0].nome}
          </p>
          <div className="mt-3 h-px bg-sidebar-border/40" />
          <p className="eyebrow mt-3 text-sidebar-foreground/50">Perfil</p>
          <p className="mt-1 text-xs font-medium text-sidebar-primary">{usuarioAtual.perfil}</p>
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-4 z-10 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
                className="shrink-0 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="hidden min-w-0 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 transition-colors focus-within:border-primary md:flex md:w-96">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  placeholder="Buscar projetos, riscos, indicadores…"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                aria-label="Notificações"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/40" />
              </Button>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 transition-colors hover:border-primary/50">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success text-[11px] font-bold text-success-foreground">
                  MA
                </div>
                <div className="hidden min-w-0 leading-tight sm:block">
                  <p className="truncate text-xs font-medium text-foreground">{usuarioAtual.nome}</p>
                  <p className="eyebrow truncate text-muted-foreground">{usuarioAtual.perfil}</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow text-muted-foreground">Project management <span className="px-1.5 text-border">/</span> <span className="text-primary">{title}.</span></p>
              <h1 className="mt-2 truncate font-display text-[28px] font-bold sm:text-[38px]">
                {title}
              </h1>
              {description && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
          </div>
          <div className="pt-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
