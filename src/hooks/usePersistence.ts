/**
 * 🔧 HOOK DE PERSISTÊNCIA - SOLUÇÃO PARA F5
 * ✅ Salva e recupera dados críticos no localStorage
 * ✅ Evita perda de estado após refresh da página
 * 
 * Dados persistidos:
 * - Status do agente (última execução, performance, etc.)
 * - Última sync dos clientes (insights processados)
 * - Última atualização do dashboard
 * - Alertas críticos
 */

import { useState, useEffect, useCallback } from 'react';

// Tipos para os dados persistidos
interface PersistedAgentStatus {
  status: string;
  statusText: string;
  lastSync: string;
  nextSync: string;
  performance: number;
  lastExecution: string;
  executionsToday: number;
  successRate: number;
  timestamp: number; // Para verificar validade
}

interface PersistedLastUpdate {
  timeAgo: string;
  nextUpdate: string;
  activity: any;
  timestamp: number;
}

interface PersistedClientSync {
  clientId: string;
  lastSync: string;
  timestamp: number;
}

interface PersistenceConfig {
  agentStatusTTL: number; // Time To Live em ms
  lastUpdateTTL: number;
  clientSyncTTL: number;
}

// Configuração padrão (TTL = Time To Live)
const DEFAULT_CONFIG: PersistenceConfig = {
  agentStatusTTL: 30 * 60 * 1000, // 30 minutos
  lastUpdateTTL: 60 * 60 * 1000,  // 1 hora
  clientSyncTTL: 2 * 60 * 60 * 1000 // 2 horas
};

export function usePersistence(config: PersistenceConfig = DEFAULT_CONFIG) {
  // Chaves do localStorage
  const KEYS = {
    AGENT_STATUS: 'sevenscale_agent_status',
    LAST_UPDATE: 'sevenscale_last_update',
    CLIENT_SYNCS: 'sevenscale_client_syncs',
    EXECUTION_COUNT: 'sevenscale_execution_count'
  };

  /**
   * ✅ SALVAR STATUS DO AGENTE
   */
  const saveAgentStatus = useCallback((agentStatus: Partial<PersistedAgentStatus>) => {
    try {
      const persistedData: PersistedAgentStatus = {
        status: agentStatus.status || 'active',
        statusText: agentStatus.statusText || 'Ativo',
        lastSync: agentStatus.lastSync || 'Agora',
        nextSync: agentStatus.nextSync || '30min',
        performance: agentStatus.performance || 95,
        lastExecution: agentStatus.lastExecution || new Date().toISOString(),
        executionsToday: agentStatus.executionsToday || 1,
        successRate: agentStatus.successRate || 95,
        timestamp: Date.now()
      };

      localStorage.setItem(KEYS.AGENT_STATUS, JSON.stringify(persistedData));
      console.log('💾 Status do agente salvo no localStorage:', persistedData);
      
      return persistedData;
    } catch (error) {
      console.error('❌ Erro ao salvar status do agente:', error);
      return null;
    }
  }, [KEYS.AGENT_STATUS]);

  /**
   * ✅ RECUPERAR STATUS DO AGENTE
   */
  const getAgentStatus = useCallback((): PersistedAgentStatus | null => {
    try {
      const stored = localStorage.getItem(KEYS.AGENT_STATUS);
      if (!stored) return null;

      const data: PersistedAgentStatus = JSON.parse(stored);
      
      // Verificar se ainda está válido (TTL)
      const isValid = (Date.now() - data.timestamp) < config.agentStatusTTL;
      
      if (!isValid) {
        console.log('⏰ Status do agente expirado, removendo do localStorage');
        localStorage.removeItem(KEYS.AGENT_STATUS);
        return null;
      }

      console.log('📖 Status do agente recuperado do localStorage:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao recuperar status do agente:', error);
      return null;
    }
  }, [KEYS.AGENT_STATUS, config.agentStatusTTL]);

  /**
   * ✅ SALVAR ÚLTIMA ATUALIZAÇÃO
   */
  const saveLastUpdate = useCallback((lastUpdate: Partial<PersistedLastUpdate>) => {
    try {
      const persistedData: PersistedLastUpdate = {
        timeAgo: lastUpdate.timeAgo || 'Agora',
        nextUpdate: lastUpdate.nextUpdate || '30min',
        activity: lastUpdate.activity || null,
        timestamp: Date.now()
      };

      localStorage.setItem(KEYS.LAST_UPDATE, JSON.stringify(persistedData));
      console.log('💾 Última atualização salva no localStorage:', persistedData);
      
      return persistedData;
    } catch (error) {
      console.error('❌ Erro ao salvar última atualização:', error);
      return null;
    }
  }, [KEYS.LAST_UPDATE]);

  /**
   * ✅ RECUPERAR ÚLTIMA ATUALIZAÇÃO
   */
  const getLastUpdate = useCallback((): PersistedLastUpdate | null => {
    try {
      const stored = localStorage.getItem(KEYS.LAST_UPDATE);
      if (!stored) return null;

      const data: PersistedLastUpdate = JSON.parse(stored);
      
      // Verificar se ainda está válido
      const isValid = (Date.now() - data.timestamp) < config.lastUpdateTTL;
      
      if (!isValid) {
        console.log('⏰ Última atualização expirada, removendo do localStorage');
        localStorage.removeItem(KEYS.LAST_UPDATE);
        return null;
      }

      console.log('📖 Última atualização recuperada do localStorage:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao recuperar última atualização:', error);
      return null;
    }
  }, [KEYS.LAST_UPDATE, config.lastUpdateTTL]);

  /**
   * ✅ SALVAR SINCRONIZAÇÕES DOS CLIENTES
   */
  const saveClientSyncs = useCallback((clientSyncs: Array<{ clientId: string; lastSync: string; }>) => {
    try {
      const persistedData: PersistedClientSync[] = clientSyncs.map(sync => ({
        clientId: sync.clientId,
        lastSync: sync.lastSync,
        timestamp: Date.now()
      }));

      localStorage.setItem(KEYS.CLIENT_SYNCS, JSON.stringify(persistedData));
      console.log('💾 Sincronizações dos clientes salvas no localStorage:', persistedData.length, 'clientes');
      
      return persistedData;
    } catch (error) {
      console.error('❌ Erro ao salvar sincronizações dos clientes:', error);
      return null;
    }
  }, [KEYS.CLIENT_SYNCS]);

  /**
   * ✅ RECUPERAR SINCRONIZAÇÕES DOS CLIENTES
   */
  const getClientSyncs = useCallback((): PersistedClientSync[] => {
    try {
      const stored = localStorage.getItem(KEYS.CLIENT_SYNCS);
      if (!stored) return [];

      const data: PersistedClientSync[] = JSON.parse(stored);
      
      // Filtrar apenas sincronizações válidas (TTL)
      const validSyncs = data.filter(sync => {
        const isValid = (Date.now() - sync.timestamp) < config.clientSyncTTL;
        return isValid;
      });

      // Se filtrou alguns, atualizar localStorage
      if (validSyncs.length !== data.length) {
        console.log('⏰ Algumas sincronizações expiraram, atualizando localStorage');
        localStorage.setItem(KEYS.CLIENT_SYNCS, JSON.stringify(validSyncs));
      }

      console.log('📖 Sincronizações dos clientes recuperadas do localStorage:', validSyncs.length, 'clientes');
      return validSyncs;
    } catch (error) {
      console.error('❌ Erro ao recuperar sincronizações dos clientes:', error);
      return [];
    }
  }, [KEYS.CLIENT_SYNCS, config.clientSyncTTL]);

  /**
   * ✅ SALVAR CONTADOR DE EXECUÇÕES
   */
  const saveExecutionCount = useCallback((count: number) => {
    try {
      const data = {
        count,
        date: new Date().toDateString(), // Resetar por dia
        timestamp: Date.now()
      };

      localStorage.setItem(KEYS.EXECUTION_COUNT, JSON.stringify(data));
      console.log('💾 Contador de execuções salvo:', count);
      
      return count;
    } catch (error) {
      console.error('❌ Erro ao salvar contador de execuções:', error);
      return 0;
    }
  }, [KEYS.EXECUTION_COUNT]);

  /**
   * ✅ RECUPERAR CONTADOR DE EXECUÇÕES
   */
  const getExecutionCount = useCallback((): number => {
    try {
      const stored = localStorage.getItem(KEYS.EXECUTION_COUNT);
      if (!stored) return 0;

      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      
      // Resetar se for outro dia
      if (data.date !== today) {
        console.log('📅 Novo dia detectado, resetando contador de execuções');
        localStorage.removeItem(KEYS.EXECUTION_COUNT);
        return 0;
      }

      console.log('📖 Contador de execuções recuperado:', data.count);
      return data.count || 0;
    } catch (error) {
      console.error('❌ Erro ao recuperar contador de execuções:', error);
      return 0;
    }
  }, [KEYS.EXECUTION_COUNT]);

  /**
   * ✅ LIMPAR TODOS OS DADOS PERSISTIDOS
   */
  const clearAllPersistedData = useCallback(() => {
    try {
      Object.values(KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🧹 Todos os dados persistidos foram limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados persistidos:', error);
    }
  }, [KEYS]);

  /**
   * ✅ VERIFICAR SE HÁ DADOS PERSISTIDOS
   */
  const hasPersistedData = useCallback(() => {
    try {
      const hasAgent = !!localStorage.getItem(KEYS.AGENT_STATUS);
      const hasUpdate = !!localStorage.getItem(KEYS.LAST_UPDATE);
      const hasClients = !!localStorage.getItem(KEYS.CLIENT_SYNCS);
      
      return {
        hasAgent,
        hasUpdate,
        hasClients,
        hasAny: hasAgent || hasUpdate || hasClients
      };
    } catch (error) {
      console.error('❌ Erro ao verificar dados persistidos:', error);
      return {
        hasAgent: false,
        hasUpdate: false,
        hasClients: false,
        hasAny: false
      };
    }
  }, [KEYS]);

  /**
   * ✅ ATUALIZAR TTL DOS DADOS (extend expiration)
   */
  const refreshPersistenceTimestamp = useCallback(() => {
    try {
      const now = Date.now();
      
      // Atualizar timestamp do status do agente
      const agentStatus = getAgentStatus();
      if (agentStatus) {
        agentStatus.timestamp = now;
        localStorage.setItem(KEYS.AGENT_STATUS, JSON.stringify(agentStatus));
      }
      
      // Atualizar timestamp da última atualização
      const lastUpdate = getLastUpdate();
      if (lastUpdate) {
        lastUpdate.timestamp = now;
        localStorage.setItem(KEYS.LAST_UPDATE, JSON.stringify(lastUpdate));
      }
      
      // Atualizar timestamp das sincronizações
      const clientSyncs = getClientSyncs();
      if (clientSyncs.length > 0) {
        const updatedSyncs = clientSyncs.map(sync => ({ ...sync, timestamp: now }));
        localStorage.setItem(KEYS.CLIENT_SYNCS, JSON.stringify(updatedSyncs));
      }
      
      console.log('🔄 Timestamps de persistência atualizados');
    } catch (error) {
      console.error('❌ Erro ao atualizar timestamps:', error);
    }
  }, [KEYS, getAgentStatus, getLastUpdate, getClientSyncs]);

  return {
    // Status do agente
    saveAgentStatus,
    getAgentStatus,
    
    // Última atualização
    saveLastUpdate,
    getLastUpdate,
    
    // Sincronizações dos clientes
    saveClientSyncs,
    getClientSyncs,
    
    // Contador de execuções
    saveExecutionCount,
    getExecutionCount,
    
    // Utilitários
    clearAllPersistedData,
    hasPersistedData,
    refreshPersistenceTimestamp,
    
    // Configuração
    config
  };
}

export default usePersistence;