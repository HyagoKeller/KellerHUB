import { cn } from "@/lib/utils";
import marcaPadrao from "@/assets/assistente-ia.png";

export type EstiloAssistente = "orbita" | "prisma" | "nexo" | "personalizado";

export const estilosAssistente: { id: EstiloAssistente; nome: string; descricao: string }[] = [
  { id: "orbita", nome: "Órbita", descricao: "Analítico e institucional" },
  { id: "prisma", nome: "Prisma", descricao: "Estratégico e preciso" },
  { id: "nexo", nome: "Nexo", descricao: "Conectado e executivo" },
  { id: "personalizado", nome: "Personalizado", descricao: "Marca própria validada" },
];

export function AssistenteMarca({
  estilo = "orbita",
  imagem,
  className,
}: {
  estilo?: EstiloAssistente;
  imagem?: string;
  className?: string;
}) {
  if (estilo === "personalizado" && imagem) {
    return <img src={imagem} alt="Ícone personalizado do assistente" className={cn("object-cover", className)} />;
  }

  if (estilo === "orbita") {
    return <img src={marcaPadrao} alt="Marca Órbita do assistente" className={cn("object-cover", className)} />;
  }

  return (
    <span className={cn("grid place-items-center bg-primary text-primary-foreground", className)} aria-label={`Marca ${estilo} do assistente`}>
      {estilo === "prisma" ? (
        <svg viewBox="0 0 32 32" className="h-3/5 w-3/5" fill="none" aria-hidden="true">
          <path d="M16 3 28 24 16 29 4 24 16 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="m4 24 12-8 12 8M16 16v13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 32 32" className="h-3/5 w-3/5" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="22" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="m13 12 3 6 3-6M14 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}