import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createRunIdFetch, getRunIdFromRequest } from "@/lib/ai-gateway.server";
import { resolverMotor } from "@/lib/ai-modelo.server";
import { ehPerfil, montarSystemPrompt } from "@/lib/assistente-contexto.server";
import { createClient } from "@supabase/supabase-js";

type CorpoChat = {
  messages?: unknown;
  perfil?: unknown;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!token || !url || !key) return new Response("Não autorizado", { status: 401 });
        const cliente = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: identidade, error: identidadeErro } = await cliente.auth.getUser(token);
        if (identidadeErro || !identidade.user || identidade.user.email?.toLowerCase() !== "hyagokeller@outlook.com.br") {
          return new Response("Não autorizado", { status: 401 });
        }
        const { messages, perfil } = (await request.json()) as CorpoChat;
        if (!Array.isArray(messages)) {
          return new Response("Mensagens são obrigatórias", { status: 400 });
        }

        const perfilAtivo = ehPerfil(perfil) ? perfil : "Gestor";
        const initialRunId = getRunIdFromRequest(request);
        const runIdFetch = createRunIdFetch(initialRunId);

        const { data: papel } = await cliente
          .from("user_roles")
          .select("role")
          .eq("user_id", identidade.user.id)
          .eq("role", "superadmin")
          .maybeSingle();
        if (!papel) return new Response("Não autorizado", { status: 403 });

        const { data: configuracao, error: configErro } = await cliente
          .from("app_settings")
          .select("config")
          .eq("id", "ai")
          .maybeSingle();
        if (configErro) return new Response("Não foi possível carregar o motor de IA.", { status: 500 });
        const motor = configuracao?.config && typeof configuracao.config === "object"
          ? configuracao.config
          : { motorId: "nativa" };

        const resolucao = resolverMotor(motor, runIdFetch.fetch);
        if (!resolucao.ok) {
          return new Response(resolucao.mensagem, { status: resolucao.status });
        }

        const nativo = ("motorId" in motor ? motor.motorId : "nativa") === "nativa";

        const result = streamText({
          model: resolucao.model,
          system: montarSystemPrompt(perfilAtivo),
          messages: await convertToModelMessages(messages as UIMessage[]),
          abortSignal: request.signal,
          ...(nativo
            ? {
                providerOptions: {
                  openai: {
                    store: false,
                    forceReasoning: true,
                    reasoningEffort: "low",
                    reasoningSummary: "auto",
                    include: ["reasoning.encrypted_content"],
                  },
                },
              }
            : {}),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
