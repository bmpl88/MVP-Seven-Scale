import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Key,
  Upload,
  Download,
  TestTube,
  Save,
  HelpCircle,
  Loader2,
  Copy,
  RefreshCw,
  Shield,
  Database,
  Zap,
  Settings,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  Target,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';

interface CoreIntegrationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationId: string;
  onComplete: (integrationData: any) => void;
}

interface Client {
  id: string;
  name: string;
  specialty: string;
  city: string;
  phone: string;
  email: string;
  plan: string;
  planPrice: string;
}

const clientsData: Client[] = [
  { id: 'dr-silva', name: 'Dr. Silva', specialty: 'Clínica Médica', city: 'São Paulo - SP', phone: '(11) 99999-9999', email: 'silva@clinica.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'cardio-vida', name: 'Clínica CardioVida', specialty: 'Cardiologia', city: 'São Paulo - SP', phone: '(11) 98888-8888', email: 'contato@cardiovida.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'dermatologia-plus', name: 'Dermatologia Plus', specialty: 'Dermatologia', city: 'Rio de Janeiro - RJ', phone: '(21) 97777-7777', email: 'admin@dermaplus.com', plan: 'Enterprise', planPrice: 'R$ 40.000/mês' },
  { id: 'dr-oliveira', name: 'Dr. Oliveira', specialty: 'Endocrinologia', city: 'Belo Horizonte - MG', phone: '(31) 96666-6666', email: 'oliveira@endocrino.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'ortho-life', name: 'Clínica OrtoLife', specialty: 'Ortopedia', city: 'Porto Alegre - RS', phone: '(51) 95555-5555', email: 'contato@ortolife.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'pediatria-feliz', name: 'Pediatria Feliz', specialty: 'Pediatria', city: 'Brasília - DF', phone: '(61) 94444-4444', email: 'admin@pediatriafeliz.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'dr-costa', name: 'Dr. Costa', specialty: 'Clínica Geral', city: 'Salvador - BA', phone: '(71) 93333-3333', email: 'costa@clinica.com', plan: 'Basic', planPrice: 'R$ 15.000/mês' },
  { id: 'clinica-visao', name: 'Clínica Visão', specialty: 'Oftalmologia', city: 'Fortaleza - CE', phone: '(85) 92222-2222', email: 'contato@clinicavisao.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'dr-lima', name: 'Dr. Lima', specialty: 'Urologia', city: 'Recife - PE', phone: '(81) 91111-1111', email: 'lima@urologia.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' },
  { id: 'neuro-center', name: 'Neuro Center', specialty: 'Neurologia', city: 'Curitiba - PR', phone: '(41) 90000-0000', email: 'admin@neurocenter.com', plan: 'Enterprise', planPrice: 'R$ 40.000/mês' },
  { id: 'dr-santos', name: 'Dr. Santos', specialty: 'Pediatria', city: 'Goiânia - GO', phone: '(62) 98888-9999', email: 'santos@pediatria.com', plan: 'Basic', planPrice: 'R$ 15.000/mês' },
  { id: 'ortho-med', name: 'Clínica OrthoMed', specialty: 'Ortopedia', city: 'Manaus - AM', phone: '(92) 97777-8888', email: 'contato@orthomed.com', plan: 'Pro', planPrice: 'R$ 25.000/mês' }
];

const integrationConfigs = {
  hubspot: {
    name: 'HubSpot CRM',
    logo: '🏢',
    badge: 'CORE',
    subtitle: 'Setup personalizado para especialidade médica'
  },
  'rd-station': {
    name: 'RD Station Marketing',
    logo: '🎯',
    badge: 'CORE',
    subtitle: 'Setup personalizado para especialidade médica'
  },
  'google-calendar': {
    name: 'Google Calendar',
    logo: '📅',
    badge: 'CORE',
    subtitle: 'Setup personalizado para especialidade médica'
  },
  'google-analytics': {
    name: 'Google Analytics 4',
    logo: '📊',
    badge: 'CORE',
    subtitle: 'Setup personalizado para especialidade médica'
  },
  'meta-ads': {
    name: 'Meta Ads Manager',
    logo: '📘',
    badge: 'CORE',
    subtitle: 'Setup personalizado para especialidade médica'
  }
};

export default function CoreIntegrationSetupModal({ 
  isOpen, 
  onClose, 
  integrationId, 
  onComplete 
}: CoreIntegrationSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState('dr-silva');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const config = integrationConfigs[integrationId as keyof typeof integrationConfigs];
  if (!config) return null;

  const selectedClientData = clientsData.find(client => client.id === selectedClient);

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 2) {
      if (integrationId === 'hubspot') {
        if (!formData.portalId) errors.portalId = 'Portal ID é obrigatório';
        if (!formData.apiToken) errors.apiToken = 'API Token é obrigatório';
        if (!formData.ownerEmail) errors.ownerEmail = 'Email é obrigatório';
      } else if (integrationId === 'meta-ads') {
        if (!formData.businessId) errors.businessId = 'Business Manager ID é obrigatório';
        if (!formData.appId) errors.appId = 'App ID é obrigatório';
        if (!formData.appSecret) errors.appSecret = 'App Secret é obrigatório';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    // Simulate testing process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsTestingConnection(false);
  };

  const handleSaveAndActivate = async () => {
    setIsSaving(true);
    
    // Simulate saving process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const integrationData = {
      id: integrationId,
      name: config.name,
      logo: config.logo,
      client: selectedClientData,
      formData
    };
    
    onComplete(integrationData);
    setIsSaving(false);
  };

  const renderStep1ClientSelection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Selecione o Cliente Médico</h3>
          <p className="text-gray-600">Para qual cliente você está configurando esta integração?</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Cliente Médico *
          </label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          >
            {clientsData.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.specialty}
              </option>
            ))}
          </select>
        </div>

        {selectedClientData && (
          <div className="mt-6 p-6 rounded-xl border-2 border-blue-200 bg-blue-50">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Informações do Cliente Selecionado</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Cliente</p>
                  <p className="font-medium text-blue-900">{selectedClientData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Especialidade</p>
                  <p className="font-medium text-blue-900">{selectedClientData.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Cidade</p>
                  <p className="font-medium text-blue-900">{selectedClientData.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Telefone</p>
                  <p className="font-medium text-blue-900">{selectedClientData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Email</p>
                  <p className="font-medium text-blue-900">{selectedClientData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700">Plano SevenScale</p>
                  <p className="font-medium text-blue-900">{selectedClientData.plan} ({selectedClientData.planPrice})</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep2Credentials = () => {
    if (integrationId === 'hubspot') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Configuração HubSpot para {selectedClientData?.name}</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portal ID (Hub ID) *
            </label>
            <input
              type="text"
              value={formData.portalId || ''}
              onChange={(e) => updateFormData('portalId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.portalId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="12345678"
            />
            {validationErrors.portalId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.portalId}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              ⓘ Encontre em: Settings → Account Setup
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Private App Token *
            </label>
            <div className="relative">
              <input
                type={showPassword.apiToken ? 'text' : 'password'}
                value={formData.apiToken || ''}
                onChange={(e) => updateFormData('apiToken', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                  validationErrors.apiToken ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('apiToken')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.apiToken ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {validationErrors.apiToken && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.apiToken}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              ⓘ Crie em: Settings → Private Apps
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Administrador *
            </label>
            <input
              type="email"
              value={formData.ownerEmail || selectedClientData?.email || ''}
              onChange={(e) => updateFormData('ownerEmail', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.ownerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="admin@clinica.com"
            />
            {validationErrors.ownerEmail && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.ownerEmail}</p>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissões Necessárias</h4>
            <div className="space-y-3">
              {[
                { name: 'Contacts', description: 'Read/Write', required: true },
                { name: 'Deals', description: 'Read/Write', required: true },
                { name: 'Companies', description: 'Read/Write', required: true },
                { name: 'Timeline', description: 'Read/Write', required: true },
                { name: 'Properties', description: 'Read/Write', required: true }
              ].map((permission, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{permission.name}</p>
                    <p className="text-green-700 text-sm">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (integrationId === 'meta-ads') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Configuração Meta Ads para {selectedClientData?.name}</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Manager ID *
            </label>
            <input
              type="text"
              value={formData.businessId || ''}
              onChange={(e) => updateFormData('businessId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.businessId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123456789012345"
            />
            {validationErrors.businessId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.businessId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App ID *
            </label>
            <input
              type="text"
              value={formData.appId || ''}
              onChange={(e) => updateFormData('appId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.appId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123456789012345"
            />
            {validationErrors.appId && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.appId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              App Secret *
            </label>
            <div className="relative">
              <input
                type={showPassword.appSecret ? 'text' : 'password'}
                value={formData.appSecret || ''}
                onChange={(e) => updateFormData('appSecret', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                  validationErrors.appSecret ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('appSecret')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.appSecret ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {validationErrors.appSecret && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.appSecret}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Configuração de credenciais para {config.name}</p>
        <p className="text-gray-500 text-sm mt-2">Em desenvolvimento...</p>
      </div>
    );
  };

  const renderStep3Personalization = () => {
    if (integrationId === 'hubspot') {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pipeline Personalizado - {selectedClientData?.specialty}</h3>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Funil Customizado</h4>
            <div className="space-y-3">
              {[
                'Lead Interessado → Clínica Geral',
                'Agendamento Marcado → Consulta confirmada',
                'Consulta Realizada → Atendimento concluído',
                'Follow-up/Retorno → Paciente recorrente'
              ].map((stage, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">{stage}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🏥 Custom Properties Médicas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Especialidade de interesse: Clínica Geral',
                'Plano de saúde: [Multi-select]',
                'Faixa etária preferencial: Adultos',
                'Tipo consulta: Consulta, Check-up, Urgência',
                'Canal preferido: WhatsApp, Email, Telefone'
              ].map((property, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 text-sm">{property}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🤖 Automações {selectedClientData?.name}</h4>
            <div className="space-y-3">
              {[
                'Email boas-vindas personalizado',
                'Lembrete consulta (24h + 2h antes)',
                'Follow-up pós-consulta (3 dias)',
                'Pesquisa satisfação (7 dias)',
                'Retorno automático (30 dias)'
              ].map((automation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-800">{automation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Personalização para {config.name}</p>
        <p className="text-gray-500 text-sm mt-2">Em desenvolvimento...</p>
      </div>
    );
  };

  const renderStep4TestActivation = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <TestTube className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Teste e Ativação</h3>
        </div>

        {isTestingConnection ? (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🧪 Testando Configuração Final</h4>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Testando credenciais... ✅ Válidas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Verificando permissões... ✅ Corretas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Configurando personalização... ✅ Aplicada</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Ativando automações... ✅ Ativas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Sincronização inicial... ✅ Concluída</span>
              </div>
            </div>
          </div>
        ) : isSaving ? (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Configurando integração...</h4>
            <p className="text-gray-600">Isso pode levar alguns momentos</p>
          </div>
        ) : (
          <>
            <div className="p-6 rounded-xl bg-green-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h4 className="text-lg font-bold text-green-900">
                  ✅ {config.name} configurado com sucesso para {selectedClientData?.name}!
                </h4>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Resumo - {config.name} para {selectedClientData?.name}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span><strong>Cliente:</strong> {selectedClientData?.name} - {selectedClientData?.specialty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span><strong>Portal:</strong> {formData.portalId || 'Configurado'} (conectado)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span><strong>Pipeline:</strong> Funil {selectedClientData?.specialty.toLowerCase()} (4 etapas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span><strong>Properties:</strong> 5 campos médicos customizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span><strong>Automações:</strong> 5 fluxos ativos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span><strong>Primeira sincronização:</strong> Sucesso (23 contatos)</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2">💡 Próximos passos:</h5>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Integração ativa e monitorada 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Dados sincronizando a cada 5 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Relatórios disponíveis no dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    <span>Suporte SevenScale disponível</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleTestConnection}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mx-auto"
              >
                <TestTube className="w-5 h-5" />
                Testar Conexão Final
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1ClientSelection();
      case 2:
        return renderStep2Credentials();
      case 3:
        return renderStep3Personalization();
      case 4:
        return renderStep4TestActivation();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{config.logo}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Configurar {config.name} - Cliente Médico
                </h2>
                <p className="text-gray-600">{config.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {config.badge}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  INCLUÍDO
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress: Step {currentStep}/4</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-between text-sm">
            {['Dados Básicos', 'Credenciais', 'Personalização', 'Ativação'].map((label, index) => (
              <span 
                key={index}
                className={`${
                  index + 1 <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {currentStep === 4 && !isTestingConnection && !isSaving && (
                <p>🟢 Configuração salva e testada com sucesso</p>
              )}
              {currentStep < 4 && (
                <p>⏰ Última modificação: há 5 minutos</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep > 1 && !isTestingConnection && !isSaving && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={isTestingConnection || isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  Próximo: {['Credenciais', 'Personalização', 'Ativação'][currentStep - 1]}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                !isTestingConnection && !isSaving && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        // Navigate to client dashboard
                        onComplete({
                          id: integrationId,
                          name: config.name,
                          client: selectedClientData,
                          action: 'dashboard'
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Ver Dashboard Cliente
                    </button>
                    <button
                      onClick={handleSaveAndActivate}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Finalizar Setup
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}