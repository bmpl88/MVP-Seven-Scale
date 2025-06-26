import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Bell, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';

export default function Dashboard() {
  const { 
    overview, 
    clientPerformance, 
    agentStatus,
    agentStatusLoading,
    loadOverview, 
    loadClientPerformance,
    loadAgentStatus,
    loading 
  } = useDashboardContext();
  
  const [clientsData, setClientsData] = useState<any[]>([]);
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    loadOverview();
    loadClientPerformance();
  }, [loadOverview, loadClientPerformance]);
  
  // Processar dados dos clientes
  useEffect(() => {
    if (clientPerformance && clientPerformance.length > 0) {
      const processedClients = clientPerformance.map(client => {
        return {
          id: client.id,
          name: client.name,
          specialty: client.specialty,
          status: client.status === 'operational' ? 'Ativo' : 'Inativo',
          lastSync: Math.floor(Math.random() * 8) + 1 + 'h atrás'
        };
      });
      
      setClientsData(processedClients);
    }
  }, [clientPerformance]);

  if (loading && !overview) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da plataforma SevenScale</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                loadOverview();
                loadClientPerformance();
                loadAgentStatus();
              }}
              disabled={loading || agentStatusLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || agentStatusLoading) ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Clientes Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{overview?.total_clients || 8}</p>
                <p className="text-gray-500 text-sm mb-3">
                  {overview?.operational_clients || 7} OK, {overview?.attention_clients || 1} atenção
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* CARD DINÂMICO STATUS AGENTE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-600 text-sm font-medium">Status Agente</p>
                  {agentStatusLoading && (
                    <div className="w-3 h-3 rounded-full border border-gray-300 border-t-blue-600 animate-spin"></div>
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {agentStatus?.statusText || 'Carregando...'}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {agentStatus?.lastSync ? `Última sync: ${agentStatus.lastSync}` : 'Aguardando dados'}
                </p>
                {agentStatus?.nextSync && (
                  <p className="text-xs text-gray-400">
                    Próxima: {agentStatus.nextSync}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                agentStatus?.status === 'active' ? 'bg-green-100' :
                agentStatus?.status === 'processing' ? 'bg-purple-100' :
                agentStatus?.status === 'attention' ? 'bg-amber-100' :
                'bg-gray-100'
              }`}>
                {agentStatus?.status === 'processing' ? (
                  <Clock className={`w-6 h-6 ${
                    agentStatus?.status === 'active' ? 'text-green-600' :
                    agentStatus?.status === 'processing' ? 'text-purple-600 animate-pulse' :
                    agentStatus?.status === 'attention' ? 'text-amber-600' :
                    'text-gray-600'
                  }`} />
                ) : agentStatus?.status === 'active' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : agentStatus?.status === 'attention' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                ) : (
                  <Clock className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
            {agentStatus?.performance && agentStatus.performance > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Performance</span>
                  <span>{agentStatus.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      agentStatus.performance >= 90 ? 'bg-green-500' :
                      agentStatus.performance >= 70 ? 'bg-blue-500' :
                      agentStatus.performance >= 50 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${agentStatus.performance}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Última Atualização</p>
                <p className="text-xl font-bold text-gray-900 mb-1">Há 2 horas</p>
                <p className="text-gray-500 text-sm mb-3">Próxima: 15min</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Alertas</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">2</p>
                <p className="text-gray-500 text-sm mb-3">Requerem atenção</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Clientes Ativos</h3>
            <div className="text-sm text-gray-500">Total: {clientsData.length}</div>
          </div>

          <div className="space-y-4">
            {clientsData.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: client.status === 'Ativo' ? '#10b981' : '#f59e0b' }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{client.name}</h4>
                    <p className="text-gray-600 text-sm">{client.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900">{client.status}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Última sync</p>
                    <p className="text-gray-500 text-sm">{client.lastSync}</p>
                  </div>
                  
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Alertas Recentes</h3>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Atualização Pendente</h4>
                  <p className="text-gray-700 text-sm">Clínica CardioVida aguardando sincronização há mais de 4h</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs ml-8">2 horas atrás</p>
            </div>

            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex items-start gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Integração Desconectada</h4>
                  <p className="text-gray-700 text-sm">WhatsApp API desconectada para Dr. Santos</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs ml-8">1 hora atrás</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}