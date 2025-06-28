import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import NewClientModal from '../components/NewClientModal';
import ClientLogsModal from '../components/ClientLogsModal';
import { useDashboardContext } from '../context/DashboardContext';
import { agentApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Clients() {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClientLogs, setSelectedClientLogs] = useState<{id: string, name: string} | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const { clientPerformance, loadClientPerformance, loading } = useDashboardContext();
  const [clientsData, setClientsData] = useState<any[]>([]);
  const navigate = useNavigate();

  // ✅ ATUALIZAR TEMPO A CADA MINUTO PARA CÁLCULOS DINÂMICOS
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadClientPerformance();
  }, [loadClientPerformance]);
  
  // ✅ FUNÇÃO PARA GARANTIR STRING
  const ensureString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Objeto inválido]';
      }
    }
    return String(value);
  };

  // ✅ FUNÇÃO PARA CALCULAR TEMPO DECORRIDO DINAMICAMENTE
  const calculateTimeAgo = (timestamp) => {
    if (!timestamp) return 'Nunca';
    
    const now = currentTime;
    const time = new Date(timestamp).getTime();
    const diffMs = now - time;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
      return 'Agora';
    } else if (diffMinutes < 60) {
      return `Há ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Há ${diffHours}h`;
    } else {
      return `Há ${diffDays}d`;
    }
  };

  // ✅ BUSCAR DADOS REAIS DE SINCRONIZAÇÃO
  const loadClientInsights = async () => {
    try {
      console.log('🔥 Buscando insights reais dos agentes via agentApi...');
      const data = await agentApi.getInsights();
      console.log('✅ Insights reais carregados via agentApi:', data);
      return data.insights || data || [];
    } catch (error) {
      console.error('❌ Erro ao carregar insights:', error);
      return [];
    }
  };

  // ✅ OBTER ÚLTIMA SYNC REAL DO CLIENTE
  const getClientLastSync = (clientId, insights) => {
    if (!insights || insights.length === 0) {
      return 'Nunca';
    }
    
    // Filtrar insights do cliente específico
    const clientInsights = insights.filter(insight => {
      const insightClientId = ensureString(insight.client_id);
      return insightClientId === clientId || insightClientId === String(clientId);
    });
    
    if (clientInsights.length === 0) {
      return 'Nunca';
    }
    
    // Pegar o insight mais recente
    const lastInsight = clientInsights.sort((a, b) => 
      new Date(b.processed_at).getTime() - new Date(a.processed_at).getTime()
    )[0];
    
    return calculateTimeAgo(lastInsight.processed_at);
  };

  // ✅ PROCESSAR DADOS DOS CLIENTES COM DADOS REAIS
  useEffect(() => {
    const processClientsWithRealSync = async () => {
      if (clientPerformance && clientPerformance.length > 0) {
        console.log('🔄 Processando clientes com dados reais de sincronização...');
        
        // Buscar insights reais dos agentes
        const insights = await loadClientInsights();
        console.log('📊 Insights recebidos:', insights?.length || 0);
        
        // Processar dados dos clientes
        const processedClients = clientPerformance.map(client => {
          const clientId = ensureString(client.id);
          
          // ✅ OBTER DADOS REAIS DE SYNC APENAS PARA CLIENTES AUTORIZADOS
          const realLastSync = getClientLastSync(clientId, insights);
          
          // ✅ VALIDAR SE CLIENTE TEM DADOS REAIS (apenas clientes 1 e 2 são processados)
          if (realLastSync !== 'Nunca') {
            console.log(`✅ Cliente ${client.name} (ID: ${clientId}) - processado:`, realLastSync);
          } else {
            console.log(`🚫 Cliente ${client.name} (ID: ${clientId}) - não processado pelo agente`);
          }
          
          return {
            id: clientId,
            name: ensureString(client.name),
            specialty: ensureString(client.specialty),
            status: client.status === 'operational' ? 'Ativo' : 'Inativo',
            lastSync: realLastSync
          };
        });
        
        // Mostrar TODOS os clientes (removido limite do MVP)
        setClientsData(processedClients);
        console.log('✅ Clientes processados com dados reais:', processedClients.length);
      }
    };
    
    processClientsWithRealSync();
  }, [clientPerformance, currentTime]); // ✅ Dependências otimizadas

  const handleViewDashboard = () => {
    navigate('/cliente');
  };

  // 🆕 Função para recarregar lista após cadastro
  const handleClientCreated = async () => {
    console.log('🔄 handleClientCreated chamado - recarregando lista...');
    try {
      await loadClientPerformance();
      console.log('✅ Lista de clientes atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar lista:', error);
    }
  };

  if (loading && clientsData.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes MVP</h1>
            <p className="text-gray-600">
              {clientsData.length} clientes carregados 
              ({clientsData.filter(c => c.status === 'Ativo').length} ativos, 
               {clientsData.filter(c => c.status === 'Inativo').length} inativos) | 
              <span className="font-medium text-blue-600">
                Agente processa apenas clientes 1 e 2
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                console.log('🔄 Atualizando lista manualmente...');
                loadClientPerformance();
              }}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 disabled:opacity-50" 
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Carregando...
                </>
              ) : (
                <>
                  🔄 Atualizar
                </>
              )}
            </button>
            <button 
              onClick={() => setShowNewClientModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium" 
              style={{ backgroundColor: '#0468BF' }}
            >
              <Plus className="w-4 h-4" />
              Novo Cliente
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {/* Grid de Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {clientsData.map((client, index) => {
            const isActive = client.status === 'Ativo';
            // 🔧 GARANTIR KEY Única (ID ou fallback)
            const uniqueKey = client.id || `client-${index}-${client.name || 'unknown'}`;
            
            return (
              <div key={uniqueKey} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-gray-600 text-sm">{client.specialty}</p>
                    </div>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: isActive ? '#03A63C20' : '#F59E0B20' 
                    }}
                  >
                    {isActive ? (
                      <CheckCircle className="w-3 h-3" style={{ color: '#03A63C' }} />
                    ) : (
                      <AlertTriangle className="w-3 h-3" style={{ color: '#F59E0B' }} />
                    )}
                    <span 
                      className="text-xs font-medium" 
                      style={{ 
                        color: isActive ? '#03A63C' : '#F59E0B' 
                      }}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div>
                    <span>Última sincronização: </span>
                    <span className={`font-medium ${
                      ensureString(client.lastSync) === 'Agora' ? 'text-green-600' :
                      ensureString(client.lastSync).includes('min') ? 'text-blue-600' :
                      ensureString(client.lastSync) === 'Nunca' ? 'text-red-500' :
                      'text-gray-700'
                    }`}>
                      {ensureString(client.lastSync) === 'Agora' && '✅ '}
                      {ensureString(client.lastSync)}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleViewDashboard}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#0468BF' }}
                  >
                    <Eye className="w-4 h-4" />
                    Ver Dashboard
                  </button>
                  <button 
                    onClick={() => setSelectedClientLogs({id: ensureString(client.id), name: ensureString(client.name)})}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    title={`Ver logs de processamento de ${ensureString(client.name)}`}
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal Novo Cliente */}
      <NewClientModal 
        isOpen={showNewClientModal} 
        onClose={() => setShowNewClientModal(false)}
        onClientCreated={handleClientCreated} // 🆕 Callback para atualizar
      />
      
      {/* Modal de Logs do Cliente */}
      <ClientLogsModal
        isOpen={selectedClientLogs !== null}
        onClose={() => setSelectedClientLogs(null)}
        clientId={selectedClientLogs?.id || ''}
        clientName={selectedClientLogs?.name || ''}
      />
    </div>
  );
}