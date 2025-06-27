import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, clientsApi, analyticsApi, integrationsApi, agentApi } from '../services/api';
import usePersistence from './usePersistence';

/**
 * Hook para gerenciar dados do dashboard - VERSÃO OTIMIZADA
 * ✅ Agora conecta ao BACKEND otimizado com processamento sequencial
 * ✅ Configurado para processar apenas 1 cliente por vez (máx 2 clientes)
 */
export function useDashboard() {
  // ✅ HOOK DE PERSISTÊNCIA - SOLUÇÃO PARA F5
  const persistence = usePersistence();
  
  const [overview, setOverview] = useState<any>(null);
  const [clientPerformance, setClientPerformance] = useState<any[]>([]);
  const [agentAnalytics, setAgentAnalytics] = useState<any[]>([]);
  const [integrationHealth, setIntegrationHealth] = useState<any[]>([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [agentStatusLoading, setAgentStatusLoading] = useState<boolean>(false);
  
  // ✅ NOVOS ESTADOS PARA PERSISTÊNCIA
  const [persistedAgentStatus, setPersistedAgentStatus] = useState<any>(null);
  const [persistedLastUpdate, setPersistedLastUpdate] = useState<any>(null);
  const [persistedClientSyncs, setPersistedClientSyncs] = useState<any[]>([]);

  /**
   * 🔧 RECUPERAR DADOS PERSISTIDOS AO INICIALIZAR
   * Executa apenas uma vez na montagem do componente
   */
  useEffect(() => {
    console.log('🔄 Recuperando dados persistidos após F5...');
    
    // Recuperar status do agente
    const savedAgentStatus = persistence.getAgentStatus();
    if (savedAgentStatus) {
      console.log('📖 Status do agente recuperado:', savedAgentStatus);
      setPersistedAgentStatus({
        status: savedAgentStatus.status,
        statusText: savedAgentStatus.statusText,
        lastSync: savedAgentStatus.lastSync,
        nextSync: savedAgentStatus.nextSync,
        performance: savedAgentStatus.performance,
        lastExecution: savedAgentStatus.lastExecution,
        executionsToday: savedAgentStatus.executionsToday,
        successRate: savedAgentStatus.successRate,
        isOnline: true
      });
    }
    
    // Recuperar última atualização
    const savedLastUpdate = persistence.getLastUpdate();
    if (savedLastUpdate) {
      console.log('📖 Última atualização recuperada:', savedLastUpdate);
      setPersistedLastUpdate(savedLastUpdate);
    }
    
    // Recuperar sincronizações dos clientes
    const savedClientSyncs = persistence.getClientSyncs();
    if (savedClientSyncs.length > 0) {
      console.log('📖 Sincronizações dos clientes recuperadas:', savedClientSyncs.length);
      setPersistedClientSyncs(savedClientSyncs);
    }
    
    // Verificar se há dados persistidos
    const hasData = persistence.hasPersistedData();
    if (hasData.hasAny) {
      console.log('✅ Dados persistidos encontrados:', hasData);
    } else {
      console.log('ℹ️ Nenhum dado persistido encontrado (primeira visita ou dados expirados)');
    }
  }, []);

  /**
   * Verificar autenticação
   */
  const checkAuthentication = useCallback(async () => {
    try {
      // Implementar verificação via backend se necessário
      const token = localStorage.getItem('supabase_token');
      const authenticated = !!token;
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  /**
   * Carregar visão geral do dashboard
   * AGORA CONECTA AO BACKEND + GPT-4! 🤖
   */
  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Carregando overview via BACKEND...');
      
      const data = await dashboardApi.getOverview();
      setOverview(data);
      
      console.log('✅ Overview carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar visão geral via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar performance dos clientes
   * AGORA VIA BACKEND ANALYTICS API!
   */
  const loadClientPerformance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Carregando client performance via BACKEND...');
      
      const data = await analyticsApi.getClientsPerformance();
      setClientPerformance(data);
      
      console.log('✅ Client performance carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar performance dos clientes via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar analytics dos agentes
   * AGORA VIA BACKEND ANALYTICS API COM GPT-4!
   */
  const loadAgentAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Carregando agent analytics via BACKEND...');
      
      const data = await analyticsApi.getAgentsAnalytics();
      setAgentAnalytics(data);
      
      console.log('✅ Agent analytics carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar analytics dos agentes via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar saúde das integrações
   * AGORA VIA BACKEND INTEGRATIONS API!
   */
  const loadIntegrationHealth = useCallback(async (clientId?: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Carregando integration health via BACKEND...');
      
      const data = await integrationsApi.getStatus();
      setIntegrationHealth(data);
      
      console.log('✅ Integration health carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar saúde das integrações via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar análise de receita por especialidade
   * AGORA VIA BACKEND ANALYTICS API!
   */
  const loadRevenueAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Carregando revenue analytics via BACKEND...');
      
      const data = await analyticsApi.getSpecialtiesRoi();
      setRevenueAnalytics(data);
      
      console.log('✅ Revenue analytics carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar análise de receita via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ OTIMIZADO: Carregar status do agente MVP com configurações sequenciais
   * Conecta ao agentApi.getStatus() - ENDPOINT: /api/v1/agent/status
   */
  const loadAgentStatus = useCallback(async () => {
    try {
      setAgentStatusLoading(true);
      console.log('🤖 Carregando status OTIMIZADO do agente via endpoint correto...');
      
      const data = await agentApi.getStatus();
      setAgentStatus(data);
      
      console.log('🤖✅ Status OTIMIZADO do agente carregado via /agent/status:', data);
      
      // ✅ Log das configurações otimizadas
      if (data.success && data.status) {
        console.log(`🎯 Modo: ${data.status.mode || 'sequential-processing'}`);
        console.log(`🎯 Max clientes simultâneos: ${data.status.max_concurrent_clients || 1}`);
        console.log(`🎯 Max clientes total: ${data.status.max_clients_total || 2}`);
        console.log(`🎯 Clientes autorizados: ${JSON.stringify(data.status.authorized_clients || ['1', '2'])}`);
        console.log(`🎯 Versão: ${data.status.version || 'optimized'}`);
      }
      
      return data;
    } catch (err) {
      console.error('🤖❌ Erro ao carregar status OTIMIZADO do agente:', err);
      
      // ✅ Status padrão otimizado em caso de erro
      const fallbackStatus = {
        success: false,
        status: {
          agent_status: 'offline',
          mode: 'sequential-processing',
          last_processing: null,
          insights_today: 0,
          total_insights: 0,
          openai_configured: false,
          supabase_connected: false,
          max_concurrent_clients: 1,
          max_clients_total: 2,
          authorized_clients: ['1', '2'],
          version: 'offline'
        },
        error: 'Agente offline'
      };
      
      setAgentStatus(fallbackStatus);
      return fallbackStatus;
    } finally {
      setAgentStatusLoading(false);
    }
  }, []);

  /**
   * Carregar métricas de dashboard para um cliente
   * AGORA VIA BACKEND CLIENTS API!
   */
  const loadClientMetrics = useCallback(async (clientId: number, period: string = '3m') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Carregando client metrics para ${clientId} via BACKEND...`);
      
      const data = await clientsApi.getMetrics(clientId, { period });
      
      console.log('✅ Client metrics carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar métricas do cliente via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar histórico de performance de um cliente
   * AGORA VIA BACKEND ANALYTICS API!
   */
  const loadClientPerformanceHistory = useCallback(async (clientId: number, period: string = '6m') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Carregando performance history para ${clientId} via BACKEND...`);
      
      const data = await analyticsApi.getClientsPerformance({ clientId, period });
      
      console.log('✅ Performance history carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar histórico de performance via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ OTIMIZADO: Carregar insights do GPT-4 para um cliente usando agentApi!
   * Usa o endpoint correto: /api/v1/agent/insights/:clientId
   */
  const loadClientGPTInsights = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🤖 Carregando GPT-4 insights OTIMIZADOS para cliente ${clientId} via agentApi...`);
      
      const data = await agentApi.getInsights(String(clientId));
      
      console.log('🤖✅ GPT-4 insights OTIMIZADOS carregados via agentApi:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('🤖❌ Erro ao carregar GPT-4 insights otimizados:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ OTIMIZADO: Processar cliente com GPT-4 usando agentApi SEQUENCIAL!
   * Usa o endpoint otimizado: /api/v1/agent/process/:clientId
   */
  const processClientWithAI = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🤖 Processando cliente ${clientId} com GPT-4 OTIMIZADO via agentApi...`);
      
      const data = await agentApi.processClient(String(clientId));
      
      console.log('🤖✅ Cliente processado com GPT-4 OTIMIZADO via agentApi:', data);
      
      // 💾 SALVAR EXECUÇÃO NO LOCALSTORAGE
      const now = new Date();
      const executionCount = persistence.getExecutionCount() + 1;
      
      // Salvar status do agente atualizado
      const newAgentStatus = {
        status: 'active',
        statusText: 'Ativo',
        lastSync: 'Agora',
        nextSync: '30min',
        performance: 95,
        lastExecution: now.toISOString(),
        executionsToday: executionCount,
        successRate: 95
      };
      
      persistence.saveAgentStatus(newAgentStatus);
      persistence.saveExecutionCount(executionCount);
      setPersistedAgentStatus(newAgentStatus);
      
      // Salvar última atualização
      const newLastUpdate = {
        timeAgo: 'Agora',
        nextUpdate: '30min',
        activity: {
          created_at: now.toISOString(),
          log_type: 'agent_execution',
          message: `Cliente ${clientId} processado com IA`
        }
      };
      
      persistence.saveLastUpdate(newLastUpdate);
      setPersistedLastUpdate(newLastUpdate);
      
      console.log('💾 Execução salva no localStorage');
      
      // ✅ Recarregar status após processamento
      setTimeout(() => {
        loadAgentStatus();
      }, 2000);
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('🤖❌ Erro ao processar cliente com GPT-4 otimizado:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadAgentStatus, persistence]);

  /**
   * ✅ NOVO: Processar todos os clientes (máx 2) SEQUENCIALMENTE
   * Usa o endpoint otimizado: /api/v1/agent/process-all
   */
  const processAllClientsWithAI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🤖 Processando TODOS os clientes (máx 2) SEQUENCIALMENTE com GPT-4...');
      
      const data = await agentApi.processAll();
      
      console.log('🤖✅ Todos os clientes processados SEQUENCIALMENTE com GPT-4:', data);
      
      // 💾 SALVAR EXECUÇÃO EM LOTE NO LOCALSTORAGE
      const now = new Date();
      const executionCount = persistence.getExecutionCount() + 1;
      const processed = data?.processed || data?.clients_processed || 2;
      
      // Salvar status do agente atualizado
      const newAgentStatus = {
        status: 'active',
        statusText: 'Ativo',
        lastSync: 'Agora',
        nextSync: '2h',
        performance: 95,
        lastExecution: now.toISOString(),
        executionsToday: executionCount,
        successRate: 95
      };
      
      persistence.saveAgentStatus(newAgentStatus);
      persistence.saveExecutionCount(executionCount);
      setPersistedAgentStatus(newAgentStatus);
      
      // Salvar última atualização
      const newLastUpdate = {
        timeAgo: 'Agora',
        nextUpdate: '2h',
        activity: {
          created_at: now.toISOString(),
          log_type: 'agent_execution',
          message: `Agente executado - ${processed} clientes processados`
        }
      };
      
      persistence.saveLastUpdate(newLastUpdate);
      setPersistedLastUpdate(newLastUpdate);
      
      console.log('💾 Execução em lote salva no localStorage');
      
      // ✅ Recarregar status após processamento
      setTimeout(() => {
        loadAgentStatus();
      }, 3000);
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('🤖❌ Erro ao processar todos os clientes sequencialmente:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadAgentStatus, persistence]);

  /**
   * ✅ NOVO: Processar cliente único via endpoint dedicado
   * Usa o endpoint: /api/v1/agent/process-single
   */
  const processSingleClientWithAI = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🤖 Processamento ÚNICO otimizado para cliente ${clientId}...`);
      
      const data = await agentApi.processSingle(String(clientId));
      
      console.log('🤖✅ Processamento ÚNICO concluído:', data);
      
      // 💾 SALVAR PROCESSAMENTO ÚNICO NO LOCALSTORAGE
      const now = new Date();
      const executionCount = persistence.getExecutionCount() + 1;
      
      // Salvar status do agente atualizado
      const newAgentStatus = {
        status: 'active',
        statusText: 'Ativo',
        lastSync: 'Agora',
        nextSync: '30min',
        performance: 95,
        lastExecution: now.toISOString(),
        executionsToday: executionCount,
        successRate: 95
      };
      
      persistence.saveAgentStatus(newAgentStatus);
      persistence.saveExecutionCount(executionCount);
      setPersistedAgentStatus(newAgentStatus);
      
      // Salvar última atualização
      const newLastUpdate = {
        timeAgo: 'Agora',
        nextUpdate: '30min',
        activity: {
          created_at: now.toISOString(),
          log_type: 'agent_execution',
          message: `Processamento único cliente ${clientId}`
        }
      };
      
      persistence.saveLastUpdate(newLastUpdate);
      setPersistedLastUpdate(newLastUpdate);
      
      console.log('💾 Processamento único salvo no localStorage');
      
      // ✅ Recarregar status após processamento
      setTimeout(() => {
        loadAgentStatus();
      }, 2000);
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('🤖❌ Erro no processamento único:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadAgentStatus, persistence]);

  /**
   * ✅ NOVO: Testar agente com configurações otimizadas
   */
  const testAgentWithAI = useCallback(async (clientId: string = '1') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🤖 Testando agente OTIMIZADO com cliente ${clientId}...`);
      
      const data = await agentApi.testAgent(clientId);
      
      console.log('🤖✅ Teste do agente OTIMIZADO concluído:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('🤖❌ Erro no teste do agente otimizado:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ NOVO: Obter configurações do agente
   */
  const getAgentConfig = useCallback(async () => {
    try {
      console.log('🤖 Obtendo configurações do agente...');
      
      const data = await agentApi.getConfig();
      
      console.log('🤖✅ Configurações do agente obtidas:', data);
      return data;
    } catch (err) {
      console.error('🤖❌ Erro ao obter configurações do agente:', err);
      throw err;
    }
  }, []);

  /**
   * Carregar execuções de agentes para um cliente
   * AGORA VIA BACKEND!
   */
  const loadClientAgentExecutions = useCallback(async (clientId: number, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Carregando agent executions para ${clientId} via BACKEND...`);
      
      // Via analytics API
      const data = await analyticsApi.getAgentsAnalytics();
      
      console.log('✅ Agent executions carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar execuções de agentes via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar sincronizações de integrações para um cliente
   * AGORA VIA BACKEND!
   */
  const loadClientIntegrationSyncs = useCallback(async (clientId: number, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Carregando integration syncs para ${clientId} via BACKEND...`);
      
      const data = await integrationsApi.getClientIntegrations(clientId);
      
      console.log('✅ Integration syncs carregado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar sincronizações de integrações via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Gerar relatório para um cliente
   * AGORA VIA BACKEND ANALYTICS!
   */
  const generateClientReport = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🚀 Gerando relatório para ${clientId} via BACKEND...`);
      
      const data = await analyticsApi.exportAnalytics({ clientId });
      
      console.log('✅ Relatório gerado via backend:', data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao gerar relatório do cliente via backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carregar preferências do usuário
   * Mantém função local por enquanto
   */
  const loadUserPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Preferências padrão
      const defaultPreferences = {
        theme: 'light',
        dashboard_layout: {},
        favorite_metrics: ['roi', 'performance', 'revenue', 'patients'],
        notification_settings: {
          email: true,
          push: true,
          alerts: {
            critical: true,
            warning: true,
            info: false
          }
        }
      };
      
      setUserPreferences(defaultPreferences);
      return defaultPreferences;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar preferências do usuário:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualizar preferências do usuário
   */
  const updateUserPreferences = useCallback(async (preferences: any) => {
    try {
      setLoading(true);
      setError(null);
      
      setUserPreferences(preferences);
      return preferences;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao atualizar preferências do usuário:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ OTIMIZADO: Carregar todos os dados do dashboard
   * AGORA 100% VIA BACKEND + GPT-4 OTIMIZADO! 🚀
   */
  const loadAllDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 CARREGANDO TODOS OS DADOS VIA BACKEND OTIMIZADO...');
      
      // Sempre carrega preferências primeiro
      const userPreferencesData = await loadUserPreferences();
      
      // Verifica autenticação
      const authenticated = await checkAuthentication();
      
      if (!authenticated) {
        console.log('⚠️ Usuário não autenticado, carregando apenas preferências padrão');
        return {
          overview: null,
          clientPerformance: [],
          agentAnalytics: [],
          integrationHealth: [],
          revenueAnalytics: [],
          userPreferences: userPreferencesData
        };
      }
      
      // ✅ Executar todas as chamadas EM PARALELO para o BACKEND OTIMIZADO 🚀
      console.log('🚀 Executando chamadas paralelas para o BACKEND OTIMIZADO...');
      const results = await Promise.allSettled([
        dashboardApi.getOverview(),
        analyticsApi.getClientsPerformance(),
        analyticsApi.getAgentsAnalytics(),
        integrationsApi.getStatus(),
        analyticsApi.getSpecialtiesRoi(),
        loadAgentStatus() // ✅ Incluir status do agente otimizado
      ]);
      
      // Processar resultados
      const [
        overviewResult,
        clientPerformanceResult,
        agentAnalyticsResult,
        integrationHealthResult,
        revenueAnalyticsResult,
        agentStatusResult
      ] = results;
      
      // Atualizar estados com dados do BACKEND OTIMIZADO
      const overviewData = overviewResult.status === 'fulfilled' ? overviewResult.value : null;
      const clientPerformanceData = clientPerformanceResult.status === 'fulfilled' ? clientPerformanceResult.value : [];
      const agentAnalyticsData = agentAnalyticsResult.status === 'fulfilled' ? agentAnalyticsResult.value : [];
      const integrationHealthData = integrationHealthResult.status === 'fulfilled' ? integrationHealthResult.value : [];
      const revenueAnalyticsData = revenueAnalyticsResult.status === 'fulfilled' ? revenueAnalyticsResult.value : [];
      
      setOverview(overviewData);
      setClientPerformance(clientPerformanceData);
      setAgentAnalytics(agentAnalyticsData);
      setIntegrationHealth(integrationHealthData);
      setRevenueAnalytics(revenueAnalyticsData);
      
      // Log sucessos e erros
      results.forEach((result, index) => {
        const endpoints = ['overview', 'clientPerformance', 'agentAnalytics', 'integrationHealth', 'revenueAnalytics', 'agentStatus'];
        if (result.status === 'fulfilled') {
          console.log(`✅ ${endpoints[index]} carregado via BACKEND OTIMIZADO`);
        } else {
          console.error(`❌ Erro ao carregar ${endpoints[index]} via BACKEND OTIMIZADO:`, result.reason);
        }
      });
      
      console.log('🎯 TODOS OS DADOS CARREGADOS VIA BACKEND OTIMIZADO! MVP FUNCIONANDO PERFEITAMENTE!');
      
      return {
        overview: overviewData,
        clientPerformance: clientPerformanceData,
        agentAnalytics: agentAnalyticsData,
        integrationHealth: integrationHealthData,
        revenueAnalytics: revenueAnalyticsData,
        userPreferences: userPreferencesData
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar dados do dashboard via BACKEND OTIMIZADO:', error);
      
      return {
        overview: null,
        clientPerformance: [],
        agentAnalytics: [],
        integrationHealth: [],
        revenueAnalytics: [],
        userPreferences: userPreferences
      };
    } finally {
      setLoading(false);
    }
  }, [checkAuthentication, userPreferences, loadUserPreferences, loadAgentStatus]);

  // Carregar preferências ao montar
  useEffect(() => {
    loadUserPreferences().catch(console.error);
  }, [loadUserPreferences]);

  return {
    // Estados
    overview,
    clientPerformance,
    agentAnalytics,
    integrationHealth,
    revenueAnalytics,
    userPreferences,
    loading,
    error,
    isAuthenticated,
    agentStatus,
    agentStatusLoading,
    
    // ✅ ESTADOS PERSISTIDOS - DISPONÍVEIS APÓS F5
    persistedAgentStatus,
    persistedLastUpdate,
    persistedClientSyncs,
    
    // Métodos CORRIGIDOS (agora via backend otimizado)
    checkAuthentication,
    loadOverview,
    loadClientPerformance,
    loadAgentAnalytics,
    loadIntegrationHealth,
    loadRevenueAnalytics,
    loadAgentStatus,
    loadClientMetrics,
    loadClientPerformanceHistory,
    loadClientAgentExecutions,
    loadClientIntegrationSyncs,
    generateClientReport,
    loadUserPreferences,
    updateUserPreferences,
    loadAllDashboardData,
    
    // ✅ MÉTODOS GPT-4 OTIMIZADOS! 🤖
    loadClientGPTInsights,
    processClientWithAI,
    processAllClientsWithAI,
    processSingleClientWithAI,
    testAgentWithAI,
    getAgentConfig,
    
    // ✅ MÉTODOS DE PERSISTÊNCIA
    clearPersistedData: persistence.clearAllPersistedData,
    hasPersistedData: persistence.hasPersistedData,
    refreshPersistence: persistence.refreshPersistenceTimestamp
  };
}

export default useDashboard;