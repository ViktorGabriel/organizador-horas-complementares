import { NextRequest, NextResponse } from "next/server";
import { JsonCertificadoRepository } from "@/infra/persistence/JsonCertificadoRepository";
import { LocalFileStorage } from "@/infra/storage/LocalFileStorage";
import { CadastrarCertificadoUseCase } from "@/application/usecases/CadastrarCertificadoUseCase";
import { ArquivoAnexo } from "@/domain/entities/Certificado";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const titulo = formData.get("titulo")?.toString() || "";
    const categoriaId = formData.get("categoriaId")?.toString() || "";
    const instituicaoEmissora = formData.get("instituicaoEmissora")?.toString() || "";
    const dataConclusao = formData.get("dataConclusao")?.toString() || "";
    const horasDeclaradas = Number(formData.get("horasDeclaradas") || 0);
    const observacoes = formData.get("observacoes")?.toString() || undefined;

    const arquivo = formData.get("arquivo") as File | null;
    let anexo: ArquivoAnexo | undefined = undefined;

    if (arquivo && arquivo.size > 0) {
      // Validação defensiva de tamanho (máximo 15MB)
      if (arquivo.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { erro: "O arquivo excede o limite máximo permitido de 15MB." },
          { status: 400 }
        );
      }

      const storage = new LocalFileStorage();
      const bytes = await arquivo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      anexo = await storage.salvarArquivo(
        buffer,
        arquivo.name,
        arquivo.type || "application/octet-stream"
      );
    }

    const certRepo = new JsonCertificadoRepository();
    const useCase = new CadastrarCertificadoUseCase(certRepo);

    const criado = await useCase.executar({
      dados: {
        titulo,
        categoriaId,
        instituicaoEmissora,
        dataConclusao,
        horasDeclaradas,
        observacoes,
      },
      anexo,
    });

    return NextResponse.json(criado, { status: 201 });
  } catch (erro: any) {
    return NextResponse.json(
      { erro: erro?.message || "Erro ao cadastrar comprovante" },
      { status: 400 }
    );
  }
}
