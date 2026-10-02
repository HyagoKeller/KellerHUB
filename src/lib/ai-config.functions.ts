import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const EMAIL_RESPONSAVEL_IA = "hyagokeller@outlook.com.br";

const motorSchema = z.object({
  motorId: z.enum(["nativa", "chatgpt", "gemini", "claude", "copilot", "personalizado"]),
  autorizacaoExterna: z.boolean(),
  endpoint: z.string().max(500),
  modelo: z.string().max(200),
  segredo: z.string().max(100),
  credencialPropria: z.boolean(),
});

const configPadrao = {
  motorId: "nativa",
  autorizacaoExterna: false,
  endpoint: "",
  modelo: "",
  segredo: "IA_EXTERNA_API_KEY",
  credencialPropria: false,
} as const;

async function exigirSuperadmin(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "superadmin")
    .maybeSingle();
  if (error || !data) throw new Error("Apenas o Superadministrador pode alterar o motor de IA.");
}

export const obterConfigMotorIA = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await exigirSuperadmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("app_settings")
      .select("config")
      .eq("id", "ai")
      .maybeSingle();
    if (error) throw error;
    const validacao = motorSchema.safeParse(data?.config ?? configPadrao);
    return validacao.success ? validacao.data : configPadrao;
  });

export const salvarConfigMotorIA = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ config: motorSchema, senha: z.string().min(8).max(200) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await exigirSuperadmin(context.supabase, context.userId);

    const email = typeof context.claims.email === "string" ? context.claims.email : "";
    if (!email) throw new Error("Não foi possível confirmar a identidade do Superadministrador.");
    if (email.toLowerCase() !== EMAIL_RESPONSAVEL_IA) {
      throw new Error("A configuração do motor de IA é exclusiva do responsável Hyago Keller.");
    }

    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const verificador = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: confirmacao, error: senhaErro } = await verificador.auth.signInWithPassword({
      email,
      password: data.senha,
    });
    if (senhaErro || confirmacao.user?.id !== context.userId) {
      throw new Error("Senha atual inválida. A configuração não foi salva.");
    }

    const config = data.config.motorId === "gemini"
      ? {
          ...data.config,
          credencialPropria: false,
          autorizacaoExterna: false,
          endpoint: "",
          modelo: "",
          segredo: "IA_EXTERNA_API_KEY",
        }
      : data.config;

    const { error } = await context.supabase.from("app_settings").upsert({
      id: "ai",
      config,
      updated_by: context.userId,
    });
    if (error) throw error;
    await context.supabase.from("security_audit_log").insert({
      user_id: context.userId,
      event_type: "ai_settings_changed",
      entity_type: "app_settings",
      entity_id: "ai",
      result: "success",
      context: { motor_id: config.motorId },
    });
    return config;
  });
