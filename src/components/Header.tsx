import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Consultório Dr. Silva</h2>
            <p className="text-gray-600">Clínica Médica • Janeiro - Dezembro 2024</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#03A63C20' }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#03A63C' }} />
            <span className="font-semibold" style={{ color: '#03A63C' }}>Cliente Ativo</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Período de Consultoria</p>
          <p className="text-lg font-semibold text-gray-900">12 meses</p>
        </div>
      </div>
    </header>
  );
}