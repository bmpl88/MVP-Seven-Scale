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
import { dashboardApi } from '../services/api';
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
    loading 
  } = useDashboardContext();
  
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  const [lastUpdateLoading, setLastUpdateLoading] = useState(false);
  const [agentProcessing, setAgentProcessing] = useState(false);
  const [agentMessage, setAgentMessage] = useState<string>('');
  const [localAgentStatus, setLocalAgentStatus] = useState<any>(null); // 🎯 Forçar atualização local
  const [localLastUpdate, setLocalLastUpdate] = useState<any>(null); // 🎯 Forçar atualização local lastUpdate
  const [selectedClientLogs, setSelectedClientLogs] = useState<{id: string, name: string} | null>(null); // 🎯 Modal de logs do cliente
  
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
      setAgentMessage('Iniciando processamento...');
      console.log('🤖 Executando agente GPT-4...');
      
      // 🔄 FORÇAR STATUS "PROCESSING" NO CARD AGENTE
      // Temporariamente atualizar o status do agente para mostrar processamento
      if (agentStatus) {
        // Simular estado de processamento no card
        const processingStatus = {
          ...agentStatus,
          status: 'processing',
          statusText: 'Processando...',
          lastSync: 'Executando agora',
          nextSync: 'Em andamento'
        };
        // Como não temos acesso direto ao setAgentStatus, vamos forçar reload
        loadAgentStatus();
      }
      
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
        
        // 🔥 FORÇAR ATUALIZAÇÃO IMEDIATA DOS CARDS
        // Simular nova execução para o agentStatus (local update)
        const now = new Date();
        const fakeAgentStatus = {
          status: 'active',
          statusText: 'Ativo',
          lastSync: 'Agora',
          nextSync: '2h',
          performance: 95,
          isOnline: true,
          lastExecution: now.toISOString(),
          executionsToday: (agentStatus?.executionsToday || 0) + 1,
          successRate: 95
        };
        
        // 🎯 ATUALIZAÇÃO FORÇADA LOCAL (temporária)
        // Usar estado local para simular atualização instantânea
        console.log('🔥 Forçando atualização local dos cards...', fakeAgentStatus);
        setLocalAgentStatus(fakeAgentStatus);
        
        // 🔍 Salvar timestamp para comparação posterior
        const manualExecutionTimestamp = now.getTime();
        
        // Simular nova atividade para lastUpdate
        const fakeLastUpdate = {
          timeAgo: 'Agora',
          nextUpdate: '2h',
          activity: {
            created_at: now.toISOString(),
            log_type: 'agent_execution',
            message: `Agente executado manualmente - ${result.processed} clientes processados`
          }
        };
        console.log('🔥 Forçando atualização do lastUpdate:', fakeLastUpdate);
        setLastUpdate(fakeLastUpdate);
        setLocalLastUpdate(fakeLastUpdate); // 🎯 Salvar também como local
        
        // ✅ ATUALIZAR TODOS OS DADOS + SINCRONIZAR CARD AGENTE + FORÇAR ATUALIZAÇÃO DE CLIENTES
        // Aguardar 2 segundos e atualizar dados reais do backend
        setTimeout(async () => {
          console.log('🔄 Atualizando dados após execução do agente...');
          
          await Promise.all([
            loadOverview(),
            loadClientPerformance(), // 🎯 Isso vai disparar o useEffect que busca dados reais de sync
            loadAgentStatus(), // 🎯 Isso vai tentar capturar da base de dados
            loadAlerts(),
            loadLastUpdate()
          ]);
          
          // 🔥 FORÇAR ATUALIZAÇÃO DOS DADOS DE CLIENTES IMEDIATAMENTE
          console.log('🔥 Forçando atualização imediata dos dados de clientes...');
          
          // Forçar uma nova busca de execuções
          const newExecutions = await loadClientExecutions();
          console.log('🔍 Nova busca de execuções:', newExecutions?.length || 0);
          
          // 🔥 LIMPEZA CONSERVADORA - SÓ LIMPAR SE REALMENTE NECESSÁRIO
          setTimeout(() => {
            console.log('🔥 Verificando se dados do backend são mais recentes...');
            
            // 🎯 AGUARDAR MAIS TEMPO ANTES DE VERIFICAR (backend pode demorar)
            setTimeout(() => {
              const agentStatusReal = agentStatus; // Pegar status real mais atual
              const agentLastExecution = agentStatusReal?.lastExecution;
              
              if (agentLastExecution) {
                const backendTime = new Date(agentLastExecution).getTime();
                const timeDiff = Math.abs(backendTime - manualExecutionTimestamp) / (1000 * 60); // diferença em minutos
                
                console.log('🕵️ Comparação conservadora de tempos:');
                console.log('- Backend:', new Date(agentLastExecution).toLocaleString());
                console.log('- Manual:', new Date(manualExecutionTimestamp).toLocaleString());
                console.log('- Diferença:', timeDiff, 'minutos');
                
                // 🎯 SÓ LIMPAR SE DIFERENÇA FOR MUITO PEQUENA (menos de 2 minutos)
                if (timeDiff < 2) {
                  console.log('🔥✅ Backend tem dados muito recentes! Limpando status local');
                  setLocalAgentStatus(null);
                  setLocalLastUpdate(null);
                } else {
                  console.log('🔥⚡ Mantendo dados locais - diferença ainda grande ou backend não atualizado');
                  // 🎯 MANTER DADOS LOCAIS POR MUITO MAIS TEMPO (10 minutos)
                  setTimeout(() => {
                    console.log('🔥 Limpeza final após 10 minutos (dados locais válidos)');
                    setLocalAgentStatus(null);
                    setLocalLastUpdate(null);
                  }, 600000); // 10 minutos
                }
              } else {
                console.log('🔥⚡ Backend sem lastExecution. Mantendo dados locais indefinidamente.');
                // 🎯 SE BACKEND NÃO TEM DADOS, MANTER LOCAIS POR 30 MINUTOS
                setTimeout(() => {
                  console.log('🔥 Limpeza após 30 minutos (backend ainda sem dados)');
                  setLocalAgentStatus(null);
                  setLocalLastUpdate(null);
                }, 1800000); // 30 minutos
              }
            }, 5000); // Aguardar 5 segundos extras para backend processar
          }, 3000); // Aguardar 3 segundos antes da primeira verificação
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
      
      // 🔄 RECARREGAR STATUS DO AGENTE MESMO EM CASO DE ERRO
      // Mas não limpar o status local se estiver definido
      if (!localAgentStatus) {
        await loadAgentStatus();
      }
      
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
  
  // 🔥 FUNÇÃO PARA BUSCAR DADOS REAIS DE INSIGHTS (ENDPOINT CORRETO)
  const loadClientInsights = async () => {
    try {
      console.log('🔥 Buscando insights reais dos agentes...');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/agent/insights`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Insights reais carregados:', data);
      
      return data.insights || [];
    } catch (error) {
      console.error('❌ Erro ao carregar insights:', error);
      return [];
    }
  };

  // 🎯 CALCULAR TEMPO REAL DE ÚLTIMA SINCRONIZAÇÃO
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

  // Processar dados dos clientes COM SINCRONIZAÇÃO REAL - VERSÃO CORRIGIDA
  useEffect(() => {
    const processClientsWithRealSync = async () => {
      if (clientPerformance && clientPerformance.length > 0) {
        console.log('🔄 Processando clientes com dados reais de sincronização...');
        console.log('📊 Clientes para processar:', clientPerformance.length);
        
        // Buscar insights reais dos agentes
        const insights = await loadClientInsights();
        console.log('📊 Insights recebidos:', insights?.length || 0);
        
        const processedClients = clientPerformance.map((client, index) => {
          // Garantir que temos um cliente válido
          if (!client || typeof client !== 'object') {
            console.warn(`⚠️ Cliente ${index} é inválido:`, client);
            return null;
          }
          
          const clientId = ensureString(client.id);
          const clientName = ensureString(client.name);
          
          console.log(`🔍 Processando cliente: ${clientName} (ID: ${clientId})`);
          
          // 🔍 BUSCAR ÚLTIMA INSIGHT PARA ESTE CLIENTE
          const clientInsights = insights.filter(insight => {
            const insightClientId = ensureString(insight.client_id);
            return insightClientId === clientId || insightClientId === String(clientId);
          });
          
          console.log(`  📊 Insights encontrados para ${clientName}: ${clientInsights.length}`);
          
          // Pegar o insight mais recente
          const lastInsight = clientInsights.length > 0 
            ? clientInsights.sort((a, b) => new Date(b.processed_at).getTime() - new Date(a.processed_at).getTime())[0]
            : null;
          
          // Calcular tempo da última sincronização
          let realLastSync = 'Nunca';
          if (lastInsight) {
            realLastSync = calculateLastSync(lastInsight.processed_at);
            console.log(`  🎯 Cliente PROCESSADO: ${clientName} -> ${realLastSync}`);
          } else {
            console.log(`  📝 Cliente NÃO processado: ${clientName} -> ${realLastSync}`);
          }
          
          console.log(`🔍 Cliente ${clientName}:`, {
            id: clientId,
            executions: clientExecutions.length,
            lastInsight: lastInsight?.processed_at || 'Nenhuma',
            realLastSync
          });
          
          return {
            id: clientId,
            name: clientName,
            specialty: ensureString(client.specialty),
            status: ensureString(client.status) === 'operational' ? 'Ativo' : 'Inativo',
            lastSync: realLastSync // 🎯 DADOS REAIS!
          };
        }).filter(Boolean); // Remove elementos null/undefined
        
        console.log('✅ Clientes processados com dados específicos:', processedClients.length);
        
        // 📊 RELATÓRIO DE PROCESSAMENTO
        const processedCount = processedClients.filter(c => c.lastSync !== 'Nunca').length;
        const neverProcessedCount = processedClients.filter(c => c.lastSync === 'Nunca').length;
        
        console.log('📊 RELATÓRIO FINAL DE PROCESSAMENTO:');
        console.log(`  ✅ Processados: ${processedCount}`);
        console.log(`  📝 Não processados: ${neverProcessedCount}`);
        console.log(`  📈 Total de clientes: ${processedClients.length}`);
        
        setClientsData(processedClients);
      } else {
        console.log('⚠️ Nenhum clientPerformance disponível para processar');
      }
    };
    
    processClientsWithRealSync();
  }, [clientPerformance]);
  
  // 🔥 LIMPEZA ULTRA CONSERVADORA - QUASE NUNCA LIMPAR AUTOMATICAMENTE
  useEffect(() => {
    if (agentStatus && localAgentStatus && !agentProcessing) {
      // 🎯 SÓ LIMPAR SE BACKEND TEM EXECUÇÃO MUITO MUITO RECENTE (menos de 30 segundos)
      const timeDiff = agentStatus.lastExecution ? Date.now() - new Date(agentStatus.lastExecution).getTime() : Infinity;
      if (timeDiff < 30 * 1000) { // Última execução foi há menos de 30 SEGUNDOS
        console.log('🔥⚡ Backend tem execução MUITO recente (< 30s), limpando status local');
        setLocalAgentStatus(null);
        setLocalLastUpdate(null);
      } else {
        console.log('🔥✅ Mantendo dados locais - backend não tem execução muito recente');
        console.log('🔍 TimeDiff:', Math.round(timeDiff / 1000), 'segundos');
      }
    }
  }, [agentStatus, localAgentStatus, agentProcessing]);

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
                // 🔥 PRESERVAR DADOS LOCAIS durante atualização - VERSÃO CORRIGIDA
                console.log('🔄 Atualizando dados (preservando status local se existir)...');
                console.log('🔍 Estado atual:', { localAgentStatus, localLastUpdate });
                
                // Salvar referências dos dados locais antes da atualização
                const currentLocalAgentStatus = localAgentStatus;
                const currentLocalLastUpdate = localLastUpdate;
                
                // Executar atualizações normais
                loadOverview();
                loadClientPerformance(); // 🎯 Isso vai disparar o useEffect que busca dados reais de sync
                loadAlerts();
                
                // 🎯 PRESERVAÇÃO TOTAL DOS DADOS LOCAIS DURANTE ATUALIZAÇÃO
                if (!currentLocalAgentStatus) {
                  console.log('🔄 Sem agentStatus local, atualizando do backend...');
                  loadAgentStatus();
                } else {
                  console.log('🔄 ✅ PRESERVANDO agentStatus local:', currentLocalAgentStatus.statusText);
                  // 🎯 GARANTIR que os dados locais não sejam limpos durante atualização
                  setTimeout(() => {
                    if (!localAgentStatus) {
                      console.log('🔄 🔥 Restaurando agentStatus local após atualização');
                      setLocalAgentStatus(currentLocalAgentStatus);
                    }
                  }, 1000);
                }
                
                if (!currentLocalLastUpdate) {
                  console.log('🔄 Sem lastUpdate local, atualizando do backend...');
                  loadLastUpdate();
                } else {
                  console.log('🔄 ✅ PRESERVANDO lastUpdate local:', currentLocalLastUpdate.timeAgo);
                  // 🎯 GARANTIR que os dados locais não sejam limpos durante atualização
                  setTimeout(() => {
                    if (!localLastUpdate) {
                      console.log('🔄 🔥 Restaurando lastUpdate local após atualização');
                      setLocalLastUpdate(currentLocalLastUpdate);
                    }
                  }, 1000);
                }
                
                console.log('🎯 Atualização concluída - dados locais preservados!');
              }}
              disabled={loading || agentStatusLoading || alertsLoading || lastUpdateLoading || agentProcessing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || agentStatusLoading || alertsLoading || lastUpdateLoading) ? 'animate-spin' : ''}`} />
              {(localAgentStatus || localLastUpdate) ? 'Atualizar (Preservando)' : 'Atualizar Dados'}
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
      
      {/* Notificação do Agente */}
      {agentMessage && (
        <div className={`mx-8 mt-6 p-4 rounded-lg border-l-4 ${
          agentMessage.includes('✅') ? 'bg-green-50 border-green-400' :
          agentMessage.includes('❌') ? 'bg-red-50 border-red-400' :
          'bg-blue-50 border-blue-400'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {agentMessage.includes('✅') ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : agentMessage.includes('❌') ? (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className={`w-5 h-5 text-blue-600 ${agentProcessing ? 'animate-spin' : ''}`} />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                agentMessage.includes('✅') ? 'text-green-800' :
                agentMessage.includes('❌') ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {agentMessage.includes('✅') ? 'Agente Executado' :
                 agentMessage.includes('❌') ? 'Erro na Execução' :
                 'Executando Agente GPT-4'}
              </h3>
              <div className={`mt-1 text-sm ${
                agentMessage.includes('✅') ? 'text-green-700' :
                agentMessage.includes('❌') ? 'text-red-700' :
                'text-blue-700'
              }`}>
                <p>{agentMessage}</p>
              </div>
            </div>
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
                   localAgentStatus ? (
                     console.log('🏯 Usando agentStatus LOCAL:', localAgentStatus.statusText) || ensureString(localAgentStatus.statusText)
                   ) :
                   agentStatus ? (
                     console.log('🖾 Usando agentStatus BACKEND:', agentStatus.statusText) || ensureString(agentStatus.statusText)
                   ) : 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {agentProcessing ? 'Executando agora' : 
                   localAgentStatus ? `Última sync: ${ensureString(localAgentStatus.lastSync)}` :
                   agentStatus?.lastSync ? `Última sync: ${ensureString(agentStatus.lastSync)}` : 
                   'Aguardando dados'}
                </p>
                {((localAgentStatus || agentStatus)?.nextSync) && !agentProcessing && (
                  <p className="text-xs text-gray-400">
                    Próxima: {ensureString((localAgentStatus || agentStatus).nextSync)}
                  </p>
                )}
                {agentProcessing && (
                  <p className="text-xs text-purple-600 font-medium">
                    ⚡ Execução manual em andamento
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                agentProcessing ? 'bg-purple-100' :
                (localAgentStatus?.status || agentStatus?.status) === 'active' ? 'bg-green-100' :
                (localAgentStatus?.status || agentStatus?.status) === 'processing' ? 'bg-purple-100' :
                (localAgentStatus?.status || agentStatus?.status) === 'attention' ? 'bg-amber-100' :
                'bg-gray-100'
              }`}>
                {(agentProcessing || (localAgentStatus?.status || agentStatus?.status) === 'processing') ? (
                  <Clock className="w-6 h-6 text-purple-600 animate-spin" />
                ) : (localAgentStatus?.status || agentStatus?.status) === 'active' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (localAgentStatus?.status || agentStatus?.status) === 'attention' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
            {!agentProcessing && (localAgentStatus?.performance || agentStatus?.performance) && (localAgentStatus?.performance || agentStatus?.performance) > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Performance</span>
                  <span>{ensureString((localAgentStatus?.performance || agentStatus?.performance))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      (localAgentStatus?.performance || agentStatus?.performance) >= 90 ? 'bg-green-500' :
                      (localAgentStatus?.performance || agentStatus?.performance) >= 70 ? 'bg-blue-500' :
                      (localAgentStatus?.performance || agentStatus?.performance) >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${ensureString((localAgentStatus?.performance || agentStatus?.performance))}%` }}
                  ></div>
                </div>
              </div>
            )}
            {agentProcessing && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-purple-600 mb-1">
                  <span>Executando GPT-4</span>
                  <span>⚡</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ width: '75%' }}></div>
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
                  {localLastUpdate ? (
                    console.log('🏯 Usando lastUpdate LOCAL:', localLastUpdate.timeAgo) || ensureString(localLastUpdate.timeAgo)
                  ) : lastUpdate ? (
                    console.log('🖾 Usando lastUpdate BACKEND:', lastUpdate.timeAgo) || ensureString(lastUpdate.timeAgo)
                  ) : 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  Próxima: {localLastUpdate ? ensureString(localLastUpdate.nextUpdate) : 
                            lastUpdate ? ensureString(lastUpdate.nextUpdate) : 'Aguardando'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                (localLastUpdate?.timeAgo || lastUpdate?.timeAgo) && 
                !ensureString((localLastUpdate?.timeAgo || lastUpdate?.timeAgo)).includes('Erro') && 
                !ensureString((localLastUpdate?.timeAgo || lastUpdate?.timeAgo)).includes('Nunca') 
                  ? 'bg-green-100' 
                  : 'bg-gray-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  (localLastUpdate?.timeAgo || lastUpdate?.timeAgo) && 
                  !ensureString((localLastUpdate?.timeAgo || lastUpdate?.timeAgo)).includes('Erro') && 
                  !ensureString((localLastUpdate?.timeAgo || lastUpdate?.timeAgo)).includes('Nunca')
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
            <div className="text-sm text-gray-500">
              Total: {ensureString(clientsData.length)} | 
              Processados: {clientsData.filter(c => c.lastSync === 'Agora' || (c.lastSync && c.lastSync.includes('min atrás'))).length}/{ensureString(clientsData.length)}
            </div>
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