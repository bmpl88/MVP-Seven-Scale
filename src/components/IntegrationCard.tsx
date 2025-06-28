import React from 'react';
import { CheckCircle, AlertTriangle, Clock, Settings, TestTube, FileText, Wrench } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'warning' | 'disconnected';
  lastSync: string;
  priority: 'CRÍTICA' | 'ALTA' | 'MÉDIA' | 'BAIXA';
  metrics: {
    primary: string;
    secondary: string;
    tertiary: string;
    latency: string;
  };
  syncedData: string[];
  statusDetails: {
    rateLimit: string;
    health: string;
    quality: string;
  };
  actions: string[];
}

interface IntegrationCardProps {
  integration: Integration;
  onConfigure: (integration: Integration) => void;
  onTest: (integration: Integration) => void;
  onViewLogs: (integration: Integration) => void;
  onSpecialAction: (integration: Integration) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'connected':
      return { 
        bg: '#03A63C20', 
        text: '#03A63C', 
        label: 'Conectado', 
        icon: CheckCircle 
      };
    case 'warning':
      return { 
        bg: '#F59E0B20', 
        text: '#F59E0B', 
        label: 'Atenção', 
        icon: AlertTriangle 
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

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'CRÍTICA':
      return { bg: '#EF444420', text: '#EF4444' };
    case 'ALTA':
      return { bg: '#F59E0B20', text: '#F59E0B' };
    case 'MÉDIA':
      return { bg: '#0468BF20', text: '#0468BF' };
    case 'BAIXA':
      return { bg: '#6B728020', text: '#6B7280' };
    default:
      return { bg: '#6B728020', text: '#6B7280' };
  }
};

export default function IntegrationCard({ 
  integration, 
  onConfigure, 
  onTest, 
  onViewLogs, 
  onSpecialAction 
}: IntegrationCardProps) {
  const statusConfig = getStatusConfig(integration.status);
  const priorityConfig = getPriorityConfig(integration.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{integration.logo}</div>
          <div>
            <h3 className="font-bold text-gray-900">{integration.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon className="w-4 h-4" style={{ color: statusConfig.text }} />
              <span className="text-sm" style={{ color: statusConfig.text }}>
                {statusConfig.label}
              </span>
              <span className="text-gray-500 text-sm">
                | Última sync: {integration.lastSync}
              </span>
            </div>
          </div>
        </div>
        <div 
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ 
            backgroundColor: priorityConfig.bg,
            color: priorityConfig.text
          }}
        >
          {integration.priority}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-lg font-bold text-gray-900">{integration.metrics.primary}</p>
          <p className="text-gray-600 text-xs">Métrica principal</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{integration.metrics.secondary}</p>
          <p className="text-gray-600 text-xs">Performance hoje</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{integration.metrics.tertiary}</p>
          <p className="text-gray-600 text-xs">Qualidade dados</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{integration.metrics.latency}</p>
          <p className="text-gray-600 text-xs">Latência média</p>
        </div>
      </div>

      {/* Dados Sincronizados */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Dados sincronizados</p>
        <div className="space-y-1">
          {integration.syncedData.map((data, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" style={{ color: '#03A63C' }} />
              <span className="text-xs text-gray-600">{data}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Detalhado */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Status detalhado</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Rate Limit:</span>
            <span className="text-xs font-medium text-gray-900">{integration.statusDetails.rateLimit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Health:</span>
            <span className="text-xs font-medium text-gray-900">{integration.statusDetails.health}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Quality:</span>
            <span className="text-xs font-medium text-gray-900">{integration.statusDetails.quality}</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onConfigure(integration)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
        >
          <Settings className="w-4 h-4" />
          Configurar
        </button>
        <button 
          onClick={() => onTest(integration)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
        >
          <TestTube className="w-4 h-4" />
          Testar Conexão
        </button>
        <button 
          onClick={() => onViewLogs(integration)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
        >
          <FileText className="w-4 h-4" />
          Logs
        </button>
        <button 
          onClick={() => onSpecialAction(integration)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: statusConfig.text }}
        >
          <Wrench className="w-4 h-4" />
          {integration.actions[0]}
        </button>
      </div>
    </div>
  );
}