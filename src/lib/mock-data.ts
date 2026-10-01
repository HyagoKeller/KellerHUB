// Dados de demonstração da plataforma PPM.
// Substituir por consultas ao banco quando o backend for habilitado.

export type Saude = "verde" | "amarelo" | "vermelho";
export type StatusProjeto = string;
export type Metodologia = string;
export type Perfil = "Técnico" | "Gestor" | "Alta Administração";

export const organizacoes = [
  { id: "org-1", nome: "Secretaria de Inovação", sigla: "SEINOV" },
  { id: "org-2", nome: "Diretoria de Tecnologia", sigla: "DITEC" },
];

export const usuarioAtual = {
  nome: "Marina Alcântara",
  email: "marina.alcantara@orgao.gov.br",
  perfil: "Gestor" as Perfil,
  organizacaoId: "org-1",
};

export type Portfolio = {
  id: string;
  nome: string;
  tipo: string;
  responsavel: string;
  orcamento: number;
  executado: number;
  progresso: number;
  saude: Saude;
  prioridade: number;
  score: number;
  programas: number;
  projetos: number;
  riscosCriticos: number;
};

export const portfolios: Portfolio[] = [
  { id: "pf-1", nome: "Transformação Digital", tipo: "Institucional", responsavel: "Marina Alcântara", orcamento: 18400000, executado: 11200000, progresso: 62, saude: "verde", prioridade: 1, score: 92, programas: 3, projetos: 11, riscosCriticos: 2 },
  { id: "pf-2", nome: "Infraestrutura e Resiliência", tipo: "Institucional", responsavel: "Rodrigo Prates", orcamento: 12750000, executado: 8900000, progresso: 71, saude: "amarelo", prioridade: 2, score: 81, programas: 2, projetos: 7, riscosCriticos: 3 },
  { id: "pf-3", nome: "Atendimento ao Cidadão", tipo: "Temático", responsavel: "Cláudia Menezes", orcamento: 6300000, executado: 2100000, progresso: 34, saude: "vermelho", prioridade: 3, score: 74, programas: 2, projetos: 6, riscosCriticos: 4 },
  { id: "pf-4", nome: "Capacitação e Pessoas", tipo: "Temático", responsavel: "Eduardo Lins", orcamento: 3900000, executado: 3100000, progresso: 84, saude: "verde", prioridade: 4, score: 66, programas: 1, projetos: 4, riscosCriticos: 0 },
];

export type Programa = {
  id: string;
  nome: string;
  portfolioId: string;
  gerente: string;
  objetivo: string;
  progresso: number;
  saude: Saude;
  metas: { nome: string; alvo: number; atual: number; unidade: string }[];
};

export const programas: Programa[] = [
  { id: "pg-1", nome: "Governo Digital 2030", portfolioId: "pf-1", gerente: "Marina Alcântara", objetivo: "Digitalizar 100% dos serviços de alta demanda", progresso: 68, saude: "verde", metas: [{ nome: "Serviços digitalizados", alvo: 120, atual: 82, unidade: "serviços" }, { nome: "Satisfação do usuário", alvo: 90, atual: 78, unidade: "%" }] },
  { id: "pg-2", nome: "Dados e Analytics", portfolioId: "pf-1", gerente: "Tiago Ferraz", objetivo: "Consolidar a plataforma corporativa de dados", progresso: 54, saude: "amarelo", metas: [{ nome: "Bases integradas", alvo: 30, atual: 14, unidade: "bases" }, { nome: "Painéis publicados", alvo: 25, atual: 19, unidade: "painéis" }] },
  { id: "pg-3", nome: "Segurança da Informação", portfolioId: "pf-1", gerente: "Ana Beatriz Rocha", objetivo: "Elevar a maturidade em conformidade LGPD/POSIC", progresso: 47, saude: "amarelo", metas: [{ nome: "Sistemas em conformidade", alvo: 60, atual: 28, unidade: "sistemas" }] },
  { id: "pg-4", nome: "Modernização de Data Center", portfolioId: "pf-2", gerente: "Rodrigo Prates", objetivo: "Migrar cargas críticas para nuvem híbrida", progresso: 73, saude: "verde", metas: [{ nome: "Cargas migradas", alvo: 45, atual: 33, unidade: "cargas" }] },
  { id: "pg-5", nome: "Conectividade Regional", portfolioId: "pf-2", gerente: "Sérgio Vilela", objetivo: "Ampliar cobertura de rede nas unidades regionais", progresso: 58, saude: "amarelo", metas: [{ nome: "Unidades conectadas", alvo: 140, atual: 81, unidade: "unidades" }] },
  { id: "pg-6", nome: "Canal Único do Cidadão", portfolioId: "pf-3", gerente: "Cláudia Menezes", objetivo: "Unificar canais de atendimento em portal e app", progresso: 31, saude: "vermelho", metas: [{ nome: "Canais unificados", alvo: 8, atual: 3, unidade: "canais" }] },
  { id: "pg-7", nome: "Ouvidoria Ativa", portfolioId: "pf-3", gerente: "Paulo Ivan", objetivo: "Reduzir o tempo médio de resposta ao cidadão", progresso: 44, saude: "amarelo", metas: [{ nome: "Tempo de resposta", alvo: 5, atual: 11, unidade: "dias" }] },
  { id: "pg-8", nome: "Escola de Gestão", portfolioId: "pf-4", gerente: "Eduardo Lins", objetivo: "Formar 1.500 servidores em gestão de projetos", progresso: 84, saude: "verde", metas: [{ nome: "Servidores formados", alvo: 1500, atual: 1262, unidade: "pessoas" }] },
];

export type Projeto = {
  id: string;
  nome: string;
  programaId: string;
  gerente: string;
  metodologia: Metodologia;
  status: StatusProjeto;
  progresso: number;
  saude: Saude;
  inicio: string;
  fim: string;
  orcamento: number;
  executado: number;
  objetivoId: string;
};

export const projetos: Projeto[] = [
  { id: "pj-1", nome: "Portal de Serviços 2.0", programaId: "pg-1", gerente: "Larissa Duarte", metodologia: "Ágil", status: "Em execução", progresso: 72, saude: "verde", inicio: "2026-01-12", fim: "2026-11-30", orcamento: 3200000, executado: 2050000, objetivoId: "oe-1" },
  { id: "pj-2", nome: "Assinatura Digital Corporativa", programaId: "pg-1", gerente: "Bruno Sales", metodologia: "Híbrida", status: "Em execução", progresso: 58, saude: "amarelo", inicio: "2026-02-02", fim: "2026-12-18", orcamento: 1450000, executado: 810000, objetivoId: "oe-1" },
  { id: "pj-3", nome: "Data Lake Institucional", programaId: "pg-2", gerente: "Tiago Ferraz", metodologia: "Ágil", status: "Em risco", progresso: 41, saude: "vermelho", inicio: "2025-09-01", fim: "2026-10-30", orcamento: 4100000, executado: 2600000, objetivoId: "oe-3" },
  { id: "pj-4", nome: "Catálogo de Dados Abertos", programaId: "pg-2", gerente: "Helena Vaz", metodologia: "Ágil", status: "Em execução", progresso: 66, saude: "verde", inicio: "2026-03-10", fim: "2026-12-05", orcamento: 900000, executado: 512000, objetivoId: "oe-3" },
  { id: "pj-5", nome: "Programa de Conformidade LGPD", programaId: "pg-3", gerente: "Ana Beatriz Rocha", metodologia: "PMBOK", status: "Em execução", progresso: 47, saude: "amarelo", inicio: "2025-11-03", fim: "2027-02-26", orcamento: 2200000, executado: 940000, objetivoId: "oe-4" },
  { id: "pj-6", nome: "Centro de Operações de Segurança", programaId: "pg-3", gerente: "Marcos Tenório", metodologia: "Híbrida", status: "Planejamento", progresso: 12, saude: "amarelo", inicio: "2026-06-01", fim: "2027-06-30", orcamento: 5300000, executado: 320000, objetivoId: "oe-4" },
  { id: "pj-7", nome: "Migração de Cargas Críticas", programaId: "pg-4", gerente: "Rodrigo Prates", metodologia: "PMBOK", status: "Em execução", progresso: 73, saude: "verde", inicio: "2025-08-15", fim: "2026-09-30", orcamento: 6800000, executado: 5100000, objetivoId: "oe-2" },
  { id: "pj-8", nome: "Backup e Continuidade", programaId: "pg-4", gerente: "Nina Corrêa", metodologia: "PMBOK", status: "Concluído", progresso: 100, saude: "verde", inicio: "2025-02-01", fim: "2026-03-28", orcamento: 1900000, executado: 1870000, objetivoId: "oe-2" },
  { id: "pj-9", nome: "Rede Regional Fase II", programaId: "pg-5", gerente: "Sérgio Vilela", metodologia: "PMBOK", status: "Em risco", progresso: 38, saude: "vermelho", inicio: "2026-01-20", fim: "2027-04-15", orcamento: 4050000, executado: 1490000, objetivoId: "oe-2" },
  { id: "pj-10", nome: "App do Cidadão", programaId: "pg-6", gerente: "Cláudia Menezes", metodologia: "Ágil", status: "Em risco", progresso: 29, saude: "vermelho", inicio: "2026-02-16", fim: "2027-01-29", orcamento: 2750000, executado: 690000, objetivoId: "oe-1" },
  { id: "pj-11", nome: "Chat de Atendimento Assistido", programaId: "pg-6", gerente: "Iara Nogueira", metodologia: "Ágil", status: "Em execução", progresso: 51, saude: "amarelo", inicio: "2026-04-06", fim: "2026-12-20", orcamento: 780000, executado: 340000, objetivoId: "oe-1" },
  { id: "pj-12", nome: "Painel da Ouvidoria", programaId: "pg-7", gerente: "Paulo Ivan", metodologia: "Híbrida", status: "Em execução", progresso: 44, saude: "amarelo", inicio: "2026-03-02", fim: "2026-11-14", orcamento: 620000, executado: 260000, objetivoId: "oe-5" },
  { id: "pj-13", nome: "Suspensão: Quiosques Presenciais", programaId: "pg-7", gerente: "Paulo Ivan", metodologia: "PMBOK", status: "Suspenso", progresso: 18, saude: "vermelho", inicio: "2025-10-01", fim: "2026-08-30", orcamento: 1100000, executado: 210000, objetivoId: "oe-5" },
  { id: "pj-14", nome: "Trilha de Gestão de Projetos", programaId: "pg-8", gerente: "Eduardo Lins", metodologia: "Híbrida", status: "Em execução", progresso: 84, saude: "verde", inicio: "2025-07-01", fim: "2026-10-31", orcamento: 1400000, executado: 1120000, objetivoId: "oe-6" },
];

export const tarefasKanban = {
  Backlog: [
    { id: "t-1", titulo: "Mapear jornadas de serviço prioritárias", responsavel: "LD", pontos: 8 },
    { id: "t-2", titulo: "Definir padrão de acessibilidade WCAG 2.2", responsavel: "BS", pontos: 5 },
  ],
  "A fazer": [
    { id: "t-3", titulo: "Revisar arquitetura de informação do portal", responsavel: "HV", pontos: 5 },
    { id: "t-4", titulo: "Especificar API de autenticação Gov.br", responsavel: "TF", pontos: 13 },
  ],
  "Em andamento": [
    { id: "t-5", titulo: "Implementar catálogo de serviços", responsavel: "LD", pontos: 8 },
    { id: "t-6", titulo: "Testes de carga do gateway", responsavel: "MT", pontos: 3 },
  ],
  Revisão: [{ id: "t-7", titulo: "Homologação do fluxo de protocolo", responsavel: "IN", pontos: 5 }],
  Concluído: [
    { id: "t-8", titulo: "Design system institucional", responsavel: "CM", pontos: 13 },
    { id: "t-9", titulo: "Ambiente de homologação", responsavel: "NC", pontos: 8 },
  ],
};

export const cronograma = [
  { fase: "Iniciação", inicio: 0, duracao: 8, progresso: 100 },
  { fase: "Planejamento", inicio: 6, duracao: 14, progresso: 100 },
  { fase: "Execução, Onda 1", inicio: 18, duracao: 26, progresso: 78 },
  { fase: "Execução, Onda 2", inicio: 38, duracao: 30, progresso: 32 },
  { fase: "Homologação", inicio: 62, duracao: 16, progresso: 0 },
  { fase: "Encerramento", inicio: 76, duracao: 10, progresso: 0 },
];

export const statusReports = [
  { id: "sr-1", periodo: "Junho/2026", autor: "Larissa Duarte", saude: "verde" as Saude, resumo: "Onda 1 entregue dentro do prazo; integração Gov.br em homologação." },
  { id: "sr-2", periodo: "Maio/2026", autor: "Larissa Duarte", saude: "amarelo" as Saude, resumo: "Atraso de 6 dias na API de protocolo, com plano de recuperação aprovado." },
  { id: "sr-3", periodo: "Abril/2026", autor: "Bruno Sales", saude: "verde" as Saude, resumo: "Escopo estabilizado após replanejamento; custo dentro da linha de base." },
];

export type Objetivo = {
  id: string;
  codigo: string;
  nome: string;
  perspectiva: string;
  meta: string;
  aderencia: number;
  responsavel: string;
};

export const objetivos: Objetivo[] = [
  { id: "oe-1", codigo: "OE-01", nome: "Ampliar a digitalização dos serviços públicos", perspectiva: "Cidadão", meta: "120 serviços digitais até 2027", aderencia: 68, responsavel: "Marina Alcântara" },
  { id: "oe-2", codigo: "OE-02", nome: "Garantir infraestrutura resiliente e disponível", perspectiva: "Processos", meta: "Disponibilidade de 99,5%", aderencia: 74, responsavel: "Rodrigo Prates" },
  { id: "oe-3", codigo: "OE-03", nome: "Tornar a decisão orientada a dados", perspectiva: "Processos", meta: "30 bases integradas", aderencia: 52, responsavel: "Tiago Ferraz" },
  { id: "oe-4", codigo: "OE-04", nome: "Elevar a maturidade em segurança e privacidade", perspectiva: "Governança", meta: "Conformidade LGPD em 60 sistemas", aderencia: 41, responsavel: "Ana Beatriz Rocha" },
  { id: "oe-5", codigo: "OE-05", nome: "Aproximar o cidadão da administração", perspectiva: "Cidadão", meta: "Resposta em até 5 dias", aderencia: 36, responsavel: "Paulo Ivan" },
  { id: "oe-6", codigo: "OE-06", nome: "Desenvolver competências institucionais", perspectiva: "Pessoas", meta: "1.500 servidores formados", aderencia: 84, responsavel: "Eduardo Lins" },
];

export type Indicador = {
  id: string;
  nome: string;
  formula: string;
  unidade: string;
  meta: number;
  atual: number;
  periodicidade: "Mensal" | "Trimestral" | "Anual";
  responsavel: string;
  polaridade: "maior" | "menor";
  historico: { periodo: string; valor: number }[];
};

export const indicadores: Indicador[] = [
  { id: "kpi-1", nome: "Serviços digitalizados", formula: "count(serviços com jornada 100% digital)", unidade: "serviços", meta: 120, atual: 82, periodicidade: "Mensal", responsavel: "Marina Alcântara", polaridade: "maior", historico: [{ periodo: "Jan", valor: 61 }, { periodo: "Fev", valor: 64 }, { periodo: "Mar", valor: 69 }, { periodo: "Abr", valor: 73 }, { periodo: "Mai", valor: 78 }, { periodo: "Jun", valor: 82 }] },
  { id: "kpi-2", nome: "Execução orçamentária", formula: "(executado / orçado) × 100", unidade: "%", meta: 85, atual: 63, periodicidade: "Mensal", responsavel: "Rodrigo Prates", polaridade: "maior", historico: [{ periodo: "Jan", valor: 12 }, { periodo: "Fev", valor: 23 }, { periodo: "Mar", valor: 34 }, { periodo: "Abr", valor: 45 }, { periodo: "Mai", valor: 55 }, { periodo: "Jun", valor: 63 }] },
  { id: "kpi-3", nome: "Projetos no prazo", formula: "(projetos no prazo / total) × 100", unidade: "%", meta: 80, atual: 64, periodicidade: "Mensal", responsavel: "Cláudia Menezes", polaridade: "maior", historico: [{ periodo: "Jan", valor: 71 }, { periodo: "Fev", valor: 69 }, { periodo: "Mar", valor: 66 }, { periodo: "Abr", valor: 68 }, { periodo: "Mai", valor: 65 }, { periodo: "Jun", valor: 64 }] },
  { id: "kpi-4", nome: "Tempo médio de resposta ao cidadão", formula: "média(dias entre protocolo e resposta)", unidade: "dias", meta: 5, atual: 11, periodicidade: "Mensal", responsavel: "Paulo Ivan", polaridade: "menor", historico: [{ periodo: "Jan", valor: 16 }, { periodo: "Fev", valor: 15 }, { periodo: "Mar", valor: 14 }, { periodo: "Abr", valor: 13 }, { periodo: "Mai", valor: 12 }, { periodo: "Jun", valor: 11 }] },
  { id: "kpi-5", nome: "Disponibilidade dos sistemas", formula: "(tempo disponível / tempo total) × 100", unidade: "%", meta: 99, atual: 99.4, periodicidade: "Mensal", responsavel: "Nina Corrêa", polaridade: "maior", historico: [{ periodo: "Jan", valor: 98.7 }, { periodo: "Fev", valor: 99.1 }, { periodo: "Mar", valor: 99.3 }, { periodo: "Abr", valor: 98.9 }, { periodo: "Mai", valor: 99.5 }, { periodo: "Jun", valor: 99.4 }] },
  { id: "kpi-6", nome: "Servidores capacitados", formula: "count(conclusões de trilha)", unidade: "pessoas", meta: 1500, atual: 1262, periodicidade: "Trimestral", responsavel: "Eduardo Lins", polaridade: "maior", historico: [{ periodo: "Jan", valor: 840 }, { periodo: "Fev", valor: 930 }, { periodo: "Mar", valor: 1020 }, { periodo: "Abr", valor: 1105 }, { periodo: "Mai", valor: 1190 }, { periodo: "Jun", valor: 1262 }] },
];

export type Risco = {
  id: string;
  nome: string;
  categoria: "Estratégico" | "Operacional" | "Projeto";
  origem: string;
  probabilidade: 1 | 2 | 3 | 4 | 5;
  impacto: 1 | 2 | 3 | 4 | 5;
  resposta: "Mitigar" | "Aceitar" | "Transferir" | "Evitar";
  plano: string;
  responsavel: string;
  prazo: string;
  tendencia: "alta" | "estável" | "queda";
};

export const riscos: Risco[] = [
  { id: "rk-1", nome: "Atraso na contratação de nuvem", categoria: "Estratégico", origem: "Infraestrutura e Resiliência", probabilidade: 4, impacto: 5, resposta: "Mitigar", plano: "Antecipar termo de referência e acionar ata de registro de preços vigente.", responsavel: "Rodrigo Prates", prazo: "2026-09-15", tendencia: "alta" },
  { id: "rk-2", nome: "Indisponibilidade de equipe técnica especializada", categoria: "Operacional", origem: "Transformação Digital", probabilidade: 4, impacto: 4, resposta: "Mitigar", plano: "Plano de retenção e contratação de fábrica de software complementar.", responsavel: "Marina Alcântara", prazo: "2026-08-30", tendencia: "estável" },
  { id: "rk-3", nome: "Vazamento de dados pessoais", categoria: "Estratégico", origem: "Segurança da Informação", probabilidade: 2, impacto: 5, resposta: "Mitigar", plano: "Criptografia em repouso, DLP e revisão de acessos privilegiados trimestral.", responsavel: "Ana Beatriz Rocha", prazo: "2026-10-01", tendencia: "queda" },
  { id: "rk-4", nome: "Baixa adesão dos cidadãos ao novo app", categoria: "Projeto", origem: "Atendimento ao Cidadão", probabilidade: 3, impacto: 4, resposta: "Mitigar", plano: "Campanha de comunicação e piloto assistido em 5 unidades.", responsavel: "Cláudia Menezes", prazo: "2026-11-20", tendencia: "alta" },
  { id: "rk-5", nome: "Integração Gov.br instável", categoria: "Projeto", origem: "Transformação Digital", probabilidade: 3, impacto: 3, resposta: "Transferir", plano: "Acordo de nível de serviço com o provedor e fallback de autenticação.", responsavel: "Larissa Duarte", prazo: "2026-08-12", tendencia: "estável" },
  { id: "rk-6", nome: "Contingenciamento orçamentário", categoria: "Estratégico", origem: "Institucional", probabilidade: 3, impacto: 5, resposta: "Aceitar", plano: "Reserva de contingência e repriorização trimestral do portfólio.", responsavel: "Marina Alcântara", prazo: "2026-12-31", tendencia: "alta" },
  { id: "rk-7", nome: "Obsolescência de ativos de rede", categoria: "Operacional", origem: "Infraestrutura e Resiliência", probabilidade: 4, impacto: 3, resposta: "Mitigar", plano: "Plano plurianual de renovação com substituição por criticidade.", responsavel: "Sérgio Vilela", prazo: "2027-03-30", tendencia: "estável" },
  { id: "rk-8", nome: "Rotatividade de patrocinadores", categoria: "Operacional", origem: "Capacitação e Pessoas", probabilidade: 2, impacto: 3, resposta: "Aceitar", plano: "Documentar decisões e manter comitê gestor formalizado.", responsavel: "Eduardo Lins", prazo: "2026-12-15", tendencia: "queda" },
  { id: "rk-9", nome: "Qualidade dos dados de origem", categoria: "Projeto", origem: "Transformação Digital", probabilidade: 5, impacto: 3, resposta: "Mitigar", plano: "Régua de qualidade automatizada e curadoria por domínio de dados.", responsavel: "Tiago Ferraz", prazo: "2026-09-30", tendencia: "alta" },
  { id: "rk-10", nome: "Judicialização de contratos", categoria: "Estratégico", origem: "Institucional", probabilidade: 2, impacto: 4, resposta: "Evitar", plano: "Parecer jurídico prévio e padronização de minutas.", responsavel: "Ana Beatriz Rocha", prazo: "2027-01-31", tendencia: "estável" },
];

export const evolucaoRiscos = [
  { periodo: "Jan", critico: 3, alto: 6, medio: 9, baixo: 12 },
  { periodo: "Fev", critico: 4, alto: 6, medio: 8, baixo: 11 },
  { periodo: "Mar", critico: 4, alto: 7, medio: 10, baixo: 10 },
  { periodo: "Abr", critico: 5, alto: 8, medio: 9, baixo: 9 },
  { periodo: "Mai", critico: 4, alto: 9, medio: 11, baixo: 8 },
  { periodo: "Jun", critico: 5, alto: 9, medio: 10, baixo: 8 },
];

export const execucaoMensal = [
  { periodo: "Jan", planejado: 1.6, realizado: 1.2 },
  { periodo: "Fev", planejado: 3.4, realizado: 2.6 },
  { periodo: "Mar", planejado: 5.4, realizado: 4.1 },
  { periodo: "Abr", planejado: 7.9, realizado: 6.3 },
  { periodo: "Mai", planejado: 10.2, realizado: 8.4 },
  { periodo: "Jun", planejado: 12.8, realizado: 10.9 },
];

export const auditoria = [
  { id: "au-1", quando: "31/07/2026 09:12", usuario: "Marina Alcântara", perfil: "Gestor", acao: "Atualizou", entidade: "Projeto · Portal de Serviços 2.0", detalhe: "Progresso 68% → 72%" },
  { id: "au-2", quando: "30/07/2026 17:48", usuario: "Ana Beatriz Rocha", perfil: "Técnico", acao: "Criou", entidade: "Risco · Judicialização de contratos", detalhe: "Severidade Alta" },
  { id: "au-3", quando: "30/07/2026 15:03", usuario: "Rodrigo Prates", perfil: "Gestor", acao: "Excluiu", entidade: "Indicador · Chamados reabertos", detalhe: "Indicador descontinuado" },
  { id: "au-4", quando: "29/07/2026 11:26", usuario: "Tiago Ferraz", perfil: "Técnico", acao: "Atualizou", entidade: "Programa · Dados e Analytics", detalhe: "Meta de bases 25 → 30" },
  { id: "au-5", quando: "28/07/2026 08:55", usuario: "Cláudia Menezes", perfil: "Alta Administração", acao: "Publicou", entidade: "Relatório · Painel Executivo Q2", detalhe: "Compartilhado com 12 stakeholders" },
];

export const relatorios = [
  { id: "rl-1", nome: "Painel Executivo Trimestral", publico: "Alta Administração", formato: "Dashboard", atualizado: "31/07/2026", compartilhado: true },
  { id: "rl-2", nome: "Status Report Consolidado de Projetos", publico: "Gestor", formato: "PDF", atualizado: "28/07/2026", compartilhado: true },
  { id: "rl-3", nome: "Matriz de Riscos Corporativos", publico: "Gestor", formato: "XLSX", atualizado: "26/07/2026", compartilhado: false },
  { id: "rl-4", nome: "Base de Indicadores (Power BI)", publico: "Técnico", formato: "CSV", atualizado: "31/07/2026", compartilhado: true },
  { id: "rl-5", nome: "Aderência Estratégica por Objetivo", publico: "Alta Administração", formato: "Dashboard", atualizado: "24/07/2026", compartilhado: false },
];

export const moeda = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export const severidade = (p: number, i: number) => {
  const s = p * i;
  if (s >= 15) return { nivel: "Crítico", token: "destructive" as const };
  if (s >= 9) return { nivel: "Alto", token: "warning" as const };
  if (s >= 4) return { nivel: "Médio", token: "info" as const };
  return { nivel: "Baixo", token: "success" as const };
};

export const portfolioDoProjeto = (p: Projeto) => {
  const pg = programas.find((x) => x.id === p.programaId);
  return portfolios.find((x) => x.id === pg?.portfolioId);
};
