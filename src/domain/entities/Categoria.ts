export type GrupoCategoria = 'ENSINO' | 'PESQUISA' | 'EXTENSAO' | 'OUTROS';

export interface CategoriaAtividade {
  id: string;
  nome: string;
  grupo: GrupoCategoria;
  descricao: string;
  tetoHoras: number; // Limite máximo de horas aceitas pelo curso nesta categoria
  limitePorAtividade?: number; // Limite máximo aceito por certificado individual (se houver)
}

export const CATEGORIAS_PADRAO: CategoriaAtividade[] = [
  {
    id: "cursos-extensao",
    nome: "Cursos Livres e de Extensão Online/Presencial",
    grupo: "EXTENSAO",
    descricao: "Cursos extracurriculares, bootcamps, workshops e formações técnicas complementares.",
    tetoHoras: 60,
    limitePorAtividade: 40,
  },
  {
    id: "eventos-congressos",
    nome: "Congressos, Seminários, Jornadas e Simpósios",
    grupo: "PESQUISA",
    descricao: "Participação como ouvinte ou palestrante em eventos acadêmicos e conferências técnicas.",
    tetoHoras: 40,
    limitePorAtividade: 20,
  },
  {
    id: "iniciacao-cientifica",
    nome: "Iniciação Científica e Publicação de Artigos",
    grupo: "PESQUISA",
    descricao: "Projetos de pesquisa acadêmica PIBIC/PIBITI, publicações em periódicos e anais de congressos.",
    tetoHoras: 80,
    limitePorAtividade: 60,
  },
  {
    id: "monitoria-ensino",
    nome: "Monitoria Acadêmica e Nivelamento",
    grupo: "ENSINO",
    descricao: "Atividades de monitoria acadêmica em disciplinas de graduação devidamente comprovadas pela IES.",
    tetoHoras: 60,
    limitePorAtividade: 40,
  },
  {
    id: "projetos-sociais",
    nome: "Ações Sociais, Voluntariado e Ligas Acadêmicas",
    grupo: "EXTENSAO",
    descricao: "Atividades voluntárias de extensão com impacto social direto ou gestão em ligas acadêmicas.",
    tetoHoras: 40,
    limitePorAtividade: 30,
  },
  {
    id: "estagio-nao-obrigatorio",
    nome: "Estágio Não Obrigatório ou Prática Profissional",
    grupo: "ENSINO",
    descricao: "Horas de estágio profissional extracurricular com termo de compromisso e relatório.",
    tetoHoras: 60,
    limitePorAtividade: 40,
  },
];
