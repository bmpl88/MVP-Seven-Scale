import React, { useState } from 'react';
import { X, Bot, Zap, Target, Clock, CheckCircle, Settings } from 'lucide-react';

interface ConfigureAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySettings: (settings: GlobalSettings) => void;
  currentStats: {
    activeAgents: number;
    totalAgents: number;
    processingTasks: number;
    successRate: number;
    avgResponseTime: string;
  };
}

interface GlobalSettings {
  model: string;
  rateLimit: number;
  timeout: number;
  operationMode: string;
  action?: 'activate-all' | 'pause-all' | 'restart-all';
}

export default function ConfigureAllModal({ 
  isOpen, 
  onClose, 
  onApplySettings, 
  currentStats 
}: ConfigureAllModalProps) {
  const [settings, setSettings] = useState<GlobalSettings>({
    model: 'gpt-4-turbo',
    rateLimit: 50,
    timeout: 120,
    operationMode: 'production'
  });

  if (!isOpen) return null;

  const handleBatchAction = (action: 'activate-all' | 'pause-all' | 'restart-all') => {
    onApplySettings({ ...settings, action });
  };

  const handleApplySettings = () => {
    onApplySettings(settings);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Configuração Global - 7 Agentes IA</h3>
              <p className="text-gray-600">Gerenciar todos os agentes simultaneamente</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Status Overview */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
                <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#03A63C' }} />
                <p className="text-lg font-bold text-gray-900">{currentStats.activeAgents}</p>
                <p className="text-gray-600 text-sm">agentes ativos</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#F59E0B10' }}>
                <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: '#F59E0B' }} />
                <p className="text-lg font-bold text-gray-900">{currentStats.processingTasks}</p>
                <p className="text-gray-600 text-sm">processamentos</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#0468BF10' }}>
                <Target className="w-6 h-6 mx-auto mb-2" style={{ color: '#0468BF' }} />
                <p className="text-lg font-bold text-gray-900">{currentStats.successRate}%</p>
                <p className="text-gray-600 text-sm">taxa de sucesso</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: '#7E5EF210' }}>
                <Zap className="w-6 h-6 mx-auto mb-2" style={{ color: '#7E5EF2' }} />
                <p className="text-lg font-bold text-gray-900">{currentStats.avgResponseTime}</p>
                <p className="text-gray-600 text-sm">tempo médio</p>
              </div>
            </div>
          </div>

          {/* Batch Actions */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Ações em Massa</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleBatchAction('activate-all')}
                className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-green-200 text-green-700 hover:bg-green-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Ativar Todos</span>
              </button>
              <button
                onClick={() => handleBatchAction('pause-all')}
                className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Clock className="w-5 h-5" />
                <span className="font-medium">Pausar Todos</span>
              </button>
              <button
                onClick={() => handleBatchAction('restart-all')}
                className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Zap className="w-5 h-5" />
                <span className="font-medium">Reiniciar Todos</span>
              </button>
            </div>
          </div>

          {/* Global Settings */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Configurações Globais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo IA Global
                </label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude 3</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate Limit Global: {settings.rateLimit} req/min
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.rateLimit}
                  onChange={(e) => setSettings(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout Global (segundos)
                </label>
                <input
                  type="number"
                  min="60"
                  max="300"
                  value={settings.timeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modo de Operação
                </label>
                <select
                  value={settings.operationMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, operationMode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="production">Produção</option>
                  <option value="development">Desenvolvimento</option>
                  <option value="testing">Teste</option>
                  <option value="maintenance">Manutenção</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleApplySettings}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Settings className="w-4 h-4" />
            Aplicar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}