import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FileCheck2, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { aceitarTermos, obterEstadoSeguranca, registrarEventoSeguranca } from "@/lib/security.functions";

type Estado = Awaited<ReturnType<typeof obterEstadoSeguranca>>;

function referenciaSessao() {
  const chave = "keller-hub.session-reference";
  const atual = sessionStorage.getItem(chave);
  if (atual) return atual;
  const nova = crypto.randomUUID().slice(0, 12);
  sessionStorage.setItem(chave, nova);
  return nova;
}

export function SecurityProtection({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const sessao = useMemo(() => referenciaSessao(), []);

  useEffect(() => {
    let ativo = true;
    void obterEstadoSeguranca().then((resultado) => {
      if (!ativo) return;
      setEstado(resultado);
      if (resultado.accepted) {
        void registrarEventoSeguranca({ data: {
          eventType: "authenticated_access",
          entityType: "application",
          result: "success",
          context: { path: window.location.pathname },
          sessionReference: sessao,
        } }).catch(() => undefined);
      }
    }).catch(() => {
      if (ativo) setErro("Não foi possível confirmar os termos de acesso.");
    });
    return () => { ativo = false; };
  }, [sessao]);

  const aceitar = async () => {
    if (!confirmado) return;
    setSalvando(true);
    setErro("");
    try {
      await aceitarTermos({ data: { confirmed: true, sessionReference: sessao } });
      const novoEstado = await obterEstadoSeguranca();
      setEstado(novoEstado);
    } catch {
      setErro("Não foi possível registrar o aceite. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  if (!estado) {
    return <div className="liquid-workspace grid min-h-screen place-items-center bg-background text-foreground"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      {children}
      <div className="security-watermark" aria-hidden="true">
        <span>{estado.user.email}</span><span>{new Date().toLocaleDateString("pt-BR")} · {sessao}</span>
      </div>
      {!estado.accepted && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-background/75 p-4 backdrop-blur-xl">
          <section role="dialog" aria-modal="true" aria-labelledby="titulo-termos" className="panel max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><FileCheck2 className="h-5 w-5" /></div>
              <div><h1 id="titulo-termos" className="font-display text-xl font-semibold">Termos de uso e licença</h1><p className="mt-1 text-sm text-muted-foreground">Versão {estado.termsVersion}</p></div>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>O Keller Hub é licenciado para uso autorizado. É proibido copiar, redistribuir, sublicenciar, fazer engenharia reversa ou compartilhar credenciais de acesso.</p>
              <p>As telas possuem identificação individual e as ações relevantes podem ser registradas para segurança, auditoria e atendimento às obrigações legais.</p>
              <p>Capturas ou exportações devem respeitar a LGPD, as regras da organização e a finalidade que justificou o acesso.</p>
            </div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/35 p-4 text-sm">
              <Checkbox checked={confirmado} onCheckedChange={(valor) => setConfirmado(valor === true)} className="mt-0.5" />
              <span>Li e aceito os termos de uso, a licença e o registro das ações de segurança.</span>
            </label>
            {erro && <p role="alert" className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Aceite individual e auditável</p>
              <Button onClick={() => void aceitar()} disabled={!confirmado || salvando}>{salvando ? <LoaderCircle className="animate-spin" /> : <FileCheck2 />}Aceitar e continuar</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}