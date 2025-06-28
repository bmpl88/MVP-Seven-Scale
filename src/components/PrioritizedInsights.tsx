import React from 'react';
import { AlertTriangle, Zap, FileText, Clock, CheckCircle } from 'lucide-react';

const insights = [
  {
    priority: 'ALTA PRIORIDADE',
    icon: AlertTriangle,
    color: '#F25835',
    items: [
      {
        title: 'Horário 16-18h: +35% potencial',
        description: 'Análise de 6 meses mostra alta demanda não atendida neste período',
        action: 'Implementar',
        status: 'new'
      },
      {
        title: 'Campanha cardiologia: ROI +67%',
        description: 'Segmentação específica mostra oportunidade de especialização',
        action: 'Implementar',
        status: 'new'
      }
    ]
  },
  {
    priority: 'MÉDIA PRIORIDADE',
    icon: Zap,
    color: '#0468BF',
    items: [
      {
        title: 'Follow-up automático: +28% retenção',
        description: 'Sistema de acompanhamento pós-consulta aumenta fidelização',
        action: 'Avaliar',
        status: 'processing'
      },
      {
        title: 'Landing page: +15% conversão',
        description: 'Otimização de página de agendamento online',
        action: 'Avaliar',
        status: 'processing'
      }
    ]
  },
  {
    priority: 'BAIXA PRIORIDADE',
    icon: FileText,
    color: '#03A63C',
    items: [
      {
        title: 'Telemedicina: +45% nova receita',
        description: 'Implementação de consultas online para casos específicos',
        action: 'Planejar',
        status: 'pending'
      },
      {
        title: 'Programa referência: +20% orgânico',
        description: 'Sistema de indicações entre pacientes satisfeitos',
        action: 'Planejar',
        status: 'pending'
      }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <AlertTriangle className="w-4 h-4" style={{ color: '#F25835' }} />;
    case 'processing': return <Clock className="w-4 h-4" style={{ color: '#0468BF' }} />;
    case 'implemented': return <CheckCircle className="w-4 h-4" style={{ color: '#03A63C' }} />;
    default: return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

export default function PrioritizedInsights() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Insights Priorizados</h3>
        <p className="text-gray-600">Oportunidades identificadas pelos 7 agentes IA</p>
      </div>

      <div className="space-y-6">
        {insights.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="flex items-center gap-3 mb-4">
              <section.icon className="w-5 h-5" style={{ color: section.color }} />
              <h4 className="font-bold text-gray-900">{section.priority}</h4>
            </div>
            
            <div className="space-y-3 ml-8">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="border rounded-lg p-4"
                  style={{ 
                    borderColor: section.color + '40',
                    backgroundColor: section.color + '08'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(item.status)}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">{item.title}</h5>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: section.color }}
                    >
                      {item.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}