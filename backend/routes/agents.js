import express from 'express';
import { dbService } from '../lib/database.js';
import { validateAgent } from '../types/models.js';
import logger from '../lib/logger.js';
import { mvpAgent } from '../lib/mvp-agent.js';

const router = express.Router();

/**
 * @route GET /api/v1/agents
 * @desc Get all agents
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const agents = await dbService.executeQuery(
      'ai_agents',
      'select',
      { order: { column: 'id', desc: false } }
    );
    
    res.json(agents);
  } catch (error) {
    logger.error(`Error fetching agents: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/agents/performance
 * @desc Get agent performance metrics
 * @access Private
 */
router.get('/performance', async (req, res) => {
  try {
    const agents = await dbService.executeQuery(
      'ai_agents',
      'select'
    );
    
    const performanceData = agents.map(agent => ({
      agent_id: agent.id,
      agent_name: agent.name,
      agent_type: agent.agent_type,
      performance: agent.performance,
      executions_today: agent.executions_today,
      success_rate: agent.success_rate,
      status: agent.status
    }));
    
    res.json(performanceData);
  } catch (error) {
    logger.error(`Error fetching agent performance: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/agents/:id
 * @desc Get agent by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const agents = await dbService.executeQuery(
      'ai_agents',
      'select',
      { filters: [{ column: 'id', value: parseInt(id) }] }
    );
    
    if (!agents || agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agents[0]);
  } catch (error) {
    logger.error(`Error fetching agent ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route PUT /api/v1/agents/:id
 * @desc Update an agent
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agentData = req.body;
    
    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(agentData).filter(([_, v]) => v !== undefined)
    );
    
    const result = await dbService.executeQuery(
      'ai_agents',
      'update',
      {
        id: parseInt(id),
        data: filteredData
      }
    );
    
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    logger.error(`Error updating agent ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error updating agent' });
  }
});

/**
 * @route POST /api/v1/agents/:id/execute
 * @desc Execute an agent
 * @access Private
 */
router.post('/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const executionData = req.body;
    
    // Simulate agent execution
    // In a real implementation, this would integrate with the AI system
    
    // Update last execution
    await dbService.executeQuery(
      'ai_agents',
      'update',
      {
        id: parseInt(id),
        data: {
          last_execution: new Date().toISOString(),
          executions_today: (executionData.executions_today || 0) + 1
        }
      }
    );
    
    // Log execution
    await dbService.executeQuery(
      'system_logs',
      'insert',
      {
        data: {
          log_type: 'agent_execution',
          message: `Agent ${id} executed successfully`,
          details: executionData,
          agent_id: parseInt(id)
        }
      }
    );
    
    res.json({
      message: 'Agent executed successfully',
      execution_id: `exec_${id}_${Date.now()}`,
      status: 'completed'
    });
  } catch (error) {
    logger.error(`Error executing agent ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error executing agent' });
  }
});

/**
 * @route POST /api/v1/agents/:id/toggle
 * @desc Toggle agent status (active/paused)
 * @access Private
 */
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current agent
    const agents = await dbService.executeQuery(
      'ai_agents',
      'select',
      { filters: [{ column: 'id', value: parseInt(id) }] }
    );
    
    if (!agents || agents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    const currentAgent = agents[0];
    const newStatus = currentAgent.status === 'active' ? 'paused' : 'active';
    
    // Update status
    await dbService.executeQuery(
      'ai_agents',
      'update',
      {
        id: parseInt(id),
        data: { status: newStatus }
      }
    );
    
    res.json({
      message: `Agent ${newStatus}`,
      agent_id: parseInt(id),
      new_status: newStatus
    });
  } catch (error) {
    logger.error(`Error toggling agent ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error toggling agent' });
  }
});

/**
 * @route GET /api/v1/agents/:id/logs
 * @desc Get agent logs
 * @access Private
 */
router.get('/:id/logs', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;
    
    const logs = await dbService.executeQuery(
      'system_logs',
      'select',
      {
        filters: [{ column: 'agent_id', value: parseInt(id) }],
        order: { column: 'created_at', desc: true },
        limit: parseInt(limit)
      }
    );
    
    res.json(logs);
  } catch (error) {
    logger.error(`Error fetching logs for agent ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route POST /api/v1/agents/run-daily-analysis
 * @desc Run daily analysis for all clients
 * @access Private
 */
router.post('/run-daily-analysis', async (req, res) => {
  try {
    const result = await mvpAgent.runDailyAnalysis();
    res.json(result);
  } catch (error) {
    logger.error(`Error in daily analysis: ${error.message}`);
    res.status(500).json({ error: 'Error in daily analysis' });
  }
});

/**
 * @route POST /api/v1/agents/process-client/:clientId
 * @desc Process a specific client
 * @access Private
 */
router.post('/process-client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const result = await mvpAgent.processClient(parseInt(clientId));
    res.json(result);
  } catch (error) {
    logger.error(`Error processing client ${req.params.clientId}: ${error.message}`);
    res.status(500).json({ error: 'Error processing client' });
  }
});

export default router;