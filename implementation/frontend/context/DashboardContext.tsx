import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useDashboard from '../hooks/useDashboard';

// Criar contexto
const DashboardContext = createContext<ReturnType<typeof useDashboard> | undefined>(undefined);

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const dashboardHook = useDashboard();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Carregar dados iniciais do dashboard
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Iniciando carregamento inicial dos dados do dashboard...');
        await dashboardHook.loadAllDashboardData();
        console.log('Carregamento inicial dos dados do dashboard concluído');
      } catch (error) {
        console.error('Erro no carregamento inicial dos dados do dashboard:', error);
        // Não impede a aplicação de continuar funcionando
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadInitialData();
  }, []);
  
  // Configurar intervalo para atualização automática apenas após o carregamento inicial
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    console.log('Configurando atualização automática dos dados do dashboard...');
    
    // Configurar intervalo para atualização automática (a cada 5 minutos)
    const intervalId = setInterval(async () => {
      try {
        console.log('Executando atualização automática dos dados do dashboard...');
        await dashboardHook.loadAllDashboardData();
      } catch (error) {
        console.error('Erro na atualização automática dos dados do dashboard:', error);
        // Não impede a aplicação de continuar funcionando
      }
    }, 5 * 60 * 1000);
    
    return () => {
      console.log('Limpando intervalo de atualização automática');
      clearInterval(intervalId);
    };
  }, [initialLoadComplete, dashboardHook.loadAllDashboardData]);
  
  // Refresh automático do status do agente a cada 30 segundos
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    console.log('🤖 Configurando refresh automático do status do agente...');
    
    const agentRefreshId = setInterval(async () => {
      try {
        console.log('🤖 Atualizando status do agente...');
        await dashboardHook.loadAgentStatus();
      } catch (error) {
        console.error('🤖 Erro no refresh do status do agente:', error);
      }
    }, 30 * 1000); // 30 segundos
    
    return () => {
      console.log('🤖 Limpando intervalo de refresh do agente');
      clearInterval(agentRefreshId);
    };
  }, [initialLoadComplete, dashboardHook.loadAgentStatus]);
  
  return (
    <DashboardContext.Provider value={dashboardHook}>
      {children}
    </DashboardContext.Provider>
  );
}

// Hook para usar o contexto
export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}