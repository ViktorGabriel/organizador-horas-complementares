import { CategoriaAtividade, CATEGORIAS_PADRAO } from "./Categoria";

export interface CursoConfig {
  id: string;
  nomeCurso: string;
  instituicao: string;
  alunoNome: string;
  alunoMatricula: string;
  periodoLetivo?: string;
  horasExigidas: number; // Meta global de horas complementares exigidas para graduacao
  categorias: CategoriaAtividade[];
  createdAt: string;
  updatedAt: string;
}

export const CURSO_PADRAO: CursoConfig = {
  id: "curso-default-01",
  nomeCurso: "Bacharelado em Engenharia de Software",
  instituicao: "Universidade / Faculdade de Tecnologia",
  alunoNome: "Estudante de Graduação",
  alunoMatricula: "GRAD-2024.1",
  periodoLetivo: "2026.1",
  horasExigidas: 200,
  categorias: CATEGORIAS_PADRAO,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
