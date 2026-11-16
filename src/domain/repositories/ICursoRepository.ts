import { CursoConfig } from "../entities/Curso";

export interface ICursoRepository {
  obterConfiguracao(): Promise<CursoConfig>;
  atualizarConfiguracao(config: Partial<CursoConfig>): Promise<CursoConfig>;
}
