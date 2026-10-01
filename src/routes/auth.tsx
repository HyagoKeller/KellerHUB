import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL_SUPERADMIN, garantirSuperadmin } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({ next: typeof search.next === "string" ? search.next : "/" }),
  head: () => ({
    meta: [
      { title: "Acesso seguro | Keller Hub" },
      { name: "description", content: "Acesso autenticado à demonstração institucional do Keller Hub." },
      { property: "og:title", content: "Acesso seguro | Keller Hub" },
      { property: "og:description", content: "Acesso autenticado à demonstração institucional do Keller Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [modo, setModo] = useState<"entrar" | "ativar">("entrar");
  const [senha, setSenha] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const destino = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const enviar = async () => {
    if (senha.length < 8) {
      setErro("Use uma senha com pelo menos 8 caracteres.");
      return;
    }
    setOcupado(true);
    setErro("");
    setMensagem("");
    try {
      if (modo === "ativar") {
        const { data, error } = await supabase.auth.signUp({
          email: EMAIL_SUPERADMIN,
          password: senha,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setMensagem("Conta criada. Confirme o acesso no e-mail informado e depois entre com sua senha.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: EMAIL_SUPERADMIN, password: senha });
        if (error) throw error;
      }
      const resultado = await garantirSuperadmin();
      if (!resultado.autorizado) throw new Error("Este usuário não possui acesso à demonstração.");
      await navigate({ to: destino });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível concluir o acesso.");
    } finally {
      setOcupado(false);
    }
  };

  const recuperar = async () => {
    setOcupado(true);
    setErro("");
    const { error } = await supabase.auth.resetPasswordForEmail(EMAIL_SUPERADMIN, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setOcupado(false);
    if (error) setErro(error.message);
    else setMensagem("Enviamos as instruções de recuperação para o e-mail autorizado.");
  };

  return (
    <main className="liquid-workspace relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="liquid-atmosphere" aria-hidden="true"><div className="liquid-blob liquid-blob-a" /><div className="liquid-blob liquid-blob-b" /><div className="liquid-blob liquid-blob-c" /></div>
      <section className="panel relative z-10 w-full max-w-md p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
          <div><h1 className="font-display text-xl font-semibold">Keller Hub</h1><p className="text-sm text-muted-foreground">Ambiente de demonstração</p></div>
        </div>
        <h2 className="font-display text-2xl font-semibold">{modo === "entrar" ? "Acessar a plataforma" : "Ativar conta Superadministrador"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Acesso exclusivo para o responsável autorizado pela demonstração.</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">E-mail autorizado
            <div className="relative mt-2"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={EMAIL_SUPERADMIN} readOnly className="pl-9" /></div>
          </label>
          <label className="block text-sm font-medium">Senha
            <div className="relative mt-2"><KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void enviar()} autoComplete={modo === "entrar" ? "current-password" : "new-password"} className="pl-9" /></div>
          </label>
        </div>
        {erro && <p role="alert" className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
        {mensagem && <p role="status" className="mt-4 rounded-xl border border-success/40 bg-success/10 p-3 text-sm text-success">{mensagem}</p>}
        <Button className="mt-6 w-full" onClick={() => void enviar()} disabled={ocupado}>{ocupado ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}{modo === "entrar" ? "Entrar" : "Criar e confirmar conta"}</Button>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
          <Button variant="link" className="h-auto p-0" onClick={() => { setModo(modo === "entrar" ? "ativar" : "entrar"); setErro(""); setMensagem(""); }}>{modo === "entrar" ? "Primeiro acesso" : "Já tenho uma conta"}</Button>
          {modo === "entrar" && <Button variant="link" className="h-auto p-0" onClick={() => void recuperar()} disabled={ocupado}>Esqueci minha senha</Button>}
        </div>
      </section>
    </main>
  );
}