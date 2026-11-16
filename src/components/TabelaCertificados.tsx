"use client";

import React, { useState } from "react";
import { ResumoCategoria, ItemCalculado } from "@/domain/entities/Certificado";
import {
  Search,
  Filter,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
  ExternalLink,
  Award,
} from "lucide-react";

interface TabelaCertificadosProps {
  categorias: ResumoCategoria[];
  onExcluirCertificado: (id: string) => Promise<void>;
  onVisualizarAnexo: (storagePath: string, nomeOriginal: string) => void;
  onAdicionarPrimeiro: () => void;
}

export const TabelaCertificados: React.FC<TabelaCertificadosProps> = ({
  categorias,
  onExcluirCertificado,
  onVisualizarAnexo,
  onAdicionarPrimeiro,
}) => {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("TODAS");
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  // Unifica todos os itens calculados de todas as categorias
  const todosOsItens: ItemCalculado[] = categorias.flatMap((c) => c.itens);

  // Aplica filtros de busca e categoria
  const itensFiltrados = todosOsItens.filter((item) => {
    const atendeCategoria =
      categoriaFiltro === "TODAS" || item.certificado.categoriaId === categoriaFiltro;

    const termo = busca.toLowerCase();
    const atendeBusca =
      !busca ||
      item.certificado.titulo.toLowerCase().includes(termo) ||
      item.certificado.instituicaoEmissora.toLowerCase().includes(termo);

    return atendeCategoria && atendeBusca;
  });

  const handleExcluir = async (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja excluir o comprovante "${titulo}"?`)) {
      setExcluindoId(id);
      try {
        await onExcluirCertificado(id);
      } finally {
        setExcluindoId(null);
      }
    }
  };

  const getNomeCategoria = (categoriaId: string) => {
    const encontrada = categorias.find((c) => c.categoriaId === categoriaId);
    return encontrada ? encontrada.nomeCategoria : "Geral";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Barra de Ferramentas / Filtros */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Comprovantes e Certificados Anexados
          </h3>
          <p className="text-xs text-slate-500">
            Total de {todosOsItens.length} atividades cadastradas no sistema
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {/* Campo de Busca */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por curso, evento ou órgão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filtro por Categoria */}
          <div className="relative w-full sm:w-48">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="TODAS">Todas as Categorias</option>
              {categorias.map((cat) => (
                <option key={cat.categoriaId} value={cat.categoriaId}>
                  {cat.nomeCategoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo da Tabela ou Empty State */}
      {itensFiltrados.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            Nenhum certificado encontrado
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {busca || categoriaFiltro !== "TODAS"
              ? "Nenhum resultado corresponde aos filtros aplicados. Tente limpar a busca."
              : "Você ainda não adicionou nenhum comprovante. Comece anexando os PDFs ou prints de cursos e eventos."}
          </p>
          {!busca && categoriaFiltro === "TODAS" && (
            <button
              onClick={onAdicionarPrimeiro}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              <Award className="w-4 h-4" /> Cadastrar Primeiro Certificado
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Atividade / Instituição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4 text-center">Conclusão</th>
                <th className="py-3 px-4 text-center">Horas Brutas</th>
                <th className="py-3 px-4 text-center">Aproveitadas</th>
                <th className="py-3 px-4">Observação / Teto</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensFiltrados.map((item) => {
                const cert = item.certificado;
                const temExcedente = item.horasExcedentes > 0;

                return (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Título e Órgão */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1" title={cert.titulo}>
                        {cert.titulo}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {cert.instituicaoEmissora}
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 max-w-[200px] truncate" title={getNomeCategoria(cert.categoriaId)}>
                        {getNomeCategoria(cert.categoriaId)}
                      </span>
                    </td>

                    {/* Data de Conclusão */}
                    <td className="py-3 px-4 text-center text-slate-600">
                      {cert.dataConclusao.split("-").reverse().join("/")}
                    </td>

                    {/* Carga Horária Declarada */}
                    <td className="py-3 px-4 text-center font-medium text-slate-700">
                      {cert.horasDeclaradas}h
                    </td>

                    {/* Carga Horária Válida Aproveitada */}
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded ${temExcedente ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700"}`}>
                        {item.horasAproveitadas}h
                      </span>
                    </td>

                    {/* Observação / Motivo de Redução */}
                    <td className="py-3 px-4">
                      {item.motivoReducao ? (
                        <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium" title={item.motivoReducao}>
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[180px]">{item.motivoReducao}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium">
                          100% aproveitado
                        </span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {cert.anexo?.storagePath ? (
                          <button
                            onClick={() =>
                              onVisualizarAnexo(cert.anexo!.storagePath, cert.anexo!.nomeOriginal)
                            }
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Visualizar Comprovante Anexado"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleExcluir(cert.id, cert.titulo)}
                          disabled={excluindoId === cert.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Remover Comprovante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
