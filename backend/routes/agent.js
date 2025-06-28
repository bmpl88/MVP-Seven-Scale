/**
 * SevenScale Agent Routes - MVP
 * MODIFICADO: Endpoints otimizados para processamento 1 cliente por vez
 * Configurado para máximo 2 clientes teste
 */

import express from 'express';
import { AgentConsolidator } from '../services/agentConsolidator.js';
import { dbService } from '../lib/database.js';
import logger from '../lib/logger.js';

const router = express.Router();
const agent = new AgentConsolidator();

/**
 * @route POST /api/v1/agent/process/:clientId
 * @desc Processar dados cliente e gerar insights (OTIMIZADO)
 * @access Private
 */
router.post('/process/:clientId', async (req, res) => {
  // ✅ Timeout personalizado para este endpoint
  req.setTimeout(60000); // 60 segundos

  try {
    const { clientId } = req.params;
    
    logger.info(`🤖 Starting optimized agent processing for client: ${clientId}`);
    
    // ✅ Usar método otimizado para cliente único
    const result = await agent.processSingleClient(clientId);
    
    res.json({
      success: true,
      clientId,
      insights: result.insights,
      processedAt: result.processedAt,
      message: 'Insights generated successfully (optimized)',
      config: agent.getConfig()
    });
    
  } catch (error) {
    logger.error(`Agent process error for client ${req.params.clientId}: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      clientId: req.params.clientId,
      suggestion: error.message.includes('não autorizado') ? 
        'Use apenas clientes 1 ou 2 no modo teste' : 
        'Tente novamente em alguns segundos'
    });
  }
});

/**
 * @route GET /api/v1/agent/insights/:clientId
 * @desc Obter últimos insights do cliente
 * @access Private
 */
router.get('/insights/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const insights = await dbService.getLatestInsights(clientId);
    
    if (!insights) {
      return res.status(404).json({
        success: false,
        message: 'No insights found for this client',
        clientId
      });
    }
    
    res.json({
      success: true,
      clientId,
      insights: insights.insights_data,
      processedAt: insights.processed_at,
      agentType: insights.agent_type,
      status: insights.status
    });
    
  } catch (error) {
    logger.error(`Get insights error for client ${req.params.clientId}: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      clientId: req.params.clientId
    });
  }
});

/**
 * @route POST /api/v1/agent/process-all
 * @desc OTIMIZADO: Processar apenas 2 clientes teste, um por vez
 * @access Private
 */
router.post('/process-all', async (req, res) => {
  // ✅ Timeout estendido para processamento sequencial
  req.setTimeout(180000); // 3 minutos total

  try {
    logger.info('🚀 Starting OPTIMIZED batch processing (max 2 clients, sequential)');
    
    const results = await agent.processAllClients();
    
    const summary = {
      success: true,
      totalClients: results.length,
      processed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      processedAt: new Date().toISOString(),
      config: agent.getConfig(),
      mode: 'optimized-sequential'
    };
    
    res.json({
      ...summary,
      results
    });
    
  } catch (error) {
    logger.error(`Process all error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: 'Sistema em modo teste - apenas 2 clientes por execução'
    });
  }
});

/**
 * @route GET /api/v1/agent/status
 * @desc Status do agente consolidador OTIMIZADO
 * @access Private
 */
router.get('/status', async (req, res) => {
  try {
    // Verificar últimos processamentos
    const recentInsights = await dbService.executeQuery('agent_insights', 'select', {
      order: { column: 'processed_at', desc: true },
      limit: 10
    });
    
    const today = new Date().toISOString().split('T')[0];
    const todayInsights = recentInsights.filter(insight => 
      insight.processed_at.startsWith(today)
    );
    
    // ✅ Status otimizado
    const config = agent.getConfig();
    const status = {
      agent_status: 'active-optimized',
      mode: 'sequential-processing',
      last_processing: recentInsights[0]?.processed_at || null,
      insights_today: todayInsights.length,
      total_insights: recentInsights.length,
      openai_configured: !!process.env.OPENAI_API_KEY,
      supabase_connected: true,
      // ✅ Configurações otimizadas
      max_concurrent_clients: config.MAX_CONCURRENT_CLIENTS,
      max_clients_total: config.MAX_CLIENTS_TOTAL,
      processing_delay: config.PROCESSING_DELAY,
      authorized_clients: config.TEST_CLIENT_IDS,
      version: config.version
    };
    
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Agent status error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/v1/agent/insights
 * @desc Listar todos os insights recentes
 * @access Private
 */
router.get('/insights', async (req, res) => {
  try {
    const { limit = 20, clientId } = req.query;
    
    const options = {
      order: { column: 'processed_at', desc: true },
      limit: parseInt(limit)
    };
    
    // ✅ Filtrar por cliente se especificado
    if (clientId) {
      options.filters = [{ column: 'client_id', value: clientId }];
      logger.info(`Filtrando insights para cliente: ${clientId}`);
    }
    
    const insights = await dbService.executeQuery('agent_insights', 'select', options);
    
    // ✅ Log detalhado para debugging
    logger.info(`Insights encontrados: ${insights.length} (limite: ${limit}, cliente: ${clientId || 'todos'})`);
    
    res.json({
      success: true,
      insights,
      count: insights.length,
      clientId: clientId || null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`List insights error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/v1/agent/insights/:insightId
 * @desc Deletar insight específico
 * @access Private
 */
router.delete('/insights/:insightId', async (req, res) => {
  try {
    const { insightId } = req.params;
    
    const result = await dbService.executeQuery('agent_insights', 'delete', {
      id: insightId
    });
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Insight deleted successfully',
      deletedAt: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Delete insight error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/v1/agent/test
 * @desc Teste rápido do agente OTIMIZADO (sem salvar no DB)
 * @access Private
 */
router.post('/test', async (req, res) => {
  // ✅ Timeout reduzido para teste
  req.setTimeout(45000); // 45 segundos

  try {
    const { clientId = '1' } = req.body;
    
    // ✅ Verificar se é cliente autorizado
    const config = agent.getConfig();
    if (!config.TEST_CLIENT_IDS.includes(clientId)) {
      return res.status(400).json({
        success: false,
        error: `Cliente ${clientId} não autorizado para teste`,
        authorizedClients: config.TEST_CLIENT_IDS
      });
    }
    
    const consolidatedData = await agent.collectClientData(clientId);
    const insights = await agent.generateInsights(consolidatedData);
    
    res.json({
      success: true,
      message: 'Test completed successfully (optimized)',
      clientId,
      consolidatedData,
      insights,
      config: config,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Agent test error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/v1/agent/seed-data
 * @desc Criar dados simulados do agente para demonstrações
 * @access Private
 */
router.post('/seed-data', async (req, res) => {
  try {
    logger.info('🌱 Iniciando seed de dados do agente OTIMIZADO...');
    
    // Importar e executar o seed
    const { seedAgentData } = await import('../scripts/seed-agent-data.js');
    await seedAgentData();
    
    res.json({
      success: true,
      message: 'Agent data seeded successfully (optimized)',
      config: agent.getConfig(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Seed data error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * NOVO: @route GET /api/v1/agent/config
 * @desc Obter configurações atuais do agente
 * @access Private
 */
router.get('/config', async (req, res) => {
  try {
    const config = agent.getConfig();
    
    res.json({
      success: true,
      config,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Get config error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * NOVO: @route POST /api/v1/agent/process-single
 * @desc Endpoint específico para processamento de cliente único otimizado
 * @access Private
 */
router.post('/process-single', async (req, res) => {
  req.setTimeout(60000); // 60 segundos

  try {
    const { clientId } = req.body;
    
    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'clientId é obrigatório',
        example: { clientId: "1" }
      });
    }
    
    logger.info(`🎯 Processing single client via dedicated endpoint: ${clientId}`);
    
    const result = await agent.processSingleClient(clientId);
    
    res.json({
      success: true,
      ...result,
      message: 'Single client processed successfully',
      endpoint: 'process-single'
    });
    
  } catch (error) {
    logger.error(`Process single error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: 'Use apenas clientId "1" ou "2" no modo teste'
    });
  }
});

export default router;