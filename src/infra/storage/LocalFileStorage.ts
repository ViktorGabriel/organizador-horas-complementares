import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ArquivoAnexo } from "../../domain/entities/Certificado";

export class LocalFileStorage {
  private readonly storageDir: string;

  constructor(baseDir?: string) {
    this.storageDir = baseDir || path.resolve(process.cwd(), "data", "uploads");
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  public async salvarArquivo(
    buffer: Buffer,
    nomeOriginal: string,
    mimeType: string
  ): Promise<ArquivoAnexo> {
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const extensao = path.extname(nomeOriginal).toLowerCase() || ".bin";
    const nomeArmazenado = `${Date.now()}-${hash.substring(0, 12)}${extensao}`;
    const caminhoCompleto = path.join(this.storageDir, nomeArmazenado);

    await fs.promises.writeFile(caminhoCompleto, buffer);

    return {
      nomeOriginal: path.basename(nomeOriginal),
      mimeType,
      tamanhoBytes: buffer.length,
      storagePath: nomeArmazenado,
      hashSha256: hash,
    };
  }

  public obterCaminhoCompleto(storagePath: string): string {
    const sanitizado = path.basename(storagePath);
    return path.join(this.storageDir, sanitizado);
  }

  public async removerArquivo(storagePath: string): Promise<void> {
    const caminho = this.obterCaminhoCompleto(storagePath);
    if (fs.existsSync(caminho)) {
      await fs.promises.unlink(caminho);
    }
  }
}
