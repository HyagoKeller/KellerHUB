// Monta o contexto enviado ao modelo a partir dos dados da própria plataforma,
// respeitando o perfil de acesso do usuário (item 4.153.1 "j" do Termo de Referência).
import {
  auditoria,
  evolucaoRiscos,
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
          p.tipo,
          `responsável ${p.responsavel}`,
          `saúde ${p.saude}`,
          `orçamento ${moeda(p.orcamento)}`,
          `executado ${moeda(p.executado)}`,
          `progresso ${p.progresso}%`,
          `prioridade ${p.prioridade}`,
          `score ${p.score}`,
          `riscos críticos ${p.riscosCriticos}`,
        ]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Programas",
      ...programas.map((p) =>
        linha([
          p.nome,
          `portfólio ${portfolios.find((x) => x.id === p.portfolioId)?.nome ?? p.portfolioId}`,
          `gerente ${p.gerente}`,
          `objetivo ${p.objetivo}`,
          `saúde ${p.saude}`,
          `progresso ${p.progresso}%`,
          `metas ${p.metas.map((m) => `${m.nome} ${m.atual}/${m.alvo} ${m.unidade}`).join("; ")}`,
        ]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Objetivos estratégicos",
      ...objetivos.map((o) =>
        linha([o.codigo, o.nome, o.perspectiva, `meta ${o.meta}`, `aderência ${o.aderencia}%`, `responsável ${o.responsavel}`]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Indicadores de desempenho",
      ...indicadores.map((i) =>
        linha([
          i.nome,
          `meta ${i.meta} ${i.unidade}`,
          `atual ${i.atual} ${i.unidade}`,
          `polaridade ${i.polaridade} é melhor`,
          i.periodicidade,
          `responsável ${i.responsavel}`,
          `histórico ${i.historico.map((h) => `${h.periodo}=${h.valor}`).join(" ")}`,
        ]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Riscos",
      ...riscos.map((r) =>
        linha([
          r.nome,
          r.categoria,
          `origem ${r.origem}`,
          `probabilidade ${r.probabilidade}`,
          `impacto ${r.impacto}`,
          `severidade ${severidade(r.probabilidade, r.impacto).nivel}`,
          `resposta ${r.resposta}`,
          `plano ${r.plano}`,
          `responsável ${r.responsavel}`,
          `prazo ${r.prazo}`,
          `tendência ${r.tendencia}`,
        ]),
      ),
      "",
      "### Evolução do quantitativo de riscos",
      ...evolucaoRiscos.map((e) =>
        linha([e.periodo, `crítico ${e.critico}`, `alto ${e.alto}`, `médio ${e.medio}`, `baixo ${e.baixo}`]),
      ),
    ].join("\n"),
  );

  blocos.push(
    [
      "## Execução orçamentária acumulada (R$ milhões)",
      ...execucaoMensal.map((m) => linha([m.periodo, `planejado ${m.planejado}`, `realizado ${m.realizado}`])),
    ].join("\n"),
  );

  if (perfil === "Técnico" || perfil === "Gestor") {
    blocos.push(
      [
        "## Projetos",
        ...projetos.map((p) =>
          linha([
            p.nome,
            `programa ${programas.find((x) => x.id === p.programaId)?.nome ?? p.programaId}`,
            p.status,
            p.metodologia,
            `gerente ${p.gerente}`,
            `saúde ${p.saude}`,
            `progresso ${p.progresso}%`,
            `orçamento ${moeda(p.orcamento)}`,
            `executado ${moeda(p.executado)}`,
            `início ${p.inicio}`,
            `fim ${p.fim}`,
          ]),
        ),
      ].join("\n"),
    );
    blocos.push(
      [
        "## Status reports",
        ...statusReports.map((s) => linha([s.periodo, s.autor, `saúde ${s.saude}`, s.resumo])),
      ].join("\n"),
    );
  } else {
    blocos.push(
      [
        "## Projetos (visão agregada)",
        ...projetos.map((p) => linha([p.nome, p.status, `saúde ${p.saude}`, `progresso ${p.progresso}%`])),
      ].join("\n"),
    );
  }

  if (perfil !== "Técnico") {
    blocos.push(
      [
        "## Trilha de auditoria (registros recentes)",
        ...auditoria.map((a) => linha([a.quando, a.usuario, a.perfil, a.acao, a.entidade, a.detalhe])),
      ].join("\n"),
    );
  }

  return blocos.join("\n\n");
}

const regrasPorPerfil: Record<Perfil, string> = {
  Técnico:
    "O usuário tem perfil Técnico: pode ver dados operacionais de projetos, riscos e a base de indicadores. Não tem acesso à trilha de auditoria; não produza relatórios de auditoria.",
  Gestor:
    "O usuário tem perfil Gestor: pode ver dados gerenciais de portfólios, programas, projetos, riscos, indicadores e a trilha de auditoria.",
  "Alta Administração":
    "O usuário tem perfil Alta Administração: trabalhe em nível agregado e estratégico. Não detalhe execução operacional de tarefas nem dados individuais de equipe.",
};

export function montarSystemPrompt(perfil: Perfil) {
  return [
    "Você é o Assistente de Governança de uma plataforma institucional de gestão de portfólios, programas e projetos (PPM).",
    "Responda sempre em português do Brasil, com linguagem objetiva e adequada ao ambiente público.",
    "",
    "REGRAS DE ACESSO",
    regrasPorPerfil[perfil],
    "Use exclusivamente as informações do CONTEXTO abaixo, que vêm da própria plataforma. Se algo não estiver no contexto, diga que a informação não está registrada e nunca invente dados, valores, nomes ou datas.",
    "Nunca solicite nem reproduza dados pessoais sensíveis. Não há transferência de dados sigilosos para fora da plataforma.",
    "",
    "O QUE VOCÊ FAZ",
    "Identifica, extrai, consolida e analisa riscos, indicadores e registros da plataforma; elabora sumários, informações executivas, relatórios gerenciais e subsídios para identificação de riscos em contratações e contratos.",
    "Quando o pedido for relatório ou sumário, estruture a resposta com títulos curtos, listas e, quando útil, uma tabela em markdown. Encerre com recomendações acionáveis.",
    "Sempre cite os itens da plataforma que sustentam a análise (nome do portfólio, projeto, risco ou indicador).",
    "",
    "CONTEXTO DA PLATAFORMA",
    montarContexto(perfil),
  ].join("\n");
}
