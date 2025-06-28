import React from 'react';
import { Zap, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const impulsoSteps = [
  {
    step: 'I',
    name: 'Identificar',
    description: 'Oportunidades de crescimento',
    status: 'completed',
    progress: 100
  },
  {
    step: 'M',
    name: 'Mapear',
    description: 'Jornada do paciente',
    status: 'completed',
    progress: 100
  },
  {
    step: 'P',
    name: 'Processar',
    description: 'Dados em tempo real',
    status: 'active',
    progress: 85
  },
  {
    step: 'U',
    name: 'Unificar',
    description: 'Canais de comunicação',
    status: 'active',
    progress: 92
  },
  {
    step: 'L',
    name: 'Liderar',
    description: 'Automação inteligente',
    status: 'active',
    progress: 78
  },
  {
    step: 'S',
    name: 'Sustentar',
    description: 'Crescimento contínuo',
    status: 'pending',
    progress: 45
  },
  {
    step: 'O',
    name: 'Otimizar',
    description: 'Performance constante',
    status: 'pending',
    progress: 30
  }
];

export default function ImpulsoMethod() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
          <Zap className="w-6 h-6" style={{ color: '#7E5EF2' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Método IMPULSO</h3>
          <p className="text-gray-600">Framework proprietário SevenScale em execução</p>
        </div>
      </div>

      <div className="space-y-4">
        {impulsoSteps.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                item.status === 'completed' ? 'bg-green-500' :
                item.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              style={
                item.status === 'completed' ? { backgroundColor: '#03A63C' } :
                item.status === 'active' ? { backgroundColor: '#0468BF' } : {}
              }
            >
              {item.status === 'completed' ? (
                <CheckCircle className="w-6 h-6" />
              ) : item.status === 'active' ? (
                <Clock className="w-6 h-6" />
              ) : (
                item.step
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <span className="text-sm font-medium" style={{ color: '#0468BF' }}>
                  {item.progress}%
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${item.progress}%`,
                    backgroundColor: item.status === 'completed' ? '#03A63C' : 
                                   item.status === 'active' ? '#0468BF' : '#9CA3AF'
                  }}
                />
              </div>
            </div>

            {index < impulsoSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#7E5EF210' }}>
        <p className="text-sm" style={{ color: '#7E5EF2' }}>
          <span className="font-semibold">Status Atual:</span> 4 de 7 etapas do método IMPULSO ativas. 
          Próxima otimização agendada para amanhã às 09:00.
        </p>
      </div>
    </div>
  );
}