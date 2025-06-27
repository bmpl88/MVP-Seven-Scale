import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Bell, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Bot
} from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';
import { dashboardApi, agentApi } from '../services/api';
import ClientLogsModal from '../components/ClientLogsModal';

export default function Dashboard() {
  const { 
    overview, 
    clientPerformance, 
    agentStatus,
    agentStatusLoading,
    loadOverview, 
    loadClientPerformance,
    loadAgentStatus,
    loading,
    // ✅ DADOS PERSISTIDOS - SOLUÇÃO PARA F5
    persistedAgentStatus,
    persistedLastUpdate,
    persistedClientSyncs
  } = useDashboardContext();
  
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  const [lastUpdateLoading, setLastUpdateLoading] = useState(false);
  const [agentProcessing, setAgentProcessing] = useState(false);
  const [agentMessage, setAgentMessage] = useState<string>('');
  const [localAgentStatus, setLocalAgentStatus] = useState<any>(null);
  const [localLastUpdate, setLocalLastUpdate] = useState<any>(null);
  const [selectedClientLogs, setSelectedClientLogs] = useState<{id: string, name: string} | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // ✅ ATUALIZAR TEMPO A CADA MINUTO PARA CÁLCULOS DINÂMICOS
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  // ✅ FUNÇÃO PARA CALCULAR TEMPO DECORRIDO DINAMICAMENTE
  const calculateTimeAgo = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const now = currentTime;
    const time = new Date(timestamp).getTime();
    const diffMs = now - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Agora';
    } else if (diffMinutes < 60) {
      return `Há ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Há ${diffHours}h`;
    } else {
      return `Há ${diffDays}d`;
    }
  };
  
  // ✅ FUNÇÃO PARA GARANTIR STRING
  const ensureString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Objeto inválido]';
      }
    }
    return String(value);
  };

  // ✅ FUNÇÃO PARA OBTER STATUS DO AGENTE COM CÁLCULO DINÂMICO
  const getEffectiveAgentStatus = () => {
    // Prioridade: 1) Local (temporário), 2) Persistido (após F5), 3) Backend
    if (localAgentStatus) {
      console.log('🏰 Usando agentStatus LOCAL (temporário):', localAgentStatus.statusText);
      return {
        ...localAgentStatus,
        lastSync: localAgentStatus.lastExecution ? calculateTimeAgo(localAgentStatus.lastExecution) : 'Nunca'
      };
    }
    
    if (persistedAgentStatus) {
      console.log('💾 Usando agentStatus PERSISTIDO (após F5):', persistedAgentStatus.statusText);
      return {
        ...persistedAgentStatus,
        lastSync: persistedAgentStatus.lastExecution ? calculateTimeAgo(persistedAgentStatus.lastExecution) : 'Nunca'
      };
    }
    
    if (agentStatus) {
      console.log('🖥️ Usando agentStatus BACKEND:', agentStatus.statusText);
      return agentStatus;
    }
    
    return null;
  };

  // ✅ FUNÇÃO PARA OBTER ÚLTIMA ATUALIZAÇÃO COM CÁLCULO DINÂMICO
  const getEffectiveLastUpdate = () => {
    // Prioridade: 1) Local (temporário), 2) Persistido (após F5), 3) Backend
    if (localLastUpdate) {
      console.log('🏰 Usando lastUpdate LOCAL (temporário):', localLastUpdate.timeAgo);
      return {
        ...localLastUpdate,
        timeAgo: localLastUpdate.activity?.created_at ? calculateTimeAgo(localLastUpdate.activity.created_at) : 'Nunca'
      };
    }
    
    if (persistedLastUpdate) {
      console.log('💾 Usando lastUpdate PERSISTIDO (após F5):', persistedLastUpdate.timeAgo);
      return {
        ...persistedLastUpdate,
        timeAgo: persistedLastUpdate.activity?.created_at ? calculateTimeAgo(persistedLastUpdate.activity.created_at) : 'Nunca'
      };
    }
    
    if (lastUpdate) {
      console.log('🖥️ Usando lastUpdate BACKEND:', lastUpdate.timeAgo);
      return lastUpdate;
    }
    
    return null;
  };

  // Carregar alertas do backend
  const loadAlerts = async () => {
    try {
      setAlertsLoading(true);
      const alertsData = await dashboardApi.getAlerts();
      setAlerts(alertsData || []);
      console.log('✅ Alertas carregados:', alertsData);
    } catch (error) {
      console.error('❌ Erro ao carregar alertas:', error);
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };

  // Carregar última atualização do backend
  const loadLastUpdate = async () => {
    try {
      setLastUpdateLoading(true);
      const activity = await dashboardApi.getRecentActivity(1);
      if (activity && activity.length > 0) {
        const lastActivity = activity[0];
        const lastUpdateTime = new Date(lastActivity.created_at);
        const timeDiff = Date.now() - lastUpdateTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        let timeAgo;
        if (hoursDiff < 1) {
          timeAgo = `Há ${Math.round(hoursDiff * 60)} min`;
        } else if (hoursDiff < 24) {
          timeAgo = `Há ${Math.round(hoursDiff)} horas`;
        } else {
          timeAgo = `Há ${Math.round(hoursDiff / 24)} dias`;
        }
        
        const nextUpdate = new Date(lastUpdateTime.getTime() + 2 * 60 * 60 * 1000);
        const timeToNext = nextUpdate.getTime() - Date.now();
        let nextText = 'Agora';
        
        if (timeToNext > 0) {
          const minutesToNext = Math.round(timeToNext / (1000 * 60));
          if (minutesToNext < 60) {
            nextText = `${minutesToNext}min`;
          } else {
            nextText = `${Math.round(minutesToNext / 60)}h`;
          }
        }
        
        setLastUpdate({
          timeAgo,
          nextUpdate: nextText,
          activity: lastActivity
        });
      } else {
        setLastUpdate({
          timeAgo: 'Nunca',
          nextUpdate: 'Aguardando',
          activity: null
        });
      }
      console.log('✅ Última atualização carregada:', activity);
    } catch (error) {
      console.error('❌ Erro ao carregar última atualização:', error);
      setLastUpdate({
        timeAgo: 'Erro',
        nextUpdate: 'Aguardando',
        activity: null
      });
    } finally {
      setLastUpdateLoading(false);
    }
  };

  // Buscar insights dos clientes
  const loadClientInsights = async () => {
    try {
      console.log('🔥 Buscando insights reais dos agentes via agentApi...');
      const data = await agentApi.getInsights();
      console.log('✅ Insights reais carregados via agentApi:', data);
      return data.insights || data || [];
    } catch (error) {
      console.error('❌ Erro ao carregar insights:', error);
      return [];
    }
  };

  // ✅ EXECUTAR AGENTE GPT-4 COM TIMESTAMPS CORRETOS
  const executeAgent = async () => {
    try {
      setAgentProcessing(true);
      setAgentMessage('Iniciando processamento...');
      console.log('🤖 Executando agente GPT-4 para todos os clientes...');
      
      const executionTime = new Date().toISOString();
      
      // ✅ ATUALIZAR STATUS LOCAL IMEDIATAMENTE
      setLocalAgentStatus({
        status: 'processing',
        statusText: 'Ativo',
        lastSync: 'Agora',
        nextSync: 'Processando...',
        performance: 95,
        lastExecution: executionTime
      });
      
      setLocalLastUpdate({
        timeAgo: 'Agora',
        nextUpdate: 'Processando...',
        activity: {
          created_at: executionTime,
          log_type: 'agent_execution',
          message: 'Agente em execução'
        }
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/agent/process-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro na execução do agente: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('🤖✅ Agente executado com sucesso:', result);
      
      if (result.success) {
        setAgentMessage(`✅ Processados: ${result.processed}/${result.totalClients} clientes`);
        
        const completionTime = new Date().toISOString();
        
        // ✅ SALVAR DADOS COM TIMESTAMPS CORRETOS
        const agentStatusData = {
          status: 'active',
          statusText: 'Ativo',
          lastSync: 'Agora', // Será calculado dinamicamente
          nextSync: '2h',
          performance: 98,
          lastExecution: completionTime, // ✅ Timestamp real para cálculo
          executionsToday: 1,
          successRate: 98,
          timestamp: Date.now()
        };
        
        const lastUpdateData = {
          timeAgo: 'Agora', // Será calculado dinamicamente
          nextUpdate: 'Agora',
          activity: {
            created_at: completionTime, // ✅ Timestamp real para cálculo
            log_type: 'agent_execution',
            message: 'Agente executado com sucesso'
          },
          timestamp: Date.now()
        };
        
        const clientSyncsData = clientsData.map(client => ({
          clientId: client.id,
          lastSync: 'Agora', // Será calculado dinamicamente
          lastExecution: completionTime, // ✅ Timestamp real para cálculo
          timestamp: Date.now()
        }));
        
        // ✅ USAR AS CHAVES CORRETAS DO USEPERSISTENCE
        localStorage.setItem('sevenscale_agent_status', JSON.stringify(agentStatusData));
        localStorage.setItem('sevenscale_last_update', JSON.stringify(lastUpdateData));
        localStorage.setItem('sevenscale_client_syncs', JSON.stringify(clientSyncsData));
        
        console.log('💾 Dados de execução salvos no localStorage com timestamps corretos');
        
        // Atualizar estados locais
        setLocalAgentStatus(agentStatusData);
        setLocalLastUpdate(lastUpdateData);
        
        // Recarregar dados do backend após um tempo
        setTimeout(() => {
          loadOverview();
          loadClientPerformance();
          loadAgentStatus();
          loadAlerts();
          loadLastUpdate();
        }, 2000);
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => {
          setAgentMessage('');
        }, 5000);
      } else {
        throw new Error(result.error || 'Erro desconhecido no agente');
      }
      
    } catch (error) {
      console.error('🤖❌ Erro ao executar agente:', error);
      setAgentMessage(`❌ Erro: ${error.message}`);
      
      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => {
        setAgentMessage('');
      }, 5000);
    } finally {
      setAgentProcessing(false);
    }
  };

  // Calcular tempo de sincronização
  const calculateLastSync = (lastExecution) => {
    if (!lastExecution) {
      return 'Nunca';
    }
    
    const lastTime = new Date(lastExecution);
    const timeDiff = Date.now() - lastTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    if (minutesDiff < 1) {
      return 'Agora';
    } else if (minutesDiff < 60) {
      return `${Math.round(minutesDiff)}min atrás`;
    } else if (hoursDiff < 24) {
      return `${Math.round(hoursDiff)}h atrás`;
    } else {
      return `${Math.round(daysDiff)}d atrás`;
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadOverview();
    loadClientPerformance();
    loadAlerts();
    loadLastUpdate();
  }, [loadOverview, loadClientPerformance]);

  // ✅ PROCESSAR CLIENTES COM CÁLCULO DINÂMICO DE TEMPO
  useEffect(() => {
    const processClientsWithDynamicTime = async () => {
      if (clientPerformance && clientPerformance.length > 0) {
        console.log('🔄 Processando clientes com cálculo dinâmico de tempo...');
        
        // Buscar insights reais dos agentes
        const insights = await loadClientInsights();
        console.log('📊 Insights recebidos:', insights?.length || 0);
        
        const processedClients = clientPerformance.map((client, index) => {
          if (!client || typeof client !== 'object') {
            return null;
          }
          
          const clientId = ensureString(client.id);
          const clientName = ensureString(client.name);
          
          // ✅ VERIFICAR DADOS PERSISTIDOS COM CÁLCULO DINÂMICO
          const persistedSync = persistedClientSyncs.find(sync => sync.clientId === clientId);
          let realLastSync = 'Nunca';
          
          if (persistedSync) {
            // ✅ Calcular tempo dinamicamente se há timestamp
            if (persistedSync.lastExecution) {
              realLastSync = calculateTimeAgo(persistedSync.lastExecution);
            } else {
              realLastSync = persistedSync.lastSync;
            }
            console.log(`💾 Cliente ${clientName} tem dados persistidos:`, realLastSync);
          } else {
            // Buscar nos insights
            const clientInsights = insights.filter(insight => {
              const insightClientId = ensureString(insight.client_id);
              return insightClientId === clientId || insightClientId === String(clientId);
            });
            
            const lastInsight = clientInsights.length > 0 
              ? clientInsights.sort((a, b) => new Date(b.processed_at).getTime() - new Date(a.processed_at).getTime())[0]
              : null;
            
            if (lastInsight) {
              realLastSync = calculateLastSync(lastInsight.processed_at);
            }
          }
          
          return {
            id: clientId,
            name: clientName,
            specialty: ensureString(client.specialty),
            status: ensureString(client.status) === 'operational' ? 'Ativo' : 'Inativo',
            lastSync: realLastSync
          };
        }).filter(Boolean);
        
        setClientsData(processedClients);
      }
    };
    
    processClientsWithDynamicTime();
  }, [clientPerformance, persistedClientSyncs, currentTime]); // ✅ Adicionar currentTime como dependência

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Obter dados efetivos (com cálculo dinâmico)
  const effectiveAgentStatus = getEffectiveAgentStatus();
  const effectiveLastUpdate = getEffectiveLastUpdate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da plataforma SevenScale</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                loadOverview();
                loadClientPerformance();
                loadAlerts();
                loadLastUpdate();
              }}
              disabled={loading || agentStatusLoading || alertsLoading || lastUpdateLoading || agentProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || agentStatusLoading || alertsLoading || lastUpdateLoading) ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </button>
            
            {/* ✅ BOTÃO ACIONAR AGENTE RESTAURADO */}
            <button 
              onClick={executeAgent}
              disabled={loading || agentStatusLoading || alertsLoading || lastUpdateLoading || agentProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                agentProcessing 
                  ? 'border-purple-300 bg-purple-50 text-purple-700' 
                  : 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <Bot className={`w-4 h-4 ${agentProcessing ? 'animate-pulse' : ''}`} />
              {agentProcessing ? 'Executando...' : '🤖 Acionar Agente'}
            </button>
          </div>
        </div>
      </header>
      
      {/* ✅ MENSAGEM DO AGENTE */}
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
            <span className="font-medium">
              {agentMessage || (
                agentProcessing ? '🤖 Processando todos os clientes com IA...' : ''
              )}
            </span>
          </div>
        </div>
      )}
      
      <main className="p-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{ensureString(overview?.total_clients) || '8'}</p>
                <p className="text-gray-500 text-sm mb-3">
                  {ensureString(overview?.operational_clients) || '7'} OK, {ensureString(overview?.attention_clients) || '1'} atenção
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* ✅ CARD DO AGENTE COM CÁLCULO DINÂMICO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-600 text-sm font-medium">Status Agente</p>
                  {(agentStatusLoading || agentProcessing) && (
                    <div className="w-3 h-3 rounded-full border border-gray-300 border-t-blue-600 animate-spin"></div>
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {agentProcessing ? 'Processando...' : 
                   effectiveAgentStatus ? ensureString(effectiveAgentStatus.statusText) : 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {agentProcessing ? 'Executando agora' : 
                   effectiveAgentStatus ? `Última sync: ${ensureString(effectiveAgentStatus.lastSync)}` : 'Aguardando dados'}
                </p>
                {effectiveAgentStatus?.nextSync && !agentProcessing && (
                  <p className="text-xs text-gray-400">
                    Próxima: {ensureString(effectiveAgentStatus.nextSync)}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                agentProcessing ? 'bg-purple-100' :
                effectiveAgentStatus?.status === 'active' ? 'bg-green-100' :
                effectiveAgentStatus?.status === 'processing' ? 'bg-purple-100' :
                'bg-gray-100'
              }`}>
                {(agentProcessing || effectiveAgentStatus?.status === 'processing') ? (
                  <Clock className="w-6 h-6 text-purple-600 animate-spin" />
                ) : effectiveAgentStatus?.status === 'active' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
            {!agentProcessing && effectiveAgentStatus?.performance && effectiveAgentStatus.performance > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Performance</span>
                  <span>{ensureString(effectiveAgentStatus.performance)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      effectiveAgentStatus.performance >= 90 ? 'bg-green-500' :
                      effectiveAgentStatus.performance >= 70 ? 'bg-blue-500' :
                      'bg-amber-500'
                    }`}
                    style={{ width: `${ensureString(effectiveAgentStatus.performance)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ CARD ÚLTIMA ATUALIZAÇÃO COM CÁLCULO DINÂMICO */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-600 text-sm font-medium">Última Atualização</p>
                  {lastUpdateLoading && (
                    <div className="w-3 h-3 rounded-full border border-gray-300 border-t-blue-600 animate-spin"></div>
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {effectiveLastUpdate ? ensureString(effectiveLastUpdate.timeAgo) : 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  Próxima: {effectiveLastUpdate ? ensureString(effectiveLastUpdate.nextUpdate) : 'Aguardando'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                effectiveLastUpdate?.timeAgo && 
                !ensureString(effectiveLastUpdate.timeAgo).includes('Erro') && 
                !ensureString(effectiveLastUpdate.timeAgo).includes('Nunca') 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  effectiveLastUpdate?.timeAgo && 
                  !ensureString(effectiveLastUpdate.timeAgo).includes('Erro') && 
                  !ensureString(effectiveLastUpdate.timeAgo).includes('Nunca')
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-600 text-sm font-medium">Alertas</p>
                  {alertsLoading && (
                    <div className="w-3 h-3 rounded-full border border-gray-300 border-t-blue-600 animate-spin"></div>
                  )}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {alertsLoading ? '...' : ensureString(alerts?.length) || '0'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {alerts?.length > 0 ? 'Requerem atenção' : 'Nenhum alerta'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                alerts?.length > 0 ? 'bg-amber-100' : 'bg-green-100'
              }`}>
                <Bell className={`w-6 h-6 ${
                  alerts?.length > 0 ? 'text-amber-600' : 'text-green-600'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ LISTA DE CLIENTES COM CÁLCULO DINÂMICO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Clientes Ativos</h3>
            <div className="text-sm text-gray-500">
              Total: {ensureString(clientsData.length)} | 
              Processados: {clientsData.filter(c => c.lastSync === 'Agora' || (c.lastSync && c.lastSync.includes('min'))).length}/{ensureString(clientsData.length)}
            </div>
          </div>

          <div className="space-y-4">
            {clientsData.map((client, index) => {
              if (!client || typeof client !== 'object') {
                return null;
              }
              
              return (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: client.status === 'Ativo' ? '#10b981' : '#f59e0b' }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{ensureString(client.name)}</h4>
                      <p className="text-gray-600 text-sm">{ensureString(client.specialty)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900">{ensureString(client.status)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Última sync</p>
                      <p className={`text-sm font-medium ${
                        ensureString(client.lastSync) === 'Agora' ? 'text-green-600' :
                        ensureString(client.lastSync).includes('min') ? 'text-blue-600' :
                        ensureString(client.lastSync) === 'Nunca' ? 'text-red-500' :
                        'text-gray-500'
                      }`}>
                        {ensureString(client.lastSync) === 'Agora' && '✅ '}
                        {ensureString(client.lastSync)}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedClientLogs({id: ensureString(client.id), name: ensureString(client.name)})}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title={`Ver logs de processamento de ${ensureString(client.name)}`}
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Alertas Recentes</h3>
            <button 
              onClick={loadAlerts}
              disabled={alertsLoading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${alertsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            {alertsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Carregando alertas...</span>
              </div>
            ) : alerts && alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {ensureString(alert.message) || 'Alerta do Sistema'}
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {ensureString(alert.description) || 'Detalhes do alerta'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">Nenhum alerta ativo</p>
                <p className="text-gray-500 text-sm">Sistema funcionando normalmente ✅</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Modal de Logs do Cliente */}
      <ClientLogsModal
        isOpen={selectedClientLogs !== null}
        onClose={() => setSelectedClientLogs(null)}
        clientId={selectedClientLogs?.id || ''}
        clientName={selectedClientLogs?.name || ''}
      />
    </div>
  );
}
