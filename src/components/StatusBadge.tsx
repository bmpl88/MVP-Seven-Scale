import React from 'react';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'connected' | 'warning' | 'disconnected' | 'processing';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  connected: {
    bg: '#03A63C20',
    text: '#03A63C',
    icon: CheckCircle,
    defaultLabel: 'Conectado'
  },
  warning: {
    bg: '#F59E0B20',
    text: '#F59E0B',
    icon: AlertTriangle,
    defaultLabel: 'Atenção'
  },
  disconnected: {
    bg: '#EF444420',
    text: '#EF4444',
    icon: AlertTriangle,
    defaultLabel: 'Desconectado'
  },
  processing: {
    bg: '#0468BF20',
    text: '#0468BF',
    icon: Clock,
    defaultLabel: 'Processando'
  }
};

const sizeConfig = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'w-3 h-3'
  },
  md: {
    padding: 'px-3 py-1',
    text: 'text-sm',
    icon: 'w-4 h-4'
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    icon: 'w-5 h-5'
  }
};

export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <div 
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeStyles.padding} ${sizeStyles.text}`}
      style={{ 
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      <Icon className={sizeStyles.icon} />
      {displayLabel}
    </div>
  );
}