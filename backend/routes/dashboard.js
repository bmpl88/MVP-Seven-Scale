import express from 'express';
import { dbService } from '../lib/database.js';
import logger from '../lib/logger.js';

const router = express.Router();

/**
 * @route GET /api/v1/dashboard/overview
 * @desc Get dashboard overview
 * @access Private
 */
router.get('/overview', async (req, res) => {
  try {
    // Calculate dashboard overview manually
    // Fetch basic data
    const clients = await dbService.executeQuery('clients', 'select');
    const agents = await dbService.executeQuery('ai_agents', 'select');
    const integrations = await dbService.executeQuery('integrations', 'select');
    
    // Calculate metrics
    const totalClients = clients.length;
    const operationalClients = clients.filter(c => c.status === 'operational').length;
    const attentionClients = clients.filter(c => c.status === 'attention').length;
    const criticalClients = clients.filter(c => c.status === 'critical').length;
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
    
    // Calculate total revenue
    let totalRevenue = 0;
    for (const client of clients) {
      if (client.revenue) {
        const revenueStr = client.revenue.replace('R$ ', '').replace('k', '000').replace('.', '');
        try {
          totalRevenue += parseFloat(revenueStr);
        } catch (e) {
          // Skip invalid revenue
        }
      }
    }
    
    // Calculate average performance
    const avgClientPerformance = clients.length > 0 
      ? clients.reduce((sum, c) => sum + (c.performance || 0), 0) / clients.length 
      : 0;
    
    const avgAgentPerformance = agents.length > 0
      ? agents.reduce((sum, a) => sum + (a.performance || 0), 0) / agents.length
      : 0;
    
    res.json({
      total_clients: totalClients,
      operational_clients: operationalClients,
      attention_clients: attentionClients,
      critical_clients: criticalClients,
      active_agents: activeAgents,
      total_agents: agents.length,
      connected_integrations: connectedIntegrations,
      total_integrations: integrations.length,
      total_revenue: totalRevenue,
      avg_client_performance: avgClientPerformance,
      avg_agent_performance: avgAgentPerformance,
      system_uptime: 99.2,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error fetching dashboard overview: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/dashboard/metrics
 * @desc Get dashboard metrics
 * @access Private
 */
router.get('/metrics', async (req, res) => {
  try {
    // Fetch data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const clients = await dbService.executeQuery('clients', 'select');
    const agents = await dbService.executeQuery('ai_agents', 'select');
    
    // Performance metrics
    const performanceData = clients.map(client => ({
      client_id: client.id,
      client_name: client.name,
      specialty: client.specialty,
      performance: client.performance,
      patients: client.patients,
      status: client.status
    }));
    
    // Agent metrics
    const agentsData = agents.map(agent => ({
      agent_id: agent.id,
      agent_name: agent.name,
      agent_type: agent.agent_type,
      performance: agent.performance,
      status: agent.status,
      executions_today: agent.executions_today
    }));
    
    res.json({
      clients_performance: performanceData,
      agents_performance: agentsData,
      period: '30d',
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error fetching dashboard metrics: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/dashboard/alerts
 * @desc Get system alerts
 * @access Private
 */
router.get('/alerts', async (req, res) => {
  try {
    // Fetch recent warning logs
    const warningLogs = await dbService.executeQuery(
      'system_logs',
      'select',
      {
        filters: [{ column: 'log_type', value: 'warning' }],
        order: { column: 'created_at', desc: true },
        limit: 10
      }
    );
    
    // Fetch critical logs
    const criticalLogs = await dbService.executeQuery(
      'system_logs',
      'select',
      {
        filters: [{ column: 'log_type', value: 'critical' }],
        order: { column: 'created_at', desc: true },
        limit: 5
      }
    );
    
    // Combine and sort by date
    const allAlerts = [...warningLogs, ...criticalLogs];
    allAlerts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Return only the 15 most recent
    res.json(allAlerts.slice(0, 15));
  } catch (error) {
    logger.error(`Error fetching alerts: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/dashboard/health
 * @desc Get system health
 * @access Private
 */
router.get('/health', async (req, res) => {
  try {
    // Check component status
    const clients = await dbService.executeQuery('clients', 'select');
    const agents = await dbService.executeQuery('ai_agents', 'select');
    const integrations = await dbService.executeQuery('integrations', 'select');
    
    // Calculate component health
    const clientsHealth = clients.length > 0
      ? (clients.filter(c => c.status === 'operational').length / clients.length) * 100
      : 100;
      
    const agentsHealth = agents.length > 0
      ? (agents.filter(a => a.status === 'active').length / agents.length) * 100
      : 100;
      
    const integrationsHealth = integrations.length > 0
      ? (integrations.filter(i => i.status === 'connected').length / integrations.length) * 100
      : 100;
    
    const overallHealth = (clientsHealth + agentsHealth + integrationsHealth) / 3;
    
    res.json({
      overall_health: Math.round(overallHealth * 10) / 10,
      components: {
        clients: {
          health: Math.round(clientsHealth * 10) / 10,
          status: clientsHealth > 80 ? 'healthy' : clientsHealth > 60 ? 'warning' : 'critical'
        },
        agents: {
          health: Math.round(agentsHealth * 10) / 10,
          status: agentsHealth > 80 ? 'healthy' : agentsHealth > 60 ? 'warning' : 'critical'
        },
        integrations: {
          health: Math.round(integrationsHealth * 10) / 10,
          status: integrationsHealth > 80 ? 'healthy' : integrationsHealth > 60 ? 'warning' : 'critical'
        },
        database: {
          health: 100.0,
          status: 'healthy'
        }
      },
      last_check: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error checking system health: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/dashboard/recent-activity
 * @desc Get recent system activity
 * @access Private
 */
router.get('/recent-activity', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const logs = await dbService.executeQuery(
      'system_logs',
      'select',
      {
        order: { column: 'created_at', desc: true },
        limit: parseInt(limit)
      }
    );
    
    res.json(logs);
  } catch (error) {
    logger.error(`Error fetching recent activity: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;