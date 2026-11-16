import fs from "fs";
import path from "path";
import { CursoConfig, CURSO_PADRAO } from "../../domain/entities/Curso";
import { ICursoRepository } from "../../domain/repositories/ICursoRepository";

export class JsonCursoRepository implements ICursoRepository {
  private readonly filePath: string;

  constructor(customPath?: string) {
    const dataDir = customPath || path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, "curso.json");
  }

  public async obterConfiguracao(): Promise<CursoConfig> {
    if (!fs.existsSync(this.filePath)) {
      await this.salvarEmDisco(CURSO_PADRAO);
      return CURSO_PADRAO;
    }

    try {
      const conteudo = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(conteudo) as CursoConfig;
    } catch {
      return CURSO_PADRAO;
    }
  }

  public async atualizarConfiguracao(dados: Partial<CursoConfig>): Promise<CursoConfig> {
    const atual = await this.obterConfiguracao();
    const atualizado: CursoConfig = {
      ...atual,
      ...dados,
      categorias: dados.categorias || atual.categorias,
      updatedAt: new Date().toISOString(),
    };

    await this.salvarEmDisco(atualizado);
    return atualizado;
  }

  private async salvarEmDisco(curso: CursoConfig): Promise<void> {
    const tempFile = `${this.filePath}.tmp`;
    await fs.promises.writeFile(tempFile, JSON.stringify(curso, null, 2), "utf-8");
    await fs.promises.rename(tempFile, this.filePath);
  }
}
