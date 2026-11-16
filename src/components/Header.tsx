"use client";

import React from "react";
import { GraduationCap, FileDown, Settings, Plus, Sparkles } from "lucide-react";
import { CursoConfig } from "@/domain/entities/Curso";
import { RelatorioAproveitamentoGeral } from "@/domain/entities/Certificado";

interface HeaderProps {
  curso: CursoConfig;
  relatorio: RelatorioAproveitamentoGeral;
  onAbrirNovoCertificado: () => void;
  onAbrirEditarPerfil: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  curso,
  relatorio,
  onAbrirNovoCertificado,
  onAbrirEditarPerfil,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Organizador de Horas Complementares
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3" /> Gestão Acadêmica
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {curso.alunoNome} ({curso.alunoMatricula}) • {curso.nomeCurso} - {curso.instituicao}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={onAbrirEditarPerfil}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="Ajustar metas do curso e dados do aluno"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Configurações</span>
            </button>

            <a
              href="/api/relatorio/pdf"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-all"
              title="Baixar relatório analítico pronto para entregar à coordenação"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar Dossiê (PDF)</span>
            </a>

            <button
              onClick={onAbrirNovoCertificado}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Certificado</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
