import { ICursoRepository } from "../../domain/repositories/ICursoRepository";
import { JsonCertificadoRepository } from "../../infra/persistence/JsonCertificadoRepository";
import { CalculadoraAproveitamento } from "../../domain/services/CalculadoraAproveitamento";
import { RelatorioAproveitamentoGeral } from "../../domain/entities/Certificado";
import { CursoConfig } from "../../domain/entities/Curso";

export interface PainelAcademicoOutput {
  curso: CursoConfig;
  relatorio: RelatorioAproveitamentoGeral;
}

export class ObterPainelAcademicoUseCase {
  constructor(
    private cursoRepo: ICursoRepository,
    private certificadoRepo: JsonCertificadoRepository
  ) {}

  public async executar(): Promise<PainelAcademicoOutput> {
    const curso = await this.cursoRepo.obterConfiguracao();
    const certificados = await this.certificadoRepo.listarTodos();
    const relatorio = CalculadoraAproveitamento.calcular(curso, certificados);

    return {
      curso,
      relatorio,
    };
  }
}
