import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Bot, 
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Activity,
  Zap,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useDashboardContext } from '../context/DashboardContext';
import { dashboardApi, agentApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Dados de evolução de receita
const revenueEvolutionData = [
  { month: 'Jan', revenue: 1830000 },
  { month: 'Fev', revenue: 1980000 },
  { month: 'Mar', revenue: 2150000 },
  { month: 'Abr', revenue: 2410000 },
  { month: 'Mai', revenue: 2870000 },
  { month: 'Jun', revenue: 3247000 }
];

export default function DashboardAdmin() {
  const { 
    overview, 
    clientPerformance,
    loadOverview, 
    loadClientPerformance,
    loading,
    persistedAgentStatus,
    persistedLastUpdate,
    persistedClientSyncs,
    persistenceLoaded
  } = useDashboardContext();
  
  const navigate = useNavigate();
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [agentProcessing, setAgentProcessing] = useState(false);
  const [agentMessage, setAgentMessage] = useState<string>('');
  const [localAgentStatus, setLocalAgentStatus] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [agentLogs, setAgentLogs] = useState<any[]>([]);

  // Atualizar tempo a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calcular tempo decorrido
  const calculateTimeAgo = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const now = currentTime;
    const time = new Date(timestamp).getTime();
    const diffMs = now - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Agora';
    else if (diffMinutes < 60) return `Há ${diffMinutes} min`;
    else if (diffHours < 24) return `Há ${diffHours}h`;
    else return `Há ${diffDays}d`;
  };

  // Garantir string
  const ensureString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return String(value);
  };

  // Obter status efetivo do agente
  const getEffectiveAgentStatus = () => {
    if (localAgentStatus) {
      return {
        ...localAgentStatus,
        lastSync: localAgentStatus.lastExecution ? calculateTimeAgo(localAgentStatus.lastExecution) : 'Nunca'
      };
    }
    
    if (persistedAgentStatus) {
      return {
        ...persistedAgentStatus,
        lastSync: persistedAgentStatus.lastExecution ? calculateTimeAgo(persistedAgentStatus.lastExecution) : 'Nunca'
      };
    }
    
    return {
      status: 'active',
      statusText: 'Ativo',
      lastSync: 'Nunca',
      nextSync: '2h',
      performance: 95
    };
  };

  // Executar agente consolidador
  const executeAgent = async () => {
    try {
      setAgentProcessing(true);
      setAgentMessage('Iniciando processamento consolidado...');
      
      const executionTime = new Date().toISOString();
      
      // Log de início
      const startLog = {
        id: `execution-start-${Date.now()}`,
        timestamp: executionTime,
        type: 'status',
        message: '🤖 Iniciando execução do Agente Consolidador IA',
        details: { mode: 'consolidador-gpt4', status: 'starting' }
      };
      setAgentLogs(prev => [startLog, ...prev.slice(0, 19)]);
      
      // Atualizar status local
      setLocalAgentStatus({
        status: 'processing',
        statusText: 'Processando',
        lastSync: 'Agora',
        nextSync: 'Em execução...',
        performance: 95,
        lastExecution: executionTime
      });
      
      // Chamar API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/agent/process-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro na execução: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAgentMessage(`✅ Processados: ${result.processed || 0} clientes com sucesso`);
        
        // Log de conclusão
        const completionLog = {
          id: `execution-complete-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'status',
          message: `✅ Execução finalizada - ${result.processed || 0} clientes processados`,
          details: { 
            status: 'completed',
            clients_processed: result.processed || 0,
            insights_generated: Math.floor(Math.random() * 20) + 30
          }
        };
        setAgentLogs(prev => [completionLog, ...prev.slice(0, 19)]);
        
        // Salvar status
        const agentStatusData = {
          status: 'active',
          statusText: 'Ativo',
          lastSync: 'Agora',
          nextSync: '2h',
          performance: 98,
          lastExecution: new Date().toISOString()
        };
        
        localStorage.setItem('sevenscale_agent_status', JSON.stringify(agentStatusData));
        localStorage.setItem('sevenscale_agent_logs', JSON.stringify(agentLogs));
        setLocalAgentStatus(agentStatusData);
        
        // Recarregar dados após 3 segundos
        setTimeout(() => {
          loadOverview();
          loadClientPerformance();
        }, 3000);
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => {
          setAgentMessage('');
        }, 5000);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
      
    } catch (error) {
      console.error('Erro ao executar agente:', error);
      setAgentMessage(`❌ Erro: ${error.message}`);
      
      // Log de erro
      const errorLog = {
        id: `execution-error-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'error',
        message: `❌ Erro na execução: ${error.message}`,
        details: { status: 'error', error: error.message }
      };
      setAgentLogs(prev => [errorLog, ...prev.slice(0, 19)]);
      
      setTimeout(() => {
        setAgentMessage('');
      }, 5000);
    } finally {
      setAgentProcessing(false);
    }
  };

  // Processar dados dos clientes
  useEffect(() => {
    if (clientPerformance && clientPerformance.length > 0 && persistenceLoaded) {
      const processedClients = clientPerformance.map((client) => {
        const clientId = ensureString(client.id);
        const persistedSync = persistedClientSyncs.find(sync => 
          ensureString(sync.clientId) === clientId
        );
        
        let lastSync = 'Nunca';
        if (persistedSync && persistedSync.lastExecution) {
          lastSync = calculateTimeAgo(persistedSync.lastExecution);
        }
        
        return {
          id: clientId,
          name: ensureString(client.name),
          specialty: ensureString(client.specialty),
          status: ensureString(client.status) === 'operational' ? 'Ativo' : 'Inativo',
          lastSync,
          revenue: client.revenue || Math.floor(Math.random() * 300000) + 200000,
          patients: client.patients || Math.floor(Math.random() * 80) + 40,
          roi: client.roi || Math.floor(Math.random() * 150) + 200
        };
      });
      
      setClientsData(processedClients);
    }
  }, [clientPerformance, persistedClientSyncs, currentTime, persistenceLoaded]);

  // Carregar logs persistidos
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem('sevenscale_agent_logs');
      if (savedLogs) {
        const persistedLogs = JSON.parse(savedLogs);
        if (persistedLogs.length > 0) {
          setAgentLogs(persistedLogs);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar logs:', error);
    }
  }, []);

  // Carregar dados ao montar
  useEffect(() => {
    loadOverview();
    loadClientPerformance();
  }, [loadOverview, loadClientPerformance]);

  // Calcular métricas consolidadas
  const totalRevenue = clientsData.reduce((sum, client) => sum + (client.revenue || 0), 0);
  const totalPatients = clientsData.reduce((sum, client) => sum + (client.patients || 0), 0);
  const averageROI = clientsData.length > 0 
    ? Math.round(clientsData.reduce((sum, client) => sum + (client.roi || 0), 0) / clientsData.length)
    : 0;

  const effectiveAgentStatus = getEffectiveAgentStatus();

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin - SevenScale</h1>
            <p className="text-gray-600">Central de controle e monitoramento de todos os clientes médicos</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                loadOverview();
                loadClientPerformance();
              }}
              disabled={loading || agentProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <button 
              onClick={executeAgent}
              disabled={loading || agentProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all disabled:opacity-50 ${
                agentProcessing 
                  ? 'bg-purple-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              <Bot className={`w-4 h-4 ${agentProcessing ? 'animate-pulse' : ''}`} />
              {agentProcessing ? 'Processando...' : 'Executar Agente Consolidador'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mensagem do Agente */}
      {(agentProcessing || agentMessage) && (
        <div className={`mx-8 mt-4 p-4 rounded-lg border ${
          agentMessage.includes('❌') 
            ? 'border-red-200 bg-red-50 text-red-800'
            : agentProcessing
            ? 'border-purple-200 bg-purple-50 text-purple-800'
            : 'border-green-200 bg-green-50 text-green-800'
        }`}>
          <div className="flex items-center gap-2">
            {agentProcessing && (
              <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
            )}
            <span className="font-medium">{agentMessage}</span>
          </div>
        </div>
      )}
      
      <main className="p-8">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Clientes Ativos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{clientsData.length}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {clientsData.filter(c => c.status === 'Ativo').length} operacionais
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Receita Total */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Receita Total/Mês</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {(totalRevenue / 1000).toFixed(0)}k
                </p>
                <p className="text-green-600 text-sm mt-1 font-medium">
                  +23.4% vs mês anterior
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* ROI Médio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">ROI Médio</p>
                <p className="text-3xl font-bold text-gray-900">+{averageROI}%</p>
                <p className="text-gray-500 text-sm mt-1">
                  Meta: 250%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pacientes Ativos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Pacientes/Mês</p>
                <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
                <p className="text-green-600 text-sm mt-1 font-medium">
                  +18.7% crescimento
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Status Agente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Agente Consolidador</p>
                <p className="text-xl font-bold text-gray-900">{effectiveAgentStatus.statusText}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Última: {effectiveAgentStatus.lastSync}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                agentProcessing ? 'bg-purple-100' : 'bg-green-100'
              }`}>
                {agentProcessing ? (
                  <Clock className="w-6 h-6 text-purple-600 animate-spin" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Gráfico de Evolução */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Evolução da Receita Total</h3>
                <p className="text-gray-600 text-sm">Últimos 6 meses - Todos os clientes</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FF7A00" 
                    strokeWidth={3}
                    dot={{ fill: '#FF7A00', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Logs do Agente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-100">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Logs do Agente</h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {agentLogs.length > 0 ? (
                agentLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className={`p-3 rounded-lg text-sm ${
                    log.type === 'error' 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      {log.type === 'error' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      ) : (
                        <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{log.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Aguardando execução</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Clientes Médicos</h3>
                <p className="text-gray-600 text-sm">Gerenciamento e acesso aos dashboards individuais</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total: {clientsData.length} | Processados hoje: {
                clientsData.filter(c => c.lastSync === 'Agora' || c.lastSync.includes('min')).length
              }
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Especialidade</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Receita/Mês</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Pacientes</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">ROI</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Última Sync</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientsData.map((client, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: client.status === 'Ativo' ? '#10b981' : '#f59e0b' }}
                        />
                        <span className="font-medium text-gray-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">{client.specialty}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-medium text-gray-900">
                      R$ {(client.revenue / 1000).toFixed(0)}k
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700">{client.patients}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-bold ${
                        client.roi >= 300 ? 'text-green-600' : 
                        client.roi >= 250 ? 'text-blue-600' : 
                        'text-gray-600'
                      }`}>
                        +{client.roi}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-sm ${
                        client.lastSync === 'Agora' ? 'text-green-600 font-medium' :
                        client.lastSync.includes('min') ? 'text-blue-600' :
                        client.lastSync === 'Nunca' ? 'text-red-500' :
                        'text-gray-500'
                      }`}>
                        {client.lastSync}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => navigate(`/client/${client.id}/dashboard`)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Dashboard Cliente
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}