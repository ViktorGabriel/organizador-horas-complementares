"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { MetricCards } from "@/components/MetricCards";
import { CategoriasGrid } from "@/components/CategoriasGrid";
import { TabelaCertificados } from "@/components/TabelaCertificados";
import { NovoCertificadoModal } from "@/components/NovoCertificadoModal";
import { EditarPerfilModal } from "@/components/EditarPerfilModal";
import { VisualizadorAnexoModal } from "@/components/VisualizadorAnexoModal";
import { CursoConfig } from "@/domain/entities/Curso";
import { RelatorioAproveitamentoGeral } from "@/domain/entities/Certificado";
import { Loader2, AlertCircle } from "lucide-react";

export default function PaginaInicial() {
  const [curso, setCurso] = useState<CursoConfig | null>(null);
  const [relatorio, setRelatorio] = useState<RelatorioAproveitamentoGeral | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados dos modais
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [categoriaPreSelecionada, setCategoriaPreSelecionada] = useState<string | undefined>(undefined);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [visualizadorAnexo, setVisualizadorAnexo] = useState<{
    aberto: boolean;
    storagePath: string | null;
    nomeOriginal: string | null;
  }>({
    aberto: false,
    storagePath: null,
    nomeOriginal: null,
  });

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const res = await fetch("/api/painel", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Não foi possível carregar os dados acadêmicos.");
      }
      const dados = await res.json();
      setCurso(dados.curso);
      setRelatorio(dados.relatorio);
      setErro(null);
    } catch (err: any) {
      setErro(err?.message || "Erro de conexão com o servidor local.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleAbrirNovoComCategoria = (catId: string) => {
    setCategoriaPreSelecionada(catId);
    setModalNovoAberto(true);
  };

  const handleExcluirCertificado = async (id: string) => {
    const res = await fetch(`/api/certificados/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Erro ao remover certificado.");
      return;
    }
    await carregarDados();
  };

  const handleVisualizarAnexo = (storagePath: string, nomeOriginal: string) => {
    setVisualizadorAnexo({
      aberto: true,
      storagePath,
      nomeOriginal,
    });
  };

  if (carregando && !relatorio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold">Carregando painel de horas acadêmicas...</p>
      </div>
    );
  }

  if (erro && !relatorio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="p-6 bg-white border border-rose-200 rounded-2xl shadow-sm text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800 mb-1">Falha na Inicialização</h2>
          <p className="text-xs text-slate-500 mb-4">{erro}</p>
          <button
            onClick={carregarDados}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!curso || !relatorio) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Cabeçalho */}
      <Header
        curso={curso}
        relatorio={relatorio}
        onAbrirNovoCertificado={() => {
          setCategoriaPreSelecionada(undefined);
          setModalNovoAberto(true);
        }}
        onAbrirEditarPerfil={() => setModalPerfilAberto(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Painel de Métricas e Progresso */}
        <MetricCards relatorio={relatorio} />

        {/* Grade de Tetos Regimentais por Categoria */}
        <CategoriasGrid
          categorias={relatorio.categorias}
          onSelecionarCategoriaParaNovo={handleAbrirNovoComCategoria}
        />

        {/* Relação Analítica de Comprovantes */}
        <TabelaCertificados
          categorias={relatorio.categorias}
          onExcluirCertificado={handleExcluirCertificado}
          onVisualizarAnexo={handleVisualizarAnexo}
          onAdicionarPrimeiro={() => {
            setCategoriaPreSelecionada(undefined);
            setModalNovoAberto(true);
          }}
        />
      </main>

      {/* Rodapé Institucional */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>
          Organizador de Horas Complementares • Sistema para gestão, auditoria de tetos e geração de dossiês acadêmicos
        </p>
      </footer>

      {/* Modais */}
      <NovoCertificadoModal
        aberto={modalNovoAberto}
        categoriaPreSelecionada={categoriaPreSelecionada}
        categorias={relatorio.categorias}
        onFechar={() => setModalNovoAberto(false)}
        onSalvoComSucesso={carregarDados}
      />

      <EditarPerfilModal
        aberto={modalPerfilAberto}
        curso={curso}
        onFechar={() => setModalPerfilAberto(false)}
        onSalvoComSucesso={carregarDados}
      />

      <VisualizadorAnexoModal
        aberto={visualizadorAnexo.aberto}
        storagePath={visualizadorAnexo.storagePath}
        nomeOriginal={visualizadorAnexo.nomeOriginal}
        onFechar={() =>
          setVisualizadorAnexo({ aberto: false, storagePath: null, nomeOriginal: null })
        }
      />
    </div>
  );
}
