import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Layers,
  Boxes,
  FolderKanban,
  Target,
  Gauge,
  ShieldAlert,
  MessageSquareText,
  FileBarChart,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { usuarioAtual, organizacoes } from "@/lib/mock-data";
import { usePortal } from "@/lib/portal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BuscaGlobal, SeletorArea, SimularPerfil } from "@/components/Acesso";
import { supabase } from "@/integrations/supabase/client";
import { RodapeInstitucional } from "@/components/RodapeInstitucional";

const AssistenteFlutuante = lazy(async () => {
  const modulo = await import("@/components/AssistenteFlutuante");
  return { default: modulo.AssistenteFlutuante };
});

const nav = [
  { to: "/", label: "Visão executiva", icon: LayoutDashboard, exact: true },
  { to: "/portfolios", label: "Portfólios", icon: Layers },
  { to: "/programas", label: "Programas", icon: Boxes },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/estrategia", label: "Estratégia", icon: Target },
  { to: "/indicadores", label: "Indicadores", icon: Gauge },
  { to: "/riscos", label: "Riscos", icon: ShieldAlert },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart },
  { to: "/assistente", label: "Assistente", icon: MessageSquareText },
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
            aria-label="Logo Keller Hub"
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
        <p className="truncate font-display text-base font-semibold text-sidebar-accent-foreground">
          {nome || "Keller Hub"}
        </p>
        <p className="eyebrow truncate text-sidebar-foreground/50">Gestão PPM</p>
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
                ? "nav-active-glass text-sidebar-primary-foreground"
                : "nav-glass text-sidebar-foreground/75 hover:translate-x-0.5 hover:text-sidebar-accent-foreground",
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
  const { config } = usePortal();
  const nomeOrg = config.organizacao || organizacoes[0].nome;
  return (
    <div className="flex h-full flex-col bg-sidebar/72 py-5 backdrop-blur-3xl">
      <div className="px-5 pb-5">
        <Logo logo={config.logo} nome={config.organizacao || undefined} />
      </div>
      <div className="px-3 pb-3">
        <div className="h-px bg-sidebar-border/60" />
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mt-auto px-5 pt-6">
        <div className="glass-control rounded-xl px-4 py-3">
          <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
            {nomeOrg}
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
  const [carregarAssistente, setCarregarAssistente] = useState(false);
  const { config, alternarModo } = usePortal();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (pathname.startsWith("/assistente")) return;
    const ativar = () => setCarregarAssistente(true);
    const janela = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (janela.requestIdleCallback) {
      const id = janela.requestIdleCallback(ativar, { timeout: 2500 });
      return () => janela.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(ativar, 1200);
    return () => window.clearTimeout(id);
  }, [pathname]);
  const sair = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", search: { next: "/" }, replace: true });
  };


  return (
    <div className="liquid-workspace min-h-screen w-full bg-background">
      <div className="liquid-atmosphere" aria-hidden="true">
        <div className="liquid-blob liquid-blob-a" />
        <div className="liquid-blob liquid-blob-b" />
        <div className="liquid-blob liquid-blob-c" />
      </div>
       <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border/70 bg-sidebar/66 shadow-2xl shadow-background/30 backdrop-blur-3xl lg:block">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border/70 bg-sidebar/88 shadow-2xl backdrop-blur-3xl">
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
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/48 shadow-lg shadow-background/20 backdrop-blur-3xl">
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
              <BuscaGlobal />
              <SeletorArea />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={alternarModo}
                aria-label={config.modo === "escuro" ? "Ativar modo claro" : "Ativar modo escuro"}
                title={config.modo === "escuro" ? "Modo claro" : "Modo escuro"}
                className="text-muted-foreground hover:text-foreground"
              >
                {config.modo === "escuro" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button

                variant="outline"
                size="icon"
                aria-label="Notificações"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <SimularPerfil />
              <Button variant="outline" size="icon" onClick={() => void sair()} aria-label="Sair" title="Sair"><LogOut className="h-4 w-4" /></Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Gestão de projetos <span className="px-1.5 text-border">/</span> <span className="text-foreground">{title}</span></p>
              <h1 className="mt-2 truncate font-display text-2xl font-semibold">
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
          <RodapeInstitucional className="pb-2 pt-10" />
        </main>
      </div>
      {carregarAssistente && !pathname.startsWith("/assistente") && (
        <Suspense fallback={null}>
          <AssistenteFlutuante />
        </Suspense>
      )}
    </div>
  );
}
