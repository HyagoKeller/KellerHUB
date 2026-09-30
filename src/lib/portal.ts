// Personalização do portal: identidade da organização, paleta e modo claro/escuro.
// Estado compartilhado simples (store + assinantes) para que o cabeçalho e a
// tela de Configurações fiquem sincronizados sem alterar os módulos.
import { useEffect, useState } from "react";

export type Modo = "claro" | "escuro";

export type PaletaId = "indigo" | "teal" | "ambar" | "magenta" | "grafite";

export type Paleta = {
  id: PaletaId;
  nome: string;
  descricao: string;
  /** Amostra apenas para a interface de escolha. */
  amostra: string[];
};

export const paletas: Paleta[] = [
  {
    id: "indigo",
    nome: "Índigo (padrão)",
    descricao: "Identidade original do Hepta Project.",
    amostra: ["#6161FF", "#FFCB00", "#00C875"],
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
  idioma: string;
  fusoHorario: string;
  localizacao: string;
  formatoMonetario: string;
  tamanhoMaximoArquivoMb: number;
  extensoesProibidas: string;
  sitesPermitidos: string;
  nomeAssistente: string;
  iconeAssistente: string;
  paleta: PaletaId;
  modo: Modo;
};

export const configPortalPadrao: ConfigPortal = {
  organizacao: "",
  logo: "",
  mensagemInicioSessao: "Bem-vindo ao ambiente de gestão de portfólios, programas e projetos.",
  logoInicioSessao: "",
  idioma: "Português",
  fusoHorario: "America/Sao_Paulo",
  localizacao: "Brasil",
  formatoMonetario: "1.000,00",
  tamanhoMaximoArquivoMb: 25,
  extensoesProibidas: "exe, bat, msi",
  sitesPermitidos: "*.gov.br, *.microsoft.com, *.google.com",
  nomeAssistente: "Assistente de Governança",
  iconeAssistente: "",
  paleta: "indigo",
  modo: "escuro",
};

const CHAVE = "hepta.portal.v1";

let estado: ConfigPortal = configPortalPadrao;
let carregado = false;
const assinantes = new Set<(c: ConfigPortal) => void>();

function ler(): ConfigPortal {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) return { ...configPortalPadrao, ...(JSON.parse(bruto) as ConfigPortal) };
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
