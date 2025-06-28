import { useState, useCallback } from 'react';
import api from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T = any>(initialData: T | null = null) {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const request = useCallback(async <R = T>(
    apiFunc: (...args: any[]) => Promise<R>,
    ...args: any[]
  ): Promise<R> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiFunc(...args);
      
      setState(prev => ({ 
        ...prev, 
        data: response as unknown as T, 
        loading: false 
      }));
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState(prev => ({ ...prev, error, loading: false }));
      throw error;
    }
  }, []);

  return {
    ...state,
    request,
    api
  };
}

// Hooks específicos para cada serviço
export function useClientsApi() {
  const { data, loading, error, request } = useApi();
  
  const getAll = useCallback((filters = {}) => {
    return request(api.clients.getAll, filters);
  }, [request]);
  
  const getSummary = useCallback(() => {
    return request(api.clients.getSummary);
  }, [request]);
  
  const getById = useCallback((id: number) => {
    return request(api.clients.getById, id);
  }, [request]);
  
  const create = useCallback((clientData: any) => {
    return request(api.clients.create, clientData);
  }, [request]);
  
  const update = useCallback((id: number, clientData: any) => {
    return request(api.clients.update, id, clientData);
  }, [request]);
  
  const remove = useCallback((id: number) => {
    return request(api.clients.delete, id);
  }, [request]);
  
  const getMetrics = useCallback((id: number, params = {}) => {
    return request(api.clients.getMetrics, id, params);
  }, [request]);
  
  return {
    data,
    loading,
    error,
    getAll,
    getSummary,
    getById,
    create,
    update,
    remove,
    getMetrics
  };
}

export function useAgentsApi() {
  const { data, loading, error, request } = useApi();
  
  const getAll = useCallback((filters = {}) => {
    return request(api.agents.getAll, filters);
  }, [request]);
  
  const getPerformance = useCallback(() => {
    return request(api.agents.getPerformance);
  }, [request]);
  
  const getById = useCallback((id: number) => {
    return request(api.agents.getById, id);
  }, [request]);
  
  const update = useCallback((id: number, agentData: any) => {
    return request(api.agents.update, id, agentData);
  }, [request]);
  
  const execute = useCallback((id: number, executionData: any) => {
    return request(api.agents.execute, id, executionData);
  }, [request]);
  
  const toggle = useCallback((id: number) => {
    return request(api.agents.toggle, id);
  }, [request]);
  
  const getLogs = useCallback((id: number, params = {}) => {
    return request(api.agents.getLogs, id, params);
  }, [request]);
  
  return {
    data,
    loading,
    error,
    getAll,
    getPerformance,
    getById,
    update,
    execute,
    toggle,
    getLogs
  };
}

export function useAnalyticsApi() {
  const { data, loading, error, request } = useApi();
  
  const getDashboard = useCallback((params = {}) => {
    return request(api.analytics.getDashboard, params);
  }, [request]);
  
  const getClientsPerformance = useCallback((params = {}) => {
    return request(api.analytics.getClientsPerformance, params);
  }, [request]);
  
  const getSpecialtiesRoi = useCallback(() => {
    return request(api.analytics.getSpecialtiesRoi);
  }, [request]);
  
  const getFunnel = useCallback((params = {}) => {
    return request(api.analytics.getFunnel, params);
  }, [request]);
  
  const getAgentsAnalytics = useCallback(() => {
    return request(api.analytics.getAgentsAnalytics);
  }, [request]);
  
  const getIntegrationsMetrics = useCallback(() => {
    return request(api.analytics.getIntegrationsMetrics);
  }, [request]);
  
  const getRevenueEvolution = useCallback((params = {}) => {
    return request(api.analytics.getRevenueEvolution, params);
  }, [request]);
  
  const exportAnalytics = useCallback((params = {}) => {
    return request(api.analytics.exportAnalytics, params);
  }, [request]);
  
  return {
    data,
    loading,
    error,
    getDashboard,
    getClientsPerformance,
    getSpecialtiesRoi,
    getFunnel,
    getAgentsAnalytics,
    getIntegrationsMetrics,
    getRevenueEvolution,
    exportAnalytics
  };
}

export function useIntegrationsApi() {
  const { data, loading, error, request } = useApi();
  
  const getAll = useCallback((filters = {}) => {
    return request(api.integrations.getAll, filters);
  }, [request]);
  
  const getStatus = useCallback(() => {
    return request(api.integrations.getStatus);
  }, [request]);
  
  const getById = useCallback((id: number) => {
    return request(api.integrations.getById, id);
  }, [request]);
  
  const create = useCallback((integrationData: any) => {
    return request(api.integrations.create, integrationData);
  }, [request]);
  
  const update = useCallback((id: number, integrationData: any) => {
    return request(api.integrations.update, id, integrationData);
  }, [request]);
  
  const remove = useCallback((id: number) => {
    return request(api.integrations.delete, id);
  }, [request]);
  
  const test = useCallback((id: number, testData: any) => {
    return request(api.integrations.test, id, testData);
  }, [request]);
  
  const sync = useCallback((id: number) => {
    return request(api.integrations.sync, id);
  }, [request]);
  
  const getClientIntegrations = useCallback((clientId: number) => {
    return request(api.integrations.getClientIntegrations, clientId);
  }, [request]);
  
  return {
    data,
    loading,
    error,
    getAll,
    getStatus,
    getById,
    create,
    update,
    remove,
    test,
    sync,
    getClientIntegrations
  };
}

export function useDashboardApi() {
  const { data, loading, error, request } = useApi();
  
  const getOverview = useCallback(() => {
    return request(api.dashboard.getOverview);
  }, [request]);
  
  const getMetrics = useCallback(() => {
    return request(api.dashboard.getMetrics);
  }, [request]);
  
  const getAlerts = useCallback(() => {
    return request(api.dashboard.getAlerts);
  }, [request]);
  
  const getHealth = useCallback(() => {
    return request(api.dashboard.getHealth);
  }, [request]);
  
  const getRecentActivity = useCallback((limit = 20) => {
    return request(api.dashboard.getRecentActivity, limit);
  }, [request]);
  
  return {
    data,
    loading,
    error,
    getOverview,
    getMetrics,
    getAlerts,
    getHealth,
    getRecentActivity
  };
}

export default useApi;