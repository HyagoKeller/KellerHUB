import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  createGovernancaAiProvider,
  createRunIdFetch,
  getRunIdFromRequest,
} from "@/lib/ai-gateway.server";
import { ehPerfil, montarSystemPrompt } from "@/lib/assistente-contexto.server";

type CorpoChat = { messages?: unknown; perfil?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, perfil } = (await request.json()) as CorpoChat;
        if (!Array.isArray(messages)) {
          return new Response("Mensagens são obrigatórias", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("Assistente indisponível: chave de IA não configurada", { status: 500 });
        }

        const perfilAtivo = ehPerfil(perfil) ? perfil : "Gestor";
        const initialRunId = getRunIdFromRequest(request);
        const runIdFetch = createRunIdFetch(initialRunId);
        const provider = createGovernancaAiProvider(apiKey, runIdFetch.fetch);

        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: montarSystemPrompt(perfilAtivo),
          messages: await convertToModelMessages(messages as UIMessage[]),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
