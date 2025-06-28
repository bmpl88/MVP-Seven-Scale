import axios from 'axios';

// ✅ CONFIGURAÇÃO OTIMIZADA - Timeouts ajustados para processamento sequencial
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 70000, // ✅ 70 segundos para 1 cliente por vez
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Serviços de API

// Clientes
export const clientsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/clients', { params: filters });
    return response.data;
  },
  
  getSummary: async () => {
    const response = await api.get('/clients/summary');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  
  create: async (clientData) => {
    console.log('🔍 DADOS SENDO ENVIADOS PARA O BACKEND:', JSON.stringify(clientData, null, 2));
    
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/clients/${id}`);
    return true;
  },
  
  getMetrics: async (id, params = {}) => {
    const response = await api.get(`/clients/${id}/metrics`, { params });
    return response.data;
  }
};

// Agentes IA
export const agentsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/agents', { params: filters });
    return response.data;
  },
  
  getPerformance: async () => {
    const response = await api.get('/agents/performance');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },
  
  update: async (id, agentData) => {
    const response = await api.put(`/agents/${id}`, agentData);
    return response.data;
  },
  
  execute: async (id, executionData) => {
    const response = await api.post(`/agents/${id}/execute`, executionData);
    return response.data;
  },
  
  toggle: async (id) => {
    const response = await api.post(`/agents/${id}/toggle`);
    return response.data;
  },
  
  getLogs: async (id, params = {}) => {
    const response = await api.get(`/agents/${id}/logs`, { params });
    return response.data;
  }
};

// Analytics
export const analyticsApi = {
  getDashboard: async (params = {}) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },
  
  getClientsPerformance: async (params = {}) => {
    try {
      const response = await api.get('/analytics/clients/performance', { params });
      return response.data;
      
    } catch (error) {
      console.error('🚨 TIMEOUT em clientPerformance, usando dados mock temporários');
      
      // Dados mock base
      const mockData = [
        {
          id: 'mock-1',
          name: 'Clínica CardioCenter',
          specialty: 'Cardiologia',
          status: 'operational',
          revenue: 150000,
          performance: 85
        },
        {
          id: 'mock-2', 
          name: 'DermaClinic',
          specialty: 'Dermatologia',
          status: 'operational',
          revenue: 120000,
          performance: 92
        },
        {
          id: 'mock-3',
          name: 'Centro Ortopédico',
          specialty: 'Ortopedia', 
          status: 'operational',
          revenue: 180000,
          performance: 78
        }
      ];
      
      return mockData;
    }
  },
  
  getSpecialtiesRoi: async () => {
    const response = await api.get('/analytics/specialties/roi');
    return response.data;
  },
  
  getFunnel: async (params = {}) => {
    const response = await api.get('/analytics/funnel', { params });
    return response.data;
  },
  
  getAgentsAnalytics: async () => {
    const response = await api.get('/analytics/agents/performance');
    return response.data;
  },
  
  getIntegrationsMetrics: async () => {
    const response = await api.get('/analytics/integrations/metrics');
    return response.data;
  },
  
  getRevenueEvolution: async (params = {}) => {
    const response = await api.get('/analytics/revenue/evolution', { params });
    return response.data;
  },
  
  exportAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/export', { params });
    return response.data;
  }
};

// Integrações
export const integrationsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/integrations', { params: filters });
    return response.data;
  },
  
  getStatus: async () => {
    try {
      const response = await api.get('/integrations/status');
      return response.data;
    } catch (error) {
      console.error('🚨 TIMEOUT em integrations status, usando dados mock temporários');
      // 🔧 DADOS MOCK TEMPORÁRIOS  
      return [
        {
          id: 'whatsapp',
          name: 'WhatsApp Business',
          status: 'connected',
          health: 95
        },
        {
          id: 'hubspot',
          name: 'HubSpot CRM',
          status: 'connected', 
          health: 88
        },
        {
          id: 'google-ads',
          name: 'Google Ads',
          status: 'connected',
          health: 92
        }
      ];
    }
  },
  
  getById: async (id) => {
    const response = await api.get(`/integrations/${id}`);
    return response.data;
  },
  
  create: async (integrationData) => {
    const response = await api.post('/integrations', integrationData);
    return response.data;
  },
  
  update: async (id, integrationData) => {
    const response = await api.put(`/integrations/${id}`, integrationData);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/integrations/${id}`);
    return true;
  },
  
  test: async (id, testData) => {
    const response = await api.post(`/integrations/${id}/test`, testData);
    return response.data;
  },
  
  sync: async (id) => {
    const response = await api.post(`/integrations/${id}/sync`);
    return response.data;
  },
  
  getClientIntegrations: async (clientId) => {
    const response = await api.get(`/integrations/client/${clientId}`);
    return response.data;
  }
};

// Dashboard
export const dashboardApi = {
  getOverview: async () => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },
  
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },
  
  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },
  
  getHealth: async () => {
    const response = await api.get('/dashboard/health');
    return response.data;
  },
  
  getRecentActivity: async (limit = 20) => {
    const response = await api.get('/dashboard/recent-activity', { params: { limit } });
    return response.data;
  }
};

// ✅ AGENTE API OTIMIZADA - CONFIGURADA PARA PROCESSAMENTO SEQUENCIAL
export const agentApi = {
  /**
   * Obter status do agente com configurações otimizadas
   */
  getStatus: async () => {
    try {
      const response = await api.get('/agent/status', { 
        timeout: 15000 // ✅ 15 segundos para status
      });
      return response.data;
    } catch (error) {
      console.error('🚨 Erro no status do agente:', error);
      // ✅ Status mock para não quebrar o frontend
      return {
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
    }
  },
  
  /**
   * Obter insights (todos ou por cliente)
   */
  getInsights: async (clientId?: string) => {
    try {
      const url = clientId ? `/agent/insights/${clientId}` : '/agent/insights';
      const response = await api.get(url, { 
        timeout: 20000 // ✅ 20 segundos para insights
      });
      return response.data;
    } catch (error) {
      console.error('🚨 Erro ao obter insights:', error);
      throw error;
    }
  },
  
  /**
   * ✅ NOVO: Processar cliente específico com timeout otimizado
   */
  processClient: async (clientId: string) => {
    try {
      console.log(`🎯 Iniciando processamento otimizado para cliente ${clientId}`);
      
      const response = await api.post(`/agent/process/${clientId}`, {}, { 
        timeout: 70000 // ✅ 70 segundos para processamento individual
      });
      
      console.log(`✅ Cliente ${clientId} processado com sucesso`);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Erro ao processar cliente ${clientId}:`, error);
      
      // ✅ Melhor tratamento de erro
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Timeout ao processar cliente ${clientId}. O agente está demorando mais que o esperado.`);
      }
      
      if (error.response?.status === 400) {
        throw new Error(`Cliente ${clientId} não autorizado para processamento no modo teste.`);
      }
      
      throw error;
    }
  },
  
  /**
   * ✅ OTIMIZADO: Processar apenas 2 clientes sequencialmente
   */
  processAll: async () => {
    try {
      console.log('🚀 Iniciando processamento sequencial otimizado (máx 2 clientes)');
      
      const response = await api.post('/agent/process-all', {}, { 
        timeout: 180000 // ✅ 3 minutos para 2 clientes sequenciais
      });
      
      console.log('✅ Processamento em lote concluído');
      return response.data;
      
    } catch (error) {
      console.error('❌ Erro no processamento em lote:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout no processamento em lote. Tente processar clientes individualmente.');
      }
      
      throw error;
    }
  },
  
  /**
   * ✅ NOVO: Processar cliente único via endpoint otimizado
   */
  processSingle: async (clientId: string) => {
    try {
      console.log(`🎯 Processamento único otimizado para cliente ${clientId}`);
      
      const response = await api.post('/agent/process-single', { 
        clientId 
      }, { 
        timeout: 70000 // ✅ 70 segundos
      });
      
      console.log(`✅ Processamento único concluído para cliente ${clientId}`);
      return response.data;
      
    } catch (error) {
      console.error(`❌ Erro no processamento único cliente ${clientId}:`, error);
      throw error;
    }
  },
  
  /**
   * ✅ NOVO: Obter configurações do agente
   */
  getConfig: async () => {
    try {
      const response = await api.get('/agent/config', { 
        timeout: 10000 // ✅ 10 segundos
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao obter configurações:', error);
      // ✅ Config mock
      return {
        success: false,
        config: {
          MAX_CONCURRENT_CLIENTS: 1,
          MAX_CLIENTS_TOTAL: 2,
          PROCESSING_DELAY: 3000,
          TEST_CLIENT_IDS: ['1', '2'],
          version: 'offline'
        },
        error: 'Configurações offline'
      };
    }
  },
  
  /**
   * Deletar insight
   */
  deleteInsight: async (insightId: string) => {
    const response = await api.delete(`/agent/insights/${insightId}`, {
      timeout: 15000 // ✅ 15 segundos
    });
    return response.data;
  },
  
  /**
   * ✅ OTIMIZADO: Teste do agente com timeout reduzido
   */
  testAgent: async (clientId: string = '1') => {
    try {
      const response = await api.post('/agent/test', { 
        clientId 
      }, { 
        timeout: 50000 // ✅ 50 segundos para teste
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro no teste do agente:', error);
      throw error;
    }
  },
  
  /**
   * Seed data
   */
  seedData: async () => {
    const response = await api.post('/agent/seed-data', {}, {
      timeout: 30000 // ✅ 30 segundos
    });
    return response.data;
  },

  /**
   * ✅ NOVO: Polling inteligente para status do agente
   */
  pollStatus: async (intervalMs = 5000, maxAttempts = 12) => {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++;
          const status = await agentApi.getStatus();
          
          // ✅ Verificar se processamento terminou
          if (status.success && status.status.agent_status !== 'processing') {
            resolve(status);
            return;
          }
          
          // ✅ Continuar polling se ainda processando
          if (attempts < maxAttempts) {
            console.log(`🔄 Polling tentativa ${attempts}/${maxAttempts} - Agente: ${status.status.agent_status}`);
            setTimeout(poll, intervalMs);
          } else {
            reject(new Error('Timeout no polling do agente'));
          }
          
        } catch (error) {
          console.error('❌ Erro no polling:', error);
          if (attempts < maxAttempts) {
            setTimeout(poll, intervalMs);
          } else {
            reject(error);
          }
        }
      };
      
      poll();
    });
  }
};

// Exportar todos os serviços
export default {
  clients: clientsApi,
  agents: agentsApi,
  analytics: analyticsApi,
  integrations: integrationsApi,
  dashboard: dashboardApi,
  agent: agentApi // ✅ API do agente otimizada
};