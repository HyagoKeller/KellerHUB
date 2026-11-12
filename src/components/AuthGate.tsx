import { Navigate, useRouterState } from "@tanstack/react-router";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { garantirSuperadmin } from "@/lib/auth";
import { CarteiraCompartilhadaProvider } from "@/lib/ppm-store";

type Estado = "carregando" | "autorizado" | "negado";

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [estado, setEstado] = useState<Estado>("carregando");
  const rotaPublica = pathname === "/auth" || pathname === "/reset-password";

  useEffect(() => {
    let ativo = true;
    const conferir = async () => {
      try {
        const resultado = await garantirSuperadmin();
        if (!ativo) return;

        setEstado(resultado.autorizado ? "autorizado" : "negado");
      } catch {
        if (ativo) setEstado("negado");
      }
    };

    void conferir();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setEstado("carregando");
        if (event === "SIGNED_OUT") {
          setEstado("negado");
          return;
        }
        void garantirSuperadmin(session?.user).then((resultado) => {
          if (!ativo) return;
  
          setEstado(resultado.autorizado ? "autorizado" : "negado");
        }).catch(() => {
          if (ativo) setEstado("negado");
        });
      }
    });
    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (rotaPublica) return children;
  if (estado === "negado") return <Navigate to="/auth" search={{ next: pathname }} replace />;
  if (estado === "carregando") {
    return (
      <div className="liquid-workspace grid min-h-screen place-items-center bg-background text-foreground">
        <div className="panel flex items-center gap-3 px-5 py-4 text-sm text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" /> Verificando acesso
        </div>
      </div>
    );
  }
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-background text-foreground">Carregando dados compartilhados</div>}><CarteiraCompartilhadaProvider>{children}</CarteiraCompartilhadaProvider></Suspense>;
}