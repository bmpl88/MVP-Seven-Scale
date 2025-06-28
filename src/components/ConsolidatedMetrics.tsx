import React from 'react';
import { Target, DollarSign, Users, TrendingUp } from 'lucide-react';

const metrics = [
  {
    title: 'Performance Score',
    value: '87/100',
    description: 'Resultado dos 7 agentes',
    change: '+12 pontos',
    changeType: 'positive' as const,
    icon: Target,
    color: '#7E5EF2'
  },
  {
    title: 'ROI Total',
    value: '+380%',
    description: 'Todas as fontes integradas',
    change: '+120%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: '#03A63C'
  },
  {
    title: 'Novos Pacientes',
    value: '78/mês',
    description: 'Crescimento consistente',
    change: '↑73%',
    changeType: 'positive' as const,
    icon: Users,
    color: '#0468BF'
  },
  {
    title: 'Oportunidades',
    value: '5 identificadas',
    description: 'Priorizadas por impacto',
    change: '3 novas',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: '#F25835'
  }
];

export default function ConsolidatedMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-gray-500 text-sm mb-3">{metric.description}</p>
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
        </div>
      ))}
    </div>
  );
}