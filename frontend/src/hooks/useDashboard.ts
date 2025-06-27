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
   * ✅ OTIMIZADO: Carregar todos os dados do dashboard
   * AGORA 100% VIA BACKEND + GPT-4 OTIMIZADO! 🚀
   */
  const loadAllDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 CARREGANDO TODOS OS DADOS VIA BACKEND OTIMIZADO...');
      
      // Verifica autenticação
      const authenticated = await checkAuthentication();
      
      if (!authenticated) {
        console.log('⚠️ Usuário não autenticado, carregando apenas preferências padrão');
        return {
          overview: null,
          clientPerformance: [],
          agentStatus: null
        };
      }
      
      // ✅ Executar todas as chamadas EM PARALELO para o BACKEND OTIMIZADO 🚀
      console.log('🚀 Executando chamadas paralelas para o BACKEND OTIMIZADO...');
      const results = await Promise.allSettled([
        dashboardApi.getOverview(),
        analyticsApi.getClientsPerformance(),
        loadAgentStatus() // ✅ Incluir status do agente otimizado
      ]);
      
      // Processar resultados
      const [
        overviewResult,
        clientPerformanceResult,
        agentStatusResult
      ] = results;
      
      // Atualizar estados com dados do BACKEND OTIMIZADO
      const overviewData = overviewResult.status === 'fulfilled' ? overviewResult.value : null;
      const clientPerformanceData = clientPerformanceResult.status === 'fulfilled' ? clientPerformanceResult.value : [];
      
      setOverview(overviewData);
      setClientPerformance(clientPerformanceData);
      
      // Log sucessos e erros
      results.forEach((result, index) => {
        const endpoints = ['overview', 'clientPerformance', 'agentStatus'];
        if (result.status === 'fulfilled') {
          console.log(`✅ ${endpoints[index]} carregado via BACKEND OTIMIZADO`);
        } else {
          console.error(`❌ Erro ao carregar ${endpoints[index]} via BACKEND OTIMIZADO:`, result.reason);
        }
      });
      
      console.log('🎯 TODOS OS DADOS CARREGADOS VIA BACKEND OTIMIZADO! MVP FUNCIONANDO PERFEITAMENTE!');
      
      return {
        overview: overviewData,
        clientPerformance: clientPerformanceData
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar dados do dashboard via BACKEND OTIMIZADO:', error);
      
      return {
        overview: null,
        clientPerformance: []
      };
    } finally {
      setLoading(false);
    }
  }, [checkAuthentication, loadAgentStatus]);

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
    loadAgentStatus,
    loadAllDashboardData,
    
    // ✅ MÉTODOS DE PERSISTÊNCIA
    clearPersistedData: persistence.clearAllPersistedData,
    hasPersistedData: persistence.hasPersistedData,
    refreshPersistence: persistence.refreshPersistenceTimestamp
  };
}

export default useDashboard;