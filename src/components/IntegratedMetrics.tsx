import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Activity } from 'lucide-react';

const metrics = [
  {
    title: 'Conversas Processadas',
    value: '450/mês',
    source: 'N8N Atendimento',
    change: '+23%',
    changeType: 'positive' as const,
    icon: Activity,
    color: '#7E5EF2'
  },
  {
    title: 'Leads Qualificados',
    value: '78',
    source: 'HubSpot CRM',
    change: '+45%',
    changeType: 'positive' as const,
    icon: Users,
    color: '#0468BF'
  },
  {
    title: 'Sessões Web',
    value: '12.5k/mês',
    source: 'Google Analytics',
    change: '+67%',
    changeType: 'positive' as const,
    icon: BarChart3,
    color: '#03A63C'
  },
  {
    title: 'ROI Campanhas',
    value: '380%',
    source: 'Meta Ads',
    change: '+120%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: '#F25835'
  },
  {
    title: 'Growth Score',
    value: '87/100',
    source: 'Supabase Analytics',
    change: '+12 pontos',
    changeType: 'positive' as const,
    icon: Target,
    color: '#7E5EF2'
  },
  {
    title: 'Taxa Comparecimento',
    value: '89%',
    source: 'WhatsApp Business',
    change: '+14%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: '#03A63C'
  }
];

export default function IntegratedMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-gray-500 text-xs mb-2">Fonte: {metric.source}</p>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                metric.changeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {metric.change}
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: metric.color + '20' }}>
              <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
            <span className="text-xs text-gray-500">Atualizado agora</span>
          </div>
        </div>
      ))}
    </div>
  );
}