// Resolve qual motor de IA atende a consulta, sem acoplar a plataforma
// a um único fornecedor (requisito 4.153.1 "j").
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { createGovernancaAiProvider } from "./ai-gateway.server";
import { motorPorId, type ConfigMotorIA } from "./ai-provedores";

export type ResolucaoMotor =
  | { ok: true; model: LanguageModel; motor: string; externo: boolean }
  | { ok: false; status: number; mensagem: string };

export function resolverMotor(
  config: Partial<ConfigMotorIA> | undefined,
  fetchImpl: typeof fetch,
): ResolucaoMotor {
  const motor = motorPorId(config?.motorId ?? "nativa");

  if (motor.tipo === "interno") {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return {
        ok: false,
        status: 500,
        mensagem: "Assistente indisponível: credencial interna de IA não configurada.",
      };
    }
    const provider = createGovernancaAiProvider(apiKey, fetchImpl);
    const model =
      motor.id === "nativa"
        ? provider.responses(motor.modelo)
        : provider.chat(motor.modelo);
    return { ok: true, model, motor: motor.nome, externo: false };
  }

  // Motor de terceiros: só opera com autorização expressa, endpoint e credencial.
  if (!config?.autorizacaoExterna) {
    return {
      ok: false,
      status: 403,
      mensagem:
        `O motor ${motor.nome} é externo. É necessária autorização expressa para envio de dados a ferramentas externas de IA (Configurações › Motor de IA).`,
    };
  }

  const endpoint = config?.endpoint?.trim();
  if (!endpoint) {
    return {
      ok: false,
      status: 400,
      mensagem: `Informe o endpoint do serviço ${motor.nome} em Configurações › Motor de IA.`,
    };
  }

  const nomeSegredo = (config?.segredo || "IA_EXTERNA_API_KEY").trim();
  const apiKey = process.env[nomeSegredo];
  if (!apiKey) {
    return {
      ok: false,
      status: 400,
      mensagem: `Credencial "${nomeSegredo}" não cadastrada no ambiente. Cadastre o segredo institucional para usar ${motor.nome}.`,
    };
  }

  const modelo = (config?.modelo?.trim() || motor.modelo).trim();
  if (!modelo) {
    return {
      ok: false,
      status: 400,
      mensagem: `Informe o modelo a ser usado em ${motor.nome}.`,
    };
  }

  const externo = createOpenAI({ baseURL: endpoint, apiKey, fetch: fetchImpl });
  return { ok: true, model: externo.chat(modelo), motor: motor.nome, externo: true };
}
