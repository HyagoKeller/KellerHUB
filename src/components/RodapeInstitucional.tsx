import { cn } from "@/lib/utils";

export function RodapeInstitucional({ className }: { className?: string }) {
  return (
    <footer className={cn("text-center text-xs text-muted-foreground", className)}>
      <p>Desenvolvido por Hyago Keller</p>
      <p className="mt-1">Todos os direitos reservados</p>
    </footer>
  );
}