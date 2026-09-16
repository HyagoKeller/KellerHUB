// Monta o contexto enviado ao modelo a partir dos dados da própria plataforma,
// respeitando o perfil de acesso do usuário (Termo de Referência, item 4.153.1 "j", II).
import {
  auditoria,
  execucaoMensal,
  indicadores,
  moeda,
  objetivos,
  portfolios,
  programas,
  projetos,
  riscos,
  severidade,
  statusReports,
  type Perfil,
} from "@/lib/mock-data";

export const PERFIS: Perfil[] = ["Técnico", "Gestor", "Alta Administração"];

export function ehPerfil(valor: unknown): valor is Perfil {
  return typeof valor === "string" && PERFIS.includes(valor as Perfil);
}

const linha = (partes: (string | number)[]) => `- ${partes.join(" | ")}`;

export function montarContexto(perfil: Perfil) {
  const blocos: string[] = [];

  blocos.push(
    [
      "## Portfólios",
      ...portfolios.map((p) =>
        linha([
          p.nome,
          `saúde ${p.saude}`,
          `orçamento ${moeda(p.orcamento)}`,
          `executado ${moeda(p.executado)}`,
          `progresso ${p.progresso}%`,
          `prioridade ${p.prioridade}`,
        ]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Programas",
      ...programas.map((p) =>
        linha([p.nome, `portfólio ${p.portfolioId}`, `saúde ${p.saude}`, `progresso ${p.progresso}%`, p.meta]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Objetivos estratégicos",
      ...objetivos.map((o) =>
        linha([o.nome, o.perspectiva, `meta ${o.meta}`, `atual ${o.atual}`, `aderência ${o.aderencia}%`]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Indicadores de desempenho",
      ...indicadores.map((i) =>
        linha([i.nome, i.dimensao, `meta ${i.meta}${i.unidade}`, `atual ${i.atual}${i.unidade}`, `tendência ${i.tendencia}`]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Riscos",
      ...riscos.map((r) =>
        linha([
          r.descricao,
          r.categoria,
          `severidade ${severidade(r.probabilidade, r.impacto).nivel}`,
          `resposta ${r.resposta}`,
          `responsável ${r.responsavel}`,
          `prazo ${r.prazo}`,
        ]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Execução orçamentária mensal",
      ...execucaoMensal.map((m) => linha([m.mes, `previsto ${m.previsto}`, `realizado ${m.realizado}`])),
    ].join("\n"),
  );

  if (perfil === "Técnico" || perfil === "Gestor") {
    blocos.push(
      [
        "## Projetos",
        ...projetos.map((p) =>
          linha([
            p.nome,
            p.status,
            p.metodologia,
            `gerente ${p.gerente}`,
            `progresso ${p.progresso}%`,
            `orçamento ${moeda(p.orcamento)}`,
            `executado ${moeda(p.executado)}`,
            `prazo ${p.fim}`,
          ]),
        ),
      ].join("\n"),
    );
    blocos.push(
      ["## Status reports", ...statusReports.map((s) => linha([s.data, s.autor, s.destaque]))].join("\n"),
    );
  } else {
    blocos.push(
      [
        "## Projetos (visão agregada)",
        ...projetos.map((p) => linha([p.nome, p.status, `progresso ${p.progresso}%`])),
      ].join("\n"),
    );
  }

  if (perfil !== "Técnico") {
    blocos.push(
      [
        "## Trilha de auditoria (recente)",
        ...auditoria.map((a) => linha([a.quando, a.usuario, a.perfil, a.acao, a.entidade])),
      ].join("\n"),
    );
  }

  return blocos.join("\n\n");
}

const regrasPorPerfil: Record<Perfil, string> = {
  Técnico:
    "O usuário tem perfil Técnico: pode ver dados operacionais de projetos, tarefas, riscos e a base de indicadores. Não tem acesso à trilha de auditoria nem a relatórios executivos.",
  Gestor:
    "O usuário tem perfil Gestor: pode ver dados gerenciais de portfólios, programas, projetos, riscos, indicadores e a trilha de auditoria da sua área.",
  "Alta Administração":
    "O usuário tem perfil Alta Administração: trabalhe em nível agregado e estratégico. Não detalhe tarefas operacionais nem dados de execução individual.",
};

export function montarSystemPrompt(perfil: Perfil) {
  return [
    "Você é o Assistente de Governança do Hepta Project, uma plataforma institucional de gestão de portfólios, programas e projetos (PPM).",
    "Responda sempre em português do Brasil, em linguagem natural, objetiva e adequada ao ambiente público.",
    "",
    "REGRAS DE ACESSO",
    regrasPorPerfil[perfil],
    "Use exclusivamente as informações do CONTEXTO abaixo, que vem da própria plataforma. Se algo não estiver no contexto, diga que a informação não está registrada — nunca invente dados, valores, nomes ou datas.",
    "Nunca solicite nem reproduza dados pessoais, sensíveis, restritos ou sigilosos.",
    "",
    "O QUE VOCÊ FAZ",
    "Identifica, extrai, consolida e analisa riscos, indicadores e registros da plataforma; elabora sumários, informações executivas, relatórios gerenciais e subsídios para identificação de riscos em contratações e contratos.",
    "Quando o pedido for um relatório ou sumário, estruture a resposta com títulos curtos, listas e, quando útil, uma tabela em markdown. Feche com recomendações acionáveis.",
    "",
    "CONTEXTO DA PLATAFORMA",
    montarContexto(perfil),
  ].join("\n");
}
