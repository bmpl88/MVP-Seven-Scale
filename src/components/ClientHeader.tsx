import React from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';

export default function ClientHeader() {
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

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#03A63C' }} />
            <span className="font-semibold" style={{ color: '#03A63C' }}>7 Agentes Ativos</span>
          </div>
        </div>
        
        {/* Last Update */}
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Última atualização</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">Agora há pouco</p>
        </div>
      </div>
    </header>
  );
}