import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { month: 'Ago', roi: 180, pacientes: 32, performance: 45, label: 'Agosto' },
  { month: 'Set', roi: 220, pacientes: 38, performance: 58, label: 'Setembro' },
  { month: 'Out', roi: 280, pacientes: 45, performance: 67, label: 'Outubro' },
  { month: 'Nov', roi: 320, pacientes: 58, performance: 74, label: 'Novembro' },
  { month: 'Dez', roi: 360, pacientes: 68, performance: 82, label: 'Dezembro' },
  { month: 'Jan', roi: 380, pacientes: 78, performance: 87, label: 'Janeiro' },
  // Projeções
  { month: 'Fev', roi: 420, pacientes: 85, performance: 91, label: 'Fevereiro', projected: true },
  { month: 'Mar', roi: 450, pacientes: 92, performance: 94, label: 'Março', projected: true }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = data.find(d => d.month === label);
    const isProjected = dataPoint?.projected;
    
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">
          {dataPoint?.label} {isProjected && '(Projeção)'}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}: </span>
            {entry.dataKey === 'roi' ? `${entry.value}%` : 
             entry.dataKey === 'performance' ? `${entry.value}/100` : 
             entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TemporalEvolutionChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#0468BF20' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#0468BF' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Evolução das Métricas - Últimos 6 Meses</h3>
          <p className="text-gray-600">Crescimento consistente desde implementação dos 7 agentes</p>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="implementationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#03A63C" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#03A63C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Marco dos 7 Agentes */}
            <ReferenceLine 
              x="Out" 
              stroke="#03A63C" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: "7 Agentes Implementados", 
                position: "topLeft", 
                fill: "#03A63C", 
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
            
            {/* Área sombreada pós-implementação */}
            <ReferenceArea 
              x1="Out" 
              x2="Jan" 
              fill="#03A63C" 
              fillOpacity={0.05}
            />
            
            {/* Área de projeção */}
            <ReferenceArea 
              x1="Jan" 
              x2="Mar" 
              fill="#7E5EF2" 
              fillOpacity={0.05}
            />
            
            {/* Linha ROI */}
            <Line 
              type="monotone" 
              dataKey="roi" 
              stroke="#F25835" 
              strokeWidth={3}
              name="ROI (%)"
              dot={{ fill: '#F25835', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#F25835', strokeWidth: 2, fill: '#fff' }}
              strokeDasharray={(entry: any) => entry?.projected ? "5 5" : "0"}
            />
            
            {/* Linha Pacientes */}
            <Line 
              type="monotone" 
              dataKey="pacientes" 
              stroke="#0468BF" 
              strokeWidth={3}
              name="Pacientes/mês"
              dot={{ fill: '#0468BF', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0468BF', strokeWidth: 2, fill: '#fff' }}
              strokeDasharray={(entry: any) => entry?.projected ? "5 5" : "0"}
            />
            
            {/* Linha Performance */}
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#7E5EF2" 
              strokeWidth={3}
              name="Performance Score"
              dot={{ fill: '#7E5EF2', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#7E5EF2', strokeWidth: 2, fill: '#fff' }}
              strokeDasharray={(entry: any) => entry?.projected ? "5 5" : "0"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda e Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F2583510' }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F25835' }} />
          <div>
            <p className="font-semibold text-gray-900">ROI: 380%</p>
            <p className="text-gray-600 text-sm">+111% desde outubro</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#0468BF10' }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#0468BF' }} />
          <div>
            <p className="font-semibold text-gray-900">Pacientes: 78/mês</p>
            <p className="text-gray-600 text-sm">+73% desde outubro</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#7E5EF210' }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#7E5EF2' }} />
          <div>
            <p className="font-semibold text-gray-900">Performance: 87/100</p>
            <p className="text-gray-600 text-sm">+30 pontos desde outubro</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
        <p className="text-sm" style={{ color: '#03A63C' }}>
          <span className="font-semibold">Marco Importante:</span> Implementação dos 7 agentes em outubro resultou em crescimento exponencial. 
          Projeções indicam ROI de 450% até março.
        </p>
      </div>
    </div>
  );
}