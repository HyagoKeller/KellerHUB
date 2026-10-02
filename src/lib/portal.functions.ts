import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database, Json } from "@/integrations/supabase/types";

const portalSchema = z.object({
  organizacao: z.string().max(160),
  logo: z.string().max(2_000_000),
  mensagemInicioSessao: z.string().max(800),
  logoInicioSessao: z.string().max(2_000_000),
  metodoAcesso: z.enum(["local", "ad", "microsoft365"]),
  textoBotaoMicrosoft365: z.string().max(160),
  idioma: z.string().max(80),
  fusoHorario: z.string().max(100),
  localizacao: z.string().max(100),
  formatoMonetario: z.string().max(40),
  tamanhoMaximoArquivoMb: z.number().int().min(1).max(2048),
  extensoesProibidas: z.string().max(1000),
  sitesPermitidos: z.string().max(4000),
  nomeAssistente: z.string().max(160),
  iconeAssistente: z.string().max(2_000_000),
  estiloAssistente: z.enum(["orbita", "prisma", "nexo", "personalizado"]),
  paleta: z.enum(["azul", "indigo", "verde", "teal", "ambar", "magenta", "grafite"]),
  modo: z.enum(["claro", "escuro"]),
});

export const obterPortalPublico = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const { data, error } = await client.rpc("get_public_portal_settings");
  if (error) throw error;
  return data && typeof data === "object" ? data : null;
});

export const obterPortalCompleto = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "superadmin")
      .maybeSingle();
    if (roleError || !role) return null;
    const { data, error } = await context.supabase
      .from("portal_settings")
      .select("config")
      .eq("id", "portal")
      .maybeSingle();
    if (error) throw error;
    const validacao = portalSchema.safeParse(data?.config);
    return validacao.success ? validacao.data : null;
  });

export const salvarPortalCompartilhado = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => portalSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: role, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "superadmin")
      .maybeSingle();
    if (roleError || !role) throw new Error("Apenas o Superadministrador pode alterar as configurações do portal.");

    const { error } = await context.supabase.from("portal_settings").upsert({
      id: "portal",
      config: data as unknown as Json,
      updated_by: context.userId,
    });
    if (error) throw error;
    await context.supabase.from("security_audit_log").insert({
      user_id: context.userId,
      event_type: "administrative_action",
      entity_type: "portal_settings",
      entity_id: "portal",
      result: "success",
      context: { action: "portal_settings_changed" },
    });
    return data;
  });