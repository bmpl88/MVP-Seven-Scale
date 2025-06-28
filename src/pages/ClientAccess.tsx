import React from 'react';
import ConsolidatedHeader from '../components/ConsolidatedHeader';
import ConsolidatedMetrics from '../components/ConsolidatedMetrics';
import FinancialMetrics from '../components/FinancialMetrics';
import PrioritizedInsights from '../components/PrioritizedInsights';
import AgentsPerformanceRadar from '../components/AgentsPerformanceRadar';
import TemporalEvolutionChart from '../components/TemporalEvolutionChart';
import ProcessedDataIndicators from '../components/ProcessedDataIndicators';
import ActionCenter from '../components/ActionCenter';
import MedicalFunnelChart from '../components/MedicalFunnelChart';

export default function ClientAccess() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsolidatedHeader />
      
      <main className="p-8">
        {/* Consolidated Metrics */}
        <ConsolidatedMetrics />

        {/* Financial Metrics - NEW SECTION */}
        <FinancialMetrics />

        {/* Prioritized Insights */}
        <PrioritizedInsights />

        {/* Agents Performance Radar */}
        <AgentsPerformanceRadar />

        {/* Temporal Evolution Chart */}
        <TemporalEvolutionChart />

        {/* Processed Data Indicators */}
        <ProcessedDataIndicators />

        {/* Action Center */}
        <ActionCenter />

        {/* Medical Funnel Chart */}
        <MedicalFunnelChart />

        {/* Premium Value Banner */}
        <div 
          className="rounded-xl p-6 text-white mt-8"
          style={{ 
            background: 'linear-gradient(135deg, #7E5EF2 0%, #0468BF 100%)' 
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Plataforma SevenScale Premium</h3>
              <p className="text-blue-100 mb-4">
                7 agentes de IA trabalhando 24/7 para maximizar o crescimento da sua clínica
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Performance Score 87/100</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">ROI 380%</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">5 oportunidades ativas</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">R$ 285k</p>
              <p className="text-blue-200 text-sm">Receita adicional anual</p>
              <button className="mt-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Agendar Consultoria
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}