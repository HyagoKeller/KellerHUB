// Conexão server-side com o Lovable AI Gateway (Responses API).
// A chave nunca sai do servidor.
import { createOpenAI } from "@ai-sdk/openai";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createRunIdFetch(initialRunId?: string | null) {
  let runId = initialRunId ?? null;

  const wrapped: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set(RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    const returned = response.headers.get(RUN_ID_HEADER);
    if (returned) runId = returned;
    return response;
  };

  return {
    fetch: wrapped,
    get runId() {
      return runId;
    },
  };
}

export function getRunIdFromRequest(request: Request) {
  return request.headers.get(RUN_ID_HEADER);
}

export function createGovernancaAiProvider(
  apiKey: string,
  fetchImpl: typeof fetch,
) {
  return createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: fetchImpl,
  });
}
