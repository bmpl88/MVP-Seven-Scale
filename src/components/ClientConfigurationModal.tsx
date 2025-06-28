import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Settings,
  Key,
  Zap,
  Database,
  Bell,
  Shield,
  Calendar,
  DollarSign,
  Users,
  Download,
  TestTube,
  Save
} from 'lucide-react';

interface ClientConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    logo: string;
  } | null;
}

const clientsData = [
  { id: 'dr-silva', name: 'Dr. Silva', specialty: 'Clínica Médica' },
  { id: 'cardio-vida', name: 'Clínica CardioVida', specialty: 'Cardiologia' },
  { id: 'dermatologia-plus', name: 'Dermatologia Plus', specialty: 'Dermatologia' },
  { id: 'dr-oliveira', name: 'Dr. Oliveira', specialty: 'Endocrinologia' },
  { id: 'ortho-life', name: 'Clínica OrtoLife', specialty: 'Ortopedia' },
  { id: 'pediatria-feliz', name: 'Pediatria Feliz', specialty: 'Pediatria' },
  { id: 'dr-costa', name: 'Dr. Costa', specialty: 'Clínica Geral' },
  { id: 'clinica-visao', name: 'Clínica Visão', specialty: 'Oftalmologia' },
  { id: 'dr-lima', name: 'Dr. Lima', specialty: 'Urologia' },
  { id: 'neuro-center', name: 'Neuro Center', specialty: 'Neurologia' },
  { id: 'dr-santos', name: 'Dr. Santos', specialty: 'Pediatria' },
  { id: 'ortho-med', name: 'Clínica OrthoMed', specialty: 'Ortopedia' }
];

const hubspotConfigs = {
  'dr-silva': {
    pipeline: [
      { stage: 'Lead Consulta Geral', count: 23, status: 'active' },
      { stage: 'Agendamento Confirmado', count: 12, status: 'active' },
      { stage: 'Consulta Realizada', count: 8, status: 'active' },
      { stage: 'Retorno/Follow-up', count: 15, status: 'active' }
    ],
    conversionRate: '34.7%',
    customProperties: [
      { name: 'Especialidade Interest', value: 'Clínica Geral', status: 'active' },
      { name: 'Plano de Saúde', value: 'Unimed, Amil, Bradesco', status: 'active' },
      { name: 'Preferência Horário', value: 'Manhã, Tarde', status: 'active' },
      { name: 'Canal Preferido', value: 'WhatsApp', status: 'active' },
      { name: 'Lead Score Médico', value: 'A, B, C, D', status: 'active' }
    ],
    automations: [
      'Email boas-vindas personalizado',
      'WhatsApp agendamento automático',
      'Follow-up pós-consulta (24h/7dias)',
      'Lembretes paciente (1h antes)',
      'Score qualificação automático'
    ],
    reports: [
      'Funil conversão semanal',
      'ROI por fonte de lead',
      'Taxa no-show por horário',
      'Performance campanha por idade'
    ]
  },
  'cardio-vida': {
    pipeline: [
      { stage: 'Lead Cardiologia', count: 31, status: 'active' },
      { stage: 'Triagem Inicial', count: 18, status: 'active' },
      { stage: 'Exame Solicitado', count: 12, status: 'active' },
      { stage: 'Resultado + Consulta', count: 9, status: 'active' }
    ],
    conversionRate: '42.1%',
    customProperties: [
      { name: 'Tipo Exame', value: 'ECG, Holter, Ecocardiograma', status: 'active' },
      { name: 'Urgência', value: 'Rotina, Urgente, Emergência', status: 'active' },
      { name: 'Médico Responsável', value: 'Dr. Carlos, Dr. Ana', status: 'active' },
      { name: 'Histórico Cardíaco', value: 'Sim/Não', status: 'active' },
      { name: 'Risk Score', value: 'Alto, Médio, Baixo', status: 'active' }
    ],
    automations: [
      'Triagem automática por sintomas',
      'Agendamento exames prioritários',
      'Follow-up resultados (48h)',
      'Lembretes medicação',
      'Score risco cardiovascular'
    ],
    reports: [
      'Funil cardiologia especializado',
      'ROI exames preventivos',
      'Taxa urgência vs rotina',
      'Performance por médico'
    ]
  }
};

const metaAdsConfigs = {
  'dr-silva': {
    campaigns: [
      {
        name: 'Consulta Clínica Geral',
        budget: 'R$ 180/dia',
        audience: '25-65 anos, 5km raio',
        cpc: 'R$ 2.34',
        ctr: '3.2%',
        conversions: 23
      },
      {
        name: 'Check-up Preventivo',
        budget: 'R$ 120/dia',
        audience: '35+ anos, plano saúde',
        cpc: 'R$ 1.89',
        ctr: '4.1%',
        conversions: 15
      },
      {
        name: 'Vacinas e Imunização',
        budget: 'R$ 80/dia',
        audience: 'Famílias, 25-45 anos',
        cpc: 'R$ 1.56',
        ctr: '2.8%',
        conversions: 8
      }
    ],
    audiences: [
      { name: 'Pacientes Existentes', size: '1.247 pessoas' },
      { name: 'Lookalike 1%', size: '65.000 pessoas' },
      { name: 'Localização 5km', size: '120.000 pessoas' },
      { name: 'Plano Saúde Premium', size: '45.000 pessoas' }
    ],
    pixels: [
      { name: 'Page View', description: 'Site principal', status: 'active' },
      { name: 'Lead', description: 'Formulário agendamento', status: 'active' },
      { name: 'Purchase', description: 'Pagamento consulta', status: 'active' },
      { name: 'Custom', description: 'WhatsApp click', status: 'active' }
    ]
  },
  'dermatologia-plus': {
    campaigns: [
      {
        name: 'Tratamento Acne',
        budget: 'R$ 220/dia',
        audience: '16-30 anos, interesse beleza',
        cpc: 'R$ 3.12',
        ctr: '5.1%',
        conversions: 31
      },
      {
        name: 'Estética Facial',
        budget: 'R$ 340/dia',
        audience: '25-50 anos, renda alta',
        cpc: 'R$ 4.23',
        ctr: '4.7%',
        conversions: 28
      }
    ],
    audiences: [
      { name: 'Interesse Beleza', size: '89.000 pessoas' },
      { name: 'Renda Alta', size: '34.000 pessoas' },
      { name: 'Lookalike Estética', size: '78.000 pessoas' },
      { name: 'Retargeting Site', size: '12.000 pessoas' }
    ],
    pixels: [
      { name: 'Page View', description: 'Site dermatologia', status: 'active' },
      { name: 'Lead', description: 'Formulário estética', status: 'active' },
      { name: 'Purchase', description: 'Pagamento tratamento', status: 'active' },
      { name: 'Custom', description: 'Interesse procedimento', status: 'active' }
    ]
  }
};

const whatsappConfigs = {
  'dr-silva': {
    templates: [
      {
        name: 'agendamento_confirmacao',
        content: 'Olá {{1}}! Sua consulta está confirmada para {{2}} às {{3}}h. Endereço: {{4}}. Dúvidas: (11) 99999-9999',
        status: 'approved',
        usage: 247
      },
      {
        name: 'lembrete_consulta',
        content: '{{1}}, lembramos que sua consulta é hoje às {{2}}h com Dr. Silva. Por favor, chegue 15min antes. Até logo!',
        status: 'approved',
        usage: 198
      },
      {
        name: 'pos_consulta_feedback',
        content: '{{1}}, esperamos que tenha gostado da consulta! Que tal avaliar nosso atendimento? Link: {{2}}',
        status: 'approved',
        usage: 156
      }
    ],
    automations: [
      'Welcome Message - Resposta automática',
      'Agendamento Bot - Integração calendário',
      'Lembrete 24h - Antes da consulta',
      'Follow-up - Pós consulta (7 dias)',
      'Plantão Digital - Urgências fim de semana'
    ],
    metrics: {
      deliveryRate: '94.2%',
      openRate: '87.3%',
      responseRate: '62.1%',
      conversionRate: '23.4%'
    }
  }
};

export default function ClientConfigurationModal({ isOpen, onClose, integration }: ClientConfigurationModalProps) {
  const [selectedClient, setSelectedClient] = useState('dr-silva');
  const [activeTab, setActiveTab] = useState('config');

  if (!isOpen || !integration) return null;

  const selectedClientData = clientsData.find(client => client.id === selectedClient);

  const renderHubSpotConfig = () => {
    const config = hubspotConfigs[selectedClient as keyof typeof hubspotConfigs] || hubspotConfigs['dr-silva'];
    
    return (
      <div className="space-y-6">
        {/* Pipeline Customizado */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Customizado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.pipeline.map((stage, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{stage.stage}</h5>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{stage.count} ativos</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-blue-800">
              <span className="font-semibold">Taxa conversão:</span> {config.conversionRate} (otimizada)
            </p>
          </div>
        </div>

        {/* Custom Properties */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Properties Médicas</h4>
          <div className="space-y-3">
            {config.customProperties.map((prop, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{prop.name}</p>
                  <p className="text-gray-600 text-sm">{prop.value}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Automações */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Automações Ativas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.automations.map((automation, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-green-800 text-sm">{automation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Relatórios */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Específicos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.reports.map((report, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 text-sm">{report}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMetaAdsConfig = () => {
    const config = metaAdsConfigs[selectedClient as keyof typeof metaAdsConfigs] || metaAdsConfigs['dr-silva'];
    
    return (
      <div className="space-y-6">
        {/* Campanhas Ativas */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Campanhas Ativas ({config.campaigns.length})</h4>
          <div className="space-y-4">
            {config.campaigns.map((campaign, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900">"{campaign.name}"</h5>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {campaign.conversions} agendamentos
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Budget</p>
                    <p className="font-medium">{campaign.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Audience</p>
                    <p className="font-medium">{campaign.audience}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CPC</p>
                    <p className="font-medium">{campaign.cpc}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CTR</p>
                    <p className="font-medium">{campaign.ctr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audiences Customizadas */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Audiences Customizadas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.audiences.map((audience, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{audience.name}</p>
                    <p className="text-blue-600 text-sm">{audience.size}</p>
                  </div>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pixels Configurados */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Pixels Configurados</h4>
          <div className="space-y-3">
            {config.pixels.map((pixel, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{pixel.name}</p>
                  <p className="text-gray-600 text-sm">{pixel.description}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWhatsAppConfig = () => {
    const config = whatsappConfigs[selectedClient as keyof typeof whatsappConfigs] || whatsappConfigs['dr-silva'];
    
    return (
      <div className="space-y-6">
        {/* Templates Aprovados */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Templates Aprovados ({config.templates.length})</h4>
          <div className="space-y-4">
            {config.templates.map((template, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900">{template.name}</h5>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 text-sm">Aprovado</span>
                    <span className="text-gray-500 text-sm">| Usado: {template.usage}x</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm bg-white p-3 rounded border italic">
                  "{template.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Automações Ativas */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Automações Ativas</h4>
          <div className="space-y-3">
            {config.automations.map((automation, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-green-800">{automation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas Específicas */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Métricas Específicas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{config.metrics.deliveryRate}</p>
              <p className="text-blue-800 text-sm">Taxa entrega</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-2xl font-bold text-green-600">{config.metrics.openRate}</p>
              <p className="text-green-800 text-sm">Taxa abertura</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">{config.metrics.responseRate}</p>
              <p className="text-purple-800 text-sm">Taxa resposta</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-2xl font-bold text-orange-600">{config.metrics.conversionRate}</p>
              <p className="text-orange-800 text-sm">Conversão agendamento</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdvancedSettings = () => {
    return (
      <div className="space-y-6">
        {/* Configurações Técnicas */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Configurações Técnicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span className="font-medium">API Keys</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Status ativo</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Sync Frequency</span>
              </div>
              <p className="text-gray-600 text-sm">Tempo real</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Data Mapping</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Campos personalizados</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Webhooks</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Endpoints configurados</p>
            </div>
          </div>
        </div>

        {/* Configurações Médicas */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Configurações Médicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-medium">Compliance LGPD</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Termos específicos</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Especialidade</span>
              </div>
              <p className="text-gray-600 text-sm">{selectedClientData?.specialty}</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Horários</span>
              </div>
              <p className="text-gray-600 text-sm">Seg-Sex 8h-18h</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium">Preços</span>
              </div>
              <p className="text-gray-600 text-sm">Tabela por procedimento</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConfigContent = () => {
    switch (integration.id) {
      case 'hubspot':
        return renderHubSpotConfig();
      case 'meta-ads':
        return renderMetaAdsConfig();
      case 'whatsapp':
        return renderWhatsAppConfig();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Configurações específicas para {integration.name}</p>
            <p className="text-gray-500 text-sm mt-2">Em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{integration.logo}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Configuração {integration.name} - Clientes Médicos
                </h2>
                <p className="text-gray-600">Setup personalizado por especialidade médica</p>
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Ativo
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Client Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o cliente para ver configurações específicas
            </label>
            <div className="relative">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {clientsData.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.specialty}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'config'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Configurações
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'advanced'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Avançado
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'config' ? renderConfigContent() : renderAdvancedSettings()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <p>Última modificação: 22/06/2025 09:15 por Bruno Monteiro</p>
              <p>Próxima revisão agendada: 29/06/2025</p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exportar Config
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <TestTube className="w-4 h-4" />
              Testar Integração
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}