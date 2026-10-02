import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const EMAIL_SUPERADMIN = "hyagokeller@outlook.com.br";
export const EMAIL_CLIENTE_DEMO = "nucleo@hepta.com.br";
export const EMAILS_SUPERADMIN = [EMAIL_SUPERADMIN, EMAIL_CLIENTE_DEMO] as const;

type ResultadoAcesso = { autorizado: boolean; user: User | null };
const cacheAcesso = new Map<string, { resultado: ResultadoAcesso; expiraEm: number }>();
const consultasAcesso = new Map<string, Promise<ResultadoAcesso>>();
const DURACAO_CACHE_ACESSO = 5 * 60 * 1000;

async function consultarSuperadmin(usuarioConfirmado?: User): Promise<ResultadoAcesso> {
  const { data, error } = usuarioConfirmado
    ? { data: { user: usuarioConfirmado }, error: null }
    : await supabase.auth.getUser();
  if (error || !data.user) return { autorizado: false, user: null };

  const { data: papel, error: papelErro } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "superadmin")
    .maybeSingle();

  if (papelErro) throw papelErro;
  if (!papel && EMAILS_SUPERADMIN.includes(data.user.email?.toLowerCase() as typeof EMAILS_SUPERADMIN[number])) {
    const { error: inserirErro } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: "superadmin" });
    if (inserirErro) throw inserirErro;
  }

  return { autorizado: Boolean(papel) || EMAILS_SUPERADMIN.includes(data.user.email?.toLowerCase() as typeof EMAILS_SUPERADMIN[number]), user: data.user };
}

export async function garantirSuperadmin(usuarioConfirmado?: User) {
  const id = usuarioConfirmado?.id;
  if (!id) return consultarSuperadmin();
  const agora = Date.now();
  const salvo = cacheAcesso.get(id);
  if (salvo && salvo.expiraEm > agora) return salvo.resultado;
  const pendente = consultasAcesso.get(id);
  if (pendente) return pendente;
  const consulta = consultarSuperadmin(usuarioConfirmado).then((resultado) => {
    cacheAcesso.set(id, { resultado, expiraEm: agora + DURACAO_CACHE_ACESSO });
    consultasAcesso.delete(id);
    return resultado;
  }).catch((erro) => {
    consultasAcesso.delete(id);
    throw erro;
  });
  consultasAcesso.set(id, consulta);
  return consulta;
}

export const authenticatedFetch: typeof fetch = async (input, init) => {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init?.headers);
  if (data.session?.access_token) {
    headers.set("Authorization", `Bearer ${data.session.access_token}`);
  }
  return fetch(input, { ...init, headers });
};