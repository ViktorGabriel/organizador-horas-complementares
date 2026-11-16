import { CursoConfig } from "../entities/Curso";
import { Certificado, RelatorioAproveitamentoGeral, ResumoCategoria, ItemCalculado } from "../entities/Certificado";

export class CalculadoraAproveitamento {
  /**
   * Processa a lista de certificados contra a grade de regras do curso,
   * calculando tetos regimentais por categoria e o aproveitamento global.
   */
  public static calcular(curso: CursoConfig, certificados: Certificado[]): RelatorioAproveitamentoGeral {
    let horasAproveitadasTotal = 0;
    let horasExcedentesTotal = 0;

    const resumosCategorias: ResumoCategoria[] = curso.categorias.map((categoria) => {
      // Filtrar certificados aprovados ou elegiveis para a categoria
      const certificadosDaCategoria = certificados.filter(
        (cert) => cert.categoriaId === categoria.id && cert.status !== "REJEITADO"
      );

      let horasAcumuladasCategoria = 0;
      let horasDeclaradasCategoria = 0;
      let excedenteAcumuladoCategoria = 0;

      const itens: ItemCalculado[] = certificadosDaCategoria.map((cert) => {
        horasDeclaradasCategoria += cert.horasDeclaradas;

        let horasElegiveisDesteCertificado = cert.horasDeclaradas;
        let motivoReducao: string | undefined;

        // 1. Regra de Limite individual por atividade (se configurado)
        if (categoria.limitePorAtividade && horasElegiveisDesteCertificado > categoria.limitePorAtividade) {
          const excedenteItem = horasElegiveisDesteCertificado - categoria.limitePorAtividade;
          horasElegiveisDesteCertificado = categoria.limitePorAtividade;
          motivoReducao = `Limitado ao teto individual da atividade (${categoria.limitePorAtividade}h). Excedente: ${excedenteItem}h`;
        }

        // 2. Regra de Teto Máximo Global da Categoria
        const saldoDisponivelNaCategoria = Math.max(0, categoria.tetoHoras - horasAcumuladasCategoria);
        const horasAproveitadas = Math.min(horasElegiveisDesteCertificado, saldoDisponivelNaCategoria);
        const excedente = cert.horasDeclaradas - horasAproveitadas;

        if (saldoDisponivelNaCategoria === 0 && !motivoReducao) {
          motivoReducao = `Teto regimental da categoria (${categoria.tetoHoras}h) já atingido.`;
        } else if (horasAproveitadas < horasElegiveisDesteCertificado && !motivoReducao) {
          motivoReducao = `Aproveitamento parcial: atingiu o teto da categoria (${categoria.tetoHoras}h).`;
        }

        horasAcumuladasCategoria += horasAproveitadas;
        excedenteAcumuladoCategoria += excedente;

        return {
          certificado: cert,
          horasAproveitadas,
          horasExcedentes: excedente,
          motivoReducao,
        };
      });

      const atingiuTeto = horasAcumuladasCategoria >= categoria.tetoHoras;
      const percentualConclusao = categoria.tetoHoras > 0
        ? Math.min(100, Math.round((horasAcumuladasCategoria / categoria.tetoHoras) * 100))
        : 100;

      horasAproveitadasTotal += horasAcumuladasCategoria;
      horasExcedentesTotal += excedenteAcumuladoCategoria;

      return {
        categoriaId: categoria.id,
        nomeCategoria: categoria.nome,
        grupo: categoria.grupo,
        tetoHoras: categoria.tetoHoras,
        horasDeclaradas: horasDeclaradasCategoria,
        horasAproveitadas: horasAcumuladasCategoria,
        horasExcedentes: excedenteAcumuladoCategoria,
        percentualConclusao,
        atingiuTeto,
        quantidadeCertificados: certificadosDaCategoria.length,
        itens,
      };
    });

    // O total aproveitado não pode ultrapassar o total global exigido pelo curso
    const horasComputadasFinais = Math.min(horasAproveitadasTotal, curso.horasExigidas);
    const horasRestantes = Math.max(0, curso.horasExigidas - horasComputadasFinais);
    const percentualGeral = curso.horasExigidas > 0
      ? Math.min(100, Math.round((horasComputadasFinais / curso.horasExigidas) * 100))
      : 100;
    const concluido = horasComputadasFinais >= curso.horasExigidas;

    return {
      cursoNome: curso.nomeCurso,
      instituicao: curso.instituicao,
      alunoNome: curso.alunoNome,
      alunoMatricula: curso.alunoMatricula,
      horasExigidasTotal: curso.horasExigidas,
      horasAproveitadasTotal: horasComputadasFinais,
      horasExcedentesTotal,
      horasRestantes,
      percentualGeral,
      concluido,
      categorias: resumosCategorias,
      geradoEm: new Date().toISOString(),
    };
  }
}
