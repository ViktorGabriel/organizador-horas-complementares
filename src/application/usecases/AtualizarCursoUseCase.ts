import { AtualizarCursoInput, AtualizarCursoSchema } from "../dtos/CertificadoDTO";
import { ICursoRepository } from "../../domain/repositories/ICursoRepository";
import { CursoConfig } from "../../domain/entities/Curso";

export class AtualizarCursoUseCase {
  constructor(private cursoRepo: ICursoRepository) {}

  public async executar(dados: AtualizarCursoInput): Promise<CursoConfig> {
    const validado = AtualizarCursoSchema.parse(dados);
    return await this.cursoRepo.atualizarConfiguracao(validado);
  }
}
