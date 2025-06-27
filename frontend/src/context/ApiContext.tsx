import React, { createContext, useContext, ReactNode } from 'react';
import { 
  useClientsApi, 
  useAgentsApi, 
  useAnalyticsApi, 
  useIntegrationsApi, 
  useDashboardApi 
} from '../hooks/useApi';

interface ApiContextType {
  clients: ReturnType<typeof useClientsApi>;
  agents: ReturnType<typeof useAgentsApi>;
  analytics: ReturnType<typeof useAnalyticsApi>;
  integrations: ReturnType<typeof useIntegrationsApi>;
  dashboard: ReturnType<typeof useDashboardApi>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const clients = useClientsApi();
  const agents = useAgentsApi();
  const analytics = useAnalyticsApi();
  const integrations = useIntegrationsApi();
  const dashboard = useDashboardApi();
  
  const value = {
    clients,
    agents,
    analytics,
    integrations,
    dashboard
  };
  
  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}