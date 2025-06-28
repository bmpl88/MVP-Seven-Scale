import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain } from 'lucide-react';

const agentsData = [
  { agent: 'Diagnosticador', performance: 92, fullName: 'Diagnosticador' },
  { agent: 'Arquiteto Clínico', performance: 85, fullName: 'Arquiteto Clínico' },
  { agent: 'Prototipador', performance: 88, fullName: 'Prototipador' },
  { agent: 'Implementador', performance: 90, fullName: 'Implementador' },
  { agent: 'Lapidador', performance: 84, fullName: 'Lapidador' },
  { agent: 'Sistematizador', performance: 86, fullName: 'Sistematizador' },
  { agent: 'Monitor', performance: 94, fullName: 'Monitor' }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{data.fullName}</p>
        <p style={{ color: '#2563eb' }}>
          <span className="font-medium">Performance: </span>
          {data.performance}/100
        </p>
      </div>
    );
  }
  return null;
};

export default function AgentsPerformanceRadar() {
  const averageScore = Math.round(agentsData.reduce((sum, agent) => sum + agent.performance, 0) / agentsData.length);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#2563eb20' }}>
          <Brain className="w-6 h-6" style={{ color: '#2563eb' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Performance dos 7 Agentes IA</h3>
          <p className="text-gray-600">Análise individual de cada agente especializado</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold" style={{ color: '#2563eb' }}>{averageScore}/100</p>
          <p className="text-gray-600 text-sm">Score Médio</p>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={agentsData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="agent" 
              tick={{ fontSize: 12, fill: '#374151' }}
              className="text-sm font-medium"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              tickCount={6}
            />
            <Radar
              name="Performance"
              dataKey="performance"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.2}
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
        {agentsData.map((agent, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ 
                backgroundColor: agent.performance >= 90 ? '#10b98120' : 
                                agent.performance >= 85 ? '#2563eb20' : '#f59e0b20',
                border: `2px solid ${agent.performance >= 90 ? '#10b981' : 
                                   agent.performance >= 85 ? '#2563eb' : '#f59e0b'}`
              }}
            >
              <span 
                className="text-sm font-bold"
                style={{ 
                  color: agent.performance >= 90 ? '#10b981' : 
                         agent.performance >= 85 ? '#2563eb' : '#f59e0b'
                }}
              >
                {agent.performance}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium">{agent.agent}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#2563eb10' }}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            <span className="font-semibold" style={{ color: '#2563eb' }}>Destaque:</span> 
            Monitor e Diagnosticador com performance superior a 90/100
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
              <span className="text-gray-600">Excelente (90+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2563eb' }} />
              <span className="text-gray-600">Ótimo (85-89)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <span className="text-gray-600">Bom (80-84)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}