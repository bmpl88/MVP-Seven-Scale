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
        console.log('🚀 Iniciando carregamento inicial dos dados do dashboard OTIMIZADO...');
        await dashboardHook.loadAllDashboardData();
        console.log('✅ Carregamento inicial dos dados do dashboard OTIMIZADO concluído');
      } catch (error) {
        console.error('❌ Erro no carregamento inicial dos dados do dashboard OTIMIZADO:', error);
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
    
    console.log('🔄 Configurando atualização automática dos dados do dashboard OTIMIZADO...');
    
    // ✅ Configurar intervalo para atualização automática (a cada 10 minutos - menos frequente)
    const intervalId = setInterval(async () => {
      try {
        console.log('🔄 Executando atualização automática dos dados do dashboard OTIMIZADO...');
        await dashboardHook.loadAllDashboardData();
      } catch (error) {
        console.error('❌ Erro na atualização automática dos dados do dashboard OTIMIZADO:', error);
        // Não impede a aplicação de continuar funcionando
      }
    }, 10 * 60 * 1000); // ✅ 10 minutos (menos agressivo)
    
    return () => {
      console.log('🔄 Limpando intervalo de atualização automática');
      clearInterval(intervalId);
    };
  }, [initialLoadComplete, dashboardHook.loadAllDashboardData]);
  
  // ✅ OTIMIZADO: Refresh automático do status do agente a cada 10 segundos (menos agressivo)
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    console.log('🤖 Configurando refresh OTIMIZADO do status do agente...');
    
    const agentRefreshId = setInterval(async () => {
      try {
        console.log('🤖 Atualizando status OTIMIZADO do agente...');
        await dashboardHook.loadAgentStatus();
      } catch (error) {
        console.error('🤖❌ Erro no refresh OTIMIZADO do status do agente:', error);
      }
    }, 10 * 1000); // ✅ 10 segundos (menos agressivo que 30s)
    
    return () => {
      console.log('🤖 Limpando intervalo de refresh OTIMIZADO do agente');
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
