import { describe, it, expect } from "vitest";
import { GeradorDossiePdf } from "../../src/infra/pdf/GeradorDossiePdf";
import { RelatorioAproveitamentoGeral } from "../../src/domain/entities/Certificado";

describe("GeradorDossiePdf (Infra PDF Service)", () => {
  it("deve gerar buffer de PDF válido com cabeçalho e tabelas", () => {
    const relatorioMock: RelatorioAproveitamentoGeral = {
      cursoNome: "Engenharia de Software",
      instituicao: "Faculdade de Tecnologia",
      alunoNome: "Aluno de Graduação",
      alunoMatricula: "ENG-2024",
      horasExigidasTotal: 120,
      horasAproveitadasTotal: 80,
      horasExcedentesTotal: 10,
      horasRestantes: 40,
      percentualGeral: 67,
      concluido: false,
      geradoEm: new Date().toISOString(),
      categorias: [
        {
          categoriaId: "cat-cursos",
          nomeCategoria: "Cursos Livres e Extensão",
          grupo: "EXTENSAO",
          tetoHoras: 60,
          horasDeclaradas: 50,
          horasAproveitadas: 50,
          horasExcedentes: 0,
          percentualConclusao: 83,
          atingiuTeto: false,
          quantidadeCertificados: 1,
          itens: [
            {
              certificado: {
                id: "c1",
                titulo: "Arquitetura Limpa e DDD",
                categoriaId: "cat-cursos",
                instituicaoEmissora: "Plataforma X",
                dataConclusao: "2026-04-10",
                horasDeclaradas: 50,
                status: "VALIDADO",
                createdAt: "2026-04-10T00:00:00.000Z",
                updatedAt: "2026-04-10T00:00:00.000Z",
              },
              horasAproveitadas: 50,
              horasExcedentes: 0,
            },
          ],
        },
      ],
    };

    const pdfBuffer = GeradorDossiePdf.gerar(relatorioMock);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    // Verificar assinatura padrão de arquivo PDF (%PDF-)
    const pdfHeader = pdfBuffer.subarray(0, 5).toString("ascii");
    expect(pdfHeader).toBe("%PDF-");
  });
});
