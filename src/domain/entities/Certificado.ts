export type StatusCertificado = 'RASCUNHO' | 'SUBMETIDO' | 'VALIDADO' | 'REJEITADO';

export interface ArquivoAnexo {
  nomeOriginal: string;
  mimeType: string;
  tamanhoBytes: number;
  storagePath: string; // Caminho relativo seguro dentro do storage de uploads
  hashSha256: string;
}

export interface Certificado {
  id: string;
  titulo: string;
  categoriaId: string;
  instituicaoEmissora: string;
  dataConclusao: string; // ISO Date YYYY-MM-DD
  horasDeclaradas: number; // Horas constantes no certificado original
  status: StatusCertificado;
  observacoes?: string;
  anexo?: ArquivoAnexo;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCalculado {
  certificado: Certificado;
  horasAproveitadas: number;
  horasExcedentes: number;
  motivoReducao?: string;
}

export interface ResumoCategoria {
  categoriaId: string;
  nomeCategoria: string;
  grupo: string;
  tetoHoras: number;
  horasDeclaradas: number;
  horasAproveitadas: number;
  horasExcedentes: number;
  percentualConclusao: number; // 0 a 100%
  atingiuTeto: boolean;
  quantidadeCertificados: number;
  itens: ItemCalculado[];
}

export interface RelatorioAproveitamentoGeral {
  cursoNome: string;
  instituicao: string;
  alunoNome: string;
  alunoMatricula: string;
  horasExigidasTotal: number;
  horasAproveitadasTotal: number;
  horasExcedentesTotal: number;
  horasRestantes: number;
  percentualGeral: number; // 0 a 100%
  concluido: boolean;
  categorias: ResumoCategoria[];
  geradoEm: string;
}
