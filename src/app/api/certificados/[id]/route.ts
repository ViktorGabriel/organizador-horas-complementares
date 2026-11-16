import { NextRequest, NextResponse } from "next/server";
import { JsonCertificadoRepository } from "@/infra/persistence/JsonCertificadoRepository";
import { LocalFileStorage } from "@/infra/storage/LocalFileStorage";
import { ExcluirCertificadoUseCase } from "@/application/usecases/ExcluirCertificadoUseCase";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const certRepo = new JsonCertificadoRepository();
    const storage = new LocalFileStorage();
    const useCase = new ExcluirCertificadoUseCase(certRepo, storage);

    const removido = await useCase.executar(id);
    if (!removido) {
      return NextResponse.json({ erro: "Certificado não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ sucesso: true });
  } catch (erro: any) {
    return NextResponse.json(
      { erro: erro?.message || "Erro ao excluir certificado" },
      { status: 500 }
    );
  }
}
