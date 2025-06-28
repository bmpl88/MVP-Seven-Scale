import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Brain, 
  Target,
  FileText
} from 'lucide-react';

const navigationItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral', active: true },
  { id: 'performance', icon: TrendingUp, label: 'Performance', active: false },
  { id: 'insights', icon: Brain, label: 'Insights IA', active: false },
  { id: 'growth', icon: Target, label: 'Growth', active: false },
  { id: 'reports', icon: FileText, label: 'Relatórios', active: false },
];

export default function ClientNavigation() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <nav className="bg-white border-b border-gray-200 px-8">
      <div className="flex space-x-8">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
              item.id === activeTab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={item.id === activeTab ? { borderColor: '#0468BF', color: '#0468BF' } : {}}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}