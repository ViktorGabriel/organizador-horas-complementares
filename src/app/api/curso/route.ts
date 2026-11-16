import { NextRequest, NextResponse } from "next/server";
import { JsonCursoRepository } from "@/infra/persistence/JsonCursoRepository";
import { AtualizarCursoUseCase } from "@/application/usecases/AtualizarCursoUseCase";

export async function PUT(request: NextRequest) {
  try {
    const corpo = await request.json();
    const cursoRepo = new JsonCursoRepository();
    const useCase = new AtualizarCursoUseCase(cursoRepo);

    const atualizado = await useCase.executar(corpo);
    return NextResponse.json(atualizado);
  } catch (erro: any) {
    return NextResponse.json(
      { erro: erro?.message || "Erro ao atualizar dados do curso" },
      { status: 400 }
    );
  }
}
