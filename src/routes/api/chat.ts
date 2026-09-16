import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createRunIdFetch, getRunIdFromRequest } from "@/lib/ai-gateway.server";
import { resolverMotor } from "@/lib/ai-modelo.server";
import { ehPerfil, montarSystemPrompt } from "@/lib/assistente-contexto.server";
import type { ConfigMotorIA } from "@/lib/ai-provedores";

type CorpoChat = {
  messages?: unknown;
  perfil?: unknown;
  motor?: Partial<ConfigMotorIA>;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, perfil, motor } = (await request.json()) as CorpoChat;
        if (!Array.isArray(messages)) {
          return new Response("Mensagens são obrigatórias", { status: 400 });
        }

        const perfilAtivo = ehPerfil(perfil) ? perfil : "Gestor";
        const initialRunId = getRunIdFromRequest(request);
        const runIdFetch = createRunIdFetch(initialRunId);

        const resolucao = resolverMotor(motor, runIdFetch.fetch);
        if (!resolucao.ok) {
          return new Response(resolucao.mensagem, { status: resolucao.status });
        }

        const nativo = (motor?.motorId ?? "nativa") === "nativa";

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
