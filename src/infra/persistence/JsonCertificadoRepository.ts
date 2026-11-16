import fs from "fs";
import path from "path";
import { Certificado } from "../../domain/entities/Certificado";
import { ICertificadoRepository } from "../../domain/repositories/ICertificadoRepository";

export class JsonCertificadoRepository implements ICertificadoRepository {
  private readonly filePath: string;

  constructor(customPath?: string) {
    const dataDir = customPath || path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, "certificados.json");
  }

  public async listarTodos(): Promise<Certificado[]> {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    try {
      const conteudo = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(conteudo) as Certificado[];
    } catch {
      return [];
    }
  }

  public async buscarPorId(id: string): Promise<Certificado | null> {
    const todos = await this.listarTodos();
    return todos.find((c) => c.id === id) || null;
  }

  public async salvar(certificado: Certificado): Promise<void> {
    const todos = await this.listarTodos();
    todos.unshift(certificado); // mais recentes primeiro
    await this.salvarEmDisco(todos);
  }

  public async atualizar(certificado: Certificado): Promise<void> {
    const todos = await this.listarTodos();
    const index = todos.findIndex((c) => c.id === certificado.id);
    if (index !== -1) {
      todos[index] = {
        ...certificado,
        updatedAt: new Date().toISOString(),
      };
      await this.salvarEmDisco(todos);
    }
  }

  public async deletar(id: string): Promise<boolean> {
    const todos = await this.listarTodos();
    const filtrados = todos.filter((c) => c.id !== id);
    if (filtrados.length !== todos.length) {
      await this.salvarEmDisco(filtrados);
      return true;
    }
    return false;
  }

  private async salvarEmDisco(certificados: Certificado[]): Promise<void> {
    const tempFile = `${this.filePath}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(certificados, null, 2), "utf-8");
    await fs.promises.rename(tempFile, this.filePath);
  }
}
