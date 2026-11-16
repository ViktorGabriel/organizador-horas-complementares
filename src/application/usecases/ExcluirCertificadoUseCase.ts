import { JsonCertificadoRepository } from "../../infra/persistence/JsonCertificadoRepository";
import { LocalFileStorage } from "../../infra/storage/LocalFileStorage";

export class ExcluirCertificadoUseCase {
  constructor(
    private certificadoRepo: JsonCertificadoRepository,
    private storage: LocalFileStorage
  ) {}

  public async executar(id: string): Promise<boolean> {
    const cert = await this.certificadoRepo.buscarPorId(id);
    if (!cert) {
      return false;
    }

    if (cert.anexo?.storagePath) {
      await this.storage.removerArquivo(cert.anexo.storagePath);
    }

    return await this.certificadoRepo.deletar(id);
  }
}
