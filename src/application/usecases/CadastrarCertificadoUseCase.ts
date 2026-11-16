import crypto from "crypto";
import { CriarCertificadoInput, CriarCertificadoSchema } from "../dtos/CertificadoDTO";
import { JsonCertificadoRepository } from "../../infra/persistence/JsonCertificadoRepository";
import { Certificado, ArquivoAnexo } from "../../domain/entities/Certificado";

export interface CadastrarCertificadoParam {
  dados: CriarCertificadoInput;
  anexo?: ArquivoAnexo;
}

export class CadastrarCertificadoUseCase {
  constructor(private certificadoRepo: JsonCertificadoRepository) {}

  public async executar(param: CadastrarCertificadoParam): Promise<Certificado> {
    const validado = CriarCertificadoSchema.parse(param.dados);

    const novoCertificado: Certificado = {
      id: `cert-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      titulo: validado.titulo,
      categoriaId: validado.categoriaId,
      instituicaoEmissora: validado.instituicaoEmissora,
      dataConclusao: validado.dataConclusao,
      horasDeclaradas: validado.horasDeclaradas,
      status: "VALIDADO",
      observacoes: validado.observacoes,
      anexo: param.anexo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.certificadoRepo.salvar(novoCertificado);
    return novoCertificado;
  }
}
