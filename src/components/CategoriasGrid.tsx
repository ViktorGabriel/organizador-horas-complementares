"use client";

import React from "react";
import { ResumoCategoria } from "@/domain/entities/Certificado";
import { BookOpen, FlaskConical, Users, CheckCircle, AlertCircle, PlusCircle } from "lucide-react";

interface CategoriasGridProps {
  categorias: ResumoCategoria[];
  onSelecionarCategoriaParaNovo: (categoriaId: string) => void;
}

export const CategoriasGrid: React.FC<CategoriasGridProps> = ({
  categorias,
  onSelecionarCategoriaParaNovo,
}) => {
  const getIconeGrupo = (grupo: string) => {
    switch (grupo) {
      case "ENSINO":
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case "PESQUISA":
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      case "EXTENSAO":
        return <Users className="w-4 h-4 text-emerald-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Aproveitamento por Categoria & Tetos Regimentais
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Limites estritos estipulados pela faculdade
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((cat) => {
          const tetoAtingido = cat.atingiuTeto;

          return (
            <div
              key={cat.categoriaId}
              className={`bg-white rounded-xl p-5 border transition-all ${
                tetoAtingido
                  ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    {getIconeGrupo(cat.grupo)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {cat.grupo}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1" title={cat.nomeCategoria}>
                      {cat.nomeCategoria}
                    </h4>
                  </div>
                </div>

                {tetoAtingido ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle className="w-3 h-3" /> Teto Cheio
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                    Teto: {cat.tetoHoras}h
                  </span>
                )}
              </div>

              {/* Barra de Progresso da Categoria */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {cat.horasAproveitadas}h válidas
                  </span>
                  <span className="text-slate-400 font-medium">
                    {cat.horasAproveitadas}/{cat.tetoHoras}h ({cat.percentualConclusao}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tetoAtingido ? "bg-emerald-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(cat.percentualConclusao, 2))}%` }}
                  />
                </div>
              </div>

              {/* Informações adicionais e alertas */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  {cat.horasExcedentes > 0 ? (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-[11px]">
                      <AlertCircle className="w-3 h-3" /> {cat.horasExcedentes}h excedentes
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">
                      {cat.quantidadeCertificados} {cat.quantidadeCertificados === 1 ? "certificado" : "certificados"}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelecionarCategoriaParaNovo(cat.categoriaId)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
