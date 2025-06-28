import React from 'react';
import { CheckCircle, Database } from 'lucide-react';

const dataProcessed = [
  { source: 'HubSpot', metric: '78 leads analisados', status: 'active' },
  { source: 'Meta Ads', metric: 'ROI 380% otimizado', status: 'active' },
  { source: 'Calendar', metric: '85% ocupação mapeada', status: 'active' },
  { source: 'N8N', metric: '12 automações ativas', status: 'active' },
  { source: 'ML Analytics', metric: '18 meses dados processados', status: 'active' }
];

export default function ProcessedDataIndicators() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
          <Database className="w-6 h-6" style={{ color: '#7E5EF2' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Dados Processados</h3>
          <p className="text-gray-600">Status das análises em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataProcessed.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
            <CheckCircle className="w-5 h-5" style={{ color: '#03A63C' }} />
            <div>
              <p className="font-semibold text-gray-900">{item.source}</p>
              <p className="text-gray-600 text-sm">{item.metric}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
        <p className="text-sm" style={{ color: '#03A63C' }}>
          <span className="font-semibold">Status:</span> Todos os sistemas operando normalmente. 
          Próxima análise completa em 4h 15min.
        </p>
      </div>
    </div>
  );
}