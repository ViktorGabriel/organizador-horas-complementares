import { z } from "zod";

export const CriarCertificadoSchema = z.object({
  titulo: z.string().min(3, "O título da atividade deve ter pelo menos 3 caracteres").max(150),
  categoriaId: z.string().min(1, "A categoria é obrigatória"),
  instituicaoEmissora: z.string().min(2, "A instituição emissora é obrigatória").max(100),
  dataConclusao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (formato esperado: YYYY-MM-DD)"),
  horasDeclaradas: z.coerce.number().positive("A carga horária deve ser maior que 0").max(500, "Carga horária excessiva"),
  observacoes: z.string().max(500).optional(),
});

export type CriarCertificadoInput = z.infer<typeof CriarCertificadoSchema>;

export const AtualizarCursoSchema = z.object({
  nomeCurso: z.string().min(3, "Nome do curso deve ter pelo menos 3 caracteres"),
  instituicao: z.string().min(2, "Nome da instituição é obrigatório"),
  alunoNome: z.string().min(2, "Nome do aluno é obrigatório"),
  alunoMatricula: z.string().min(2, "Matrícula é obrigatória"),
  periodoLetivo: z.string().optional(),
  horasExigidas: z.coerce.number().int().positive("As horas exigidas devem ser um número positivo"),
});

export type AtualizarCursoInput = z.infer<typeof AtualizarCursoSchema>;
