import { NextResponse } from "next/server";
import { JsonCursoRepository } from "@/infra/persistence/JsonCursoRepository";
import { JsonCertificadoRepository } from "@/infra/persistence/JsonCertificadoRepository";
import { ObterPainelAcademicoUseCase } from "@/application/usecases/ObterPainelAcademicoUseCase";
import { GeradorDossiePdf } from "@/infra/pdf/GeradorDossiePdf";

export async function GET() {
  try {
    const cursoRepo = new JsonCursoRepository();
    const certRepo = new JsonCertificadoRepository();
    const useCase = new ObterPainelAcademicoUseCase(cursoRepo, certRepo);

    const { relatorio } = await useCase.executar();
    const pdfBuffer = GeradorDossiePdf.gerar(relatorio);

    const matriculaSanitizada = relatorio.alunoMatricula.replace(/[^a-zA-Z0-9_-]/g, "_");
    const nomeArquivo = `Dossie-Horas-Complementares-${matriculaSanitizada}.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (erro: any) {
    return NextResponse.json(
      { erro: erro?.message || "Erro ao gerar dossiê PDF" },
      { status: 500 }
    );
  }
}
