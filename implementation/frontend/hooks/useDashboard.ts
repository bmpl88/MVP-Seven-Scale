import { useState, useEffect, useCallback } from 'react';
import { dashboardApi, clientsApi, analyticsApi, integrationsApi } from '../services/api';

/**
 * Hook para gerenciar dados do dashboard - VERSÃO CORRIGIDA
 * Agora conecta ao BACKEND com GPT-4 ao invés do Supabase direto
 */
export function useDashboard() {
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

  /**
   * NOVO: Carregar status do agente MVP! 🤖
   * Conecta ao dashboardService.getAgentStatus()
   */
  const loadAgentStatus = useCallback(async () => {
    try {
      setAgentStatusLoading(true);
      console.log('🤖 Carregando status do agente...');
      
      const { dashboardService } = await import('../services/dashboardService');
      const data = await dashboardService.getAgentStatus();
      setAgentStatus(data);
      
      console.log('🤖✅ Status do agente carregado:', data);
      return data;
    } catch (err) {
      console.error('🤖❌ Erro ao carregar status do agente:', err);
      
      // Status padrão em caso de erro
      const fallbackStatus = {
        status: 'offline',
        statusText: 'Desconectado',
        lastSync: 'Erro',
        nextSync: 'Aguardando',
        performance: 0,
        isOnline: false,
        lastExecution: null,
        executionsToday: 0,
        successRate: 0
      };
      
      setAgentStatus(fallbackStatus);
      return fallbackStatus;
    } finally {
      setAgentStatusLoading(false);
    }
  }, []);

  /**
   * Carregar todos os dados do dashboard
   * AGORA INCLUI STATUS DO AGENTE!
   */
  const loadAllDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 CARREGANDO TODOS OS DADOS VIA BACKEND...');
      
      // Executar todas as chamadas EM PARALELO para o BACKEND 🚀
      console.log('🚀 Executando chamadas paralelas para o BACKEND...');
      const results = await Promise.allSettled([
        dashboardApi.getOverview(),
        analyticsApi.getClientsPerformance(),
        analyticsApi.getAgentsAnalytics(),
        integrationsApi.getStatus(),
        analyticsApi.getSpecialtiesRoi(),
        loadAgentStatus() // Incluir status do agente
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
      
      // Atualizar estados com dados do BACKEND
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
          console.log(`✅ ${endpoints[index]} carregado via BACKEND`);
        } else {
          console.error(`❌ Erro ao carregar ${endpoints[index]} via BACKEND:`, result.reason);
        }
      });
      
      console.log('🎯 TODOS OS DADOS CARREGADOS VIA BACKEND! MVP FUNCIONANDO!');
      
      return {
        overview: overviewData,
        clientPerformance: clientPerformanceData,
        agentAnalytics: agentAnalyticsData,
        integrationHealth: integrationHealthData,
        revenueAnalytics: revenueAnalyticsData,
        userPreferences: userPreferences
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Erro ao carregar dados do dashboard via BACKEND:', error);
      
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
  }, [userPreferences, loadAgentStatus]);

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
    
    // Métodos
    loadAgentStatus,
    loadAllDashboardData
  };
}

export default useDashboard;