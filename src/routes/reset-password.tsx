import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { RodapeInstitucional } from "@/components/RodapeInstitucional";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha | Keller Hub" },
      { name: "description", content: "Redefinição segura da senha de acesso ao Keller Hub." },
      { property: "og:title", content: "Redefinir senha | Keller Hub" },
      { property: "og:description", content: "Redefinição segura da senha de acesso ao Keller Hub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [recuperacao, setRecuperacao] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const verificar = async () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const { data } = await supabase.auth.getSession();
      setRecuperacao(hash.get("type") === "recovery" || Boolean(data.session));
    };
    void verificar();
  }, []);

  const salvar = async () => {
    if (senha.length < 8) return setErro("Use uma senha com pelo menos 8 caracteres.");
    if (senha !== confirmacao) return setErro("As senhas informadas não coincidem.");
    setOcupado(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setOcupado(false);
    if (error) return setErro(error.message);
    await navigate({ to: "/" });
  };

  return (
    <main className="liquid-workspace relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="liquid-atmosphere" aria-hidden="true"><div className="liquid-blob liquid-blob-a" /><div className="liquid-blob liquid-blob-b" /></div>
      <div className="relative z-10 w-full max-w-md">
      <section className="panel p-6 sm:p-8">
        <div className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
        <h1 className="font-display text-2xl font-semibold">Redefinir senha</h1>
        {!recuperacao ? <p className="mt-3 text-sm text-muted-foreground">Abra novamente o link recebido por e-mail para redefinir a senha.</p> : <>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Nova senha<div className="relative mt-2"><KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} className="pl-9" /></div></label>
            <label className="block text-sm font-medium">Confirmar nova senha<Input type="password" value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} className="mt-2" /></label>
          </div>
          {erro && <p role="alert" className="mt-4 text-sm text-destructive">{erro}</p>}
          <Button className="mt-6 w-full" onClick={() => void salvar()} disabled={ocupado}>{ocupado ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}Salvar nova senha</Button>
        </>}
      </section>
      <RodapeInstitucional className="mt-6" />
      </div>
    </main>
  );
}