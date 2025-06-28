import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Users,
  DollarSign,
  Target,
  Bot,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Brain,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

// Sample data for analytics
const platformMetrics = {
  totalRevenue: 3247500,
  averageROI: 287,
  totalPatients: 847,
  aiPerformance: 94.2
};

const clientPerformanceData = [
  { name: 'Dr. Silva', performance: 87, revenue: 285000, patients: 78, roi: 245 },
  { name: 'CardioVida', performance: 92, revenue: 320000, patients: 95, roi: 312 },
  { name: 'Dermatologia Plus', performance: 89, revenue: 295000, patients: 82, roi: 298 },
  { name: 'Dr. Oliveira', performance: 84, revenue: 270000, patients: 65, roi: 234 },
  { name: 'OrtoLife', performance: 91, revenue: 310000, patients: 88, roi: 275 },
  { name: 'Pediatria Feliz', performance: 86, revenue: 265000, patients: 72, roi: 234 },
  { name: 'Dr. Costa', performance: 83, revenue: 245000, patients: 58, roi: 189 },
  { name: 'Clínica Visão', performance: 88, revenue: 280000, patients: 76, roi: 267 },
  { name: 'Dr. Lima', performance: 85, revenue: 275000, patients: 69, roi: 245 },
  { name: 'Neuro Center', performance: 90, revenue: 300000, patients: 85, roi: 289 },
  { name: 'Dr. Santos', performance: 76, revenue: 180000, patients: 45, roi: 156 },
  { name: 'OrthoMed', performance: 71, revenue: 165000, patients: 38, roi: 134 }
];

const revenueEvolutionData = [
  { month: 'Jan', cardio: 520000, derma: 485000, ortho: 445000, outros: 380000 },
  { month: 'Fev', cardio: 540000, derma: 495000, ortho: 455000, outros: 390000 },
  { month: 'Mar', cardio: 565000, derma: 510000, ortho: 470000, outros: 405000 },
  { month: 'Abr', cardio: 580000, derma: 525000, ortho: 485000, outros: 420000 },
  { month: 'Mai', cardio: 595000, derma: 540000, ortho: 500000, outros: 435000 },
  { month: 'Jun', cardio: 610000, derma: 555000, ortho: 515000, outros: 450000 }
];

// Lista ROI por Especialidade - Substituindo o gráfico
const roiEspecialidadeList = [
  { 
    especialidade: 'Cardiologia', 
    roi: 312, 
    clientes: 2, 
    receita: 'R$ 840k',
    color: '#ef4444',
    bgGradient: 'from-red-50 to-red-100',
    borderColor: 'border-red-200'
  },
  { 
    especialidade: 'Dermatologia', 
    roi: 298, 
    clientes: 1, 
    receita: 'R$ 295k',
    color: '#f97316',
    bgGradient: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-200'
  },
  { 
    especialidade: 'Oftalmologia', 
    roi: 288, 
    clientes: 1, 
    receita: 'R$ 280k',
    color: '#eab308',
    bgGradient: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-200'
  },
  { 
    especialidade: 'Ortopedia', 
    roi: 275, 
    clientes: 2, 
    receita: 'R$ 475k',
    color: '#22c55e',
    bgGradient: 'from-green-50 to-green-100',
    borderColor: 'border-green-200'
  },
  { 
    especialidade: 'Urologia', 
    roi: 275, 
    clientes: 1, 
    receita: 'R$ 275k',
    color: '#06b6d4',
    bgGradient: 'from-cyan-50 to-cyan-100',
    borderColor: 'border-cyan-200'
  },
  { 
    especialidade: 'Endocrinologia', 
    roi: 270, 
    clientes: 1, 
    receita: 'R$ 270k',
    color: '#3b82f6',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200'
  },
  { 
    especialidade: 'Clínica Geral', 
    roi: 245, 
    clientes: 2, 
    receita: 'R$ 530k',
    color: '#8b5cf6',
    bgGradient: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200'
  },
  { 
    especialidade: 'Pediatria', 
    roi: 234, 
    clientes: 2, 
    receita: 'R$ 345k',
    color: '#ec4899',
    bgGradient: 'from-pink-50 to-pink-100',
    borderColor: 'border-pink-200'
  }
];

const consolidatedFunnelData = [
  { name: 'Leads Totais', value: 12456, percentage: 100, color: '#6B7280' },
  { name: 'Leads Qualificados', value: 4789, percentage: 38.4, color: '#0468BF' },
  { name: 'Agendamentos', value: 2345, percentage: 18.8, color: '#7E5EF2' },
  { name: 'Consultas Realizadas', value: 1987, percentage: 15.9, color: '#03A63C' },
  { name: 'Pacientes Recorrentes', value: 1234, percentage: 9.9, color: '#F59E0B' }
];

const agentsPerformanceData = [
  { agent: 'Diagnosticador', performance: 97, executions: 567, avgTime: 23, status: 'excellent' },
  { agent: 'Arquiteto Clínico', performance: 89, executions: 234, avgTime: 45, status: 'good' },
  { agent: 'Prototipador', performance: 92, executions: 189, avgTime: 67, status: 'excellent' },
  { agent: 'Implementador', performance: 85, executions: 123, avgTime: 89, status: 'good' },
  { agent: 'Lapidador', performance: 94, executions: 345, avgTime: 34, status: 'excellent' },
  { agent: 'Sistematizador', performance: 88, executions: 167, avgTime: 56, status: 'good' },
  { agent: 'Monitor', performance: 96, executions: 999, avgTime: 5, status: 'excellent' }
];

const integrationStatusData = [
  { name: 'HubSpot', clients: '12/12', uptime: 99.8, contacts: 47239, status: 'excellent' },
  { name: 'RD Station', clients: '8/12', uptime: 99.4, contacts: 23456, status: 'good' },
  { name: 'Google Calendar', clients: '12/12', uptime: 100, contacts: 1987, status: 'excellent' },
  { name: 'Google Analytics', clients: '10/12', uptime: 99.6, contacts: 234000, status: 'good' },
  { name: 'Meta Ads', clients: '12/12', uptime: 99.1, contacts: 189000, status: 'good' }
];

const revenueBySegmentData = [
  { name: 'Cardiologia', value: 1100000, percentage: 34, color: '#0468BF' },
  { name: 'Dermatologia', value: 910000, percentage: 28, color: '#03A63C' },
  { name: 'Ortopedia', value: 645000, percentage: 20, color: '#7E5EF2' },
  { name: 'Clínica Geral', value: 380000, percentage: 12, color: '#F59E0B' },
  { name: 'Outros', value: 212000, percentage: 6, color: '#F25835' }
];

const alertsData = [
  { type: 'critical', client: 'Dr. Santos', message: 'Performance abaixo de 80%', action: 'Atenção necessária' },
  { type: 'critical', client: 'OrthoMed', message: 'ROI estagnado há 2 meses', action: 'Revisar estratégia' },
  { type: 'warning', client: '3 clientes', message: 'Integrações instáveis', action: 'Verificar conexões' },
  { type: 'warning', client: 'Meta Ads', message: 'CPC aumentou 15%', action: 'Revisar campanhas' }
];

const opportunitiesData = [
  { client: 'CardioVida', opportunity: 'Potencial aumento 40% em telemedicina', impact: 'Alto' },
  { client: 'Dermatologia Plus', opportunity: 'Expandir horários → +R$ 45k/mês', impact: 'Alto' },
  { client: '5 clientes', opportunity: 'Prontos para upsell plano Enterprise', impact: 'Muito Alto' },
  { client: 'Novo nicho', opportunity: 'Oftalmologia (3 prospects)', impact: 'Médio' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}: </span>
            {entry.dataKey === 'revenue' || entry.dataKey.includes('cardio') || entry.dataKey.includes('derma') || entry.dataKey.includes('ortho') || entry.dataKey.includes('outros') 
              ? `R$ ${(entry.value / 1000).toFixed(0)}k` 
              : entry.dataKey === 'roi' ? `${entry.value}%`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return '#03A63C';
    case 'good': return '#0468BF';
    case 'warning': return '#F59E0B';
    case 'critical': return '#EF4444';
    default: return '#6B7280';
  }
};

const getAlertStyle = (type: string) => {
  switch (type) {
    case 'critical': return { bg: '#EF444410', border: '#EF444440', text: '#EF4444' };
    case 'warning': return { bg: '#F59E0B10', border: '#F59E0B40', text: '#F59E0B' };
    default: return { bg: '#0468BF10', border: '#0468BF40', text: '#0468BF' };
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Muito Alto': return { color: '#03A63C', bg: '#03A63C20' };
    case 'Alto': return { color: '#0468BF', bg: '#0468BF20' };
    case 'Médio': return { color: '#F59E0B', bg: '#F59E0B20' };
    default: return { color: '#6B7280', bg: '#6B728020' };
  }
};

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6 meses');
  const [selectedSpecialties, setSelectedSpecialties] = useState(['Todas']);
  const [selectedClients, setSelectedClients] = useState(['Todos']);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Business Intelligence</h1>
            <p className="text-gray-600">Dashboard executivo consolidado da plataforma SevenScale</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#0468BF' }}>
              <Download className="w-4 h-4" />
              Gerar Relatório
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <FileText className="w-4 h-4" />
              Exportar Dados
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filtros Avançados
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              Comparar Períodos
            </button>
          </div>
        </div>

        {/* KPIs Executivos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">📊 Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
                <p className="text-gray-500 text-sm mb-3">10 operacionais, 2 atenção</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Estável
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#0468BF20' }}>
                <Users className="w-6 h-6" style={{ color: '#0468BF' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">💰 Receita Total Mensal</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">R$ 3.2M</p>
                <p className="text-gray-500 text-sm mb-3">+23.4% vs mês anterior</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  +23.4%
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#03A63C' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">📈 ROI Médio SevenScale</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">+287%</p>
                <p className="text-gray-500 text-sm mb-3">Faixa: 189% - 380%</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Meta superada
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#7E5EF2' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">🎯 Pacientes Ativos/Mês</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">847</p>
                <p className="text-gray-500 text-sm mb-3">+18.7% vs mês anterior</p>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  +18.7%
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F2583520' }}>
                <Target className="w-6 h-6" style={{ color: '#F25835' }} />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {/* Performance por Cliente - Radar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#0468BF20' }}>
              <BarChart3 className="w-6 h-6" style={{ color: '#0468BF' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Performance por Cliente</h3>
              <p className="text-gray-600">Análise comparativa dos 12 clientes médicos</p>
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={clientPerformanceData.slice(0, 8)} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="name" 
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
                  stroke="#0468BF"
                  fill="#0468BF"
                  fillOpacity={0.2}
                  strokeWidth={3}
                  dot={{ fill: '#0468BF', strokeWidth: 2, r: 4 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {clientPerformanceData.slice(0, 4).map((client, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ 
                    backgroundColor: client.performance >= 90 ? '#10b98120' : 
                                    client.performance >= 85 ? '#0468BF20' : '#f59e0b20',
                    border: `2px solid ${client.performance >= 90 ? '#10b981' : 
                                       client.performance >= 85 ? '#0468BF' : '#f59e0b'}`
                  }}
                >
                  <span 
                    className="text-sm font-bold"
                    style={{ 
                      color: client.performance >= 90 ? '#10b981' : 
                             client.performance >= 85 ? '#0468BF' : '#f59e0b'
                    }}
                  >
                    {client.performance}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">{client.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução Receita Temporal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#03A63C' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Evolução Receita por Especialidade</h3>
              <p className="text-gray-600">Últimos 6 meses - Crescimento consolidado</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueEvolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                
                <Line 
                  type="monotone" 
                  dataKey="cardio" 
                  stroke="#0468BF" 
                  strokeWidth={3}
                  name="Cardiologia"
                  dot={{ fill: '#0468BF', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="derma" 
                  stroke="#03A63C" 
                  strokeWidth={3}
                  name="Dermatologia"
                  dot={{ fill: '#03A63C', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ortho" 
                  stroke="#7E5EF2" 
                  strokeWidth={3}
                  name="Ortopedia"
                  dot={{ fill: '#7E5EF2', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="outros" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="Outros"
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* ROI por Especialidade - LISTA ELEGANTE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
                <Target className="w-6 h-6" style={{ color: '#7E5EF2' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">ROI por Especialidade Médica</h3>
                <p className="text-gray-600">Performance comparativa do ROI SevenScale por área médica</p>
              </div>
            </div>

            <div className="space-y-3">
              {roiEspecialidadeList.map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 bg-gradient-to-r ${item.bgGradient} ${item.borderColor} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.especialidade}</h4>
                      <p className="text-gray-600 text-sm">{item.clientes} cliente{item.clientes > 1 ? 's' : ''} ativo{item.clientes > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p 
                      className="text-2xl font-bold"
                      style={{ color: item.color }}
                    >
                      {item.roi}%
                    </p>
                    <p className="text-gray-600 text-sm font-medium">{item.receita}/mês</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-sm text-gray-600 border-t border-gray-200 pt-4">
              <span>💡 <span className="font-medium">Melhor:</span> Cardiologia (312%)</span>
              <span>📊 <span className="font-medium">Média geral:</span> 274%</span>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Insights Detectados:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cardiologia lidera com 312% ROI médio</li>
                <li>• Especialidades cirúrgicas performam +15% acima da média</li>
                <li>• Pediatria tem potencial de otimização (+40% possível)</li>
                <li>• 8 especialidades acima de 250% ROI</li>
              </ul>
            </div>
          </div>

          {/* Funil Consolidado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#F2583520' }}>
                <Activity className="w-6 h-6" style={{ color: '#F25835' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Funil Consolidado Conversão</h3>
                <p className="text-gray-600">Todos os clientes - Performance geral</p>
              </div>
            </div>

            <div className="space-y-4">
              {consolidatedFunnelData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-gray-900">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${stage.percentage}%`,
                          backgroundColor: stage.color
                        }}
                      />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-gray-900">{stage.value.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm">{stage.percentage}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
              <p className="text-sm" style={{ color: '#03A63C' }}>
                <span className="font-semibold">Taxa conversão geral:</span> 9.9% (leads → pacientes recorrentes)
              </p>
            </div>
          </div>
        </div>

        {/* Análise por Agentes IA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#7E5EF220' }}>
              <Bot className="w-6 h-6" style={{ color: '#7E5EF2' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Performance dos 7 Agentes IA</h3>
              <p className="text-gray-600">Análise detalhada de cada agente especializado</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Agente</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Performance</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Execuções/Mês</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Tempo Médio</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {agentsPerformanceData.map((agent, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">
                          {agent.agent === 'Diagnosticador' ? '🔍' :
                           agent.agent === 'Arquiteto Clínico' ? '🗺️' :
                           agent.agent === 'Prototipador' ? '⚡' :
                           agent.agent === 'Implementador' ? '🏗️' :
                           agent.agent === 'Lapidador' ? '💎' :
                           agent.agent === 'Sistematizador' ? '⚙️' : '🎯'}
                        </div>
                        <span className="font-medium text-gray-900">{agent.agent}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span 
                        className="font-bold text-lg"
                        style={{ color: getStatusColor(agent.status) }}
                      >
                        {agent.performance}/100
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-900">{agent.executions}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-900">{agent.avgTime}min</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: getStatusColor(agent.status) + '20',
                          color: getStatusColor(agent.status)
                        }}
                      >
                        {agent.status === 'excellent' ? 'Excelente' : 'Bom'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#7E5EF210' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold" style={{ color: '#7E5EF2' }}>💡 Top Insights desta semana:</p>
                <p className="text-gray-700">• DIAGNOSTICADOR identificou gargalo comum em 67% das clínicas</p>
              </div>
              <div>
                <p className="text-gray-700">• LAPIDADOR otimizou ROI médio em +23% através de ML</p>
                <p className="text-gray-700">• MONITOR detectou 34 oportunidades automáticas</p>
              </div>
              <div>
                <p className="text-gray-700">• ARQUITETO criou 12 novos fluxos especializados</p>
                <p className="text-gray-700">• Performance média: 94.2/100 (excelente)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integrações & Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#0468BF20' }}>
              <Database className="w-6 h-6" style={{ color: '#0468BF' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Status Integrações Consolidado</h3>
              <p className="text-gray-600">Performance e métricas de todas as integrações</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {integrationStatusData.map((integration, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(integration.status) }}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clientes:</span>
                    <span className="font-medium">{integration.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium">{integration.uptime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dados:</span>
                    <span className="font-medium">{integration.contacts.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg bg-gray-50">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">45.678</p>
              <p className="text-gray-600 text-sm">Sincronizações hoje</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">156ms</p>
              <p className="text-gray-600 text-sm">Latência média</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">99.4%</p>
              <p className="text-gray-600 text-sm">Success rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">2.1 GB</p>
              <p className="text-gray-600 text-sm">Data processados</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Análise Financeira */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#03A63C' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Receita por Segmento</h3>
                <p className="text-gray-600">Distribuição por especialidade médica</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={revenueBySegmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                  >
                    {revenueBySegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${(value as number / 1000).toFixed(0)}k`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold" style={{ color: '#03A63C' }}>💰 Investimento Total Clientes:</p>
                  <p className="text-gray-700">R$ 312k/mês</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#03A63C' }}>📈 Receita Adicional Gerada:</p>
                  <p className="text-gray-700">R$ 2.1M/mês</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#03A63C' }}>🎯 ROI Líquido SevenScale:</p>
                  <p className="text-gray-700">+673%</p>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#03A63C' }}>💡 Payback médio:</p>
                  <p className="text-gray-700">45 dias</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas e Oportunidades */}
          <div className="space-y-6">
            {/* Alertas Críticos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#EF444420' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: '#EF4444' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Alertas Críticos</h3>
                  <p className="text-gray-600 text-sm">Situações que requerem atenção</p>
                </div>
              </div>

              <div className="space-y-3">
                {alertsData.map((alert, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: getAlertStyle(alert.type).bg,
                      borderColor: getAlertStyle(alert.type).border
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{alert.client}</p>
                        <p className="text-gray-700 text-sm">{alert.message}</p>
                      </div>
                      <button 
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getAlertStyle(alert.type).text }}
                      >
                        {alert.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades Detectadas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
                  <Target className="w-6 h-6" style={{ color: '#03A63C' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Oportunidades Detectadas</h3>
                  <p className="text-gray-600 text-sm">Potencial de crescimento identificado</p>
                </div>
              </div>

              <div className="space-y-3">
                {opportunitiesData.map((opportunity, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{opportunity.client}</p>
                        <p className="text-gray-700 text-sm">{opportunity.opportunity}</p>
                      </div>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={getImpactColor(opportunity.impact)}
                      >
                        {opportunity.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Direita - Filtros e Controles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Filtros e Controles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filtros Avançados */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">📅 Período</h4>
              <div className="space-y-2">
                {['Últimos 30 dias', '90 dias', '6 meses', '12 meses', 'Personalizado'].map((period, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="period"
                      value={period}
                      checked={selectedPeriod === period}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{period}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exports Disponíveis */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">📊 Exports Disponíveis</h4>
              <div className="space-y-2">
                {[
                  'Relatório Executivo (PDF)',
                  'Dados Analíticos (Excel)',
                  'Performance Agentes (CSV)',
                  'Análise Financeira (PDF)',
                  'Action Items (PDF)'
                ].map((exportType, index) => (
                  <button 
                    key={index}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    {exportType}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparação Temporal */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">📈 Comparação Temporal</h4>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Mês anterior</option>
                  <option>Mesmo período ano passado</option>
                  <option>Baseline pré-SevenScale</option>
                </select>
                
                <div className="space-y-2">
                  {['Receita', 'ROI', 'Conversões', 'Performance'].map((metric, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>🔄 Atualização automática a cada 5min</p>
                <p>📊 Última atualização: há 2 minutos</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#0468BF' }}>
                <RefreshCw className="w-4 h-4" />
                Atualizar Dados
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}