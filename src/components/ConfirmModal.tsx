import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  agentName: string;
  agentIcon: string;
  processingClients: number;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  agentName, 
  agentIcon, 
  processingClients 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{agentIcon}</div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Tem certeza que deseja desativar o agente {agentName}?
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">IMPACTOS:</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• Processamentos em andamento serão pausados</li>
                  <li>• {processingClients} cliente{processingClients !== 1 ? 's' : ''} na fila serão transferidos para análise manual</li>
                  <li>• Histórico de configurações será mantido</li>
                  <li>• Agente pode ser reativado a qualquer momento</li>
                </ul>
                <p className="text-amber-700 text-sm mt-3 font-medium">
                  Esta ação não afeta outros agentes IA.
                </p>
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
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Desativar Agente
          </button>
        </div>
      </div>
    </div>
  );
}