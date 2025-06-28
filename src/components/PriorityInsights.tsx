import React from 'react';
import { Brain, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const insights = [
  {
    title: 'Horário 14h-16h: +35% agendamentos',
    description: 'Análise de 6 meses mostra pico de conversão neste período. Recomendamos ampliar disponibilidade.',
    impact: 'Alto Impacto',
    status: 'new',
    timestamp: '5 min atrás',
    color: '#F25835',
    action: 'Implementar'
  },
  {
    title: 'WhatsApp automatizado: -23% no-show',
    description: 'Sistema de lembretes implementado reduziu faltas significativamente.',
    impact: 'Implementado',
    status: 'implemented',
    timestamp: '2 dias atrás',
    color: '#03A63C',
    action: 'Monitorar'
  },
  {
    title: 'Campanha cardiologia: ROI potencial +67%',
    description: 'Segmentação específica para cardiologia mostra alta demanda não atendida.',
    impact: 'Médio Impacto',
    status: 'pending',
    timestamp: '1 hora atrás',
    color: '#0468BF',
    action: 'Avaliar'
  },
  {
    title: 'Follow-up automático: LTV +280%',
    description: 'Pacientes com follow-up automatizado têm valor de vida 280% maior.',
    impact: 'Alto Impacto',
    status: 'processing',
    timestamp: '30 min atrás',
    color: '#7E5EF2',
    action: 'Processar'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'implemented': return <CheckCircle className="w-4 h-4" style={{ color: '#03A63C' }} />;
    case 'processing': return <Clock className="w-4 h-4" style={{ color: '#7E5EF2' }} />;
    case 'new': return <AlertTriangle className="w-4 h-4" style={{ color: '#F25835' }} />;
    default: return <TrendingUp className="w-4 h-4" style={{ color: '#0468BF' }} />;
  }
};

export default function PriorityInsights() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
          <Brain className="w-6 h-6" style={{ color: '#7E5EF2' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Insights Priorizados</h3>
          <p className="text-gray-600">Recomendações baseadas em análise de IA</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            style={{ 
              borderColor: insight.color + '40',
              backgroundColor: insight.color + '08'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(insight.status)}
                <div>
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: insight.color + '20',
                    color: insight.color
                  }}
                >
                  {insight.impact}
                </span>
                <p className="text-gray-500 text-xs mt-1">{insight.timestamp}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Próxima ação: {insight.action}</span>
              <button 
                className="px-3 py-1 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: insight.color }}
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border" style={{ 
        backgroundColor: '#0468BF10', 
        borderColor: '#0468BF40' 
      }}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            <span className="font-semibold" style={{ color: '#0468BF' }}>Próxima Análise:</span> 
            Sistema processará novos dados em 2 horas
          </p>
          <button 
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#0468BF' }}
          >
            Agendar Reunião
          </button>
        </div>
      </div>
    </div>
  );
}