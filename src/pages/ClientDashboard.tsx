import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  MessageSquare,
  Brain,
  Activity,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  RefreshCw,
  ArrowLeft,
  Download,
  Zap,
  Clock,
  PhoneCall,
  Eye
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Dados de exemplo para o cliente
const patientEvolutionData = [
  { month: 'Jan', novos: 45, retorno: 120, total: 165 },
  { month: 'Fev', novos: 52, retorno: 125, total: 177 },
  { month: 'Mar', novos: 48, retorno: 135, total: 183 },
  { month: 'Abr', novos: 58, retorno: 140, total: 198 },
  { month: 'Mai', novos: 65, retorno: 145, total: 210 },
  { month: 'Jun', novos: 72, retorno: 155, total: 227 }
];

const conversionFunnelData = [
  { stage: 'Visitantes Site', value: 1250, color: '#6B7280' },
  { stage: 'Leads Captados', value: 380, color: '#3B82F6' },
  { stage: 'Agendamentos', value: 145, color: '#8B5CF6' },
  { stage: 'Primeira Consulta', value: 98, color: '#10B981' },
  { stage: 'Pacientes Recorrentes', value: 76, color: '#F59E0B' }
];

const revenueBySourceData = [
  { name: 'Convênios', value: 125000, percentage: 45, color: '#0468BF' },
  { name: 'Particular', value: 97000, percentage: 35, color: '#03A63C' },
  { name: 'Telemedicina', value: 41600, percentage: 15, color: '#7E5EF2' },
  { name: 'Procedimentos', value: 13900, percentage: 5, color: '#F59E0B' }
];

const weeklyAppointmentsData = [
  { day: 'Seg', consultas: 18, meta: 20 },
  { day: 'Ter', consultas: 22, meta: 20 },
  { day: 'Qua', consultas: 24, meta: 20 },
  { day: 'Qui', consultas: 21, meta: 20 },
  { day: 'Sex', consultas: 19, meta: 20 },
  { day: 'Sáb', consultas: 8, meta: 10 }
];

export default function ClientDashboard() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);

  // Simular dados do cliente específico
  const clientData = {
    name: 'Dr. Silva - Cardiologia',
    specialty: 'Cardiologia',
    location: 'São Paulo - SP',
    activePatients: 227,
    monthlyRevenue: 277500,
    conversionRate: 7.8,
    roi: 312,
    nextAppointments: 42
  };

  // Insights GPT-4 simulados
  const aiInsights = [
    {
      id: 1,
      type: 'opportunity',
      priority: 'high',
      title: 'Oportunidade: Expandir Telemedicina',
      description: 'Análise detectou demanda reprimida de 40% para consultas online. Potencial de +R$ 45k/mês.',
      action: 'Implementar agenda dedicada para teleconsultas',
      impact: '+R$ 45.000/mês',
      confidence: 92
    },
    {
      id: 2,
      type: 'optimization',
      priority: 'medium',
      title: 'Otimização: Horários de Pico',
      description: 'Terças e quartas têm 95% ocupação. Segundas apenas 75%. Redistribuir agenda.',
      action: 'Oferecer desconto 10% para consultas segunda-feira',
      impact: '+15 consultas/mês',
      confidence: 88
    },
    {
      id: 3,
      type: 'alert',
      priority: 'high',
      title: 'Alerta: Taxa de No-Show Aumentando',
      description: 'No-show subiu de 8% para 14% no último mês. Implementar lembretes automatizados.',
      action: 'Ativar WhatsApp reminders 48h e 2h antes',
      impact: '-R$ 12.000 evitados',
      confidence: 95
    },
    {
      id: 4,
      type: 'growth',
      priority: 'medium',
      title: 'Crescimento: Programa de Referência',
      description: '68% dos novos pacientes vêm de indicações. Criar programa formal de referência.',
      action: 'Implementar programa de benefícios para indicações',
      impact: '+25 pacientes/mês',
      confidence: 85
    }
  ];

  // Status das integrações
  const integrationsStatus = [
    { name: 'Google Calendar', status: 'connected', lastSync: '2 min atrás', health: 100 },
    { name: 'WhatsApp Business', status: 'connected', lastSync: '5 min atrás', health: 98 },
    { name: 'Google Analytics', status: 'connected', lastSync: '10 min atrás', health: 100 },
    { name: 'Meta Ads', status: 'warning', lastSync: '2 horas atrás', health: 85 },
    { name: 'HubSpot CRM', status: 'connected', lastSync: '15 min atrás', health: 95 }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'optimization': return <Zap className="w-5 h-5 text-blue-600" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'growth': return <Target className="w-5 h-5 text-purple-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200';
      case 'optimization': return 'bg-blue-50 border-blue-200';
      case 'alert': return 'bg-amber-50 border-amber-200';
      case 'growth': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Cliente */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clientData.name}</h1>
              <p className="text-gray-600">Dashboard Individual - {clientData.location}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Exportar Relatório
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar Dados
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {/* KPIs Principais do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Pacientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{clientData.activePatients}</p>
                <p className="text-green-600 text-sm mt-1 font-medium">+12% este mês</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Faturamento/Mês</p>
                <p className="text-3xl font-bold text-gray-900">R$ 278k</p>
                <p className="text-green-600 text-sm mt-1 font-medium">+18% vs anterior</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Taxa Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{clientData.conversionRate}%</p>
                <p className="text-gray-500 text-sm mt-1">Leads → Pacientes</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">ROI SevenScale</p>
                <p className="text-3xl font-bold text-gray-900">+{clientData.roi}%</p>
                <p className="text-green-600 text-sm mt-1 font-medium">Top 10%</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Próx. 7 dias</p>
                <p className="text-3xl font-bold text-gray-900">{clientData.nextAppointments}</p>
                <p className="text-gray-500 text-sm mt-1">Agendamentos</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-100">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Insights IA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Insights IA - Agente Consolidador GPT-4</h3>
              <p className="text-gray-600 text-sm">Análise personalizada para sua clínica</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(insight.priority)}`}>
                    {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Impacto:</span>
                    <span className="font-medium text-gray-900">{insight.impact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{insight.confidence}%</span>
                  </div>
                </div>
                
                <button className="mt-3 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  {insight.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Evolução de Pacientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Evolução de Pacientes</h3>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patientEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="retorno" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="Pacientes Retorno"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="novos" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Novos Pacientes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funil de Conversão */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-100">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Funil de Conversão</h3>
            </div>

            <div className="space-y-3">
              {conversionFunnelData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(stage.value / conversionFunnelData[0].value) * 100}%`,
                          backgroundColor: stage.color
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[50px] text-right">
                      {stage.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Taxa de conversão total:</span> 6.1% (acima da média do setor)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Receita por Fonte */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100">
                <PieChart className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Receita por Fonte</h3>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={revenueBySourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {revenueBySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${(value as number / 1000).toFixed(0)}k`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {revenueBySourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-gray-700">{source.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Semanal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-100">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Ocupação Semanal</h3>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAppointmentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="consultas" fill="#FF7A00" name="Consultas" />
                  <Bar dataKey="meta" fill="#E5E7EB" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Taxa ocupação média:</span>
              <span className="font-bold text-green-600">89%</span>
            </div>
          </div>

          {/* Status Integrações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Integrações</h3>
            </div>

            <div className="space-y-3">
              {integrationsStatus.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      integration.status === 'connected' ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                      <p className="text-xs text-gray-500">{integration.lastSync}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      integration.health >= 95 ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {integration.health}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              Configurar Integrações
            </button>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border border-orange-300 hover:bg-orange-50 transition-colors">
              <PhoneCall className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Ligar Paciente</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border border-orange-300 hover:bg-orange-50 transition-colors">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Enviar WhatsApp</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border border-orange-300 hover:bg-orange-50 transition-colors">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Ver Agenda</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border border-orange-300 hover:bg-orange-50 transition-colors">
              <Eye className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Ver Relatórios</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}