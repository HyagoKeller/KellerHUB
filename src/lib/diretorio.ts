// Simulação de diretório corporativo (Active Directory / Microsoft Entra ID e Google Workspace).
// Em produção, substituir `buscarDiretorio` por chamada server-side ao Microsoft Graph (/users, /groups)
// ou Google Admin SDK (directory.users.list); o formato de retorno permanece o mesmo.
export type FonteDiretorio = "ad" | "google";
export type EntradaDiretorio = { id: string; nome: string; email: string; cargo: string; ou: string };

export const fontesDiretorio: { id: FonteDiretorio; nome: string; dominio: string }[] = [
  { id: "ad", nome: "Active Directory / Entra ID", dominio: "seinov.gov.br" },
  { id: "google", nome: "Google Workspace", dominio: "seinov.gov.br" },
];

const base: Record<FonteDiretorio, { ou: string; pessoas: [string, string][] }[]> = {
  ad: [
    { ou: "OU=TI,DC=seinov,DC=gov,DC=br", pessoas: [["Carlos Henrique Duarte", "Analista de Sistemas"], ["Juliana Pacheco", "Coordenadora de Desenvolvimento"], ["Marcos Vinícius Teles", "Arquiteto de Soluções"], ["Patrícia Lemos", "Analista de Dados"]] },
    { ou: "OU=Infraestrutura,DC=seinov,DC=gov,DC=br", pessoas: [["Ricardo Moura", "Especialista em Redes"], ["Fernanda Queiroz", "Analista de Segurança da Informação"], ["Thiago Barcelos", "Administrador de Banco de Dados"]] },
    { ou: "OU=Planejamento,DC=seinov,DC=gov,DC=br", pessoas: [["Luciana Ferraz", "Analista de Orçamento"], ["Gustavo Neri", "Coordenador de Planejamento"]] },
    { ou: "OU=Gabinete,DC=seinov,DC=gov,DC=br", pessoas: [["Helena Vasconcelos", "Chefe de Gabinete"], ["Paulo Sérgio Amaral", "Assessor Técnico"]] },
  ],
  google: [
    { ou: "/Tecnologia", pessoas: [["Bruna Saldanha", "Product Owner"], ["Diego Albuquerque", "Desenvolvedor Full Stack"], ["Camila Torres", "UX Designer"]] },
    { ou: "/Operações", pessoas: [["Rafael Cunha", "Analista de Suporte"], ["Isabela Monteiro", "Gerente de Operações"]] },
    { ou: "/Finanças", pessoas: [["Otávio Siqueira", "Controller"], ["Larissa Prado", "Analista Financeira"]] },
  ],
};

const slug = (n: string) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ");
const norm = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const unidadesDiretorio = (f: FonteDiretorio) => base[f].map((b) => b.ou);

export async function buscarDiretorio(f: FonteDiretorio, termo: string, ou?: string): Promise<EntradaDiretorio[]> {
  await new Promise((r) => setTimeout(r, 450));
  const t = norm(termo.trim());
  return base[f]
    .filter((b) => !ou || b.ou === ou)
    .flatMap((b) =>
      b.pessoas.map(([nome, cargo]) => {
        const s = slug(nome);
        return { id: `dir-${f}-${s.join("-")}`, nome, cargo, ou: b.ou, email: `${s[0]}.${s[s.length - 1]}@seinov.gov.br` };
      }),
    )
    .filter((p) => !t || norm(`${p.nome} ${p.email} ${p.cargo}`).includes(t));
}
