/**
 * SevenScale Agent Consolidator - MVP 
 * MODIFICADO: Processa apenas 1 cliente por vez para evitar timeouts
 * Configurado para máximo 2 clientes teste
 */

import OpenAI from 'openai';
import { dbService } from '../lib/database.js';
import logger from '../lib/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ⚙️ CONFIGURAÇÕES DE CONTROLE
const RATE_LIMIT_CONFIG = {
  MAX_CONCURRENT_CLIENTS: 1,           // ✅ Processar apenas 1 cliente por vez
  PROCESSING_DELAY: 3000,              // ✅ 3 segundos entre processamentos
  REQUEST_TIMEOUT: 45000,              // ✅ 45 segundos timeout por cliente
  MAX_CLIENTS_TOTAL: 2,                // ✅ Máximo 2 clientes para teste
  RETRY_ATTEMPTS: 2,                   // ✅ Apenas 2 tentativas
  TEST_CLIENT_IDS: ['1', '2']          // ✅ Apenas clientes específicos
};

export class AgentConsolidator {
  
  /**
   * Processa dados do cliente e gera insights usando GPT-4
   * MODIFICADO: Com timeout otimizado e rate limiting
   * @param {string} clientId - ID do cliente
   * @returns {Object} Insights gerados
   */
  async processClientData(clientId) {
    try {
      logger.info(`🤖 Processing client data: ${clientId}`);
      
      // ✅ Verificar se é cliente autorizado para teste
      if (!RATE_LIMIT_CONFIG.TEST_CLIENT_IDS.includes(clientId)) {
        logger.info(`⏭️ Cliente ${clientId} pulado - não está na lista de teste`);
        throw new Error(`Cliente ${clientId} não autorizado para processamento no modo teste`);
      }
      
      // ✅ 1. Coleta dados consolidados com timeout
      const consolidatedData = await Promise.race([
        this.collectClientData(clientId),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na coleta de dados')), 10000)
        )
      ]);
      
      // ✅ 2. Processa com GPT-4 com timeout
      const insights = await Promise.race([
        this.generateInsights(consolidatedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout no processamento GPT-4')), 35000)
        )
      ]);
      
      // ✅ 3. Salva no Supabase
      await dbService.saveAgentInsights(clientId, insights, 'mvp-consolidator');
      
      logger.info(`✅ Insights generated for client: ${clientId}`);
      return insights;
      
    } catch (error) {
      logger.error(`❌ Agent Consolidator error for client ${clientId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Coleta dados consolidados do cliente
   * MANTIDO: Mock dados mas com timeout otimizado
   * @param {string} clientId - ID do cliente
   * @returns {Object} Dados consolidados
   */
  async collectClientData(clientId) {
    // ✅ Simular pequeno delay de coleta (realista)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData = {
      client: {
        id: clientId,
        name: this.getClientName(clientId),
        specialty: this.getClientSpecialty(clientId),
        location: "São Paulo, SP"
      },
      period: "últimos 30 dias",
      timestamp: new Date().toISOString(),
      
      // HubSpot CRM data
      hubspot: {
        leads: Math.floor(Math.random() * 50) + 20,
        conversoes: Math.floor(Math.random() * 15) + 5,
        pipeline_value: `R$ ${(Math.random() * 100000 + 50000).toFixed(0)}`,
        conversion_rate: `${(Math.random() * 10 + 20).toFixed(1)}%`,
        avg_deal_size: `R$ ${(Math.random() * 5000 + 3000).toFixed(0)}`,
        sales_cycle_days: Math.floor(Math.random() * 20) + 15,
        lead_sources: ["Google Ads", "Indicação", "Site", "WhatsApp"]
      },
      
      // Google Analytics data  
      google_analytics: {
        sessions: Math.floor(Math.random() * 2000) + 1000,
        users: Math.floor(Math.random() * 1500) + 800,
        conversions: Math.floor(Math.random() * 30) + 15,
        conversion_rate: `${(Math.random() * 2 + 1).toFixed(1)}%`,
        bounce_rate: `${(Math.random() * 20 + 40).toFixed(0)}%`,
        avg_session_duration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60)}`,
        top_pages: ["/cardiologia", "/agendamento", "/contato"],
        traffic_sources: {
          organic: Math.floor(Math.random() * 30) + 35,
          paid: Math.floor(Math.random() * 20) + 25,
          direct: Math.floor(Math.random() * 10) + 15,
          social: Math.floor(Math.random() * 15) + 5
        }
      },
      
      // Meta Ads data
      meta_ads: {
        impressoes: Math.floor(Math.random() * 10000) + 10000,
        clicks: Math.floor(Math.random() * 300) + 200,
        conversions: Math.floor(Math.random() * 20) + 10,
        ctr: `${(Math.random() * 2 + 2).toFixed(1)}%`,
        cpa: `R$ ${(Math.random() * 100 + 100).toFixed(0)}`,
        roas: (Math.random() * 2 + 2).toFixed(1),
        spent: `R$ ${(Math.random() * 2000 + 1500).toFixed(0)}`,
        revenue_attributed: `R$ ${(Math.random() * 5000 + 4000).toFixed(0)}`,
        best_audience: "Homens 35-55 SP Capital"
      },
      
      // Google Calendar data
      google_calendar: {
        agendamentos: Math.floor(Math.random() * 20) + 20,
        cancelamentos: Math.floor(Math.random() * 5) + 2,
        no_shows: Math.floor(Math.random() * 3) + 1,
        ocupacao_percent: Math.floor(Math.random() * 20) + 75,
        receita_agendamentos: `R$ ${(Math.random() * 5000 + 5000).toFixed(0)}`,
        horarios_pico: ["09:00-11:00", "14:00-16:00"],
        tempo_medio_consulta: Math.floor(Math.random() * 30) + 30
      },
      
      // WhatsApp Business data
      whatsapp: {
        mensagens_enviadas: Math.floor(Math.random() * 100) + 100,
        mensagens_respondidas: Math.floor(Math.random() * 80) + 90,
        taxa_resposta: `${(Math.random() * 10 + 85).toFixed(0)}%`,
        tempo_resposta_medio: `${Math.floor(Math.random() * 20) + 5}min`,
        conversas_iniciadas: Math.floor(Math.random() * 50) + 40,
        agendamentos_whatsapp: Math.floor(Math.random() * 15) + 10,
        satisfaction_score: (Math.random() * 1 + 4).toFixed(1)
      },
      
      // RD Station data
      rd_station: {
        leads_qualificados: Math.floor(Math.random() * 20) + 15,
        score_medio: Math.floor(Math.random() * 30) + 60,
        taxa_nutricao: `${(Math.random() * 20 + 60).toFixed(0)}%`,
        emails_enviados: Math.floor(Math.random() * 150) + 150,
        emails_abertos: Math.floor(Math.random() * 100) + 100,
        emails_clicados: Math.floor(Math.random() * 40) + 30
      }
    };

    return mockData;
  }

  /**
   * Gera insights usando GPT-4
   * MODIFICADO: Prompt otimizado e timeout reduzido
   * @param {Object} data - Dados consolidados
   * @returns {Object} Insights estruturados
   */
  async generateInsights(data) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          {
            role: "user",
            content: JSON.stringify(data, null, 2)
          }
        ],
        max_tokens: 1500,          // ✅ Reduzido para resposta mais rápida
        temperature: 0.3,          // ✅ Menos criatividade, mais objetividade
        timeout: 30000             // ✅ 30 segundos timeout
      });

      const content = response.choices[0].message.content;
      
      try {
        const insights = JSON.parse(content);
        
        // Validar estrutura básica
        if (!insights.insights || !insights.action_items) {
          throw new Error('Invalid insights structure');
        }
        
        return insights;
        
      } catch (parseError) {
        logger.error('GPT-4 response parsing error:', parseError);
        logger.error('GPT-4 raw response:', content);
        throw new Error('Invalid JSON response from GPT-4');
      }
      
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw error;
    }
  }

  /**
   * Sistema de prompt OTIMIZADO para resposta mais rápida
   * @returns {string} Prompt otimizado
   */
  getSystemPrompt() {
    return `
Você é um especialista em growth marketing médico da SevenScale.

Analise os dados de clínica médica e gere insights OBJETIVOS e ACIONÁVEIS.

RESPOSTA OBRIGATÓRIA EM JSON VÁLIDO:
{
  "insights": [
    "Insight específico com métrica concreta",
    "Comparação com benchmark médico",
    "Oportunidade identificada"
  ],
  "action_items": [
    "Ação específica implementável",
    "Priorizada por impacto"
  ],
  "roi_analysis": {
    "total_investment": "R$ valor",
    "total_revenue": "R$ valor", 
    "roi_percent": "número%",
    "comparison": "vs média médico"
  },
  "alerts": [
    "Alerta crítico se necessário"
  ],
  "score": número de 1-100
}

BENCHMARKS MÉDICOS:
- Conversão site: 2-5%
- No-show: 10-15%
- ROI Google Ads: 300-500%
- Ocupação agenda: 75-85%

Seja DIRETO, OBJETIVO e use MÉTRICAS CONCRETAS.
`;
  }

  /**
   * Utilitários para dados mock
   */
  getClientName(clientId) {
    const names = {
      '1': 'Dr. Silva - Cardiologia',
      '2': 'Clínica Derma Plus'
    };
    return names[clientId] || `Cliente ${clientId}`;
  }

  getClientSpecialty(clientId) {
    const specialties = {
      '1': 'Cardiologia',
      '2': 'Dermatologia'
    };
    return specialties[clientId] || 'Medicina Geral';
  }

  /**
   * NOVO: Processa apenas os 2 clientes teste, um por vez
   * @returns {Array} Resultados de processamentos
   */
  async processAllClients() {
    try {
      logger.info(`🚀 Iniciando processamento de ${RATE_LIMIT_CONFIG.MAX_CLIENTS_TOTAL} clientes teste`);
      
      const results = [];
      
      // ✅ Processar apenas clientes autorizados, um por vez
      for (const clientId of RATE_LIMIT_CONFIG.TEST_CLIENT_IDS) {
        try {
          logger.info(`🎯 Processando cliente ${clientId}...`);
          
          // ✅ Verificar se já não ultrapassou limite
          if (results.length >= RATE_LIMIT_CONFIG.MAX_CLIENTS_TOTAL) {
            logger.info(`⏹️ Limite de ${RATE_LIMIT_CONFIG.MAX_CLIENTS_TOTAL} clientes atingido`);
            break;
          }
          
          const insights = await this.processClientData(clientId);
          
          results.push({
            clientId,
            clientName: this.getClientName(clientId),
            success: true,
            insights,
            processedAt: new Date().toISOString()
          });
          
          logger.info(`✅ Cliente ${clientId} processado com sucesso`);
          
          // ✅ Rate limiting: aguardar antes do próximo
          if (results.length < RATE_LIMIT_CONFIG.MAX_CLIENTS_TOTAL) {
            logger.info(`⏰ Aguardando ${RATE_LIMIT_CONFIG.PROCESSING_DELAY}ms antes do próximo cliente...`);
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_CONFIG.PROCESSING_DELAY));
          }
          
        } catch (error) {
          logger.error(`❌ Falha ao processar cliente ${clientId}: ${error.message}`);
          results.push({
            clientId,
            clientName: this.getClientName(clientId),
            success: false,
            error: error.message,
            processedAt: new Date().toISOString()
          });
        }
      }
      
      const summary = {
        processed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        total: results.length
      };
      
      logger.info(`📊 Processamento concluído: ${summary.processed} sucessos, ${summary.failed} falhas de ${summary.total} total`);
      
      return results;
      
    } catch (error) {
      logger.error('❌ Erro no processamento geral:', error);
      throw error;
    }
  }

  /**
   * NOVO: Método para processar cliente único (usado pelo frontend)
   * @param {string} clientId - ID do cliente
   * @returns {Object} Resultado do processamento
   */
  async processSingleClient(clientId) {
    try {
      // ✅ Verificar se é cliente autorizado
      if (!RATE_LIMIT_CONFIG.TEST_CLIENT_IDS.includes(clientId)) {
        throw new Error(`Cliente ${clientId} não autorizado para processamento`);
      }

      logger.info(`🎯 Processamento único iniciado para cliente: ${clientId}`);
      
      const insights = await this.processClientData(clientId);
      
      return {
        success: true,
        clientId,
        clientName: this.getClientName(clientId),
        insights,
        processedAt: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error(`❌ Erro no processamento único cliente ${clientId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * NOVO: Obter configurações atuais
   * @returns {Object} Configurações do agente
   */
  getConfig() {
    return {
      ...RATE_LIMIT_CONFIG,
      status: 'active',
      version: '1.1.0-optimized',
      lastUpdate: new Date().toISOString()
    };
  }
}

export default AgentConsolidator;