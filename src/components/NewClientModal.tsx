import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { clientsApi } from '../services/api';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: () => void; // 🆕 Callback para atualizar lista
}

interface FormData {
  // Step 1 - Dados Básicos
  doctorName: string;
  specialty: string;
  city: string;
  phone: string;
  email: string;
  
  // Step 2 - Dados da Clínica
  clinicName: string;
  cnpj: string;
  address: string;
  website: string;
  
  // Step 3 - Metas e Objetivos
  currentRevenue: string;
  growthTarget: string;
  timeframe: string;
  mainChallenge: string;
  
  // Step 4 - Integrações e Plano
  integrations: {
    whatsapp: boolean;
    googleAds: boolean;
    metaAds: boolean;
    hubspot: boolean;
    googleCalendar: boolean;
    calendly: boolean;
    clinicSystem: boolean;
  };
  selectedPlan: string;
}

const initialFormData: FormData = {
  doctorName: '',
  specialty: '',
  city: '',
  phone: '',
  email: '',
  clinicName: '',
  cnpj: '',
  address: '',
  website: '',
  currentRevenue: '',
  growthTarget: '',
  timeframe: '',
  mainChallenge: '',
  integrations: {
    whatsapp: true,
    googleAds: true,
    metaAds: true,
    hubspot: true,
    googleCalendar: true,
    calendly: true,
    clinicSystem: false,
  },
  selectedPlan: 'pro'
};

const specialties = [
  'cardiologia',
  'dermatologia', 
  'oftalmologia',
  'pediatria',
  'ginecologia',
  'ortopedia',
  'neurologia',
  'psiquiatria',
  'endocrinologia',
  'gastroenterologia'
];

const timeframes = ['6 meses', '12 meses', '18 meses', '24 meses'];
const challenges = [
  'Captação de Pacientes',
  'Retenção',
  'Conversão',
  'Agendamentos',
  'Marketing Digital'
];

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 15.000/mês',
    features: ['4 Agentes IA', 'Até 3 integrações'],
    icon: '📦'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 25.000/mês',
    features: ['7 Agentes IA', 'Todas integrações', 'BI Premium'],
    icon: '🚀',
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'R$ 40.000/mês',
    features: ['7 Agentes IA', 'Integrações ilimitadas', 'AI Insights', 'Suporte 24/7'],
    icon: '💎'
  }
];

const stepLabels = ['Dados Básicos', 'Clínica', 'Metas', 'Integrações'];

export default function NewClientModal({ isOpen, onClose, onClientCreated }: NewClientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.length === 14;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.doctorName) newErrors.doctorName = 'Nome é obrigatório';
        if (!formData.specialty) newErrors.specialty = 'Especialidade é obrigatória';
        if (!formData.city) newErrors.city = 'Cidade é obrigatória';
        if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.email) newErrors.email = 'Email é obrigatório';
        else if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
        break;
      case 2:
        if (!formData.clinicName) newErrors.clinicName = 'Nome da clínica é obrigatório';
        if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
        else if (!validateCNPJ(formData.cnpj)) newErrors.cnpj = 'CNPJ inválido';
        if (!formData.address) newErrors.address = 'Endereço é obrigatório';
        break;
      case 3:
        if (!formData.currentRevenue) newErrors.currentRevenue = 'Receita atual é obrigatória';
        if (!formData.growthTarget) newErrors.growthTarget = 'Meta de crescimento é obrigatória';
        if (!formData.timeframe) newErrors.timeframe = 'Prazo é obrigatório';
        if (!formData.mainChallenge) newErrors.mainChallenge = 'Principal desafio é obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // 🚀 ESTRUTURA CORRETA BASEADA NO BANCO REAL!
      const clientData = {
        // Campos obrigatórios da tabela 'clients'
        name: formData.clinicName,               // ✅ Campo correto
        specialty: formData.specialty,              // ✅ Já em minúsculo
        email: formData.email,                   // ✅ Campo correto
        
        // Campos opcionais
        phone: formData.phone,
        city: formData.city,
        status: 'operational',                   // ✅ Default do banco
        plan: formData.selectedPlan,             // pro/basic/enterprise
        
        // Campos numéricos
        performance: 85,                         // Score inicial
        patients: 0,                             // Início zerado
        revenue: formData.currentRevenue || '100000' // Como texto
      };
      
      console.log('🚀 Salvando cliente no banco de dados...', clientData);
      
      // Chama a API para criar o cliente
      const response = await clientsApi.create(clientData);
      
      console.log('✅ Cliente salvo com sucesso!', response);
      
      // 🔄 ATUALIZAR LISTA DE CLIENTES (com pequeno delay)
      if (onClientCreated) {
        setTimeout(() => {
          console.log('🔄 Atualizando lista de clientes...');
          onClientCreated();
        }, 500); // 500ms para garantir que o banco processou
      }
      
      setIsLoading(false);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('❌ Erro ao salvar cliente:', error);
      
      // 🔍 LOGS DETALHADOS PARA DEBUG:
      if (error.response) {
        console.error('❌ Response data:', error.response.data);
        console.error('❌ ERRORS DETALHADOS:', JSON.stringify(error.response.data.errors, null, 2));
        console.error('❌ Response status:', error.response.status);
      }
      
      setIsLoading(false);
      
      // Mostrar erro detalhado para o usuário
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      alert(`Erro ao cadastrar cliente: ${errorMessage}`);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
    setErrors({});
    setIsLoading(false);
    setShowSuccess(false);
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateIntegration = (integration: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      integrations: { ...prev.integrations, [integration]: value }
    }));
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Cliente Cadastrado!</h3>
          <p className="text-gray-600 mb-6">Agentes IA configurados com sucesso ✅</p>
          <div className="space-y-3">
            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              onClick={handleClose}
            >
              Ver Dashboard do Cliente
            </button>
            <button 
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              onClick={handleClose}
            >
              Voltar à Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cadastro Novo Cliente Médico</h2>
              <p className="text-gray-600">Configure o onboarding com os 7 Agentes IA SevenScale</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar - CORRIGIDO */}
          <div className="relative">
            {/* Linha de conexão */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200">
              <div 
                className="h-1 bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
            
            {/* Steps com números e labels alinhados */}
            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-10 ${
                      step <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-sm text-gray-600 mt-2 text-center whitespace-nowrap">
                    {stepLabels[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurando 7 Agentes IA...</h3>
              <p className="text-gray-600">Isso pode levar alguns momentos</p>
            </div>
          ) : (
            <>
              {/* Step 1 - Dados Básicos */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dados Básicos do Médico</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Médico *
                      </label>
                      <input
                        type="text"
                        value={formData.doctorName}
                        onChange={(e) => updateFormData('doctorName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.doctorName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Dr. João Silva"
                      />
                      {errors.doctorName && <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especialidade *
                      </label>
                      <select
                        value={formData.specialty}
                        onChange={(e) => updateFormData('specialty', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.specialty ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione a especialidade</option>
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>
                            {/* 🎨 Capitalizar apenas para exibição */}
                            {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                          </option>
                        ))}
                      </select>
                      {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: São Paulo - SP"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', formatPhone(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(11) 99999-9999"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="dr.joao@clinica.com.br"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 - Dados da Clínica */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dados da Clínica</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Clínica/Consultório *
                      </label>
                      <input
                        type="text"
                        value={formData.clinicName}
                        onChange={(e) => updateFormData('clinicName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.clinicName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Clínica Dr. João Silva"
                      />
                      {errors.clinicName && <p className="text-red-500 text-sm mt-1">{errors.clinicName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNPJ *
                      </label>
                      <input
                        type="text"
                        value={formData.cnpj}
                        onChange={(e) => updateFormData('cnpj', formatCNPJ(e.target.value))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cnpj ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00.000.000/0000-00"
                      />
                      {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Rua das Flores, 123 - Centro - São Paulo - SP - CEP: 01234-567"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site (opcional)
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.clinicadrjoao.com.br"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 - Metas e Objetivos - CORRIGIDO */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Metas e Objetivos</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Receita Atual Mensal *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <input
                          type="number"
                          value={formData.currentRevenue}
                          onChange={(e) => updateFormData('currentRevenue', e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.currentRevenue ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="150000"
                        />
                      </div>
                      {errors.currentRevenue && <p className="text-red-500 text-sm mt-1">{errors.currentRevenue}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta de Crescimento *
                      </label>
                      <input
                        type="text"
                        value={formData.growthTarget}
                        onChange={(e) => updateFormData('growthTarget', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.growthTarget ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 150% ou +R$ 50.000"
                      />
                      {errors.growthTarget && <p className="text-red-500 text-sm mt-1">{errors.growthTarget}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prazo para Meta *
                      </label>
                      <select
                        value={formData.timeframe}
                        onChange={(e) => updateFormData('timeframe', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.timeframe ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o prazo</option>
                        {timeframes.map(timeframe => (
                          <option key={timeframe} value={timeframe}>{timeframe}</option>
                        ))}
                      </select>
                      {errors.timeframe && <p className="text-red-500 text-sm mt-1">{errors.timeframe}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Principal Desafio *
                      </label>
                      <select
                        value={formData.mainChallenge}
                        onChange={(e) => updateFormData('mainChallenge', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.mainChallenge ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o desafio</option>
                        {challenges.map(challenge => (
                          <option key={challenge} value={challenge}>{challenge}</option>
                        ))}
                      </select>
                      {errors.mainChallenge && <p className="text-red-500 text-sm mt-1">{errors.mainChallenge}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 - Integrações */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrações Disponíveis</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries({
                        whatsapp: 'WhatsApp Business API',
                        googleAds: 'Google Ads',
                        metaAds: 'Meta Ads (Facebook/Instagram)',
                        hubspot: 'HubSpot CRM',
                        googleCalendar: 'Google Calendar',
                        calendly: 'Calendly',
                        clinicSystem: 'Sistema de Gestão Clínica'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <span className="text-gray-700">{label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.integrations[key as keyof typeof formData.integrations]}
                              onChange={(e) => updateIntegration(key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione o Plano</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            formData.selectedPlan === plan.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => updateFormData('selectedPlan', plan.id)}
                        >
                          {plan.recommended && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Recomendado
                              </span>
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className="text-3xl mb-2">{plan.icon}</div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                            <p className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</p>
                            
                            <ul className="space-y-2 text-sm text-gray-600">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center justify-center gap-2">
                                  <Check className="w-4 h-4 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {formData.selectedPlan === plan.id && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              )}
            </div>
            
            <div>
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <Check className="w-4 h-4" />
                  Cadastrar Cliente
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}