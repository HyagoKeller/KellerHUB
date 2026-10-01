import { supabase } from "@/integrations/supabase/client";

export const EMAIL_SUPERADMIN = "hyagokeller@outlook.com.br";

export async function garantirSuperadmin() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { autorizado: false, user: null };

  const email = data.user.email?.toLowerCase();
  if (email !== EMAIL_SUPERADMIN) return { autorizado: false, user: data.user };

  const { data: papel, error: papelErro } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "superadmin")
    .maybeSingle();

  if (papelErro) throw papelErro;
  if (!papel) {
    const { error: inserirErro } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: "superadmin" });
    if (inserirErro) throw inserirErro;
  }

  return { autorizado: true, user: data.user };
}

export const authenticatedFetch: typeof fetch = async (input, init) => {
  const { data } = await supabase.auth.getSession();
  const headers = new Headers(init?.headers);
  if (data.session?.access_token) {
    headers.set("Authorization", `Bearer ${data.session.access_token}`);
  }
  return fetch(input, { ...init, headers });
};