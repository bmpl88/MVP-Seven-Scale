import React, { useState } from 'react';
import { X, Plus, CheckCircle, Star, Zap, Clock, Target, Settings } from 'lucide-react';
import IntegrationSetupModal from './IntegrationSetupModal';
import CoreIntegrationSetupModal from './CoreIntegrationSetupModal';

interface NewIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIntegration: (integrationId: string) => void;
}

// Core SevenScale Integrations - Included in all plans
const coreIntegrations = [
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    logo: '🏢',
    description: 'CRM completo para clínicas médicas',
    benefits: [
      'Pipeline médico personalizado',
      'Lead scoring automático',
      'Automações follow-up',
      'Relatórios ROI'
    ],
    difficulty: 'Fácil',
    setupTime: '15 min',
    category: 'CRM'
  },
  {
    id: 'rd-station',
    name: 'RD Station Marketing',
    logo: '🎯',
    description: 'Marketing automation médico',
    benefits: [
      'Lead scoring inteligente',
      'Segmentação especialidades',
      'Email marketing médico',
      'Attribution multi-touch'
    ],
    difficulty: 'Fácil',
    setupTime: '10 min',
    category: 'Marketing'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    logo: '📅',
    description: 'Agendamentos médicos sincronizados',
    benefits: [
      'Agenda médica centralizada',
      'Sync bidirecional',
      'Lembretes automáticos',
      'Disponibilidade real-time'
    ],
    difficulty: 'Médio',
    setupTime: '20 min',
    category: 'Agendamento'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    logo: '📊',
    description: 'Analytics médico especializado',
    benefits: [
      'Tracking conversões',
      'Funil pacientes',
      'ROI campanhas',
      'Relatórios médicos'
    ],
    difficulty: 'Médio',
    setupTime: '25 min',
    category: 'Analytics'
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads Manager',
    logo: '📘',
    description: 'Campanhas pagas para clínicas',
    benefits: [
      'Pixel médico otimizado',
      'Audiences qualificadas',
      'Campanhas especialidades',
      'Attribution completa'
    ],
    difficulty: 'Avançado',
    setupTime: '30 min',
    category: 'Publicidade'
  }
];

// Complementary Integrations - Optional tools
const complementaryIntegrations = [
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    logo: '📧',
    description: 'Email marketing automatizado',
    category: 'Marketing',
    difficulty: 'Fácil'
  },
  {
    id: 'twilio',
    name: 'Twilio',
    logo: '📱',
    description: 'SMS e comunicação automatizada',
    category: 'Comunicação',
    difficulty: 'Médio'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💳',
    description: 'Processamento de pagamentos',
    category: 'Financeiro',
    difficulty: 'Médio'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    logo: '🎥',
    description: 'Teleconsultas integradas',
    category: 'Telemedicina',
    difficulty: 'Médio'
  },
  {
    id: 'typeform',
    name: 'Typeform',
    logo: '📋',
    description: 'Formulários inteligentes',
    category: 'Formulários',
    difficulty: 'Fácil'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    logo: '⚡',
    description: 'Automação entre aplicativos',
    category: 'Automação',
    difficulty: 'Avançado'
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '💬',
    description: 'Comunicação interna da equipe',
    category: 'Comunicação',
    difficulty: 'Fácil'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Fácil':
      return { bg: '#03A63C20', text: '#03A63C' };
    case 'Médio':
      return { bg: '#F59E0B20', text: '#F59E0B' };
    case 'Avançado':
      return { bg: '#EF444420', text: '#EF4444' };
    default:
      return { bg: '#6B728020', text: '#6B7280' };
  }
};

export default function NewIntegrationModal({ isOpen, onClose, onAddIntegration }: NewIntegrationModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showCoreSetupModal, setShowCoreSetupModal] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState('');

  if (!isOpen) return null;

  const allIntegrations = [...coreIntegrations, ...complementaryIntegrations];
  const categories = ['Todos', ...new Set(allIntegrations.map(int => int.category))];
  
  const filteredComplementaryIntegrations = complementaryIntegrations.filter(integration => {
    const matchesCategory = selectedCategory === 'Todos' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConfigureCore = (integrationId: string) => {
    setSelectedIntegrationId(integrationId);
    setShowCoreSetupModal(true);
  };

  const handleAddComplementary = (integrationId: string) => {
    setSelectedIntegrationId(integrationId);
    setShowSetupModal(true);
  };

  const handleSetupComplete = (integrationData: any) => {
    setShowSetupModal(false);
    setShowCoreSetupModal(false);
    onClose();
    onAddIntegration(integrationData.id);
  };

  const handleSetupClose = () => {
    setShowSetupModal(false);
    setShowCoreSetupModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Nova Integração</h3>
                <p className="text-gray-600">Conecte ferramentas ao ecossistema médico</p>
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
          <div className="p-6">
            {/* Core Integrations Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Integrações Core SevenScale</h4>
                  <p className="text-gray-600">Ferramentas essenciais incluídas em todos os planos</p>
                </div>
              </div>

              {/* Core Strategic Message */}
              <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-blue-800">Setup completo realizado pela nossa equipe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Configuração personalizada para sua especialidade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-blue-800">Suporte premium 24/7 para integrações Core</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-blue-800">Incluídas em todos os planos SevenScale</span>
                  </div>
                </div>
              </div>

              {/* Core Integrations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {coreIntegrations.map(integration => {
                  const difficultyConfig = getDifficultyColor(integration.difficulty);
                  
                  return (
                    <div 
                      key={integration.id}
                      className="relative border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50"
                    >
                      {/* Core Badge */}
                      <div className="absolute -top-3 left-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            CORE
                          </span>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            INCLUÍDO
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{integration.logo}</div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{integration.name}</h4>
                              <p className="text-gray-600 text-sm">{integration.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-900 mb-2">Benefícios:</h5>
                          <div className="space-y-1">
                            {integration.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Setup Info */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm">
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: difficultyConfig.bg,
                                color: difficultyConfig.text
                              }}
                            >
                              {integration.difficulty}
                            </span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600">{integration.setupTime}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleConfigureCore(integration.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          <Settings className="w-4 h-4" />
                          Configurar Agora
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complementary Integrations Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-gray-600" />
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Integrações Complementares</h4>
                  <p className="text-gray-600">Ferramentas opcionais para necessidades específicas</p>
                </div>
              </div>

              {/* Complementary Message */}
              <div className="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Integrações podem ser adicionadas conforme necessidade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">Algumas podem ter custos adicionais de licenciamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Setup realizado pela equipe SevenScale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Suporte padrão incluso</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Buscar integrações complementares..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complementary Integrations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComplementaryIntegrations.map(integration => {
                  const difficultyConfig = getDifficultyColor(integration.difficulty);
                  
                  return (
                    <div 
                      key={integration.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{integration.logo}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                            <p className="text-gray-600 text-sm">{integration.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {integration.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: difficultyConfig.bg,
                              color: difficultyConfig.text
                            }}
                          >
                            {integration.difficulty}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            OPCIONAL
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAddComplementary(integration.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Integração
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredComplementaryIntegrations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma integração encontrada com os filtros aplicados.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Core Integration Setup Modal */}
      <CoreIntegrationSetupModal
        isOpen={showCoreSetupModal}
        onClose={handleSetupClose}
        integrationId={selectedIntegrationId}
        onComplete={handleSetupComplete}
      />

      {/* Complementary Integration Setup Modal */}
      <IntegrationSetupModal
        isOpen={showSetupModal}
        onClose={handleSetupClose}
        integrationId={selectedIntegrationId}
        onComplete={handleSetupComplete}
      />
    </>
  );
}