import React from 'react';
import { Bot, Zap, CheckCircle, Clock, Activity } from 'lucide-react';

const agents = [
  {
    name: 'N8N Atendimento',
    status: 'active',
    metric: '450 conversas/mês',
    description: 'Processando leads automaticamente',
    color: '#7E5EF2',
    lastAction: '2 min atrás'
  },
  {
    name: 'HubSpot CRM',
    status: 'active',
    metric: '78 leads qualificados',
    description: 'Analisando pipeline de vendas',
    color: '#0468BF',
    lastAction: '5 min atrás'
  },
  {
    name: 'Google Analytics',
    status: 'active',
    metric: '12.5k sessões/mês',
    description: 'Monitorando comportamento web',
    color: '#03A63C',
    lastAction: '1 min atrás'
  },
  {
    name: 'Meta Ads',
    status: 'active',
    metric: 'ROI 380%',
    description: 'Otimizando campanhas publicitárias',
    color: '#F25835',
    lastAction: '3 min atrás'
  },
  {
    name: 'Supabase Analytics',
    status: 'active',
    metric: 'Growth Score 87/100',
    description: 'Calculando métricas de crescimento',
    color: '#7E5EF2',
    lastAction: '4 min atrás'
  },
  {
    name: 'WhatsApp Business',
    status: 'active',
    metric: '89% taxa comparecimento',
    description: 'Automatizando lembretes',
    color: '#03A63C',
    lastAction: '1 min atrás'
  },
  {
    name: 'Insights Generator',
    status: 'processing',
    metric: '12 insights gerados hoje',
    description: 'Analisando padrões de dados',
    color: '#0468BF',
    lastAction: 'Processando...'
  }
];

export default function AIAgentsStatus() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
            <Bot className="w-6 h-6" style={{ color: '#7E5EF2' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Agentes IA Trabalhando</h3>
            <p className="text-gray-600">7 agentes processando dados em tempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#03A63C20' }}>
          <Activity className="w-4 h-4" style={{ color: '#03A63C' }} />
          <span className="text-sm font-medium" style={{ color: '#03A63C' }}>Todos Ativos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            style={{ 
              borderColor: agent.color + '40',
              backgroundColor: agent.color + '08'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: agent.color + '20' }}>
                  <Zap className="w-4 h-4" style={{ color: agent.color }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{agent.name}</h4>
                </div>
              </div>
              {agent.status === 'active' ? (
                <CheckCircle className="w-4 h-4" style={{ color: '#03A63C' }} />
              ) : (
                <Clock className="w-4 h-4" style={{ color: '#F25835' }} />
              )}
            </div>
            
            <p className="text-lg font-bold mb-1" style={{ color: agent.color }}>{agent.metric}</p>
            <p className="text-gray-600 text-xs mb-2">{agent.description}</p>
            <p className="text-gray-500 text-xs">{agent.lastAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}