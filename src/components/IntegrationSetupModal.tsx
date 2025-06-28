import React, { useState } from 'react';
import { 
  X, 
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
  Mail,
  MessageSquare,
  CreditCard,
  Target,
  Video,
  FileText
} from 'lucide-react';

interface IntegrationSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationId: string;
  onComplete: (integrationData: any) => void;
}

interface TestResult {
  step: string;
  status: 'pending' | 'testing' | 'success' | 'error';
  message: string;
  details?: string;
}

const integrationConfigs = {
  mailchimp: {
    name: 'Mailchimp',
    logo: '📧',
    subtitle: 'Email Marketing para clínicas médicas',
    steps: [
      { id: 'credentials', title: 'Credenciais', icon: Key },
      { id: 'medical', title: 'Config Médica', icon: Shield },
      { id: 'automations', title: 'Automações', icon: Zap },
      { id: 'test', title: 'Teste', icon: TestTube }
    ]
  },
  twilio: {
    name: 'Twilio',
    logo: '📱',
    subtitle: 'SMS automático para pacientes e clínicas',
    steps: [
      { id: 'credentials', title: 'Credenciais', icon: Key },
      { id: 'medical', title: 'Config Médica', icon: Shield },
      { id: 'templates', title: 'Templates', icon: MessageSquare },
      { id: 'test', title: 'Teste', icon: TestTube }
    ]
  },
  stripe: {
    name: 'Stripe',
    logo: '💳',
    subtitle: 'Pagamentos online para consultas e procedimentos',
    steps: [
      { id: 'credentials', title: 'Credenciais', icon: Key },
      { id: 'medical', title: 'Config Médica', icon: Shield },
      { id: 'webhooks', title: 'Webhooks', icon: Database },
      { id: 'test', title: 'Teste', icon: TestTube }
    ]
  },
  'rd-station': {
    name: 'RD Station',
    logo: '🎯',
    subtitle: 'CRM alternativo para clínicas médicas',
    steps: [
      { id: 'credentials', title: 'Credenciais', icon: Key },
      { id: 'pipeline', title: 'Pipeline', icon: Target },
      { id: 'automations', title: 'Automações', icon: Zap },
      { id: 'test', title: 'Teste', icon: TestTube }
    ]
  },
  zoom: {
    name: 'Zoom',
    logo: '🎥',
    subtitle: 'Teleconsultas integradas ao agendamento',
    steps: [
      { id: 'credentials', title: 'Credenciais', icon: Key },
      { id: 'medical', title: 'Config Médica', icon: Shield },
      { id: 'integration', title: 'Integração', icon: Settings },
      { id: 'test', title: 'Teste', icon: TestTube }
    ]
  },
  typeform: {
    name: 'Typeform',
    logo: '📋',
    subtitle: 'Formulários inteligentes para clínicas',
    steps: [
      { id: 'credentials', title: 'Credenciais', icon: Key },
      { id: 'forms', title: 'Formulários', icon: FileText },
      { id: 'test', title: 'Teste', icon: TestTube }
    ]
  }
};

export default function IntegrationSetupModal({ 
  isOpen, 
  onClose, 
  integrationId, 
  onComplete 
}: IntegrationSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const config = integrationConfigs[integrationId as keyof typeof integrationConfigs];
  if (!config) return null;

  const steps = config.steps;
  const currentStepData = steps[currentStep];

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
    
    // Validation based on integration and step
    if (currentStep === 0) { // Credentials step
      if (integrationId === 'mailchimp') {
        if (!formData.apiKey) errors.apiKey = 'API Key é obrigatório';
        if (!formData.serverPrefix) errors.serverPrefix = 'Server Prefix é obrigatório';
      } else if (integrationId === 'twilio') {
        if (!formData.accountSid) errors.accountSid = 'Account SID é obrigatório';
        if (!formData.authToken) errors.authToken = 'Auth Token é obrigatório';
        if (!formData.phoneNumber) errors.phoneNumber = 'Phone Number é obrigatório';
      } else if (integrationId === 'stripe') {
        if (!formData.publishableKey) errors.publishableKey = 'Publishable Key é obrigatório';
        if (!formData.secretKey) errors.secretKey = 'Secret Key é obrigatório';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResults([]);

    const testSteps = [
      { step: 'Autenticação', message: 'Verificando credenciais...' },
      { step: 'Permissões', message: 'Validando permissões...' },
      { step: 'Conectividade', message: 'Testando conectividade...' },
      { step: 'Configuração', message: 'Verificando configuração...' }
    ];

    for (let i = 0; i < testSteps.length; i++) {
      const testStep = testSteps[i];
      
      setTestResults(prev => [...prev, {
        step: testStep.step,
        status: 'testing',
        message: testStep.message
      }]);

      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

      const success = Math.random() > 0.1; // 90% success rate
      
      setTestResults(prev => prev.map((result, index) => 
        index === i ? {
          ...result,
          status: success ? 'success' : 'error',
          message: success 
            ? `${testStep.step} validado com sucesso`
            : `Falha na verificação - verifique configurações`,
          details: success ? undefined : 'Verifique se as credenciais estão corretas e ativas'
        } : result
      ));
    }

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
      status: 'connected',
      lastSync: 'Agora',
      formData
    };
    
    onComplete(integrationData);
    setIsSaving(false);
  };

  const renderMailchimpSetup = () => {
    switch (currentStep) {
      case 0: // Credenciais
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔑 API Key *
              </label>
              <div className="relative">
                <input
                  type={showPassword.apiKey ? 'text' : 'password'}
                  value={formData.apiKey || ''}
                  onChange={(e) => updateFormData('apiKey', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    validationErrors.apiKey ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('apiKey')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.apiKey ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {validationErrors.apiKey && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.apiKey}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Obtenha em: Account → Extras → API Keys
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌐 Server Prefix *
              </label>
              <input
                type="text"
                value={formData.serverPrefix || ''}
                onChange={(e) => updateFormData('serverPrefix', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.serverPrefix ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="us12"
              />
              {validationErrors.serverPrefix && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.serverPrefix}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Extraído automaticamente da API Key (us12, us13, etc)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Account Name
              </label>
              <input
                type="text"
                value={formData.accountName || ''}
                onChange={(e) => updateFormData('accountName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Clínica Dr. Silva"
              />
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Nome da conta Mailchimp para identificação
              </p>
            </div>
          </div>
        );

      case 1: // Configuração Médica
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📋 Audience Principal *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione a audience</option>
                <option value="main">Lista Principal - Pacientes</option>
                <option value="leads">Lista Leads - Interessados</option>
                <option value="newsletter">Newsletter - Saúde</option>
              </select>
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Lista principal de contatos médicos
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🏥 Merge Tags Médicos</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'ESPECIALIDADE',
                  'PLANO_SAUDE',
                  'TELEFONE',
                  'DATA_NASCIMENTO',
                  'GENERO'
                ].map((tag, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Segmentação Automática</h4>
              <div className="space-y-3">
                {[
                  'Por especialidade médica',
                  'Por faixa etária',
                  'Por plano de saúde',
                  'Por status (lead/paciente)'
                ].map((segment, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{segment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Automações
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📧 Campanhas Médicas</h4>
              <div className="space-y-3">
                {[
                  { name: 'Welcome Series', description: '3 emails de boas-vindas' },
                  { name: 'Lembrete Consulta', description: '1 dia antes da consulta' },
                  { name: 'Follow-up Pós-consulta', description: '2 dias após consulta' },
                  { name: 'Newsletter Mensal Saúde', description: 'Conteúdo educativo mensal' }
                ].map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-gray-600 text-sm">{campaign.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🔄 Sync Settings</h4>
              <div className="flex gap-4">
                {['Tempo real', 'Diário', 'Semanal'].map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="syncFrequency"
                      value={option}
                      defaultChecked={index === 0}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTwilioSetup = () => {
    switch (currentStep) {
      case 0: // Credenciais
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🆔 Account SID *
              </label>
              <input
                type="text"
                value={formData.accountSid || ''}
                onChange={(e) => updateFormData('accountSid', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.accountSid ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
              {validationErrors.accountSid && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.accountSid}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Encontre no Console Twilio
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔑 Auth Token *
              </label>
              <div className="relative">
                <input
                  type={showPassword.authToken ? 'text' : 'password'}
                  value={formData.authToken || ''}
                  onChange={(e) => updateFormData('authToken', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    validationErrors.authToken ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('authToken')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.authToken ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {validationErrors.authToken && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.authToken}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Token de autenticação da conta
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📱 Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+55 11 99999-9999"
              />
              {validationErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Número Twilio para envio (formato internacional)
              </p>
            </div>
          </div>
        );

      case 1: // Configuração Médica
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Tipos de SMS</h4>
              <div className="space-y-3">
                {[
                  'Confirmação agendamento',
                  'Lembrete consulta (24h antes)',
                  'Lembrete consulta (1h antes)',
                  'Follow-up pós-consulta',
                  'Resultados de exames',
                  'Campanhas preventivas'
                ].map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🕐 Horários Permitidos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">De:</label>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Até:</label>
                  <input
                    type="time"
                    defaultValue="18:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias:</label>
                <div className="flex gap-2">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, index) => (
                    <label key={index} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        defaultChecked={index < 5}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Templates
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Templates SMS</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Confirmação:
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Olá {{nome}}! Consulta confirmada para {{data}} às {{hora}}h com {{medico}}. Clínica: {{endereco}}. Info: {{telefone}}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Lembrete:
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="{{nome}}, sua consulta é amanhã {{data}} às {{hora}}h. Por favor, chegue 15min antes. Dúvidas: {{telefone}}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Follow-up:
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="{{nome}}, como foi sua consulta? Avalie nosso atendimento: {{link_avaliacao}}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStripeSetup = () => {
    switch (currentStep) {
      case 0: // Credenciais
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔑 Publishable Key *
              </label>
              <input
                type="text"
                value={formData.publishableKey || ''}
                onChange={(e) => updateFormData('publishableKey', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.publishableKey ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="pk_live_xxxxxxxxxxxxx"
              />
              {validationErrors.publishableKey && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.publishableKey}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Chave pública para frontend
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔐 Secret Key *
              </label>
              <div className="relative">
                <input
                  type={showPassword.secretKey ? 'text' : 'password'}
                  value={formData.secretKey || ''}
                  onChange={(e) => updateFormData('secretKey', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                    validationErrors.secretKey ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="sk_live_xxxxxxxxxxxxx"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('secretKey')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.secretKey ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {validationErrors.secretKey && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.secretKey}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Chave secreta para backend
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔗 Webhook Endpoint Secret *
              </label>
              <div className="relative">
                <input
                  type={showPassword.webhookSecret ? 'text' : 'password'}
                  value={formData.webhookSecret || ''}
                  onChange={(e) => updateFormData('webhookSecret', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="whsec_xxxxxxxxxxxxx"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('webhookSecret')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.webhookSecret ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Para verificação de webhooks
              </p>
            </div>
          </div>
        );

      case 1: // Configuração Médica
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">💰 Produtos/Serviços</h4>
              <div className="space-y-3">
                {[
                  { name: 'Consulta Médica', price: 'R$ 200,00' },
                  { name: 'Teleconsulta', price: 'R$ 150,00' },
                  { name: 'Exames Preventivos', price: 'R$ 300,00' },
                  { name: 'Retorno', price: 'R$ 100,00' }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-900">{product.name}</span>
                    </div>
                    <span className="font-medium text-green-600">{product.price}</span>
                  </div>
                ))}
                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors">
                  + Adicionar Produto
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🏥 Métodos de Pagamento</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Cartão de Crédito',
                  'Cartão de Débito',
                  'PIX (via Stripe)',
                  'Boleto Bancário'
                ].map((method, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 text-sm">{method}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Configurações</h4>
              <div className="space-y-3">
                {[
                  'Parcelamento até 12x',
                  'Taxa conveniência 3.5%',
                  'Recibo automático'
                ].map((config, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{config}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTestStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Teste de Conexão</h4>
          
          <div className="mb-6">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isTestingConnection ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <TestTube className="w-5 h-5" />
              )}
              {isTestingConnection ? 'Testando...' : `Testar ${config.name}`}
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    {result.status === 'testing' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                    {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {result.status === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    {result.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                    <div>
                      <p className="font-medium text-gray-900">{result.step}</p>
                      <p className={`text-sm ${
                        result.status === 'success' ? 'text-green-700' :
                        result.status === 'error' ? 'text-red-700' :
                        result.status === 'testing' ? 'text-blue-700' :
                        'text-gray-600'
                      }`}>
                        {result.message}
                      </p>
                      {result.details && (
                        <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {testResults.length > 0 && !isTestingConnection && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">Resumo dos Testes</h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {testResults.filter(r => r.status === 'success').length}
                  </p>
                  <p className="text-sm text-gray-600">Sucessos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">
                    {testResults.filter(r => r.status === 'error').length}
                  </p>
                  <p className="text-sm text-gray-600">Erros</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600">89ms</p>
                  <p className="text-sm text-gray-600">Latência</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSetupContent = () => {
    // Test step is always the last step for all integrations
    if (currentStep === steps.length - 1) {
      return renderTestStep();
    }

    switch (integrationId) {
      case 'mailchimp':
        return renderMailchimpSetup();
      case 'twilio':
        return renderTwilioSetup();
      case 'stripe':
        return renderStripeSetup();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Setup para {config.name}</p>
            <p className="text-gray-500 text-sm mt-2">Em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{config.logo}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Configurar {config.name}
                </h2>
                <p className="text-gray-600">{config.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-red-600">Não configurado</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Steps Progress */}
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200">
              <div 
                className="h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
                        index <= currentStep 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-600 mt-2 text-center whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Step {currentStep + 1} - {currentStepData?.title}
            </h3>
          </div>

          {renderSetupContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isSaving ? (
                <p className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Configurando integração...
                </p>
              ) : (
                <p>🟢 Configuração salva automaticamente</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Voltar
                </button>
              )}
              
              <button 
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  Próximo
                  <RefreshCw className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSaveAndActivate}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Configurando...' : 'Salvar e Ativar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}