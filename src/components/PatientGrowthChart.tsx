import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { month: 'Jan', patients: 45, label: 'Janeiro' },
  { month: 'Fev', patients: 47, label: 'Fevereiro' },
  { month: 'Mar', patients: 46, label: 'Março' },
  { month: 'Abr', patients: 48, label: 'Abril' },
  { month: 'Mai', patients: 52, label: 'Maio' },
  { month: 'Jun', patients: 58, label: 'Junho' },
  { month: 'Jul', patients: 65, label: 'Julho' },
  { month: 'Ago', patients: 70, label: 'Agosto' },
  { month: 'Set', patients: 74, label: 'Setembro' },
  { month: 'Out', patients: 76, label: 'Outubro' },
  { month: 'Nov', patients: 78, label: 'Novembro' },
  { month: 'Dez', patients: 78, label: 'Dezembro' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = data.find(d => d.month === label);
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{dataPoint?.label}</p>
        <p style={{ color: '#0468BF' }}>
          <span className="font-medium">Novos Pacientes: </span>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function PatientGrowthChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Crescimento de Pacientes</h3>
        <p className="text-gray-600">Evolução mensal de novos pacientes em 2024</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0468BF" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0468BF" stopOpacity={0}/>
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
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine 
              x="Mai" 
              stroke="#03A63C" 
              strokeDasharray="5 5"
              label={{ value: "Início SevenScale", position: "top", fill: "#03A63C", fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="patients" 
              stroke="#0468BF" 
              strokeWidth={3}
              dot={{ fill: '#0468BF', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0468BF', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#0468BF20' }}>
        <p className="text-sm" style={{ color: '#0468BF' }}>
          <span className="font-semibold">Marco Importante:</span> Implementação SevenScale em Maio resultou em crescimento consistente de 50% nos novos pacientes mensais.
        </p>
      </div>
    </div>
  );
}