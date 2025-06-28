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
  Settings
} from 'lucide-react';

interface ApiSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    logo: string;
  } | null;
}

interface TestResult {
  step: string;
  status: 'pending' | 'testing' | 'success' | 'error';
  message: string;
  details?: string;
}

const integrationSteps = {
  hubspot: [
    { id: 'credentials', title: 'Credenciais', icon: Key },
    { id: 'permissions', title: 'Permissões', icon: Shield },
    { id: 'advanced', title: 'Configurações', icon: Settings },
    { id: 'test', title: 'Teste', icon: TestTube }
  ],
  'meta-ads': [
    { id: 'app', title: 'Facebook App', icon: Key },
    { id: 'tokens', title: 'Access Tokens', icon: Shield },
    { id: 'permissions', title: 'Permissões', icon: Settings },
    { id: 'accounts', title: 'Contas', icon: Database }
  ],
  'google-ads': [
    { id: 'project', title: 'Google Cloud', icon: Key },
    { id: 'oauth', title: 'OAuth2', icon: Shield },
    { id: 'accounts', title: 'Contas', icon: Database },
    { id: 'test', title: 'Teste', icon: TestTube }
  ],
  'google-calendar': [
    { id: 'credentials', title: 'Credenciais', icon: Key },
    { id: 'calendars', title: 'Calendários', icon: Database },
    { id: 'sync', title: 'Sync Config', icon: Settings },
    { id: 'test', title: 'Teste', icon: TestTube }
  ],
  whatsapp: [
    { id: 'business', title: 'Meta Business', icon: Key },
    { id: 'webhook', title: 'Webhook', icon: Settings },
    { id: 'phone', title: 'Phone Number', icon: Database },
    { id: 'test', title: 'Teste', icon: TestTube }
  ],
  n8n: [
    { id: 'instance', title: 'N8N Instance', icon: Key },
    { id: 'workflows', title: 'Workflows', icon: Settings },
    { id: 'test', title: 'Teste', icon: TestTube }
  ],
  calendly: [
    { id: 'api', title: 'Calendly API', icon: Key },
    { id: 'events', title: 'Event Types', icon: Settings },
    { id: 'test', title: 'Teste', icon: TestTube }
  ],
  supabase: [
    { id: 'project', title: 'Projeto', icon: Key },
    { id: 'schema', title: 'Database', icon: Database },
    { id: 'test', title: 'Teste', icon: TestTube }
  ]
};

export default function ApiSetupModal({ isOpen, onClose, integration }: ApiSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isOpen || !integration) return null;

  const steps = integrationSteps[integration.id as keyof typeof integrationSteps] || [];
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
    
    // Basic validation based on current step and integration
    if (integration.id === 'hubspot' && currentStep === 0) {
      if (!formData.apiToken) errors.apiToken = 'API Token é obrigatório';
      if (!formData.portalId) errors.portalId = 'Portal ID é obrigatório';
      if (!formData.ownerEmail) errors.ownerEmail = 'Email é obrigatório';
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
      { step: 'Latência', message: 'Testando velocidade...' },
      { step: 'Endpoints', message: 'Verificando endpoints...' },
      { step: 'Rate Limits', message: 'Checando limites...' }
    ];

    for (let i = 0; i < testSteps.length; i++) {
      const testStep = testSteps[i];
      
      setTestResults(prev => [...prev, {
        step: testStep.step,
        status: 'testing',
        message: testStep.message
      }]);

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

      const success = Math.random() > 0.15; // 85% success rate
      const latency = Math.floor(50 + Math.random() * 200);
      
      setTestResults(prev => prev.map((result, index) => 
        index === i ? {
          ...result,
          status: success ? 'success' : 'error',
          message: success 
            ? `${testStep.step} validado com sucesso ${testStep.step === 'Latência' ? `(${latency}ms)` : ''}`
            : `Falha na verificação - verifique configurações`,
          details: success ? undefined : 'Verifique se as credenciais estão corretas e ativas'
        } : result
      ));
    }

    setIsTestingConnection(false);
  };

  const renderHubSpotSetup = () => {
    switch (currentStep) {
      case 0: // Credenciais
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔑 API Private App Token *
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
                ⓘ Obtenha em: Settings → Private Apps → Create
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Portal ID (Hub ID) *
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
                ⓘ Encontre em: Settings → Account Setup → Account
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Proprietário *
              </label>
              <input
                type="email"
                value={formData.ownerEmail || ''}
                onChange={(e) => updateFormData('ownerEmail', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.ownerEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="admin@clinica.com.br"
              />
              {validationErrors.ownerEmail && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.ownerEmail}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Email do administrador da conta
              </p>
            </div>
          </div>
        );

      case 1: // Permissões
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissões Necessárias</h4>
              <div className="space-y-3">
                {[
                  { name: 'Contacts', description: 'Read/Write', required: true },
                  { name: 'Deals', description: 'Read/Write', required: true },
                  { name: 'Companies', description: 'Read/Write', required: true },
                  { name: 'Timeline', description: 'Read/Write', required: true },
                  { name: 'Properties', description: 'Read/Write', required: true },
                  { name: 'Settings', description: 'apenas se necessário', required: false }
                ].map((permission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      {permission.required ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{permission.name}</p>
                        <p className="text-gray-600 text-sm">{permission.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      permission.required 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {permission.required ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Configurações Avançadas
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Configurações Avançadas</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔄 Sync Frequency
                  </label>
                  <div className="flex gap-4">
                    {['Tempo real', '5 minutos', '30 minutos'].map((option, index) => (
                      <label key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="syncFrequency"
                          value={option}
                          defaultChecked={index === 1}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📊 Data Retention
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="90">90 dias</option>
                    <option value="180">6 meses</option>
                    <option value="365">1 ano</option>
                    <option value="unlimited">Ilimitado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Custom Properties Prefix
                  </label>
                  <input
                    type="text"
                    defaultValue="sevenscale_"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="sevenscale_"
                  />
                  <p className="text-gray-500 text-sm mt-1">(recomendado)</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Teste
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
                  {isTestingConnection ? 'Testando...' : 'Testar Credenciais'}
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
                      <p className="text-lg font-bold text-blue-600">127ms</p>
                      <p className="text-sm text-gray-600">Latência</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderMetaAdsSetup = () => {
    switch (currentStep) {
      case 0: // Facebook App
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🆔 Facebook App ID *
              </label>
              <input
                type="text"
                value={formData.appId || ''}
                onChange={(e) => updateFormData('appId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="123456789012345"
              />
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Crie em: developers.facebook.com
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔐 App Secret *
              </label>
              <div className="relative">
                <input
                  type={showPassword.appSecret ? 'text' : 'password'}
                  value={formData.appSecret || ''}
                  onChange={(e) => updateFormData('appSecret', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
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
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Nunca compartilhe este token
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Business Manager ID *
              </label>
              <input
                type="text"
                value={formData.businessId || ''}
                onChange={(e) => updateFormData('businessId', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="123456789012345"
              />
              <p className="text-gray-500 text-sm mt-1">
                ⓘ ID do Business Manager da clínica
              </p>
            </div>
          </div>
        );

      case 1: // Access Tokens
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 User Access Token *
              </label>
              <div className="relative">
                <input
                  type={showPassword.userToken ? 'text' : 'password'}
                  value={formData.userToken || ''}
                  onChange={(e) => updateFormData('userToken', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('userToken')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.userToken ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Token gerado via Graph API Explorer
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 System User Token (Recomendado) *
              </label>
              <div className="relative">
                <input
                  type={showPassword.systemToken ? 'text' : 'password'}
                  value={formData.systemToken || ''}
                  onChange={(e) => updateFormData('systemToken', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('systemToken')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword.systemToken ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                ⓘ Mais seguro para uso em produção
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Token Expiration
              </label>
              <div className="flex gap-4">
                {['Nunca expira', '60 dias', 'Personalizado'].map((option, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tokenExpiration"
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
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Configuração {integration.name}</p>
            <p className="text-gray-500 text-sm mt-2">Step {currentStep + 1} em desenvolvimento...</p>
          </div>
        );
    }
  };

  const renderSetupContent = () => {
    switch (integration.id) {
      case 'hubspot':
        return renderHubSpotSetup();
      case 'meta-ads':
        return renderMetaAdsSetup();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Setup para {integration.name}</p>
            <p className="text-gray-500 text-sm mt-2">Em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{integration.logo}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Setup {integration.name} - Configuração Técnica
                </h2>
                <p className="text-gray-600">Configure credenciais e parâmetros de conexão</p>
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
              <p>🟢 Configuração salva automaticamente</p>
              <p>🔄 Próximo teste automático: em 1 hora</p>
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Documentação API
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Próximo
                  <RefreshCw className="w-4 h-4" />
                </button>
              ) : (
                <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <Save className="w-4 h-4" />
                  Salvar e Testar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}