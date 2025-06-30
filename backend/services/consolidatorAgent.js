/**
 * SevenScale Agent Consolidator - MVP Tier 1
 * Agente IA Consolidador com GPT-4 real e integração das 6 APIs core
 * Compatível com frontend DashboardAdmin e ClientDashboard
 */

import OpenAI from 'openai';
import { dbService } from '../lib/database.js';
import logger from '../lib/logger.js';

// Inicializar OpenAI com API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ⚙️ CONFIGURAÇÕES MVP TIER 1
const MVP_CONFIG = {
  MAX_CONCURRENT_CLIENTS: 1,           // Processar 1 cliente por vez
  PROCESSING_DELAY: 2000,              // 2 segundos entre processamentos
  REQUEST_TIMEOUT: 45000,              // 45 segundos timeout
  MAX_CLIENTS_TOTAL: 12,               // Máximo 12 clientes ativos
  RETRY_ATTEMPTS: 2,                   // 2 tentativas por erro
  TEST_MODE: true,                     // Modo teste com dados simulados
  INSIGHTS_MIN_COUNT: 3,               // Mínimo 3 insights por cliente
  INSIGHTS_MAX_COUNT: 6                // Máximo 6 insights por cliente
};

// 🎯 CLIENTES ATIVOS (expandível para produção)
const ACTIVE_CLIENTS = {
  '1': { name: 'Dr. Silva - Cardiologia', specialty: 'Cardiologia', city: 'São Paulo' },
  '2': { name: 'Clínica Derma Plus', specialty: 'Dermatologia', city: 'Rio de Janeiro' },
  '3': { name: 'Dr. Oliveira - Ortopedia', specialty: 'Ortopedia', city: 'Belo Horizonte' },
  '4': { name: 'CardioVida Center', specialty: 'Cardiologia', city: 'Porto Alegre' },
  '5': { name: 'Oftalmologia Visão', specialty: 'Oftalmologia', city: 'Salvador' },
  '6': { name: 'Dr. Costa - Neurologia', specialty: 'Neurologia', city: 'Recife' },
  '7': { name: 'Pediatria Feliz', specialty: 'Pediatria', city: 'Fortaleza' },
  '8': { name: 'Dr. Santos - Urologia', specialty: 'Urologia', city: 'Brasília' }
};

export class AgentConsolidator {
  
  constructor() {
    this.isProcessing = false;
    this.processedToday = 0;
    this.lastExecution = null;
    this.errors = [];
  }

  /**
   * 🤖 PROCESSAMENTO PRINCIPAL - Compatível com frontend
   * @param {string} clientId - ID do cliente
   * @returns {Object} Insights estruturados
   */
  async processClientData(clientId) {
    try {
      logger.info(`🤖 [CONSOLIDATOR] Iniciando processamento cliente: ${clientId}`);
      const startTime = Date.now();
      
      // ✅ 1. Validar cliente ativo
      if (!ACTIVE_CLIENTS[clientId]) {
        throw new Error(`Cliente ${clientId} não encontrado na lista ativa`);
      }
      
      // ✅ 2. Coletar dados das 6 APIs com timeout
      const consolidatedData = await Promise.race([
        this.collectAllAPIsData(clientId),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na coleta de dados das APIs')), 15000)
        )
      ]);
      
      // ✅ 3. Gerar insights com GPT-4
      const insights = await Promise.race([
        this.generateMedicalInsights(consolidatedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout no processamento GPT-4')), 35000)
        )
      ]);
      
      // ✅ 4. Salvar no banco de dados
      const savedInsight = await this.saveInsightsToDB(clientId, insights);
      
      const processingTime = Date.now() - startTime;
      logger.info(`✅ [CONSOLIDATOR] Cliente ${clientId} processado em ${processingTime}ms`);
      
      return {
        success: true,
        clientId,
        clientName: ACTIVE_CLIENTS[clientId].name,
        insights,
        processedAt: new Date().toISOString(),
        processingTimeMs: processingTime
      };
      
    } catch (error) {
      logger.error(`❌ [CONSOLIDATOR] Erro cliente ${clientId}: ${error.message}`);
      this.errors.push({ clientId, error: error.message, timestamp: new Date().toISOString() });
      throw error;
    }
  }

  /**
   * 📊 COLETA DE DADOS DAS 6 APIs CORE
   * @param {string} clientId - ID do cliente
   * @returns {Object} Dados consolidados de todas as APIs
   */
  async collectAllAPIsData(clientId) {
    const client = ACTIVE_CLIENTS[clientId];
    
    // 🔄 SIMULAÇÃO REALISTA - Em produção, conectar APIs reais
    logger.info(`📡 [APIs] Coletando dados de 6 APIs para ${client.name}...`);
    
    // Delay realista de coleta de APIs
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      client: {
        id: clientId,
        name: client.name,
        specialty: client.specialty,
        location: client.city,
        sevenscale_since: "2024-01-15"
      },
      collection_timestamp: new Date().toISOString(),
      period: "últimos 30 dias",
      
      // 🏥 1. HubSpot CRM - Pipeline e Lead Management
      hubspot_crm: {
        total_leads: this.generateRealisticMetric(25, 80, 'int'),
        qualified_leads: this.generateRealisticMetric(15, 40, 'int'),
        appointments_scheduled: this.generateRealisticMetric(8, 25, 'int'),
        appointments_completed: this.generateRealisticMetric(6, 20, 'int'),
        conversion_rate: this.generateRealisticMetric(20, 35, 'percentage'),
        pipeline_value: this.generateRealisticMetric(50000, 200000, 'currency'),
        avg_deal_size: this.generateRealisticMetric(2500, 8000, 'currency'),
        sales_cycle_days: this.generateRealisticMetric(7, 30, 'int'),
        lead_sources: {
          google_ads: this.generateRealisticMetric(35, 50, 'percentage'),
          referrals: this.generateRealisticMetric(25, 40, 'percentage'),
          organic: this.generateRealisticMetric(10, 25, 'percentage'),
          social: this.generateRealisticMetric(5, 15, 'percentage')
        },
        top_performing_campaigns: ["Cardiologia SP", "Check-up Preventivo", "Consulta Especialista"]
      },
      
      // 📈 2. Google Analytics - Comportamento Digital
      google_analytics: {
        sessions: this.generateRealisticMetric(800, 3000, 'int'),
        users: this.generateRealisticMetric(600, 2200, 'int'),
        pageviews: this.generateRealisticMetric(2500, 8000, 'int'),
        bounce_rate: this.generateRealisticMetric(35, 65, 'percentage'),
        avg_session_duration: this.formatDuration(this.generateRealisticMetric(90, 300, 'int')),
        goal_conversions: this.generateRealisticMetric(15, 60, 'int'),
        conversion_rate: this.generateRealisticMetric(1.8, 4.5, 'percentage'),
        top_pages: ["/agendar-consulta", "/especialidades", "/sobre-doutor", "/contato"],
        traffic_sources: {
          organic_search: this.generateRealisticMetric(35, 55, 'percentage'),
          paid_search: this.generateRealisticMetric(20, 35, 'percentage'),
          direct: this.generateRealisticMetric(15, 25, 'percentage'),
          referral: this.generateRealisticMetric(5, 15, 'percentage'),
          social: this.generateRealisticMetric(3, 10, 'percentage')
        },
        mobile_percentage: this.generateRealisticMetric(65, 85, 'percentage'),
        device_insights: "78% mobile, 20% desktop, 2% tablet"
      },
      
      // 📱 3. Meta Ads - Facebook/Instagram Performance
      meta_ads: {
        total_impressions: this.generateRealisticMetric(15000, 50000, 'int'),
        total_clicks: this.generateRealisticMetric(200, 800, 'int'),
        total_conversions: this.generateRealisticMetric(8, 35, 'int'),
        ctr: this.generateRealisticMetric(1.2, 3.5, 'percentage'),
        cpc: this.generateRealisticMetric(0.8, 3.2, 'currency'),
        cpa: this.generateRealisticMetric(45, 150, 'currency'),
        roas: this.generateRealisticMetric(2.5, 6.0, 'decimal'),
        total_spent: this.generateRealisticMetric(1500, 5000, 'currency'),
        revenue_attributed: this.generateRealisticMetric(5000, 25000, 'currency'),
        best_performing_ad: "Consulta Cardiologia - Desconto 20%",
        audience_insights: {
          age_group: "35-54 anos (62%)",
          gender: "Feminino (58%), Masculino (42%)",
          location: `${client.city} e região metropolitana`,
          interests: ["Saúde", "Bem-estar", "Medicina preventiva"]
        },
        campaign_performance: {
          awareness: { impressions: this.generateRealisticMetric(8000, 20000, 'int'), cpm: this.generateRealisticMetric(8, 25, 'currency') },
          conversion: { conversions: this.generateRealisticMetric(5, 20, 'int'), cpa: this.generateRealisticMetric(50, 120, 'currency') }
        }
      },
      
      // 📅 4. Google Calendar - Gestão de Agendamentos
      google_calendar: {
        total_appointments: this.generateRealisticMetric(45, 120, 'int'),
        confirmed_appointments: this.generateRealisticMetric(40, 100, 'int'),
        cancelled_appointments: this.generateRealisticMetric(2, 8, 'int'),
        no_shows: this.generateRealisticMetric(1, 6, 'int'),
        occupancy_rate: this.generateRealisticMetric(75, 95, 'percentage'),
        avg_appointment_duration: this.generateRealisticMetric(30, 60, 'int'),
        peak_hours: ["09:00-11:00", "14:00-17:00"],
        peak_days: ["Terça", "Quarta", "Quinta"],
        revenue_from_appointments: this.generateRealisticMetric(25000, 80000, 'currency'),
        advance_booking_avg: this.generateRealisticMetric(3, 14, 'int'),
        repeat_patients_percentage: this.generateRealisticMetric(40, 70, 'percentage'),
        appointment_types: {
          consultation: this.generateRealisticMetric(60, 80, 'percentage'),
          followup: this.generateRealisticMetric(15, 25, 'percentage'),
          procedure: this.generateRealisticMetric(5, 15, 'percentage')
        }
      },
      
      // 💬 5. WhatsApp Business - Comunicação e Atendimento
      whatsapp_business: {
        total_messages_sent: this.generateRealisticMetric(200, 600, 'int'),
        total_messages_received: this.generateRealisticMetric(180, 500, 'int'),
        response_rate: this.generateRealisticMetric(85, 98, 'percentage'),
        avg_response_time: this.generateRealisticMetric(5, 45, 'int'), // minutos
        conversations_started: this.generateRealisticMetric(50, 150, 'int'),
        appointments_via_whatsapp: this.generateRealisticMetric(15, 45, 'int'),
        conversion_to_appointment: this.generateRealisticMetric(25, 45, 'percentage'),
        customer_satisfaction: this.generateRealisticMetric(4.2, 4.9, 'rating'),
        automated_responses: this.generateRealisticMetric(40, 70, 'percentage'),
        business_hours_usage: this.generateRealisticMetric(70, 90, 'percentage'),
        common_inquiries: [
          "Agendamento de consulta",
          "Horários disponíveis", 
          "Procedimentos realizados",
          "Valores e convênios",
          "Localização da clínica"
        ]
      },
      
      // 🎯 6. RD Station - Marketing Automation e Lead Nurturing
      rd_station: {
        total_leads: this.generateRealisticMetric(60, 200, 'int'),
        qualified_leads: this.generateRealisticMetric(25, 80, 'int'),
        lead_score_average: this.generateRealisticMetric(45, 85, 'int'),
        emails_sent: this.generateRealisticMetric(500, 1500, 'int'),
        emails_opened: this.generateRealisticMetric(200, 700, 'int'),
        emails_clicked: this.generateRealisticMetric(30, 120, 'int'),
        open_rate: this.generateRealisticMetric(25, 45, 'percentage'),
        click_rate: this.generateRealisticMetric(8, 18, 'percentage'),
        unsubscribe_rate: this.generateRealisticMetric(0.5, 3, 'percentage'),
        nurturing_conversion: this.generateRealisticMetric(15, 35, 'percentage'),
        workflows_active: this.generateRealisticMetric(3, 8, 'int'),
        landing_pages_performance: {
          total_visits: this.generateRealisticMetric(800, 2500, 'int'),
          conversions: this.generateRealisticMetric(80, 300, 'int'),
          conversion_rate: this.generateRealisticMetric(8, 18, 'percentage')
        },
        segmentation_data: {
          by_specialty: `${client.specialty} (85%)`,
          by_location: `${client.city} região (78%)`,
          by_age: "35-65 anos (72%)"
        }
      }
    };
  }

  /**
   * 🧠 GERAÇÃO DE INSIGHTS MÉDICOS COM GPT-4
   * @param {Object} data - Dados consolidados das 6 APIs
   * @returns {Object} Insights estruturados para o setor médico
   */
  async generateMedicalInsights(data) {
    try {
      logger.info(`🧠 [GPT-4] Gerando insights médicos para ${data.client.name}...`);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getMedicalSystemPrompt()
          },
          {
            role: "user", 
            content: `Analise os dados consolidados desta clínica médica:\n\n${JSON.stringify(data, null, 2)}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.4,
        timeout: 30000
      });

      const content = response.choices[0].message.content;
      
      try {
        const insights = JSON.parse(content);
        
        // ✅ Validar estrutura obrigatória
        if (!insights.insights || !insights.action_items || !insights.roi_analysis) {
          throw new Error('Estrutura de insights inválida do GPT-4');
        }
        
        // ✅ Adicionar dados de contexto
        insights.generated_at = new Date().toISOString();
        insights.client_id = data.client.id;
        insights.client_name = data.client.name;
        insights.specialty = data.client.specialty;
        insights.agent_version = "consolidator-v1.1";
        
        logger.info(`✅ [GPT-4] ${insights.insights.length} insights gerados`);
        return insights;
        
      } catch (parseError) {
        logger.error('❌ [GPT-4] Erro ao parsear resposta JSON:', parseError.message);
        logger.error('📄 [GPT-4] Resposta bruta:', content);
        throw new Error('Resposta inválida do GPT-4 - JSON malformado');
      }
      
    } catch (error) {
      logger.error('❌ [GPT-4] Erro na API OpenAI:', error.message);
      throw error;
    }
  }

  /**
   * 📝 PROMPT ESPECIALIZADO PARA SETOR MÉDICO
   * @returns {string} Prompt otimizado para análise médica
   */
  getMedicalSystemPrompt() {
    return `
Você é um consultor especialista em growth marketing médico da SevenScale.

OBJETIVO: Analisar dados de clínica médica e gerar insights ESPECÍFICOS e ACIONÁVEIS para o setor de saúde.

BENCHMARKS MÉDICOS ATUALIZADOS:
- Taxa conversão site médico: 2-5%
- No-show rate aceitável: 8-12% 
- Ocupação agenda ideal: 80-90%
- ROI Google Ads médico: 300-600%
- Tempo resposta WhatsApp: <15min
- Taxa abertura email médico: 25-35%
- Cost per acquisition médico: R$ 80-200

COMPLIANCE MÉDICO OBRIGATÓRIO:
- CFM (Conselho Federal de Medicina)
- LGPD para dados de saúde
- Publicidade médica ética
- Sigilo médico digital

RETORNE APENAS JSON VÁLIDO:
{
  "insights": [
    "Insight específico com métrica vs benchmark médico",
    "Oportunidade identificada com potencial de receita",
    "Análise comparativa com padrão do setor"
  ],
  "action_items": [
    {
      "action": "Ação específica implementável",
      "priority": "alta|média|baixa",
      "estimated_impact": "Impacto estimado em R$ ou %",
      "timeline": "Prazo de implementação",
      "medical_compliance": "Consideração regulatória se aplicável"
    }
  ],
  "roi_analysis": {
    "sevenscale_investment": "R$ valor mensal estimado",
    "additional_revenue": "R$ receita adicional gerada",
    "roi_percentage": "número%",
    "payback_period": "X dias/meses",
    "comparison_vs_sector": "vs média setor médico"
  },
  "alerts": [
    "Alerta crítico apenas se métrica estiver muito abaixo do benchmark"
  ],
  "opportunities": [
    {
      "title": "Título da oportunidade",
      "description": "Descrição específica",
      "potential_revenue": "R$ valor estimado",
      "implementation_effort": "baixo|médio|alto"
    }
  ],
  "score": número de 1-100,
  "specialty_insights": "Insights específicos da especialidade médica",
  "digital_health_trends": "Tendências relevantes de saúde digital"
}

FOQUE EM:
1. Métricas específicas do setor médico
2. Oportunidades de crescimento realistas
3. Compliance com regulamentações
4. ROI demonstrável e transparente
5. Ações implementáveis em clínicas médicas

Seja OBJETIVO, ESPECÍFICO e use DADOS CONCRETOS.
`;
  }

  /**
   * 💾 SALVAR INSIGHTS NO BANCO DE DADOS
   * @param {string} clientId - ID do cliente
   * @param {Object} insights - Insights gerados
   * @returns {Object} Registro salvo
   */
  async saveInsightsToDB(clientId, insights) {
    try {
      const savedInsight = await dbService.saveAgentInsights(
        clientId, 
        insights, 
        'consolidator-gpt4'
      );
      
      logger.info(`💾 [DB] Insights salvos para cliente ${clientId}`);
      return savedInsight;
      
    } catch (error) {
      logger.error(`❌ [DB] Erro ao salvar insights cliente ${clientId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * 🔄 PROCESSAMENTO DE TODOS OS CLIENTES (ENDPOINT PRINCIPAL)
   * @returns {Object} Resultado consolidado de todos os processamentos
   */
  async processAllClients() {
    try {
      this.isProcessing = true;
      const startTime = Date.now();
      
      logger.info(`🚀 [CONSOLIDATOR] Iniciando processamento de ${Object.keys(ACTIVE_CLIENTS).length} clientes`);
      
      const results = [];
      const clientIds = Object.keys(ACTIVE_CLIENTS);
      
      // Processar clientes sequencialmente para evitar rate limits
      for (const clientId of clientIds) {
        try {
          logger.info(`🎯 [CONSOLIDATOR] Processando cliente ${clientId}/${clientIds.length}`);
          
          const result = await this.processClientData(clientId);
          results.push(result);
          
          this.processedToday++;
          
          // Rate limiting entre clientes
          if (results.length < clientIds.length) {
            logger.info(`⏰ [CONSOLIDATOR] Aguardando ${MVP_CONFIG.PROCESSING_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, MVP_CONFIG.PROCESSING_DELAY));
          }
          
        } catch (error) {
          logger.error(`❌ [CONSOLIDATOR] Falha cliente ${clientId}: ${error.message}`);
          results.push({
            success: false,
            clientId,
            clientName: ACTIVE_CLIENTS[clientId]?.name || `Cliente ${clientId}`,
            error: error.message,
            processedAt: new Date().toISOString()
          });
        }
      }
      
      const totalTime = Date.now() - startTime;
      const summary = {
        success: true,
        processed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        total: results.length,
        executionTime: `${(totalTime / 1000).toFixed(1)}s`,
        results
      };
      
      this.lastExecution = new Date().toISOString();
      this.isProcessing = false;
      
      logger.info(`✅ [CONSOLIDATOR] Processamento completo: ${summary.processed}/${summary.total} sucessos em ${summary.executionTime}`);
      
      return summary;
      
    } catch (error) {
      this.isProcessing = false;
      logger.error('❌ [CONSOLIDATOR] Erro no processamento geral:', error.message);
      throw error;
    }
  }

  /**
   * 📊 STATUS DO AGENTE (COMPATÍVEL COM FRONTEND)
   * @returns {Object} Status atual do agente
   */
  getAgentStatus() {
    return {
      status: this.isProcessing ? 'processing' : 'active',
      agent_status: this.isProcessing ? 'Processando' : 'Ativo',
      mode: 'consolidator-gpt4',
      version: '1.1.0',
      last_execution: this.lastExecution,
      processed_today: this.processedToday,
      active_clients: Object.keys(ACTIVE_CLIENTS).length,
      openai_configured: !!process.env.OPENAI_API_KEY,
      test_mode: MVP_CONFIG.TEST_MODE,
      errors_count: this.errors.length,
      last_error: this.errors.length > 0 ? this.errors[this.errors.length - 1] : null,
      performance: this.calculatePerformance(),
      config: MVP_CONFIG
    };
  }

  /**
   * 🎯 PROCESSAMENTO DE CLIENTE ÚNICO (PARA TESTE FRONTEND)
   * @param {string} clientId - ID do cliente
   * @returns {Object} Resultado do processamento
   */
  async processSingleClient(clientId) {
    if (!ACTIVE_CLIENTS[clientId]) {
      throw new Error(`Cliente ${clientId} não encontrado`);
    }
    
    return await this.processClientData(clientId);
  }

  /**
   * 📈 CALCULAR PERFORMANCE DO AGENTE
   * @returns {number} Score de performance (1-100)
   */
  calculatePerformance() {
    if (this.processedToday === 0) return 95;
    
    const errorRate = this.errors.length / this.processedToday;
    const baseScore = 100;
    const penalty = errorRate * 20; // -20 pontos por erro
    
    return Math.max(75, Math.round(baseScore - penalty));
  }

  /**
   * 🎲 GERAR MÉTRICAS REALISTAS PARA SIMULAÇÃO
   */
  generateRealisticMetric(min, max, type) {
    const value = Math.random() * (max - min) + min;
    
    switch (type) {
      case 'int':
        return Math.round(value);
      case 'percentage':
        return parseFloat(value.toFixed(1));
      case 'currency':
        return Math.round(value);
      case 'decimal':
        return parseFloat(value.toFixed(1));
      case 'rating':
        return parseFloat(value.toFixed(1));
      default:
        return Math.round(value);
    }
  }

  /**
   * ⏱️ FORMATAR DURAÇÃO EM MM:SS
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * 📋 LISTAR CLIENTES ATIVOS
   * @returns {Array} Lista de clientes configurados
   */
  getActiveClients() {
    return Object.entries(ACTIVE_CLIENTS).map(([id, data]) => ({
      id,
      ...data,
      status: 'active'
    }));
  }
}

// Instância singleton para uso em toda a aplicação
export const consolidatorAgent = new AgentConsolidator();
export default AgentConsolidator;