import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import NewClientModal from '../components/NewClientModal';
import { useDashboardContext } from '../context/DashboardContext';
import { useNavigate } from 'react-router-dom';

export default function Clients() {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  
  const { clientPerformance, loadClientPerformance, loading } = useDashboardContext();
  const [clientsData, setClientsData] = useState<any[]>([]);
  const navigate = useNavigate();

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadClientPerformance();
  }, [loadClientPerformance]);
  
  // Processar dados dos clientes
  useEffect(() => {
    if (clientPerformance && clientPerformance.length > 0) {
      // Processar dados dos clientes
      const processedClients = clientPerformance.map(client => {
        return {
          id: client.id,
          name: client.name,
          specialty: client.specialty,
          status: client.status === 'operational' ? 'Ativo' : 'Inativo',
          lastSync: Math.floor(Math.random() * 8) + 1 + 'h atrás'
        };
      });
      
      // Mostrar TODOS os clientes (removido limite do MVP)
      setClientsData(processedClients);
    }
  }, [clientPerformance]);

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
               {clientsData.filter(c => c.status === 'Inativo').length} inativos)
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
                    <span>Última sincronização: {client.lastSync}</span>
                  </div>
                </div>

                {/* Botão de Ação */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleViewDashboard}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: '#0468BF' }}
                  >
                    <Eye className="w-4 h-4" />
                    Ver Dashboard
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
    </div>
  );
}
