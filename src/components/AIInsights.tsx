import React from 'react';
import { Brain, Clock, MessageCircle, Calendar, TrendingUp } from 'lucide-react';

const insights = [
  {
    icon: Clock,
    title: 'Otimização de Horários',
    description: 'Horário 14h-16h tem 35% mais agendamentos. Sugerimos ampliar disponibilidade.',
    impact: 'Alto',
    color: '#7E5EF2'
  },
  {
    icon: TrendingUp,
    title: 'Consultas de Retorno',
    description: 'Consultas de retorno têm LTV 280% maior. Foque follow-up automático.',
    impact: 'Muito Alto',
    color: '#03A63C'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Automático',
    description: 'WhatsApp automatizado reduziu no-show em 23%. Implemente lembretes 2h antes.',
    impact: 'Alto',
    color: '#0468BF'
  },
  {
    icon: Calendar,
    title: 'Check-up Preventivo',
    description: 'Campanhas de check-up preventivo geram pacientes 40% mais fiéis.',
    impact: 'Médio',
    color: '#F25835'
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Muito Alto': return { color: '#03A63C', backgroundColor: '#03A63C20' };
    case 'Alto': return { color: '#0468BF', backgroundColor: '#0468BF20' };
    case 'Médio': return { color: '#F25835', backgroundColor: '#F2583520' };
    default: return { color: '#6b7280', backgroundColor: '#f3f4f6' };
  }
};

export default function AIInsights() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
          <Brain className="w-6 h-6" style={{ color: '#7E5EF2' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Insights Médicos</h3>
          <p className="text-gray-600">Recomendações inteligentes baseadas nos dados</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4" 
            style={{ 
              borderColor: insight.color + '40',
              backgroundColor: insight.color + '10'
            }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <insight.icon className="w-5 h-5" style={{ color: insight.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={getImpactColor(insight.impact)}
                  >
                    {insight.impact}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border" style={{ 
        backgroundColor: '#7E5EF210', 
        borderColor: '#7E5EF240' 
      }}>
        <p className="text-sm text-gray-700">
          <span className="font-semibold" style={{ color: '#7E5EF2' }}>Próximos Passos:</span> Nossa IA identificou 12 oportunidades adicionais de otimização. 
          Agende uma sessão de estratégia para implementar essas melhorias.
        </p>
      </div>
    </div>
  );
}