import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';

export default function Integrations() {
  const { integrationHealth, loadIntegrationHealth, loading } = useDashboardContext();
  const [integrations, setIntegrations] = useState<any[]>([]);
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    loadIntegrationHealth();
  }, [loadIntegrationHealth]);

  // Processar dados das integrações
  useEffect(() => {
    // Definir as 6 integrações core para o MVP
    const coreIntegrations = [
      {
        id: 'hubspot',
        name: 'HubSpot CRM',
        logo: '🔗',
        status: 'connected'
      },
      {
        id: 'rd-station',
        name: 'RD Station CRM',
        logo: '📞',
        status: 'connected'
      },
      {
        id: 'google-analytics',
        name: 'Google Analytics',
        logo: '📊',
        status: 'connected'
      },
      {
        id: 'meta-ads',
        name: 'Meta Ads',
        logo: '📘',
        status: 'pending'
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        logo: '📅',
        status: 'connected'
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp Business',
        logo: '💬',
        status: 'disconnected'
      }
    ];
    
    // Atualizar com dados reais do backend quando disponíveis
    if (integrationHealth && integrationHealth.length > 0) {
      integrationHealth.forEach(healthData => {
        const matchingIntegration = coreIntegrations.find(
          int => int.id === healthData.integration_type?.toLowerCase()
        );
        
        if (matchingIntegration) {
          // Atualizar status com base nos dados reais
          if (healthData.status) {
            matchingIntegration.status = healthData.status;
          }
        }
      });
    }
    
    setIntegrations(coreIntegrations);
  }, [integrationHealth]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return { 
          bg: '#03A63C20', 
          text: '#03A63C', 
          label: 'Conectado', 
          icon: CheckCircle 
        };
      case 'pending':
        return { 
          bg: '#F59E0B20', 
          text: '#F59E0B', 
          label: 'Pendente', 
          icon: Clock 
        };
      case 'disconnected':
        return { 
          bg: '#EF444420', 
          text: '#EF4444', 
          label: 'Desconectado', 
          icon: AlertTriangle 
        };
      default:
        return { 
          bg: '#6B728020', 
          text: '#6B7280', 
          label: 'Desconhecido', 
          icon: Clock 
        };
    }
  };

  const handleConfigure = (integration: any) => {
    alert(`Configurar ${integration.name}`);
  };

  const handleSyncAll = () => {
    alert('Sincronizando todas as integrações...');
  };

  if (loading && integrations.length === 0) {
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setup de Integrações - MVP Tier 1</h1>
            <p className="text-gray-600">Conecte as ferramentas essenciais para sua clínica</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSyncAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Sincronizar Todas
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {/* Grid de Integrações - 2x3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const statusConfig = getStatusConfig(integration.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div 
                key={integration.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{integration.logo}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{integration.name}</h3>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusConfig.bg }}
                  >
                    <StatusIcon className="w-3 h-3" style={{ color: statusConfig.text }} />
                    <span className="text-xs font-medium" style={{ color: statusConfig.text }}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Botão de Ação */}
                <button
                  onClick={() => handleConfigure(integration)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Configurar
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}