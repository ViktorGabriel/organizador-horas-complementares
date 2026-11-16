import { NextResponse } from "next/server";
import { JsonCursoRepository } from "@/infra/persistence/JsonCursoRepository";
import { JsonCertificadoRepository } from "@/infra/persistence/JsonCertificadoRepository";
import { ObterPainelAcademicoUseCase } from "@/application/usecases/ObterPainelAcademicoUseCase";

export async function GET() {
  try {
    const cursoRepo = new JsonCursoRepository();
    const certRepo = new JsonCertificadoRepository();
    const useCase = new ObterPainelAcademicoUseCase(cursoRepo, certRepo);

    const dados = await useCase.executar();
    return NextResponse.json(dados);
  } catch (erro: any) {
    return NextResponse.json(
      { erro: erro?.message || "Erro interno ao carregar painel acadêmico" },
      { status: 500 }
    );
  }
}
