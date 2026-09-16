// Histórico do assistente guardado neste navegador (várias conversas).
import { useCallback, useState } from "react";
import type { UIMessage } from "ai";

export type Conversa = {
  id: string;
  titulo: string;
  atualizadoEm: number;
  mensagens: UIMessage[];
};

const CHAVE = "hepta.assistente.v1";

const novoId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function ler(): Conversa[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    const dados = bruto ? (JSON.parse(bruto) as Conversa[]) : [];
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function gravar(conversas: Conversa[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(conversas));
  } catch {
    /* armazenamento indisponível */
  }
}

export function conversaNova(): Conversa {
  return { id: novoId(), titulo: "Nova consulta", atualizadoEm: Date.now(), mensagens: [] };
}

/** Garante uma conversa inicial e devolve o id ativo. Idempotente. */
export function garantirConversa(): string {
  const atuais = ler();
  if (atuais.length > 0) return atuais[0].id;
  const nova = conversaNova();
  gravar([nova]);
  return nova.id;
}

export function useConversas() {
  const [conversas, setConversas] = useState<Conversa[]>(() => ler());

  const criar = useCallback(() => {
    const nova = conversaNova();
    setConversas((atuais) => {
      const proximas = [nova, ...atuais];
      gravar(proximas);
      return proximas;
    });
    return nova.id;
  }, []);

  const remover = useCallback((id: string) => {
    setConversas((atuais) => {
      const proximas = atuais.filter((c) => c.id !== id);
      gravar(proximas);
      return proximas;
    });
  }, []);

  const salvarMensagens = useCallback((id: string, mensagens: UIMessage[]) => {
    setConversas((atuais) => {
      const existente = atuais.find((c) => c.id === id);
      const base = existente ?? { id, titulo: "Nova consulta", atualizadoEm: Date.now(), mensagens: [] };
      const primeira = mensagens.find((m) => m.role === "user");
      const textoPrimeira = primeira?.parts
        ?.map((p) => (p.type === "text" ? p.text : ""))
        .join(" ")
        .trim();
      const atualizada: Conversa = {
        ...base,
        mensagens,
        atualizadoEm: Date.now(),
        titulo:
          base.titulo !== "Nova consulta"
            ? base.titulo
            : textoPrimeira
              ? textoPrimeira.slice(0, 60)
              : base.titulo,
      };
      const proximas = [atualizada, ...atuais.filter((c) => c.id !== id)];
      gravar(proximas);
      return proximas;
    });
  }, []);

  return { conversas, criar, remover, salvarMensagens };
}
