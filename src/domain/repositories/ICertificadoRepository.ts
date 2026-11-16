import { Certificado } from "../entities/Certificado";

export interface ICertificadoRepository {
  listarTodos(): Promise<Certificado[]>;
  buscarPorId(id: string): Promise<Certificado | null>;
  salvar(certificado: Certificado): Promise<void>;
  atualizar(certificado: Certificado): Promise<void>;
  deletar(id: string): Promise<boolean>;
}
