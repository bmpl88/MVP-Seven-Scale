import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, UserCheck, Target } from 'lucide-react';

const metrics = [
  {
    title: 'Receita Mensal',
    value: 347500,
    displayValue: 'R$ 347.500',
    change: '+23.4%',
    changeType: 'positive' as const,
    subtitle: 'vs mês anterior',
    icon: DollarSign,
    color: '#2563eb',
    tooltip: 'Receita bruta da clínica no mês atual. Crescimento sustentado desde implementação SevenScale.'
  },
  {
    title: 'Crescimento Acumulado',
    value: 285000,
    displayValue: '+R$ 285.000',
    change: '287%',
    changeType: 'positive' as const,
    subtitle: 'desde SevenScale (8 meses)',
    icon: TrendingUp,
    color: '#10b981',
    tooltip: 'Total adicional de receita gerada desde o início da parceria SevenScale há 8 meses.'
  },
  {
    title: 'Ticket Médio/Paciente',
    value: 4450,
    displayValue: 'R$ 4.450',
    change: '+18.7%',
    changeType: 'positive' as const,
    subtitle: 'vs baseline pré-SevenScale',
    icon: UserCheck,
    color: '#2563eb',
    tooltip: 'Valor médio por paciente atendido. Aumento indica melhor qualificação de leads.'
  },
  {
    title: 'ROI Investimento SevenScale',
    value: 1247,
    displayValue: '1.247%',
    change: '+R$ 249.400',
    changeType: 'positive' as const,
    subtitle: 'retorno em 8 meses',
    icon: Target,
    color: '#f59e0b',
    tooltip: 'Retorno sobre investimento na consultoria SevenScale. Cada R$ 1 investido retornou R$ 12,47.',
    special: true
  }
];

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
}

const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  separator = '.' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return <span>{prefix}{formatNumber(count)}{suffix}</span>;
};

export default function FinancialMetrics() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resultados Financeiros</h2>
        <p className="text-gray-600">Impacto direto da metodologia SevenScale no faturamento</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mt-3"></div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isHovered = hoveredCard === index;
          
          return (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-300 ${
                isHovered ? 'transform -translate-y-1' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div 
                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full transition-all duration-300 ${
                  isHovered ? 'shadow-lg border-gray-200' : ''
                } ${
                  metric.special ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' : ''
                }`}
              >
                {/* Special ROI Badge */}
                {metric.special && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ROI COMPROVADO
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-1">{metric.title}</p>
                    <div className="mb-2">
                      {metric.title === 'ROI Investimento SevenScale' ? (
                        <p className="text-3xl font-bold text-gray-900">
                          <CountUp end={1247} suffix="%" duration={2500} />
                        </p>
                      ) : metric.title === 'Receita Mensal' ? (
                        <p className="text-3xl font-bold text-gray-900">
                          R$ <CountUp end={347} separator="." duration={2000} />.500
                        </p>
                      ) : metric.title === 'Crescimento Acumulado' ? (
                        <p className="text-3xl font-bold text-green-600">
                          +R$ <CountUp end={285} separator="." duration={2000} />.000
                        </p>
                      ) : (
                        <p className="text-3xl font-bold text-gray-900">
                          R$ <CountUp end={4} duration={1500} />.450
                        </p>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{metric.subtitle}</p>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {metric.change}
                    </div>
                  </div>
                  <div 
                    className={`p-3 rounded-lg transition-transform duration-300 ${
                      isHovered ? 'transform rotate-6' : ''
                    }`}
                    style={{ backgroundColor: metric.color + '20' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: metric.color }} />
                  </div>
                </div>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs text-center">
                      {metric.tooltip}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Message */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Comprovação de Resultados SevenScale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-blue-800">+R$ 285k receita adicional</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-blue-800">+18.7% ticket médio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-blue-800">1.247% ROI comprovado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-blue-800">+23.4% crescimento mensal</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">R$ 287k</p>
            <p className="text-blue-700 text-sm">ROI líquido mensal</p>
            <p className="text-blue-600 text-xs mt-1">Investimento: R$ 25k/mês</p>
          </div>
        </div>
      </div>
    </div>
  );
}