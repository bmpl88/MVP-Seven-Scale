import express from 'express';
import { dbService } from '../lib/database.js';
import logger from '../lib/logger.js';

const router = express.Router();

/**
 * @route GET /api/v1/analytics/dashboard
 * @desc Get analytics dashboard data
 * @access Private
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Fetch client data
    const clients = await dbService.executeQuery(
      'clients',
      'select'
    );
    
    // Fetch client metrics
    const metrics = await dbService.executeQuery(
      'client_metrics',
      'select',
      { order: { column: 'metric_date', desc: true } }
    );
    
    // Fetch agents
    const agents = await dbService.executeQuery(
      'ai_agents',
      'select'
    );
    
    // Fetch integrations
    const integrations = await dbService.executeQuery(
      'integrations',
      'select'
    );
    
    // Calculate specialties ROI
    const specialtiesRoi = calculateSpecialtiesRoi(clients, metrics);
    
    // Calculate funnel data
    const funnelData = calculateFunnelData(metrics);
    
    // Calculate revenue evolution
    const revenueEvolution = calculateRevenueEvolution(clients, metrics);
    
    res.json({
      clients_performance: clients,
      specialties_roi: specialtiesRoi,
      funnel_data: funnelData,
      agents_analytics: agents,
      integrations_metrics: integrations,
      revenue_evolution: revenueEvolution,
      period,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error fetching analytics dashboard: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/clients/performance
 * @desc Get client performance data
 * @access Private
 */
router.get('/clients/performance', async (req, res) => {
  try {
    const clients = await dbService.executeQuery(
      'clients',
      'select'
    );
    
    const performanceData = clients.map(client => {
      // Calculate numeric revenue
      let revenueNum = 0;
      if (client.revenue) {
        const revenueStr = client.revenue.replace('R$ ', '').replace('k', '000').replace('.', '');
        try {
          revenueNum = parseFloat(revenueStr);
        } catch (e) {
          revenueNum = 0;
        }
      }
      
      return {
        name: client.name,
        performance: client.performance,
        revenue: revenueNum,
        patients: client.patients,
        specialty: client.specialty,
        status: client.status
      };
    });
    
    res.json(performanceData);
  } catch (error) {
    logger.error(`Error fetching client performance: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/specialties/roi
 * @desc Get ROI by specialty
 * @access Private
 */
router.get('/specialties/roi', async (req, res) => {
  try {
    const clients = await dbService.executeQuery(
      'clients',
      'select'
    );
    
    const metrics = await dbService.executeQuery(
      'client_metrics',
      'select',
      { filters: [{ column: 'metric_type', value: 'roi' }] }
    );
    
    const specialtiesRoi = calculateSpecialtiesRoi(clients, metrics);
    
    res.json(specialtiesRoi);
  } catch (error) {
    logger.error(`Error fetching specialties ROI: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/funnel
 * @desc Get conversion funnel data
 * @access Private
 */
router.get('/funnel', async (req, res) => {
  try {
    const metrics = await dbService.executeQuery(
      'client_metrics',
      'select'
    );
    
    const funnelData = calculateFunnelData(metrics);
    
    res.json(funnelData);
  } catch (error) {
    logger.error(`Error fetching funnel data: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/agents/performance
 * @desc Get agent analytics
 * @access Private
 */
router.get('/agents/performance', async (req, res) => {
  try {
    const agents = await dbService.executeQuery(
      'ai_agents',
      'select'
    );
    
    res.json(agents);
  } catch (error) {
    logger.error(`Error fetching agent analytics: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/integrations/metrics
 * @desc Get integration metrics
 * @access Private
 */
router.get('/integrations/metrics', async (req, res) => {
  try {
    const integrations = await dbService.executeQuery(
      'integrations',
      'select'
    );
    
    // Group by integration type
    const metricsByType = {};
    for (const integration of integrations) {
      const intType = integration.integration_type;
      if (!metricsByType[intType]) {
        metricsByType[intType] = {
          type: intType,
          total: 0,
          connected: 0,
          warning: 0,
          disconnected: 0
        };
      }
      
      metricsByType[intType].total += 1;
      metricsByType[intType][integration.status] += 1;
    }
    
    res.json(Object.values(metricsByType));
  } catch (error) {
    logger.error(`Error fetching integration metrics: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/revenue/evolution
 * @desc Get revenue evolution
 * @access Private
 */
router.get('/revenue/evolution', async (req, res) => {
  try {
    const clients = await dbService.executeQuery(
      'clients',
      'select'
    );
    
    const metrics = await dbService.executeQuery(
      'client_metrics',
      'select',
      {
        filters: [{ column: 'metric_type', value: 'revenue' }],
        order: { column: 'metric_date', desc: false }
      }
    );
    
    const revenueEvolution = calculateRevenueEvolution(clients, metrics);
    
    res.json(revenueEvolution);
  } catch (error) {
    logger.error(`Error fetching revenue evolution: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/analytics/export
 * @desc Export analytics data
 * @access Private
 */
router.get('/export', async (req, res) => {
  try {
    // Fetch all necessary data
    const clients = await dbService.executeQuery('clients', 'select');
    const agents = await dbService.executeQuery('ai_agents', 'select');
    const integrations = await dbService.executeQuery('integrations', 'select');
    const metrics = await dbService.executeQuery('client_metrics', 'select');
    
    const exportData = {
      export_date: new Date().toISOString(),
      summary: {
        total_clients: clients.length,
        total_agents: agents.length,
        total_integrations: integrations.length,
        total_metrics: metrics.length
      },
      clients,
      agents,
      integrations,
      metrics
    };
    
    res.json(exportData);
  } catch (error) {
    logger.error(`Error exporting analytics: ${error.message}`);
    res.status(500).json({ error: 'Error exporting data' });
  }
});

// Helper functions

/**
 * Calculate ROI by specialty
 * @param {Array} clients - Client data
 * @param {Array} metrics - Metrics data
 * @returns {Array} - ROI by specialty
 */
function calculateSpecialtiesRoi(clients, metrics) {
  const specialties = {};
  
  for (const client of clients) {
    const specialty = client.specialty;
    if (!specialties[specialty]) {
      specialties[specialty] = {
        especialidade: specialty,
        clientes: 0,
        roi_total: 0,
        receita_total: 0
      };
    }
    
    specialties[specialty].clientes += 1;
    
    // Find client ROI in metrics
    const clientRoi = metrics.find(m => 
      m.client_id === client.id && m.metric_type === 'roi'
    )?.metric_value || 0;
    
    specialties[specialty].roi_total += clientRoi;
    
    // Calculate revenue
    if (client.revenue) {
      const revenueStr = client.revenue.replace('R$ ', '').replace('k', '000').replace('.', '');
      try {
        const revenue = parseFloat(revenueStr);
        specialties[specialty].receita_total += revenue;
      } catch (e) {
        // Skip invalid revenue
      }
    }
  }
  
  // Calculate average ROI
  const result = [];
  for (const specialtyData of Object.values(specialties)) {
    if (specialtyData.clientes > 0) {
      const roiMedio = specialtyData.roi_total / specialtyData.clientes;
      result.push({
        especialidade: specialtyData.especialidade,
        roi: Math.round(roiMedio),
        clientes: specialtyData.clientes,
        receita: `R$ ${Math.round(specialtyData.receita_total / 1000)}k`
      });
    }
  }
  
  return result.sort((a, b) => b.roi - a.roi);
}

/**
 * Calculate funnel data
 * @param {Array} metrics - Metrics data
 * @returns {Array} - Funnel data
 */
function calculateFunnelData(metrics) {
  // Simulated data based on metrics
  return [
    { name: 'Leads Totais', value: 12456, percentage: 100 },
    { name: 'Leads Qualificados', value: 4789, percentage: 38.4 },
    { name: 'Agendamentos', value: 2345, percentage: 18.8 },
    { name: 'Consultas Realizadas', value: 1987, percentage: 15.9 },
    { name: 'Pacientes Recorrentes', value: 1234, percentage: 9.9 }
  ];
}

/**
 * Calculate revenue evolution
 * @param {Array} clients - Client data
 * @param {Array} metrics - Metrics data
 * @returns {Array} - Revenue evolution
 */
function calculateRevenueEvolution(clients, metrics) {
  // Simulated data for demonstration
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const evolution = [];
  
  const baseRevenue = 2100000; // R$ 2.1M
  for (let i = 0; i < months.length; i++) {
    const growth = 1 + (i * 0.15); // 15% growth per month
    evolution.push({
      month: months[i],
      cardio: Math.round(baseRevenue * 0.25 * growth),
      derma: Math.round(baseRevenue * 0.23 * growth),
      ortho: Math.round(baseRevenue * 0.21 * growth),
      outros: Math.round(baseRevenue * 0.31 * growth)
    });
  }
  
  return evolution;
}

export default router;