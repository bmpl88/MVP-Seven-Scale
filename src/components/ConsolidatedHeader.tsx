import React from 'react';
import { Activity, CheckCircle, Clock, Zap } from 'lucide-react';

export default function ConsolidatedHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* SevenScale Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#7E5EF2' }}>
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SevenScale</h1>
              <p className="text-gray-500 text-sm">AI Medical Platform</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="border-l border-gray-200 pl-8">
            <h2 className="text-xl font-bold text-gray-900">Consultório Dr. Silva</h2>
            <p className="text-gray-600">Clínica Médica • Plano Premium</p>
          </div>

          {/* AI Status */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#03A63C' }} />
            <span className="font-semibold" style={{ color: '#03A63C' }}>7 Agentes IA Ativos</span>
          </div>
        </div>
        
        {/* Analysis Status */}
        <div className="text-right">
          <div className="flex items-center gap-6 mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Última análise: <span className="font-medium">Há 3h</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: '#7E5EF2' }} />
              <span className="text-sm text-gray-600">Próxima: <span className="font-medium">Em 4h 15min</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#03A63C20' }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#03A63C' }} />
            <span className="text-sm font-medium" style={{ color: '#03A63C' }}>Sistema funcionando perfeitamente</span>
          </div>
        </div>
      </div>
    </header>
  );
}