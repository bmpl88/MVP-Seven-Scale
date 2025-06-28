import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Play,
  Pause,
  FileText,
  TestTube,
  Zap,
  Database,
  Brain,
  Target,
  Wrench,
  Monitor,
  Eye,
  RefreshCw,
  Download,
  Shield,
  Loader2,
  X
} from 'lucide-react';
import EditPromptModal from '../components/EditPromptModal';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmModal from '../components/ConfirmModal';
import ToastContainer from '../components/ToastContainer';
import ConfigureAllModal from '../components/ConfigureAllModal';
import { useToast } from '../hooks/useToast';
import { useDashboardContext } from '../context/DashboardContext';

interface Agent {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'processing' | 'paused' | 'error';
  isActive: boolean;
  performance: number;
  lastExecution: string;
  processingClients: number;
  prompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  timeout: number;
  retryAttempts: number;
  priorityLevel: string;
  dataSources: { name: string; connected: boolean }[];
  currentTasks: { client: string; task: string; progress: number; status: 'processing' | 'completed' | 'queued' }[];
}

const systemLogs = [
  { time: '14:32', agent: 'Agente 1', action: 'processou Dr. Silva', status: 'success' },
  { time: '14:28', agent: 'Agente 7', action: 'gerou alerta CardioVida', status: 'warning' },
  { time: '14:25', agent: 'Sistema', action: 'backup automático realizado', status: 'success' },
  { time: '14:20', agent: 'Agente 3', action: 'iniciou teste A/B', status: 'processing' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return { bg: '#03A63C20', text: '#03A63C', icon: CheckCircle };
    case 'processing': return { bg: '#F59E0B20', text: '#F59E0B', icon: Clock };
    case 'paused': return { bg: '#6B728020', text: '#6B7280', icon: Pause };
    case 'error': return { bg: '#EF444420', text: '#EF4444', icon: AlertTriangle };
    default: return { bg: '#6B728020', text: '#6B7280', icon: Clock };
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return '#03A63C';
    case 'processing': return '#F59E0B';
    case 'queued': return '#6B7280';
    default: return '#6B7280';
  }
};

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

export default function AIAgents() {
  const { agentAnalytics, loadAgentAnalytics, loading } = useDashboardContext();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfigureAllModal, setShowConfigureAllModal] = useState(false);
  const [agentToToggle, setAgentToToggle] = useState<Agent | null>(null);
  
  const { toasts, removeToast, showSuccess, showWarning, showError, showInfo } = useToast();

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadAgentAnalytics();
  }, [loadAgentAnalytics]);

  // Processar dados dos agentes
  useEffect(() => {
    if (agentAnalytics && agentAnalytics.length > 0) {
      // Mapear dados do backend para o formato do componente
      const processedAgents: Agent[] = agentAnalytics.map(agent => {
        // Determinar ícone com base no tipo de agente
        const getAgentIcon = (type: string) => {
          switch (type) {
            case 'diagnosticador': return '🔍';
            case 'arquiteto': return '🗺️';
            case 'prototipador': return '⚡';
            case 'implementador': return '🏗️';
            case 'lapidador': return '💎';
            case 'sistematizador': return '⚙️';
            case 'monitor': return '🎯';
            default: return '🤖';
          }
        };
        
        // Determinar status do agente
        const isActive = agent.status === 'active';
        const processingClients = isActive ? Math.floor(Math.random() * 4) + 1 : 0;
        
        // Gerar tarefas simuladas
        const generateTasks = () => {
          if (!isActive) return [];
          
          const tasks = [];
          const numTasks = Math.floor(Math.random() * 3) + 1;
          
          for (let i = 0; i < numTasks; i++) {
            const status = Math.random() > 0.6 ? 'processing' : Math.random() > 0.5 ? 'completed' : 'queued';
            tasks.push({
              client: `Cliente ${i + 1}`,
              task: status === 'processing' ? 'Analisando dados' : 
                    status === 'completed' ? 'Concluído' : 'Na fila',
              progress: status === 'processing' ? Math.floor(Math.random() * 80) + 20 : 
                        status === 'completed' ? 100 : 0,
              status: status as 'processing' | 'completed' | 'queued'
            });
          }
          
          return tasks;
        };
        
        // Gerar fontes de dados simuladas
        const generateDataSources = () => {
          const sources = [
            { name: 'HubSpot', connected: Math.random() > 0.1 },
            { name: 'Google Analytics', connected: Math.random() > 0.1 },
            { name: 'Meta Ads', connected: Math.random() > 0.1 }
          ];
          
          return sources;
        };
        
        return {
          id: agent.agent_type,
          name: agent.name,
          icon: getAgentIcon(agent.agent_type),
          status: agent.status as 'active' | 'processing' | 'paused' | 'error',
          isActive,
          performance: agent.performance,
          lastExecution: agent.last_execution ? '5min' : '30min',
          processingClients,
          prompt: agentPrompts[agent.agent_type] || '',
          temperature: 0.3,
          maxTokens: 2000,
          topP: 1.0,
          frequencyPenalty: 0.0,
          timeout: 120,
          retryAttempts: 3,
          priorityLevel: 'Normal',
          dataSources: generateDataSources(),
          currentTasks: generateTasks()
        };
      });
      
      setAgents(processedAgents);
      
      // Carregar status dos agentes do localStorage
      const savedStatus = localStorage.getItem('sevenscale_agents_status');
      if (savedStatus) {
        try {
          const statusMap = JSON.parse(savedStatus);
          setAgents(prevAgents => 
            prevAgents.map(agent => ({
              ...agent,
              isActive: statusMap[agent.id] !== undefined ? statusMap[agent.id] : agent.isActive,
              status: statusMap[agent.id] ? (agent.status === 'paused' ? 'active' : agent.status) : 'paused'
            }))
          );
        } catch (error) {
          console.error('Error loading agent status:', error);
        }
      }
    }
  }, [agentAnalytics]);

  // Load agent status from localStorage on mount
  useEffect(() => {
    const savedStatus = localStorage.getItem('sevenscale_agents_status');
    if (savedStatus) {
      try {
        const statusMap = JSON.parse(savedStatus);
        setAgents(prevAgents => 
          prevAgents.map(agent => ({
            ...agent,
            isActive: statusMap[agent.id] !== undefined ? statusMap[agent.id] : agent.isActive,
            status: statusMap[agent.id] ? (agent.status === 'paused' ? 'active' : agent.status) : 'paused'
          }))
        );
      } catch (error) {
        console.error('Error loading agent status:', error);
      }
    }
  }, []);

  // Save agent status to localStorage whenever it changes
  const saveAgentStatus = (updatedAgents: Agent[]) => {
    const statusMap = updatedAgents.reduce((acc, agent) => {
      acc[agent.id] = agent.isActive;
      return acc;
    }, {} as Record<string, boolean>);
    localStorage.setItem('sevenscale_agents_status', JSON.stringify(statusMap));
  };

  const totalProcessing = agents.reduce((sum, agent) => sum + (agent.isActive ? agent.processingClients : 0), 0);
  const averagePerformance = Math.round(agents.reduce((sum, agent) => sum + agent.performance, 0) / (agents.length || 1));
  const activeAgents = agents.filter(agent => agent.isActive).length;

  const handleSaveAgent = (agentId: string, updatedData: Partial<Agent>) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId 
          ? { ...agent, ...updatedData }
          : agent
      )
    );
  };

  const handleToggleAgent = (agent: Agent) => {
    if (agent.isActive) {
      // If agent is active, show confirmation modal
      setAgentToToggle(agent);
      setShowConfirmModal(true);
    } else {
      // If agent is inactive, activate immediately
      activateAgent(agent);
    }
  };

  const activateAgent = (agent: Agent) => {
    const updatedAgents = agents.map(a => 
      a.id === agent.id 
        ? { 
            ...a, 
            isActive: true, 
            status: 'active' as const,
            processingClients: a.id === 'sistematizador' ? 1 : a.processingClients // Restore processing for sistematizador
          }
        : a
    );
    setAgents(updatedAgents);
    saveAgentStatus(updatedAgents);
    showSuccess(`✅ ${agent.name} ativado com sucesso`);
  };

  const deactivateAgent = (agent: Agent) => {
    const updatedAgents = agents.map(a => 
      a.id === agent.id 
        ? { 
            ...a, 
            isActive: false, 
            status: 'paused' as const,
            processingClients: 0,
            currentTasks: []
          }
        : a
    );
    setAgents(updatedAgents);
    saveAgentStatus(updatedAgents);
    showWarning(`⏸️ ${agent.name} pausado`);
    setShowConfirmModal(false);
    setAgentToToggle(null);
  };

  const handleConfigureAll = (settings: any) => {
    if (settings.action) {
      switch (settings.action) {
        case 'activate-all':
          const allActiveAgents = agents.map(agent => ({
            ...agent,
            isActive: true,
            status: 'active' as const,
            processingClients: agent.id === 'sistematizador' ? 1 : agent.processingClients
          }));
          setAgents(allActiveAgents);
          saveAgentStatus(allActiveAgents);
          showInfo('ℹ️ Todos os agentes foram ativados');
          break;
        case 'pause-all':
          const allPausedAgents = agents.map(agent => ({
            ...agent,
            isActive: false,
            status: 'paused' as const,
            processingClients: 0,
            currentTasks: []
          }));
          setAgents(allPausedAgents);
          saveAgentStatus(allPausedAgents);
          showInfo('ℹ️ Todos os agentes foram pausados');
          break;
        case 'restart-all':
          showInfo('ℹ️ Reiniciando todos os agentes...');
          // Simulate restart process
          setTimeout(() => {
            showSuccess('✅ Todos os agentes foram reiniciados');
          }, 2000);
          break;
      }
    } else {
      showInfo('ℹ️ Configurações aplicadas a todos os agentes');
    }
    setShowConfigureAllModal(false);
  };

  const openPromptModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowPromptModal(true);
  };

  const currentStats = {
    activeAgents,
    totalAgents: agents.length,
    processingTasks: totalProcessing,
    successRate: 94,
    avgResponseTime: '23min'
  };

  if (loading && agents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">7 Agentes IA - Método IMPULSO®</h1>
            <p className="text-gray-600">Centro de configuração e monitoramento dos agentes especializados</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowConfigureAllModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium" 
              style={{ backgroundColor: '#0468BF' }}
            >
              <Settings className="w-4 h-4" />
              Configurar Todos
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Shield className="w-4 h-4" />
              Backup Prompts
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <FileText className="w-4 h-4" />
              Logs Sistema
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Performance Report
            </button>
          </div>
        </div>

        {/* Métricas do Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#03A63C10' }}>
            <CheckCircle className="w-6 h-6" style={{ color: '#03A63C' }} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
              <p className="text-gray-600 text-sm">Agentes Ativos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#7E5EF210' }}>
            <Zap className="w-6 h-6" style={{ color: '#7E5EF2' }} />
            <div>
              <p className="text-2xl font-bold text-gray-900">1.847</p>
              <p className="text-gray-600 text-sm">Processamentos hoje</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#0468BF10' }}>
            <Target className="w-6 h-6" style={{ color: '#0468BF' }} />
            <div>
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <p className="text-gray-600 text-sm">Taxa de sucesso</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F59E0B10' }}>
            <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
            <div>
              <p className="text-2xl font-bold text-gray-900">23min</p>
              <p className="text-gray-600 text-sm">Tempo médio resposta</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Grid dos Agentes - 3 colunas */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agents.map((agent) => {
                const statusConfig = getStatusColor(agent.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={agent.id} 
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-opacity ${
                      !agent.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{agent.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900">{agent.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className="w-4 h-4" style={{ color: statusConfig.text }} />
                            <span className="text-sm" style={{ color: statusConfig.text }}>
                              {agent.isActive ? (
                                agent.status === 'active' ? 'Ativo' : 
                                agent.status === 'processing' ? 'Processando' : 'Ativo'
                              ) : 'Inativo'}
                            </span>
                            <span className="text-gray-500 text-sm">
                              | {agent.isActive ? `Processando: ${agent.processingClients} clientes` : 'Pausado'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: '#7E5EF2' }}>{agent.performance}/100</p>
                          <p className="text-gray-500 text-xs">Última: {agent.lastExecution}</p>
                        </div>
                        <ToggleSwitch
                          isOn={agent.isActive}
                          onToggle={() => handleToggleAgent(agent)}
                        />
                      </div>
                    </div>

                    {/* Configurações */}
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Sistema</label>
                        <div className="relative">
                          <textarea
                            value={agent.prompt}
                            readOnly
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm resize-none"
                          />
                          <button 
                            onClick={() => openPromptModal(agent)}
                            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={agent.temperature}
                            className="w-full"
                            readOnly
                          />
                          <span className="text-xs text-gray-500">{agent.temperature}</span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                          <input
                            type="number"
                            value={agent.maxTokens}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            readOnly
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fontes de dados</label>
                        <div className="flex flex-wrap gap-2">
                          {agent.dataSources.map((source, index) => (
                            <div key={index} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ 
                              backgroundColor: source.connected ? '#03A63C20' : '#EF444420',
                              color: source.connected ? '#03A63C' : '#EF4444'
                            }}>
                              <CheckCircle className="w-3 h-3" />
                              {source.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status Processamento */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status processamento</label>
                      {agent.isActive ? (
                        <div className="space-y-2">
                          {agent.currentTasks.map((task, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getTaskStatusColor(task.status) }}
                                />
                                <span className="text-sm text-gray-700">{task.client}</span>
                                <span className="text-xs text-gray-500">- {task.task}</span>
                              </div>
                              {task.status === 'processing' && (
                                <span className="text-xs font-medium" style={{ color: '#F59E0B' }}>
                                  ({task.progress}%)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-gray-100 text-center">
                          <p className="text-sm text-gray-600">Agente pausado - Nenhum processamento ativo</p>
                        </div>
                      )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openPromptModal(agent)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Editar Prompt
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowTestModal(true);
                        }}
                        disabled={!agent.isActive}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <TestTube className="w-4 h-4" />
                        Testar
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowLogsModal(true);
                        }}
                        disabled={!agent.isActive}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText className="w-4 h-4" />
                        Logs
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="space-y-6">
            {/* Configurações Globais */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações Gerais</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo IA</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>GPT-4 Turbo</option>
                    <option>GPT-4</option>
                    <option>Claude 3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    defaultValue="50"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">50 req/min</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retry Logic</label>
                  <input
                    type="number"
                    defaultValue="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timeout</label>
                  <input
                    type="number"
                    defaultValue="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Monitoramento Sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monitoramento Sistema</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">API OpenAI</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#03A63C' }} />
                    <span className="text-sm" style={{ color: '#03A63C' }}>Operacional</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Banco de dados</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#03A63C' }} />
                    <span className="text-sm" style={{ color: '#03A63C' }}>Conectado</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Integrações</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#03A63C' }} />
                    <span className="text-sm" style={{ color: '#03A63C' }}>6/7 ativas</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Queue</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
                    <span className="text-sm" style={{ color: '#F59E0B' }}>12 jobs pendentes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs Recentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Logs Recentes</h3>
                <button className="p-1 rounded hover:bg-gray-100">
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="text-gray-500 font-mono">{log.time}</span>
                    <div className="flex-1">
                      <span className="text-gray-700">{log.agent} {log.action}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {log.status === 'success' && <CheckCircle className="w-3 h-3" style={{ color: '#03A63C' }} />}
                        {log.status === 'warning' && <AlertTriangle className="w-3 h-3" style={{ color: '#F59E0B' }} />}
                        {log.status === 'processing' && <Clock className="w-3 h-3" style={{ color: '#0468BF' }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Editar Prompt */}
      <EditPromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        agent={selectedAgent}
        onSave={handleSaveAgent}
      />

      {/* Modal Confirmar Desativação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setAgentToToggle(null);
        }}
        onConfirm={() => agentToToggle && deactivateAgent(agentToToggle)}
        title="Desativar Agente IA"
        agentName={agentToToggle?.name || ''}
        agentIcon={agentToToggle?.icon || ''}
        processingClients={agentToToggle?.processingClients || 0}
      />

      {/* Modal Configurar Todos */}
      <ConfigureAllModal
        isOpen={showConfigureAllModal}
        onClose={() => setShowConfigureAllModal(false)}
        onApplySettings={handleConfigureAll}
        currentStats={currentStats}
      />

      {/* Modal Testar Agente */}
      {showTestModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Testar Agente - {selectedAgent.name}
                </h3>
                <button onClick={() => setShowTestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dados de Teste</label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Cole aqui os dados de exemplo para testar o agente..."
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Resultado do Teste</h4>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Aguardando execução do teste...</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowTestModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Executar Teste
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Logs */}
      {showLogsModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Logs - {selectedAgent.name}
                </h3>
                <button onClick={() => setShowLogsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                <div>[2024-01-15 14:32:15] INFO: Agente iniciado com sucesso</div>
                <div>[2024-01-15 14:32:16] INFO: Conectando com fontes de dados...</div>
                <div>[2024-01-15 14:32:17] SUCCESS: HubSpot conectado</div>
                <div>[2024-01-15 14:32:18] SUCCESS: Google Analytics conectado</div>
                <div>[2024-01-15 14:32:19] INFO: Processando cliente Dr. Silva...</div>
                <div>[2024-01-15 14:32:45] SUCCESS: Análise concluída para Dr. Silva</div>
                <div>[2024-01-15 14:33:01] INFO: Processando cliente CardioVida...</div>
                <div>[2024-01-15 14:33:28] SUCCESS: Análise concluída para CardioVida</div>
                <div>[2024-01-15 14:33:30] INFO: Agente em standby</div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowLogsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Fechar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}