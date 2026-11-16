import { describe, it, expect } from "vitest";
import { CalculadoraAproveitamento } from "../../src/domain/services/CalculadoraAproveitamento";
import { CursoConfig } from "../../src/domain/entities/Curso";
import { Certificado } from "../../src/domain/entities/Certificado";

describe("CalculadoraAproveitamento (Domain Service)", () => {
  const cursoMock: CursoConfig = {
    id: "curso-01",
    nomeCurso: "Engenharia de Software",
    instituicao: "Universidade X",
    alunoNome: "Viktor Gabriel",
    alunoMatricula: "20241001",
    horasExigidas: 100,
    categorias: [
      {
        id: "cat-cursos",
        nome: "Cursos Online",
        grupo: "EXTENSAO",
        descricao: "Cursos",
        tetoHoras: 40,
        limitePorAtividade: 20,
      },
      {
        id: "cat-pesquisa",
        nome: "Iniciação Científica",
        grupo: "PESQUISA",
        descricao: "Pesquisa",
        tetoHoras: 50,
      },
      {
        id: "cat-eventos",
        nome: "Congressos",
        grupo: "PESQUISA",
        descricao: "Eventos",
        tetoHoras: 30,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("deve calcular corretamente certificados que respeitam os tetos", () => {
    const certificados: Certificado[] = [
      {
        id: "cert-1",
        titulo: "Curso TypeScript",
        categoriaId: "cat-cursos",
        instituicaoEmissora: "Plataforma A",
        dataConclusao: "2026-03-01",
        horasDeclaradas: 15,
        status: "VALIDADO",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-01T00:00:00.000Z",
      },
      {
        id: "cert-2",
        titulo: "Artigo IEEE",
        categoriaId: "cat-pesquisa",
        instituicaoEmissora: "IEEE",
        dataConclusao: "2026-04-01",
        horasDeclaradas: 30,
        status: "VALIDADO",
        createdAt: "2026-04-01T00:00:00.000Z",
        updatedAt: "2026-04-01T00:00:00.000Z",
      },
    ];

    const resultado = CalculadoraAproveitamento.calcular(cursoMock, certificados);

    expect(resultado.horasAproveitadasTotal).toBe(45);
    expect(resultado.horasExcedentesTotal).toBe(0);
    expect(resultado.horasRestantes).toBe(55);
    expect(resultado.percentualGeral).toBe(45);
    expect(resultado.concluido).toBe(false);

    const catCursos = resultado.categorias.find((c) => c.categoriaId === "cat-cursos");
    expect(catCursos?.horasAproveitadas).toBe(15);
    expect(catCursos?.atingiuTeto).toBe(false);
  });

  it("deve cortar horas que ultrapassem o limite individual por atividade", () => {
    const certificados: Certificado[] = [
      {
        id: "cert-gigante",
        titulo: "Bootcamp Completo de 60 Horas",
        categoriaId: "cat-cursos", // Limite por atividade: 20h
        instituicaoEmissora: "Escola Dev",
        dataConclusao: "2026-05-01",
        horasDeclaradas: 60,
        status: "VALIDADO",
        createdAt: "2026-05-01T00:00:00.000Z",
        updatedAt: "2026-05-01T00:00:00.000Z",
      },
    ];

    const resultado = CalculadoraAproveitamento.calcular(cursoMock, certificados);
    const catCursos = resultado.categorias.find((c) => c.categoriaId === "cat-cursos");

    expect(catCursos?.horasDeclaradas).toBe(60);
    expect(catCursos?.horasAproveitadas).toBe(20);
    expect(catCursos?.horasExcedentes).toBe(40);
    expect(catCursos?.itens[0].motivoReducao).toContain("Limitado ao teto individual da atividade");
  });

  it("deve respeitar o teto máximo da categoria e descartar excesso acumulado", () => {
    const certificados: Certificado[] = [
      {
        id: "cert-c1",
        titulo: "Curso 1",
        categoriaId: "cat-cursos", // Teto: 40h, limite item: 20h
        instituicaoEmissora: "Org 1",
        dataConclusao: "2026-01-01",
        horasDeclaradas: 20,
        status: "VALIDADO",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "cert-c2",
        titulo: "Curso 2",
        categoriaId: "cat-cursos",
        instituicaoEmissora: "Org 2",
        dataConclusao: "2026-02-01",
        horasDeclaradas: 20,
        status: "VALIDADO",
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
      },
      {
        id: "cert-c3",
        titulo: "Curso 3 (Excedente)",
        categoriaId: "cat-cursos",
        instituicaoEmissora: "Org 3",
        dataConclusao: "2026-03-01",
        horasDeclaradas: 20,
        status: "VALIDADO",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-01T00:00:00.000Z",
      },
    ];

    const resultado = CalculadoraAproveitamento.calcular(cursoMock, certificados);
    const catCursos = resultado.categorias.find((c) => c.categoriaId === "cat-cursos");

    expect(catCursos?.horasDeclaradas).toBe(60);
    expect(catCursos?.horasAproveitadas).toBe(40);
    expect(catCursos?.horasExcedentes).toBe(20);
    expect(catCursos?.atingiuTeto).toBe(true);
    expect(catCursos?.percentualConclusao).toBe(100);

    // O terceiro certificado nao aproveita horas pois o teto ja foi atingido pelos anteriores
    expect(catCursos?.itens[2].horasAproveitadas).toBe(0);
    expect(catCursos?.itens[2].horasExcedentes).toBe(20);
    expect(catCursos?.itens[2].motivoReducao).toContain("Teto regimental da categoria");
  });

  it("não deve contabilizar certificados rejeitados", () => {
    const certificados: Certificado[] = [
      {
        id: "cert-rej",
        titulo: "Certificado sem assinatura",
        categoriaId: "cat-eventos",
        instituicaoEmissora: "Sem carimbo",
        dataConclusao: "2026-01-01",
        horasDeclaradas: 30,
        status: "REJEITADO",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const resultado = CalculadoraAproveitamento.calcular(cursoMock, certificados);
    const catEventos = resultado.categorias.find((c) => c.categoriaId === "cat-eventos");

    expect(catEventos?.horasAproveitadas).toBe(0);
    expect(catEventos?.quantidadeCertificados).toBe(0);
  });

  it("deve marcar o curso como concluído ao atingir a meta global", () => {
    const certificados: Certificado[] = [
      {
        id: "c1",
        titulo: "Pesquisa 1",
        categoriaId: "cat-pesquisa",
        instituicaoEmissora: "Lab",
        dataConclusao: "2026-01-01",
        horasDeclaradas: 50,
        status: "VALIDADO",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "c2",
        titulo: "Cursos 1 e 2",
        categoriaId: "cat-cursos",
        instituicaoEmissora: "Dev",
        dataConclusao: "2026-02-01",
        horasDeclaradas: 20,
        status: "VALIDADO",
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
      },
      {
        id: "c3",
        titulo: "Eventos A",
        categoriaId: "cat-eventos",
        instituicaoEmissora: "Congresso",
        dataConclusao: "2026-03-01",
        horasDeclaradas: 30,
        status: "VALIDADO",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-01T00:00:00.000Z",
      },
    ];

    const resultado = CalculadoraAproveitamento.calcular(cursoMock, certificados);

    // 50 (pesquisa) + 20 (cursos) + 30 (eventos) = 100h aproveitadas
    expect(resultado.horasAproveitadasTotal).toBe(100);
    expect(resultado.horasRestantes).toBe(0);
    expect(resultado.percentualGeral).toBe(100);
    expect(resultado.concluido).toBe(true);
  });
});
