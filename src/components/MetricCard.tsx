import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  subtitle?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  subtitle 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm mb-2">{subtitle}</p>
          )}
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
            changeType === 'positive' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {change}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${
          changeType === 'positive' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`} />
        </div>
      </div>
    </div>
  );
}