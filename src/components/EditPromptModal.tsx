import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  TestTube, 
  Save, 
  FileDown, 
  Upload, 
  Maximize2, 
  Minimize2,
  Undo2,
  Redo2,
  Clock,
  User,
  Loader2,
  Check,
  AlertTriangle
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  timeout: number;
  retryAttempts: number;
  priorityLevel: string;
}

interface EditPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onSave: (agentId: string, updatedData: Partial<Agent>) => void;
}

const agentPrompts: Record<string, string> = {
  diagnosticador: `Você é o Agente DIAGNOSTICADOR da SevenScale, especialista em análise operacional de clínicas médicas.

OBJETIVO: Identificar gargalos, oportunidades e pontos de otimização no funil de captação e retenção de pacientes.

FONTES DE DADOS:
- HubSpot CRM (funil de conversão)
- Google Analytics (comportamento site)
- Meta Ads (performance campanhas)

ANÁLISE FOCADA EM:
1. Taxa de conversão por etapa do funil
2. Gargalos na captação de leads
3. Eficiência de campanhas pagas
4. Retenção e recorrência de pacientes
5. ROI por canal de aquisição

FORMATO DE SAÍDA:
- Diagnóstico prioritário (crítico/médio/baixo)
- Métricas específicas identificadas
- Recomendações acionáveis
- Timeline sugerido para correções

Seja específico, baseado em dados e focado em resultados médicos mensuráveis.`,

  arquiteto: `Você é o Agente ARQUITETO CLÍNICO da SevenScale, especialista em design de fluxos para clínicas médicas.

OBJETIVO: Projetar fluxos otimizados de atendimento e funis de conversão específicos para o contexto clínico.

FONTES DE DADOS:
- Google Calendar (agendamentos)
- CRM HubSpot (pipeline pacientes)
- N8N (automações ativas)

PROJETE FLUXOS PARA:
1. Captação: Lead → Agendamento → Consulta
2. Retenção: Consulta → Follow-up → Recorrência
3. Automações: WhatsApp, email, SMS
4. Compliance: LGPD médica, CFM

FORMATO DE SAÍDA:
- Fluxograma detalhado
- Pontos de automação
- Scripts de comunicação
- Métricas de acompanhamento
- Checklist de implementação

Considere sempre regulamentações médicas e ética profissional.`,

  prototipador: `Você é o Agente PROTOTIPADOR MÉDICO da SevenScale, especialista em MVPs para captação médica.

OBJETIVO: Desenvolver protótipos e testes A/B específicos para clínicas médicas, considerando compliance LGPD.

FONTES DE DADOS:
- Meta Ads Manager (campanhas)
- Landing Pages (conversões)
- Google Analytics (comportamento)

DESENVOLVA:
1. MVPs de campanhas médicas
2. Testes A/B para landing pages
3. Protótipos de funis de conversão
4. Scripts de comunicação automatizada
5. Formulários otimizados

FORMATO DE SAÍDA:
- Protótipo detalhado
- Hipóteses de teste
- Métricas de sucesso
- Timeline de implementação
- Análise de compliance

Foque em soluções testáveis e mensuráveis para o setor médico.`,

  implementador: `Você é o Agente IMPLEMENTADOR CLÍNICO da SevenScale, especialista em deploy de automações médicas.

OBJETIVO: Executar implementação de workflows e automações para clínicas médicas.

FONTES DE DADOS:
- N8N (workflows)
- WhatsApp Business API
- Google Calendar (agendamentos)
- CRM (pipeline)

IMPLEMENTE:
1. Automações de follow-up
2. Lembretes de consulta
3. Workflows de captação
4. Sistemas de feedback
5. Integrações entre plataformas

FORMATO DE SAÍDA:
- Plano de implementação
- Configurações técnicas
- Scripts de automação
- Testes de validação
- Documentação de processo

Execute com foco em estabilidade e compliance médico.`,

  lapidador: `Você é o Agente LAPIDADOR CLÍNICO da SevenScale, especialista em otimização com Machine Learning.

OBJETIVO: Otimizar performance e gerar previsões de demanda para clínicas médicas.

FONTES DE DADOS:
- Dados históricos (18+ meses)
- Modelos de ML treinados
- Analytics consolidados
- Padrões sazonais

OTIMIZE:
1. Previsão de demanda
2. Segmentação de pacientes
3. Otimização de campanhas
4. Análise de LTV
5. Modelagem preditiva

FORMATO DE SAÍDA:
- Insights baseados em ML
- Previsões quantificadas
- Recomendações de otimização
- Modelos de segmentação
- Análise de tendências

Use dados para gerar insights acionáveis e previsões precisas.`,

  sistematizador: `Você é o Agente SISTEMATIZADOR MÉDICO da SevenScale, especialista em protocolos clínicos.

OBJETIVO: Criar protocolos padronizados e sistemas de qualidade para clínicas médicas.

FONTES DE DADOS:
- CRM (processos)
- Base de protocolos
- Histórico de atendimentos
- Regulamentações CFM

SISTEMATIZE:
1. SOPs de atendimento
2. Protocolos de qualidade
3. Checklists operacionais
4. Programas de referência
5. Sistemas de compliance

FORMATO DE SAÍDA:
- Protocolos detalhados
- Checklists operacionais
- Fluxos padronizados
- Métricas de qualidade
- Documentação completa

Garanta conformidade com regulamentações médicas e CFM.`,

  monitor: `Você é o Agente MONITOR CLÍNICO da SevenScale, especialista em monitoramento 24/7.

OBJETIVO: Monitorar métricas em tempo real e identificar oportunidades de growth.

FONTES DE DADOS:
- Todas as integrações ativas
- Dashboards em tempo real
- Alertas automáticos
- Métricas consolidadas

MONITORE:
1. Performance de campanhas
2. Taxa de conversão
3. Satisfação de pacientes
4. ROI por canal
5. Anomalias no sistema

FORMATO DE SAÍDA:
- Alertas proativos
- Insights em tempo real
- Recomendações urgentes
- Relatórios de performance
- Oportunidades identificadas

Mantenha vigilância constante e gere alertas acionáveis.`
};

export default function EditPromptModal({ isOpen, onClose, agent, onSave }: EditPromptModalProps) {
  const [prompt, setPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(1.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [timeout, setTimeout] = useState(120);
  const [retryAttempts, setRetryAttempts] = useState(3);
  const [priorityLevel, setPriorityLevel] = useState('Normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    if (agent && isOpen) {
      setPrompt(agent.prompt || agentPrompts[agent.id] || '');
      setTemperature(agent.temperature || 0.3);
      setMaxTokens(agent.maxTokens || 2000);
      setTopP(agent.topP || 1.0);
      setFrequencyPenalty(agent.frequencyPenalty || 0.0);
      setTimeout(agent.timeout || 120);
      setRetryAttempts(agent.retryAttempts || 3);
      setPriorityLevel(agent.priorityLevel || 'Normal');
      setTestInput('');
      setTestOutput('');
      setSaveStatus('idle');
      setErrors({});
    }
  }, [agent, isOpen]);

  useEffect(() => {
    setCharacterCount(prompt.length);
  }, [prompt]);

  if (!isOpen || !agent) return null;

  // Pure function that calculates validation errors without setting state
  const getValidationErrors = () => {
    const newErrors: Record<string, string> = {};

    if (!prompt.trim()) {
      newErrors.prompt = 'Prompt não pode estar vazio';
    } else if (prompt.length < 100) {
      newErrors.prompt = 'Prompt deve ter pelo menos 100 caracteres';
    } else if (prompt.length > 5000) {
      newErrors.prompt = 'Prompt não pode exceder 5000 caracteres';
    }

    if (maxTokens < 500 || maxTokens > 4000) {
      newErrors.maxTokens = 'Max Tokens deve estar entre 500 e 4000';
    }

    if (timeout < 60 || timeout > 300) {
      newErrors.timeout = 'Timeout deve estar entre 60 e 300 segundos';
    }

    return newErrors;
  };

  // Function that validates form and updates state
  const validateForm = () => {
    const newErrors = getValidationErrors();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid without setting state
  const isFormValid = () => {
    const validationErrors = getValidationErrors();
    return Object.keys(validationErrors).length === 0;
  };

  const handleTestPrompt = async () => {
    if (!testInput.trim()) {
      alert('Digite dados de exemplo para testar o prompt');
      return;
    }

    setIsTestLoading(true);
    setTestOutput('');

    // Simular processamento do teste
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockOutput = `**ANÁLISE DIAGNÓSTICA - ${agent.name}**

📊 **Dados Processados:**
- Input recebido: ${testInput.substring(0, 50)}...
- Modelo: GPT-4 Turbo
- Temperatura: ${temperature}
- Tokens utilizados: ${Math.floor(Math.random() * 500) + 200}

✅ **Resultado do Teste:**
Com base nos dados fornecidos, identifiquei 3 oportunidades principais:

1. **Otimização de Funil** (Prioridade Alta)
   - Taxa de conversão atual: 12%
   - Potencial de melhoria: +35%
   - Ação recomendada: Implementar follow-up automatizado

2. **Segmentação de Campanhas** (Prioridade Média)
   - ROI atual: 280%
   - Potencial de melhoria: +45%
   - Ação recomendada: Criar campanhas específicas por especialidade

3. **Retenção de Pacientes** (Prioridade Alta)
   - LTV atual: R$ 2.400
   - Potencial de melhoria: +60%
   - Ação recomendada: Sistema de lembretes inteligente

🎯 **Próximos Passos:**
- Implementar automação de follow-up (2-3 dias)
- Configurar segmentação avançada (1 semana)
- Deploy sistema de retenção (1-2 semanas)

**Status:** ✅ Teste executado com sucesso
**Confiança:** 94%`;

    setTestOutput(mockOutput);
    setIsTestLoading(false);
  };

  const handleSave = async (saveType: 'draft' | 'activate') => {
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedData = {
        prompt,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        timeout,
        retryAttempts,
        priorityLevel
      };

      onSave(agent.id, updatedData);
      setSaveStatus('success');

      if (saveType === 'activate') {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPrompt = () => {
    const exportData = {
      agent: agent.name,
      prompt,
      parameters: {
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        timeout,
        retryAttempts,
        priorityLevel
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${agent.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    if (confirm('Deseja restaurar o prompt padrão? Todas as alterações serão perdidas.')) {
      setPrompt(agentPrompts[agent.id] || '');
      setTemperature(0.3);
      setMaxTokens(2000);
      setTopP(1.0);
      setFrequencyPenalty(0.0);
      setTimeout(120);
      setRetryAttempts(3);
      setPriorityLevel('Normal');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl transition-all duration-300 ${
        isFullscreen 
          ? 'w-full h-full max-w-none max-h-none m-0 rounded-none' 
          : 'max-w-6xl w-full mx-4 max-h-[95vh]'
      } overflow-hidden flex flex-col`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{agent.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Editar Prompt - {agent.name}
                </h2>
                <p className="text-gray-600">Configure a inteligência específica do agente</p>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#7E5EF220', color: '#7E5EF2' }}
              >
                {agent.icon} {agent.name}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={isFullscreen ? 'Sair do modo tela cheia' : 'Modo tela cheia'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Editor */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Prompt Editor */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Prompt do Sistema
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetToDefault}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Undo2 className="w-3 h-3" />
                    Restaurar Padrão
                  </button>
                  <span className={`text-xs ${
                    characterCount > 5000 ? 'text-red-500' : 
                    characterCount < 100 ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    {characterCount}/5000
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={isFullscreen ? 25 : 15}
                  className={`w-full px-4 py-3 border rounded-lg font-mono text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.prompt ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o prompt do sistema para o agente..."
                />
                
                {/* Toolbar */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleExportPrompt}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Exportar prompt"
                  >
                    <FileDown className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                    title="Importar prompt"
                  >
                    <Upload className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {errors.prompt && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.prompt}
                </p>
              )}
            </div>

            {/* Configurações Avançadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Parâmetros do Modelo</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservador</span>
                    <span>Criativo</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="4000"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxTokens ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.maxTokens && <p className="text-red-500 text-sm mt-1">{errors.maxTokens}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top P: {topP}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={topP}
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency Penalty: {frequencyPenalty}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={frequencyPenalty}
                    onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Configurações de Execução</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout (segundos)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="300"
                    value={timeout}
                    onChange={(e) => setTimeout(parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.timeout ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.timeout && <p className="text-red-500 text-sm mt-1">{errors.timeout}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retry Attempts
                  </label>
                  <select
                    value={retryAttempts}
                    onChange={(e) => setRetryAttempts(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 tentativa</option>
                    <option value={2}>2 tentativas</option>
                    <option value={3}>3 tentativas</option>
                    <option value={5}>5 tentativas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Teste Rápido */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teste Rápido</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dados de Teste
                  </label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cole dados exemplo para testar o prompt..."
                  />
                  <button
                    onClick={handleTestPrompt}
                    disabled={isTestLoading || !testInput.trim()}
                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTestLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4" />
                    )}
                    {isTestLoading ? 'Testando...' : 'Testar Prompt'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resultado do Teste
                  </label>
                  <div className="h-40 p-3 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                    {isTestLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processando teste...</span>
                      </div>
                    ) : testOutput ? (
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testOutput}</pre>
                    ) : (
                      <p className="text-gray-500 text-sm">Aguardando execução do teste...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {!isFullscreen && (
            <div className="w-80 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
              
              {/* Status de Salvamento */}
              {saveStatus !== 'idle' && (
                <div className={`p-3 rounded-lg mb-4 ${
                  saveStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {saveStatus === 'success' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {saveStatus === 'success' ? 'Prompt salvo com sucesso!' : 'Erro ao salvar prompt'}
                    </span>
                  </div>
                </div>
              )}

              {/* Histórico */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico de Versões</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>Última modificação: 23/06/2025 14:32</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>por Bruno Monteiro</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    Ver histórico completo
                  </button>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Estatísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Caracteres:</span>
                    <span className="font-medium">{characterCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Palavras:</span>
                    <span className="font-medium">{prompt.split(/\s+/).filter(word => word.length > 0).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Linhas:</span>
                    <span className="font-medium">{prompt.split('\n').length}</span>
                  </div>
                </div>
              </div>

              {/* Dicas */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Dicas</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use instruções específicas e claras</li>
                  <li>• Defina o formato de saída esperado</li>
                  <li>• Inclua exemplos quando necessário</li>
                  <li>• Teste com dados reais antes de ativar</li>
                  <li>• Considere compliance médico</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            Auto-save a cada 30s • Ctrl+Z para desfazer • Ctrl+Y para refazer
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar como Rascunho
            </button>
            <button
              onClick={() => handleSave('activate')}
              disabled={isSaving || !isFormValid()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Salvar e Ativar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}