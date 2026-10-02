// Personalização do portal: identidade da organização, paleta e modo claro/escuro.
// Estado compartilhado simples (store + assinantes) para que o cabeçalho e a
// tela de Configurações fiquem sincronizados sem alterar os módulos.
import { useEffect, useState } from "react";

export type Modo = "claro" | "escuro";

export type PaletaId = "azul" | "indigo" | "verde" | "teal" | "ambar" | "magenta" | "grafite";

export type Paleta = {
  id: PaletaId;
  nome: string;
  descricao: string;
  /** Amostra apenas para a interface de escolha. */
  amostra: string[];
};

export const paletas: Paleta[] = [
  {
    id: "azul",
    nome: "Azul fluido (padrão)",
    descricao: "Azul luminoso com profundidade e transparência.",
    amostra: ["#0A84FF", "#64D2FF", "#30D158"],
  },
  {
    id: "indigo",
    nome: "Índigo profundo",
    descricao: "Contraste sofisticado para ambientes executivos.",
    amostra: ["#6161FF", "#FFCB00", "#00C875"],
  },
  {
    id: "verde",
    nome: "Verde vital",
    descricao: "Verde equilibrado para operações e sustentabilidade.",
    amostra: ["#24A865", "#6EDB9A", "#0A84FF"],
  },
  {
    id: "teal",
    nome: "Turquesa institucional",
    descricao: "Tom mais sóbrio para portais de governo.",
    amostra: ["#12A594", "#FFCB00", "#00C875"],
  },
  {
    id: "ambar",
    nome: "Âmbar executivo",
    descricao: "Destaque quente para comitês e alta administração.",
    amostra: ["#E08A00", "#6161FF", "#00C875"],
  },
  {
    id: "magenta",
    nome: "Magenta",
    descricao: "Contraste alto para apresentações.",
    amostra: ["#D6409F", "#FFCB00", "#00C875"],
  },
  {
    id: "grafite",
    nome: "Grafite neutro",
    descricao: "Sem cor de marca, apenas neutros e status.",
    amostra: ["#7C8195", "#FFCB00", "#00C875"],
  },
];

export type ConfigPortal = {
  organizacao: string;
  logo: string;
  mensagemInicioSessao: string;
  logoInicioSessao: string;
  metodoAcesso: "local" | "ad" | "microsoft365";
  textoBotaoMicrosoft365: string;
  idioma: string;
  fusoHorario: string;
  localizacao: string;
  formatoMonetario: string;
  tamanhoMaximoArquivoMb: number;
  extensoesProibidas: string;
  sitesPermitidos: string;
  nomeAssistente: string;
  iconeAssistente: string;
  estiloAssistente: "orbita" | "prisma" | "nexo" | "personalizado";
  paleta: PaletaId;
  modo: Modo;
};

export const configPortalPadrao: ConfigPortal = {
  organizacao: "",
  logo: "",
  mensagemInicioSessao: "Bem-vindo ao ambiente de gestão de portfólios, programas e projetos.",
  logoInicioSessao: "",
  metodoAcesso: "local",
  textoBotaoMicrosoft365: "Acessar com Microsoft 365",
  idioma: "Português",
  fusoHorario: "America/Sao_Paulo",
  localizacao: "Brasil",
  formatoMonetario: "1.000,00",
  tamanhoMaximoArquivoMb: 25,
  extensoesProibidas: "exe, bat, msi",
  sitesPermitidos: "*.gov.br, *.microsoft.com, *.google.com",
  nomeAssistente: "Assistente de Governança",
  iconeAssistente: "",
  estiloAssistente: "orbita",
  paleta: "azul",
  modo: "escuro",
};

const CHAVE = "keller-hub.portal.v1";
const CHAVE_ANTIGA = "hepta.portal.v1";

let estado: ConfigPortal = configPortalPadrao;
let carregado = false;
const assinantes = new Set<(c: ConfigPortal) => void>();

function ler(): ConfigPortal {
  try {
    const bruto = localStorage.getItem(CHAVE) ?? localStorage.getItem(CHAVE_ANTIGA);
    if (bruto) {
      const salvo = { ...configPortalPadrao, ...(JSON.parse(bruto) as ConfigPortal) };
      localStorage.setItem(CHAVE, JSON.stringify(salvo));
      const chaveMigracao = "portal.paleta-padrao-azul.v1";
      if (!localStorage.getItem(chaveMigracao) && salvo.paleta === "indigo") {
        salvo.paleta = "azul";
        localStorage.setItem(CHAVE, JSON.stringify(salvo));
      }
      localStorage.setItem(chaveMigracao, "1");
      return salvo;
    }
  } catch {
    /* armazenamento indisponível */
  }
  return configPortalPadrao;
}

export function aplicarPortal(config: ConfigPortal) {
  if (typeof document === "undefined") return;
  const raiz = document.documentElement;
  raiz.classList.toggle("dark", config.modo === "escuro");
  raiz.dataset["paleta"] = config.paleta;
}

export function salvarPortal(config: ConfigPortal) {
  estado = config;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(config));
  } catch {
    /* armazenamento indisponível */
  }
  aplicarPortal(config);
  assinantes.forEach((fn) => fn(config));
}

export function usePortal() {
  const [config, setConfig] = useState<ConfigPortal>(estado);

  useEffect(() => {
    if (!carregado) {
      estado = ler();
      carregado = true;
    }
    setConfig(estado);
    aplicarPortal(estado);
    assinantes.add(setConfig);
    return () => {
      assinantes.delete(setConfig);
    };
  }, []);

  return {
    config,
    salvar: salvarPortal,
    alternarModo: () =>
      salvarPortal({ ...estado, modo: estado.modo === "escuro" ? "claro" : "escuro" }),
  };
}
