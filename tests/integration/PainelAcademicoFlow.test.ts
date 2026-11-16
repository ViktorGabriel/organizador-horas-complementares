import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { JsonCursoRepository } from "../../src/infra/persistence/JsonCursoRepository";
import { JsonCertificadoRepository } from "../../src/infra/persistence/JsonCertificadoRepository";
import { LocalFileStorage } from "../../src/infra/storage/LocalFileStorage";
import { ObterPainelAcademicoUseCase } from "../../src/application/usecases/ObterPainelAcademicoUseCase";
import { CadastrarCertificadoUseCase } from "../../src/application/usecases/CadastrarCertificadoUseCase";
import { ExcluirCertificadoUseCase } from "../../src/application/usecases/ExcluirCertificadoUseCase";
import { AtualizarCursoUseCase } from "../../src/application/usecases/AtualizarCursoUseCase";
import { GeradorDossiePdf } from "../../src/infra/pdf/GeradorDossiePdf";

describe("Fluxo de Integração do Painel Acadêmico", () => {
  const testDataDir = path.resolve(__dirname, "temp-test-data");
  let cursoRepo: JsonCursoRepository;
  let certRepo: JsonCertificadoRepository;
  let storage: LocalFileStorage;

  beforeEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });

    cursoRepo = new JsonCursoRepository(testDataDir);
    certRepo = new JsonCertificadoRepository(testDataDir);
    storage = new LocalFileStorage(path.join(testDataDir, "uploads"));
  });

  afterEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it("deve executar o fluxo completo: cadastrar certificados, computar tetos, emitir PDF e remover", async () => {
    const cadastrarUseCase = new CadastrarCertificadoUseCase(certRepo);
    const painelUseCase = new ObterPainelAcademicoUseCase(cursoRepo, certRepo);
    const atualizarCursoUseCase = new AtualizarCursoUseCase(cursoRepo);
    const excluirUseCase = new ExcluirCertificadoUseCase(certRepo, storage);

    // 1. Atualizar informações do curso e aluno
    await atualizarCursoUseCase.executar({
      nomeCurso: "Engenharia de Software",
      instituicao: "Universidade de Testes",
      alunoNome: "Aluno Alinhado",
      alunoMatricula: "MAT-9999",
      horasExigidas: 100,
    });

    // 2. Simular upload de arquivo físico
    const bufferFake = Buffer.from("Conteúdo simulado de certificado PDF");
    const anexo = await storage.salvarArquivo(bufferFake, "certificado_clean_arch.pdf", "application/pdf");

    // 3. Cadastrar certificado na categoria 'cursos-extensao' (teto: 60h, limite por item: 40h)
    const cert1 = await cadastrarUseCase.executar({
      dados: {
        titulo: "Curso Arquitetura Limpa",
        categoriaId: "cursos-extensao",
        instituicaoEmissora: "Escola de TI",
        dataConclusao: "2026-05-10",
        horasDeclaradas: 50, // deve ter 40h aproveitadas e 10h excedentes
      },
      anexo,
    });

    expect(cert1.id).toBeDefined();

    // 4. Obter painel acadêmico e verificar cálculos
    const painel1 = await painelUseCase.executar();
    expect(painel1.relatorio.horasExigidasTotal).toBe(100);
    expect(painel1.relatorio.horasAproveitadasTotal).toBe(40);
    expect(painel1.relatorio.horasExcedentesTotal).toBe(10);
    expect(painel1.relatorio.horasRestantes).toBe(60);
    expect(painel1.relatorio.percentualGeral).toBe(40);
    expect(painel1.relatorio.concluido).toBe(false);

    // 5. Cadastrar mais um certificado de outra categoria para integralizar (monitoria: 60h)
    await cadastrarUseCase.executar({
      dados: {
        titulo: "Monitoria de Estrutura de Dados",
        categoriaId: "monitoria-ensino",
        instituicaoEmissora: "Universidade de Testes",
        dataConclusao: "2026-06-20",
        horasDeclaradas: 60,
      },
    });

    // 6. Verificar conclusão do curso
    const painelFinal = await painelUseCase.executar();
    // 40h (cursos) + 40h (monitoria limitada a 40h por item) = 80h aproveitadas
    expect(painelFinal.relatorio.horasAproveitadasTotal).toBe(80);
    expect(painelFinal.relatorio.horasRestantes).toBe(20);

    // 7. Gerar PDF do dossiê final
    const pdf = GeradorDossiePdf.gerar(painelFinal.relatorio);
    expect(pdf.length).toBeGreaterThan(1000);
    expect(pdf.subarray(0, 5).toString("ascii")).toBe("%PDF-");

    // 8. Excluir o primeiro certificado e verificar se o arquivo em disco foi removido
    const caminhoArquivo = storage.obterCaminhoCompleto(anexo.storagePath);
    expect(fs.existsSync(caminhoArquivo)).toBe(true);

    const removido = await excluirUseCase.executar(cert1.id);
    expect(removido).toBe(true);
    expect(fs.existsSync(caminhoArquivo)).toBe(false);

    const painelAposRemocao = await painelUseCase.executar();
    expect(painelAposRemocao.relatorio.horasAproveitadasTotal).toBe(40);
  });
});
