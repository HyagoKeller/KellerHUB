import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Eye, EyeOff, KeyRound, LoaderCircle, LogIn, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { garantirSuperadmin } from "@/lib/auth";
import { RodapeInstitucional } from "@/components/RodapeInstitucional";
import { usePortal } from "@/lib/portal";

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
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const { config } = usePortal();

  const destino = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const enviar = async () => {
    const email = identificador.trim().toLowerCase();
    if (!email) {
      setErro("Informe o usuário ou e-mail.");
      return;
    }
    if (senha.length < 8) {
      setErro("Use uma senha com pelo menos 8 caracteres.");
      return;
    }
    setOcupado(true);
    setErro("");
    setMensagem("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      if (!data.user || !data.session) throw new Error("Não foi possível confirmar a sessão de acesso.");
      const resultado = await garantirSuperadmin(data.user);
      if (!resultado.autorizado) throw new Error("Este usuário não possui acesso à demonstração.");
      await navigate({ to: destino });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível concluir o acesso.");
    } finally {
      setOcupado(false);
    }
  };

  const nomeOrganizacao = config.organizacao.trim() || "Keller Hub";
  const logoAcesso = config.logoInicioSessao || config.logo;
  const acessoMicrosoft = config.metodoAcesso === "microsoft365";
  const acessoDiretorio = config.metodoAcesso === "ad";

  const recuperar = async () => {
    const email = identificador.trim().toLowerCase();
    if (!email) {
      setErro("Informe o e-mail para recuperar a senha.");
      return;
    }
    setOcupado(true);
    setErro("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setOcupado(false);
    if (error) setErro(error.message);
    else setMensagem("Enviamos as instruções de recuperação para o e-mail autorizado.");
  };

  return (
    <main className="liquid-workspace relative flex min-h-screen flex-col overflow-hidden bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="liquid-atmosphere" aria-hidden="true"><div className="liquid-blob liquid-blob-a" /><div className="liquid-blob liquid-blob-b" /><div className="liquid-blob liquid-blob-c" /></div>
      <div className="relative z-10 flex flex-1 items-center justify-center py-2 sm:py-6">
        <div className="w-full max-w-5xl">
        <section className="panel grid overflow-hidden lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-h-64 flex-col items-center justify-center border-b border-border/60 p-8 text-center lg:min-h-[500px] lg:border-b-0 lg:border-r lg:p-12">
            <div className="grid min-h-28 min-w-28 place-items-center">
              {logoAcesso ? (
                <img src={logoAcesso} alt={`Logo de ${nomeOrganizacao}`} className="max-h-36 max-w-56 object-contain" />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <ShieldCheck className="h-11 w-11" />
                </div>
              )}
            </div>
            <h1 className="mt-7 max-w-sm font-display text-2xl font-semibold sm:text-3xl">{nomeOrganizacao}</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">{config.mensagemInicioSessao}</p>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="mb-7 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
                {acessoDiretorio ? <Building2 className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">Acessar a plataforma</h2>
                <p className="text-sm text-muted-foreground">{acessoDiretorio ? "Acesso pelo diretório corporativo" : "Informe seus dados de acesso"}</p>
              </div>
            </div>

            {acessoMicrosoft ? (
              <div className="space-y-4">
                <Button className="w-full" disabled>
                  <Building2 /> {config.textoBotaoMicrosoft365.trim() || "Acessar com Microsoft 365"}
                </Button>
                <p className="text-center text-xs leading-relaxed text-muted-foreground">A autenticação Microsoft 365 ainda não foi habilitada.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label className="block text-sm font-medium">Usuário ou e-mail
                    <div className="relative mt-2"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={identificador} onChange={(event) => setIdentificador(event.target.value)} autoComplete="username" className="pl-9" /></div>
                  </label>
                  <label className="block text-sm font-medium">Senha
                    <div className="relative mt-2">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type={senhaVisivel ? "text" : "password"} value={senha} onChange={(event) => setSenha(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void enviar()} autoComplete="current-password" className="px-9" />
                      <Button type="button" variant="ghost" size="icon-sm" className="absolute right-1 top-0.5 text-muted-foreground" onClick={() => setSenhaVisivel((visivel) => !visivel)} aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"} title={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}>
                        {senhaVisivel ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </label>
                </div>
                {erro && <p role="alert" className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
                {mensagem && <p role="status" className="mt-4 rounded-xl border border-success/40 bg-success/10 p-3 text-sm text-success">{mensagem}</p>}
                <Button className="mt-6 w-full" onClick={() => void enviar()} disabled={ocupado}>{ocupado ? <LoaderCircle className="animate-spin" /> : <LogIn />}Entrar</Button>
                <div className="mt-4 flex justify-end text-sm">
                  <Button variant="link" className="h-auto p-0" onClick={() => void recuperar()} disabled={ocupado}>Esqueci minha senha</Button>
                </div>
              </>
            )}
          </div>
        </section>
        </div>
      </div>
      <RodapeInstitucional className="relative z-10 shrink-0 pt-4" />
    </main>
  );
}