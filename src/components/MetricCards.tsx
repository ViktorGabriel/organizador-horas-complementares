"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Target, Award } from "lucide-react";
import { RelatorioAproveitamentoGeral } from "@/domain/entities/Certificado";

interface MetricCardsProps {
  relatorio: RelatorioAproveitamentoGeral;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ relatorio }) => {
  const percentual = relatorio.percentualGeral;
  const estaConcluido = relatorio.concluido;

  return (
    <div className="space-y-4">
      {/* Barra de Progresso Principal com Alerta Acadêmico */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${estaConcluido ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
              {estaConcluido ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Progresso de Integralização de Horas
              </h2>
              <p className="text-xs text-slate-500">
                {estaConcluido
                  ? "Parabéns! Você atingiu 100% da carga horária obrigatória para colação de grau."
                  : `Faltam ${relatorio.horasRestantes} horas válidas para atingir a meta exigida de ${relatorio.horasExigidasTotal}h.`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${estaConcluido ? "text-emerald-600" : "text-blue-600"}`}>
              {percentual}%
            </span>
            <span className="text-xs text-slate-400 block font-medium">concluído</span>
          </div>
        </div>

        {/* Barra de Progresso Visual */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              estaConcluido
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-600"
            }`}
            style={{ width: `${Math.min(100, Math.max(percentual, 2))}%` }}
          />
        </div>
      </div>

      {/* Grid de 4 Métricas Chave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Horas Válidas Aproveitadas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Horas Válidas
            </span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              {relatorio.horasAproveitadasTotal}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ {relatorio.horasExigidasTotal} horas</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Cômputo apto para a coordenação
          </p>
        </div>

        {/* Horas Restantes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Horas Restantes
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              {relatorio.horasRestantes}
            </span>
            <span className="text-xs text-slate-500 font-medium">horas</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {relatorio.horasRestantes === 0 ? "Meta 100% cumprida" : "Necessárias para se formar"}
          </p>
        </div>

        {/* Excedente Descartado por Teto */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Excedente Cortado
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              {relatorio.horasExcedentesTotal}
            </span>
            <span className="text-xs text-slate-500 font-medium">horas</span>
          </div>
          <p className="text-xs text-rose-600 font-medium mt-1">
            Ultrapassou tetos regimentais
          </p>
        </div>

        {/* Total de Atividades Cadastradas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Comprovantes
            </span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              {relatorio.categorias.reduce((acc, cat) => acc + cat.quantidadeCertificados, 0)}
            </span>
            <span className="text-xs text-slate-500 font-medium">atividades</span>
          </div>
          <p className="text-xs text-indigo-600 font-medium mt-1">
            Organizados e catalogados
          </p>
        </div>
      </div>
    </div>
  );
};
