import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { garantirConversa } from "@/lib/assistente-conversas";

export const Route = createFileRoute("/assistente/")({
  head: () => ({
    meta: [
      { title: "Assistente de Governança | Plataforma PPM" },
      {
        name: "description",
        content:
          "Assistente de inteligência artificial que consulta os dados da plataforma em linguagem natural, respeitando os perfis de acesso, e gera sumários executivos.",
      },
      { property: "og:title", content: "Assistente de Governança | Plataforma PPM" },
      {
        property: "og:description",
        content:
          "Consolide riscos e indicadores, gere relatórios gerenciais e sumários executivos a partir dos dados da própria plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistenteIndex,
});

function AssistenteIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = garantirConversa();
    navigate({ to: "/assistente/$id", params: { id }, replace: true });
  }, [navigate]);

  return (
    <AppShell title="Assistente de Governança" description="Abrindo a sua última consulta…">
      <div className="grid h-64 place-items-center text-sm text-muted-foreground">
        Carregando o assistente…
      </div>
    </AppShell>
  );
}
