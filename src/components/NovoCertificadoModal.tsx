"use client";

import React, { useState } from "react";
import { X, UploadCloud, FileCheck, AlertTriangle } from "lucide-react";
import { ResumoCategoria } from "@/domain/entities/Certificado";

interface NovoCertificadoModalProps {
  aberto: boolean;
  categoriaPreSelecionada?: string;
  categorias: ResumoCategoria[];
  onFechar: () => void;
  onSalvoComSucesso: () => void;
}

export const NovoCertificadoModal: React.FC<NovoCertificadoModalProps> = ({
  aberto,
  categoriaPreSelecionada,
  categorias,
  onFechar,
  onSalvoComSucesso,
}) => {
  const [titulo, setTitulo] = useState("");
  const [categoriaId, setCategoriaId] = useState(
    categoriaPreSelecionada || (categorias[0]?.categoriaId ?? "")
  );
  const [instituicaoEmissora, setInstituicaoEmissora] = useState("");
  const [dataConclusao, setDataConclusao] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [horasDeclaradas, setHorasDeclaradas] = useState<number | "">("");
  const [observacoes, setObservacoes] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const categoriaAtual = categorias.find((c) => c.categoriaId === categoriaId);
  const saldoRestanteCategoria = categoriaAtual
    ? Math.max(0, categoriaAtual.tetoHoras - categoriaAtual.horasAproveitadas)
    : 0;

  const horasNumericas = Number(horasDeclaradas) || 0;
  const vaiExcederTeto =
    categoriaAtual &&
    horasNumericas > 0 &&
    horasNumericas > saldoRestanteCategoria;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim() || !categoriaId || !instituicaoEmissora.trim() || !horasDeclaradas) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append("titulo", titulo.trim());
      formData.append("categoriaId", categoriaId);
      formData.append("instituicaoEmissora", instituicaoEmissora.trim());
      formData.append("dataConclusao", dataConclusao);
      formData.append("horasDeclaradas", String(horasDeclaradas));
      if (observacoes.trim()) {
        formData.append("observacoes", observacoes.trim());
      }
      if (arquivo) {
        formData.append("arquivo", arquivo);
      }

      const res = await fetch("/api/certificados", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const dados = await res.json();
        throw new Error(dados.erro || "Falha ao cadastrar certificado.");
      }

      onSalvoComSucesso();
      onFechar();
    } catch (err: any) {
      setErro(err?.message || "Ocorreu um erro ao salvar o certificado.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Cadastrar Novo Certificado / Atividade
            </h3>
            <p className="text-xs text-slate-500">
              Adicione comprovantes para computar e abater suas horas complementares
            </p>
          </div>
          <button
            onClick={onFechar}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {erro && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Upload de Comprovante (PDF ou Imagem) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Arquivo Comprovante (PDF, PNG ou JPG)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {arquivo ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-semibold">
                  <FileCheck className="w-5 h-5" />
                  <span className="truncate max-w-xs">{arquivo.name}</span>
                  <span className="text-slate-400 font-normal">
                    ({(arquivo.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    Arraste o arquivo ou <span className="text-blue-600 font-semibold underline">clique para selecionar</span>
                  </p>
                  <p className="text-[11px] text-slate-400">PDF ou imagens de até 15MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Título da Atividade */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Nome da Atividade / Curso / Evento <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Formação em Arquitetura de Software e Microsserviços"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Instituição Emissora */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Instituição Emissora / Entidade Promotora <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Alura, Coursera, HarvardX, FAPESP, Centro Acadêmico"
              value={instituicaoEmissora}
              onChange={(e) => setInstituicaoEmissora(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Categoria Acadêmica <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              {categorias.map((cat) => (
                <option key={cat.categoriaId} value={cat.categoriaId}>
                  {cat.nomeCategoria} (Teto: {cat.tetoHoras}h | Saldo Restante: {Math.max(0, cat.tetoHoras - cat.horasAproveitadas)}h)
                </option>
              ))}
            </select>
          </div>

          {/* Grid com Carga Horária e Data de Conclusão */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Carga Horária (em Horas) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                placeholder="Ex: 40"
                value={horasDeclaradas}
                onChange={(e) => setHorasDeclaradas(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Data de Conclusão / Emissão <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={dataConclusao}
                onChange={(e) => setDataConclusao(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Aviso Proativo sobre Tetos Regimentais */}
          {vaiExcederTeto && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Aviso de Teto Regimental:</span>
                <p className="mt-0.5">
                  Esta categoria só tem saldo disponível de <strong>{saldoRestanteCategoria} horas</strong>.
                  O excedente ({horasNumericas - saldoRestanteCategoria}h) será registrado, mas não computado para a colação.
                </p>
              </div>
            </div>
          )}

          {/* Observações Opcionais */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Observações Adicionais (opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Certificado emitido com código de autenticação eletrônica."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onFechar}
              disabled={carregando}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 transition-all"
            >
              {carregando ? "Salvando..." : "Salvar Certificado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
