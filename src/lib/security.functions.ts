import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const VERSAO_TERMOS = "2026-10-02.1";


const eventoSchema = z.object({
  eventType: z.enum([
    "authenticated_access",
    "terms_accepted",
    "ai_settings_changed",
    "assistant_used",
    "report_exported",
    "administrative_action",
  ]),
  entityType: z.string().min(1).max(80),
  entityId: z.string().max(160).optional(),
  result: z.enum(["success", "denied", "error"]).default("success"),
  context: z.record(z.union([z.string().max(200), z.number(), z.boolean(), z.null()])).default({}),
  sessionReference: z.string().max(80).optional(),
});

export const obterEstadoSeguranca = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: aceite, error: aceiteErro }, { data: perfil }] = await Promise.all([
      context.supabase
        .from("terms_acceptances")
        .select("accepted_at")
        .eq("user_id", context.userId)
        .eq("terms_version", VERSAO_TERMOS)
        .maybeSingle(),
      context.supabase
        .from("profiles")
        .select("email, display_name")
        .eq("id", context.userId)
        .maybeSingle(),
    ]);
    if (aceiteErro) throw aceiteErro;
    const emailClaim = typeof context.claims.email === "string" ? context.claims.email : "";
    const email = perfil?.email || emailClaim;
    return {
      accepted: Boolean(aceite),
      acceptedAt: aceite?.accepted_at ?? null,
      termsVersion: VERSAO_TERMOS,
      user: {
        id: context.userId,
        email,
        displayName: perfil?.display_name || email.split("@")[0] || "Usuário autorizado",
      },
    };
  });

export const aceitarTermos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ confirmed: z.literal(true), sessionReference: z.string().max(80) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("terms_acceptances").insert({
      user_id: context.userId,
      terms_version: VERSAO_TERMOS,
      user_agent_category: "browser",
    });
    if (error && error.code !== "23505") throw error;
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("security_audit_log").insert({
      user_id: context.userId,
      event_type: "terms_accepted",
      entity_type: "terms",
      entity_id: VERSAO_TERMOS,
      result: "success",
      context: { source: "mandatory_gate" },
      session_reference: data.sessionReference,
    });
    return { accepted: true, termsVersion: VERSAO_TERMOS };
  });

export const registrarEventoSeguranca = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => eventoSchema.parse(input))
  .handler(async ({ data, context }) => {
    const {supabaseAdmin}=await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("security_audit_log").insert({
      user_id: context.userId,
      event_type: data.eventType,
      entity_type: data.entityType,
      entity_id: data.entityId,
      result: data.result,
      context: data.context,
      session_reference: data.sessionReference,
    });
    if (error) throw error;
    return { recorded: true };
  });

export const listarAuditoriaSeguranca = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{data:admin},{data:auditor}]=await Promise.all([context.supabase.rpc("ppm_tem_papel",{p:"administrador_pmo"}),context.supabase.rpc("ppm_tem_papel",{p:"auditor"})]);
    if(!admin&&!auditor)throw new Error("Acesso restrito a Auditor e Administrador/PMO.");
    const { data, error } = await context.supabase
      .from("security_audit_log")
      .select("id, user_id, event_type, entity_type, entity_id, result, context, session_reference, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data;
  });