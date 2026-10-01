// Camada de troca do motor de IA (requisito 4.153.1 "j").
// A plataforma não depende de um provedor específico: o motor pode ser
// substituído por ChatGPT, Gemini, Copilot, Claude ou serviço equivalente
// sem substituição da plataforma nem reestruturação da solução.
import { useCallback, useEffect, useState } from "react";

export type TipoMotor = "interno" | "externo";

export type MotorIA = {
  id: string;
  nome: string;
  fornecedor: string;
  tipo: TipoMotor;
  modelo: string;
  descricao: string;
  /** true quando o processamento fica na infraestrutura contratada (sem custo adicional por consulta). */
  incluidoNoContrato: boolean;
  /** Preenchimento sugerido quando a organização conecta a própria conta do fornecedor. */
  contaPropria?: { endpoint: string; segredo: string; modelo: string };
};

export const motoresIA: MotorIA[] = [
  {
    id: "nativa",
    nome: "IA nativa Keller Hub",
    fornecedor: "Plataforma",
    tipo: "interno",
    modelo: "openai/gpt-6-astra",
    descricao:
      "Motor padrão, executado na infraestrutura da solução. Nenhum dado sai do ambiente contratado.",
    incluidoNoContrato: true,
  },
  {
    id: "chatgpt",
    nome: "ChatGPT",
    fornecedor: "OpenAI",
    tipo: "interno",
    modelo: "openai/gpt-5.6-terra",
    descricao: "Modelo OpenAI acessado pela camada interna da plataforma.",
    incluidoNoContrato: true,
    contaPropria: { endpoint: "https://api.openai.com/v1", segredo: "OPENAI_API_KEY", modelo: "gpt-4.1" },
  },
  {
    id: "gemini",
    nome: "Gemini",
    fornecedor: "Google",
    tipo: "interno",
    modelo: "google/gemini-3.8-flash",
    descricao: "Modelo Google acessado pela camada interna da plataforma.",
    incluidoNoContrato: true,
    contaPropria: { endpoint: "https://generativelanguage.googleapis.com/v1beta/openai", segredo: "GEMINI_API_KEY", modelo: "gemini-2.5-flash" },
  },
  {
    id: "claude",
    nome: "Claude",
    fornecedor: "Anthropic",
    tipo: "externo",
    modelo: "claude-sonnet-4-5",
    descricao:
      "Serviço externo. Exige endpoint compatível, credencial institucional e autorização expressa para envio de dados.",
    incluidoNoContrato: false,
  },
  {
    id: "copilot",
    nome: "Copilot / Azure OpenAI",
    fornecedor: "Microsoft",
    tipo: "externo",
    modelo: "gpt-4.1",
    descricao:
      "Serviço externo no tenant da organização. Exige endpoint, credencial e autorização expressa.",
    incluidoNoContrato: false,
  },
  {
    id: "personalizado",
    nome: "Outro serviço compatível",
    fornecedor: "Definido pela organização",
    tipo: "externo",
    modelo: "",
    descricao:
      "Qualquer serviço com API compatível (inclusive modelo hospedado pela própria organização).",
    incluidoNoContrato: false,
  },
];

export type ConfigMotorIA = {
  motorId: string;
  /** Autorização expressa e registrada para envio de dados a ferramenta externa de IA. */
  autorizacaoExterna: boolean;
  /** Endpoint do serviço externo (API compatível com OpenAI). */
  endpoint: string;
  /** Modelo a ser chamado no serviço externo. */
  modelo: string;
  /** Nome do segredo institucional que guarda a credencial (a chave nunca é gravada aqui). */
  segredo: string;
  /** Usa a conta/chave própria da organização em vez da camada interna. */
  credencialPropria: boolean;
};

export const configMotorPadrao: ConfigMotorIA = {
  motorId: "nativa",
  autorizacaoExterna: false,
  endpoint: "",
  modelo: "",
  segredo: "IA_EXTERNA_API_KEY",
  credencialPropria: false,
};

const CHAVE = "hepta.ia.motor.v1";

export function motorPorId(id: string): MotorIA {
  return motoresIA.find((m) => m.id === id) ?? motoresIA[0]!;
}

export function useMotorIA() {
  const [config, setConfig] = useState<ConfigMotorIA>(configMotorPadrao);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) setConfig({ ...configMotorPadrao, ...(JSON.parse(bruto) as ConfigMotorIA) });
    } catch {
      /* configuração local ausente ou inválida: mantém o motor nativo */
    }
  }, []);

  const salvar = useCallback((parcial: Partial<ConfigMotorIA>) => {
    setConfig((atual) => {
      const proximo = { ...atual, ...parcial };
      try {
        localStorage.setItem(CHAVE, JSON.stringify(proximo));
      } catch {
        /* armazenamento indisponível */
      }
      return proximo;
    });
  }, []);

  return { config, salvar, motor: motorPorId(config.motorId) };
}
