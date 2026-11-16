import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { LocalFileStorage } from "@/infra/storage/LocalFileStorage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const storage = new LocalFileStorage();
    const filePath = storage.obterCaminhoCompleto(filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ erro: "Arquivo não encontrado" }, { status: 404 });
    }

    const buffer = await fs.promises.readFile(filePath);
    const extensao = path.extname(filename).toLowerCase();

    let mimeType = "application/octet-stream";
    if (extensao === ".pdf") mimeType = "application/pdf";
    else if (extensao === ".png") mimeType = "image/png";
    else if (extensao === ".jpg" || extensao === ".jpeg") mimeType = "image/jpeg";
    else if (extensao === ".webp") mimeType = "image/webp";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (erro: any) {
    return NextResponse.json(
      { erro: erro?.message || "Erro ao carregar anexo" },
      { status: 500 }
    );
  }
}
