"use client";

import React, { useState } from "react";
import { X, UserCog, AlertCircle } from "lucide-react";
import { CursoConfig } from "@/domain/entities/Curso";

interface EditarPerfilModalProps {
  aberto: boolean;
  curso: CursoConfig;
  onFechar: () => void;
  onSalvoComSucesso: () => void;
}

export const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
  aberto,
  curso,
  onFechar,
  onSalvoComSucesso,
}) => {
  const [alunoNome, setAlunoNome] = useState(curso.alunoNome);
  const [alunoMatricula, setAlunoMatricula] = useState(curso.alunoMatricula);
  const [nomeCurso, setNomeCurso] = useState(curso.nomeCurso);
  const [instituicao, setInstituicao] = useState(curso.instituicao);
  const [horasExigidas, setHorasExigidas] = useState(curso.horasExigidas);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const res = await fetch("/api/curso", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alunoNome,
          alunoMatricula,
          nomeCurso,
          instituicao,
          horasExigidas: Number(horasExigidas),
        }),
      });

      if (!res.ok) {
        const dados = await res.json();
        throw new Error(dados.erro || "Falha ao atualizar dados do curso.");
      }

      onSalvoComSucesso();
      onFechar();
    } catch (err: any) {
      setErro(err?.message || "Erro ao salvar alterações.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configurações do Aluno e do Curso
              </h3>
              <p className="text-xs text-slate-500">
                Ajuste os dados que constarão no cabeçalho do dossiê oficial
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Nome Completo do Discente
            </label>
            <input
              type="text"
              required
              value={alunoNome}
              onChange={(e) => setAlunoNome(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Matrícula Acadêmica
              </label>
              <input
                type="text"
                required
                value={alunoMatricula}
                onChange={(e) => setAlunoMatricula(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Meta de Horas Exigidas
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                required
                value={horasExigidas}
                onChange={(e) => setHorasExigidas(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Nome do Curso de Graduação
            </label>
            <input
              type="text"
              required
              value={nomeCurso}
              onChange={(e) => setNomeCurso(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Instituição de Ensino Superior (IES)
            </label>
            <input
              type="text"
              required
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Botões */}
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
              {carregando ? "Salvando..." : "Atualizar Configurações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
