import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { RelatorioAproveitamentoGeral } from "../../domain/entities/Certificado";

export class GeradorDossiePdf {
  public static gerar(relatorio: RelatorioAproveitamentoGeral): Buffer {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Cabeçalho Institucional
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(0, 0, pageWidth, 24, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("DOSSIÊ DE ATIVIDADES COMPLEMENTARES ACADÊMICAS", pageWidth / 2, 11, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Requerimento de Validação e Cômputo de Carga Horária para Colação de Grau", pageWidth / 2, 18, { align: "center" });

    // 2. Dados do Discente e Curso
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("1. IDENTIFICAÇÃO DO DISCENTE E CURSO", 14, 33);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const identificacaoLinha1 = `Estudante: ${relatorio.alunoNome.toUpperCase()}    |    Matrícula: ${relatorio.alunoMatricula}`;
    const identificacaoLinha2 = `Curso: ${relatorio.cursoNome}    |    Instituição: ${relatorio.instituicao}`;
    const dataEmissao = `Data de Geração: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`;

    doc.text(identificacaoLinha1, 14, 39);
    doc.text(identificacaoLinha2, 14, 45);
    doc.text(dataEmissao, 14, 51);

    // 3. Quadro Resumo Global
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("2. QUADRO RESUMO DE INTEGRALIZAÇÃO DE CARGA HORÁRIA", 14, 60);

    const statusBadge = relatorio.concluido
      ? "META CUMPRIDA (APTO A COLAÇÃO)"
      : `EM ANDAMENTO (FALTAM ${relatorio.horasRestantes}h)`;

    autoTable(doc, {
      startY: 63,
      head: [["Carga Horária Exigida", "Horas Declaradas", "Horas Aproveitadas", "Excedente Descartado", "Percentual", "Situação"]],
      body: [
        [
          `${relatorio.horasExigidasTotal} horas`,
          `${relatorio.horasAproveitadasTotal + relatorio.horasExcedentesTotal} horas`,
          `${relatorio.horasAproveitadasTotal} horas`,
          `${relatorio.horasExcedentesTotal} horas`,
          `${relatorio.percentualGeral}%`,
          statusBadge,
        ],
      ],
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: "bold", halign: "center", fontSize: 8 },
      bodyStyles: { halign: "center", fontSize: 8.5 },
      theme: "grid",
    });

    // 4. Detalhamento por Categoria e Limites Regimentais
    let cursorY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("3. APURAÇÃO POR CATEGORIA E LIMITES REGIMENTAIS", 14, cursorY);

    const corpoCategorias = relatorio.categorias.map((cat) => [
      cat.nomeCategoria,
      cat.grupo,
      `${cat.tetoHoras}h`,
      `${cat.horasDeclaradas}h`,
      `${cat.horasAproveitadas}h`,
      `${cat.horasExcedentes}h`,
      cat.atingiuTeto ? "Teto Atingido" : `${cat.percentualConclusao}%`,
    ]);

    autoTable(doc, {
      startY: cursorY + 3,
      margin: { left: 14, right: 14 },
      head: [["Categoria de Atividade", "Grupo", "Teto Regimental", "Declaradas", "Aproveitadas", "Excedente", "Status"]],
      body: corpoCategorias,
      headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: "bold", fontSize: 8 },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center", fontStyle: "bold" },
        5: { halign: "center" },
        6: { halign: "center" },
      },
      theme: "striped",
    });

    // 5. Relação Analítica de Certificados Anexados
    cursorY = (doc as any).lastAutoTable.finalY + 8;
    if (cursorY > 230) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("4. DISCRIMINAÇÃO ANALÍTICA DOS COMPROVANTES ANEXADOS", 14, cursorY);

    const itensCertificados: any[] = [];
    let contador = 1;

    relatorio.categorias.forEach((cat) => {
      cat.itens.forEach((item) => {
        itensCertificados.push([
          String(contador++).padStart(2, "0"),
          item.certificado.titulo,
          item.certificado.instituicaoEmissora,
          cat.nomeCategoria,
          item.certificado.dataConclusao,
          `${item.certificado.horasDeclaradas}h`,
          `${item.horasAproveitadas}h`,
          item.motivoReducao || "Integral",
        ]);
      });
    });

    if (itensCertificados.length === 0) {
      itensCertificados.push(["-", "Nenhum certificado cadastrado até o momento.", "-", "-", "-", "-", "-", "-"]);
    }

    autoTable(doc, {
      startY: cursorY + 3,
      margin: { left: 14, right: 14 },
      head: [["#", "Atividade Comprovada", "Instituição Emissora", "Categoria", "Conclusão", "Bruta", "Válida", "Observação"]],
      body: itensCertificados,
      headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: "bold", fontSize: 7.5 },
      styles: { fontSize: 7.5, cellPadding: 2, overflow: "linebreak" },
      columnStyles: {
        0: { halign: "center", cellWidth: 8 },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center", fontStyle: "bold" },
      },
      theme: "grid",
    });

    // 6. Termo de Submissão e Assinaturas
    let finalY = (doc as any).lastAutoTable.finalY + 14;
    if (finalY > 240) {
      doc.addPage();
      finalY = 30;
    }

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Declaro para os devidos fins de comprovação acadêmica que as atividades e comprovantes listados neste dossiê são verídicos e autênticos.",
      14,
      finalY,
      { maxWidth: 180 }
    );

    const linhaAssinaturaY = finalY + 22;
    doc.setDrawColor(148, 163, 184);
    doc.line(20, linhaAssinaturaY, 90, linhaAssinaturaY);
    doc.line(120, linhaAssinaturaY, 190, linhaAssinaturaY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Assinatura do Discente", 55, linhaAssinaturaY + 5, { align: "center" });
    doc.text("Coordenação / Colegiado de Curso", 155, linhaAssinaturaY + 5, { align: "center" });

    const arrayBuffer = doc.output("arraybuffer");
    return Buffer.from(arrayBuffer);
  }
}
