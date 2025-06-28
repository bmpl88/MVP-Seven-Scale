import React from 'react';
import { Play, Calendar, FileDown, Settings, Clock } from 'lucide-react';

const actions = [
  {
    title: 'Implementações Pendentes',
    count: 2,
    description: 'Insights de alta prioridade aguardando ação',
    icon: Play,
    color: '#F25835',
    action: 'Revisar'
  },
  {
    title: 'Próximas Análises',
    count: 3,
    description: 'Análises agendadas para as próximas 24h',
    icon: Calendar,
    color: '#0468BF',
    action: 'Agendar'
  },
  {
    title: 'Relatórios Disponíveis',
    count: 5,
    description: 'Relatórios mensais prontos para download',
    icon: FileDown,
    color: '#03A63C',
    action: 'Download'
  },
  {
    title: 'Configurações',
    count: 1,
    description: 'Ajustes recomendados nos parâmetros',
    icon: Settings,
    color: '#7E5EF2',
    action: 'Configurar'
  }
];

const implementations = [
  {
    title: 'Ampliação horário 16-18h',
    status: 'Em andamento',
    progress: 65,
    eta: '2 dias'
  },
  {
    title: 'Campanha cardiologia',
    status: 'Planejamento',
    progress: 25,
    eta: '1 semana'
  },
  {
    title: 'Follow-up automático',
    status: 'Aguardando aprovação',
    progress: 10,
    eta: 'Pendente'
  }
];

export default function ActionCenter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Actions Available */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Disponíveis</h3>
        
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: action.color + '20' }}>
                  <action.icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: action.color }}
                    >
                      {action.count}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: action.color }}
              >
                {action.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Implementações em Andamento</h3>
        
        <div className="space-y-4">
          {implementations.map((impl, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{impl.title}</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{impl.eta}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{impl.status}</p>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${impl.progress}%`,
                      backgroundColor: impl.progress > 50 ? '#03A63C' : '#0468BF'
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{impl.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#7E5EF210' }}>
          <p className="text-sm" style={{ color: '#7E5EF2' }}>
            <span className="font-semibold">Próximo Check-in:</span> Reunião de acompanhamento agendada para sexta-feira às 14h.
          </p>
        </div>
      </div>
    </div>
  );
}