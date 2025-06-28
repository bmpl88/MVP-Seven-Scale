import React from 'react';
import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { TrendingUp, ArrowRight } from 'lucide-react';

const beforeData = [
  { name: 'Interessados', value: 1000, percentage: 100, color: '#9CA3AF' },
  { name: 'Qualificados', value: 350, percentage: 35, color: '#9CA3AF' },
  { name: 'Agendamentos', value: 200, percentage: 20, color: '#9CA3AF' },
  { name: 'Consultas', value: 140, percentage: 14, color: '#9CA3AF' },
  { name: 'Recorrentes', value: 70, percentage: 7, color: '#9CA3AF' }
];

const afterData = [
  { name: 'Interessados', value: 1200, percentage: 100, color: '#0468BF', improvement: '+20%' },
  { name: 'Qualificados', value: 660, percentage: 55, color: '#0468BF', improvement: '+20%' },
  { name: 'Agendamentos', value: 360, percentage: 30, color: '#0468BF', improvement: '+10%' },
  { name: 'Consultas', value: 288, percentage: 24, color: '#0468BF', improvement: '+10%' },
  { name: 'Recorrentes', value: 173, percentage: 14.4, color: '#0468BF', improvement: '+7.4%' }
];

const improvements = [
  { stage: 'Interessados', before: 1000, after: 1200, growth: '+20%', color: '#03A63C' },
  { stage: 'Qualificados', before: 350, after: 660, growth: '+88%', color: '#03A63C' },
  { stage: 'Agendamentos', before: 200, after: 360, growth: '+80%', color: '#03A63C' },
  { stage: 'Consultas', before: 140, after: 288, growth: '+106%', color: '#03A63C' },
  { stage: 'Recorrentes', before: 70, after: 173, growth: '+147%', color: '#03A63C' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
        <p className="text-gray-700">
          <span className="font-medium">Volume: </span>
          {data.value.toLocaleString()}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Taxa: </span>
          {data.percentage}%
        </p>
        {data.improvement && (
          <p style={{ color: '#03A63C' }}>
            <span className="font-medium">Melhoria: </span>
            {data.improvement}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomLabel = (props: any) => {
  const { x, y, width, height, value, name, percentage } = props;
  return (
    <text 
      x={x + width / 2} 
      y={y + height / 2} 
      textAnchor="middle" 
      dominantBaseline="middle" 
      className="fill-white text-sm font-semibold"
    >
      <tspan x={x + width / 2} dy="-0.3em">{name}</tspan>
      <tspan x={x + width / 2} dy="1.2em">{value.toLocaleString()}</tspan>
      <tspan x={x + width / 2} dy="1.2em">({percentage}%)</tspan>
    </text>
  );
};

export default function MedicalFunnelChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#0468BF20' }}>
          <TrendingUp className="w-6 h-6" style={{ color: '#0468BF' }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Otimização do Funil de Pacientes</h3>
          <p className="text-gray-600">Resultado dos 7 Agentes IA - Comparativo Ago-Set vs Out-Jan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Funil ANTES */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            ANTES (Ago-Set)
          </h4>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  dataKey="value"
                  data={beforeData}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {beforeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList content={<CustomLabel />} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funil DEPOIS */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            DEPOIS (Out-Jan)
          </h4>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                  dataKey="value"
                  data={afterData}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationBegin={500}
                >
                  {afterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList content={<CustomLabel />} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Melhorias Detalhadas */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Melhorias por Etapa</h4>
        
        {improvements.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{item.stage}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Antes</p>
                  <p className="text-lg font-semibold text-gray-700">{item.before.toLocaleString()}</p>
                </div>
                <ArrowRight className="w-4 h-4" style={{ color: '#03A63C' }} />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Depois</p>
                  <p className="text-lg font-semibold" style={{ color: '#0468BF' }}>{item.after.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div 
                className="px-4 py-2 rounded-lg font-bold text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.growth}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo do Impacto */}
      <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#03A63C' }}>+147%</p>
            <p className="text-gray-700 font-medium">Pacientes Recorrentes</p>
            <p className="text-gray-600 text-sm">Maior impacto no LTV</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#03A63C' }}>+106%</p>
            <p className="text-gray-700 font-medium">Consultas Realizadas</p>
            <p className="text-gray-600 text-sm">Conversão otimizada</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#03A63C' }}>+88%</p>
            <p className="text-gray-700 font-medium">Leads Qualificados</p>
            <p className="text-gray-600 text-sm">Melhor segmentação</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm" style={{ color: '#03A63C' }}>
            <span className="font-semibold">Resultado SevenScale:</span> Os 7 agentes IA otimizaram cada etapa do funil, 
            resultando em 147% mais pacientes recorrentes e ROI 380% superior.
          </p>
        </div>
      </div>
    </div>
  );
}