"use client";

import React from "react";
import { X, ExternalLink, Download } from "lucide-react";

interface VisualizadorAnexoModalProps {
  aberto: boolean;
  storagePath: string | null;
  nomeOriginal: string | null;
  onFechar: () => void;
}

export const VisualizadorAnexoModal: React.FC<VisualizadorAnexoModalProps> = ({
  aberto,
  storagePath,
  nomeOriginal,
  onFechar,
}) => {
  if (!aberto || !storagePath) return null;

  const urlArquivo = `/api/uploads/${storagePath}`;
  const isPdf = nomeOriginal?.toLowerCase().endsWith(".pdf") || storagePath.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 truncate max-w-md">
              {nomeOriginal || "Comprovante Anexado"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={urlArquivo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={urlArquivo}
              download={nomeOriginal || "comprovante"}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
              title="Baixar comprovante"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onFechar}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizador */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center p-2 overflow-auto">
          {isPdf ? (
            <iframe
              src={urlArquivo}
              className="w-full h-full rounded-lg border border-slate-200 bg-white"
              title="Pré-visualização do PDF"
            />
          ) : (
            <img
              src={urlArquivo}
              alt={nomeOriginal || "Comprovante"}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};
