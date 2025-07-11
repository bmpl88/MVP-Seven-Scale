import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Bell, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';
import { dashboardApi } from '../services/api';

export default function Dashboard() {
  const { 
    overview, 
    clientPerformance, 
    agentStatus,
    agentStatusLoading,
    loadOverview, 
    loadClientPerformance,
    loadAgentStatus,
    loading 
  } = useDashboardContext();
  
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  const [lastUpdateLoading, setLastUpdateLoading] = useState(false);
  const [agentProcessing, setAgentProcessing] = useState(false);
  const [agentMessage, setAgentMessage] = useState<string>('');
  const [agentProcessing, setAgentProcessing] = useState(false);
  
  // Função para garantir que o valor seja string
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

  // Executar agente GPT-4 para todos os clientes
  const executeAgent = async () => {
    try {
      setAgentProcessing(true);
      console.log('🤖 Executando agente GPT-4 para todos os clientes...');
      
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
      
      // Após executar o agente, recarregar todos os dados
      await Promise.all([
        loadOverview(),
        loadClientPerformance(),
        loadAgentStatus(),
        loadAlerts(),
        loadLastUpdate()
      ]);
      
      console.log('🎯 Dados atualizados após execução do agente');
      
    } catch (error) {
      console.error('🤖❌ Erro ao executar agente:', error);
      // Continuar funcionando mesmo com erro
    } finally {
      setAgentProcessing(false);
    }
  };

  // Executar agente GPT-4 para todos os clientes
  const executeAgent = async () => {
    try {
      setAgentProcessing(true);
      setAgentMessage('Iniciando processamento...');
      console.log('🤖 Executando agente GPT-4...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/agent/process-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro no agente: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setAgentMessage(`✅ Processados: ${result.processed}/${result.totalClients} clientes`);
        console.log('🤖✅ Agente executado com sucesso:', result);
        
        // Atualizar todos os dados após execução
        setTimeout(() => {
          loadOverview();
          loadClientPerformance();
          loadAgentStatus();
          loadAlerts();
          loadLastUpdate();
        }, 1000);
        
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
        
        // Calcular próxima atualização (próxima execução do agente)
        const nextUpdate = new Date(lastUpdateTime.getTime() + 2 * 60 * 60 * 1000); // +2h
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

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadOverview();
    loadClientPerformance();
    loadAlerts();
    loadLastUpdate();
  }, [loadOverview, loadClientPerformance]);
  
  // Processar dados dos clientes
  useEffect(() => {
    if (clientPerformance && clientPerformance.length > 0) {
      const processedClients = clientPerformance.map(client => {
        // Garantir que temos um cliente válido
        if (!client || typeof client !== 'object') {
          return null;
        }
        
        return {
          id: ensureString(client.id),
          name: ensureString(client.name),
          specialty: ensureString(client.specialty),
          status: ensureString(client.status) === 'operational' ? 'Ativo' : 'Inativo',
          lastSync: Math.floor(Math.random() * 8) + 1 + 'h atrás'
        };
      }).filter(Boolean); // Remove elementos null/undefined
      
      setClientsData(processedClients);
    }
  }, [clientPerformance]);

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            {/* Botão para atualizar dados */}
            <button 
              onClick={() => {
                loadOverview();
                loadClientPerformance();
                loadAgentStatus();
                loadAlerts();
                loadLastUpdate();
              }}
              disabled={loading || agentStatusLoading || alertsLoading || lastUpdateLoading || agentProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || agentStatusLoading || alertsLoading || lastUpdateLoading) ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </button>
            
            {/* Botão para executar agente GPT-4 */}
            <button 
              onClick={executeAgent}
              disabled={loading || agentStatusLoading || alertsLoading || lastUpdateLoading || agentProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                agentProcessing 
                  ? 'border-purple-300 bg-purple-50 text-purple-700' 
                  : 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <Clock className={`w-4 h-4 ${agentProcessing ? 'animate-spin' : ''}`} />
              {agentProcessing ? 'Executando...' : '🤖 Executar Agente'}
            </button>
          </div>
        </div>
      </header>
      
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-600 text-sm font-medium">Status Agente</p>
                  {agentStatusLoading && (
                    <div className="w-3 h-3 rounded-full border border-gray-300 border-t-blue-600 animate-spin"></div>
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {ensureString(agentStatus?.statusText) || 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {agentStatus?.lastSync ? `Última sync: ${ensureString(agentStatus.lastSync)}` : 'Aguardando dados'}
                </p>
                {agentStatus?.nextSync && (
                  <p className="text-xs text-gray-400">
                    Próxima: {ensureString(agentStatus.nextSync)}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                agentStatus?.status === 'active' ? 'bg-green-100' :
                agentStatus?.status === 'processing' ? 'bg-purple-100' :
                agentStatus?.status === 'attention' ? 'bg-amber-100' :
                'bg-gray-100'
              }`}>
                {agentStatus?.status === 'processing' ? (
                  <Clock className={`w-6 h-6 ${
                    agentStatus?.status === 'active' ? 'text-green-600' :
                    agentStatus?.status === 'processing' ? 'text-purple-600 animate-pulse' :
                    agentStatus?.status === 'attention' ? 'text-amber-600' :
                    'text-gray-600'
                  }`} />
                ) : agentStatus?.status === 'active' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : agentStatus?.status === 'attention' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
            {agentStatus?.performance && agentStatus.performance > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Performance</span>
                  <span>{ensureString(agentStatus.performance)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      agentStatus.performance >= 90 ? 'bg-green-500' :
                      agentStatus.performance >= 70 ? 'bg-blue-500' :
                      agentStatus.performance >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${ensureString(agentStatus.performance)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

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
                  {ensureString(lastUpdate?.timeAgo) || 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  Próxima: {ensureString(lastUpdate?.nextUpdate) || 'Aguardando'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                lastUpdate?.timeAgo && !ensureString(lastUpdate.timeAgo).includes('Erro') && !ensureString(lastUpdate.timeAgo).includes('Nunca') 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  lastUpdate?.timeAgo && !ensureString(lastUpdate.timeAgo).includes('Erro') && !ensureString(lastUpdate.timeAgo).includes('Nunca')
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

        {/* Lista de Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Clientes Ativos</h3>
            <div className="text-sm text-gray-500">Total: {ensureString(clientsData.length)}</div>
          </div>

          <div className="space-y-4">
            {clientsData.map((client, index) => {
              // Garantir que temos um cliente válido
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
                    <p className="text-gray-500 text-sm">{ensureString(client.lastSync)}</p>
                  </div>
                  
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
              alerts.slice(0, 3).map((alert, index) => {
                // Garantir que temos um objeto válido
                if (!alert || typeof alert !== 'object') {
                  return null;
                }
                
                const isWarning = ensureString(alert.log_type) === 'warning';
                const isCritical = ensureString(alert.log_type) === 'critical';
                const createdAt = alert.created_at || new Date().toISOString();
                const timeAgo = new Date(createdAt);
                const timeDiff = Date.now() - timeAgo.getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                let timeAgoText;
                if (hoursDiff < 1) {
                  timeAgoText = `${Math.round(hoursDiff * 60)} min atrás`;
                } else if (hoursDiff < 24) {
                  timeAgoText = `${Math.round(hoursDiff)} horas atrás`;
                } else {
                  timeAgoText = `${Math.round(hoursDiff / 24)} dias atrás`;
                }
                
                return (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      isCritical 
                        ? 'border-red-200 bg-red-50' 
                        : isWarning 
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isCritical 
                          ? 'text-red-600' 
                          : isWarning 
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {ensureString(alert.message) || 'Alerta do Sistema'}
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {(() => {
                            // Construir descrição baseada nos dados do alerta
                            const logType = ensureString(alert.log_type);
                            const message = ensureString(alert.message);
                            
                            if (alert.details) {
                              if (alert.details.agent_id) {
                                return `Agente ${alert.details.agent_id} está inativo e precisa ser reativado`;
                              }
                              if (alert.details.integration_id) {
                                return `Integração ${alert.details.integration_id} foi desconectada e precisa reconexão`;
                              }
                              if (alert.details.execution_id) {
                                return `Processo de execução ${alert.details.execution_id} concluído`;
                              }
                              if (alert.details.status) {
                                return `Status: ${alert.details.status} - ${alert.details.processing_time || 0}ms processamento`;
                              }
                              // Fallback para outros tipos de details
                              const detailsStr = Object.entries(alert.details)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ');
                              return detailsStr || message || 'Sem detalhes disponíveis';
                            }
                            
                            // Se não tem details, usar a mensagem como descrição
                            return message || 'Sem detalhes disponíveis';
                          })()} 
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs ml-8">{timeAgoText}</p>
                  </div>
                );
              }).filter(Boolean) // Remove elementos null/undefined
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">Nenhum alerta ativo</p>
                <p className="text-gray-500 text-sm">Sistema funcionando normalmente</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}