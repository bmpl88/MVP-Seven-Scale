import express from 'express';
import { dbService } from '../lib/database.js';
import { validateClient } from '../types/models.js';
import logger from '../lib/logger.js';

const router = express.Router();

/**
 * @route GET /api/v1/clients
 * @desc Get all clients with optional filters
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const { status, specialty, limit = 50 } = req.query;
    
    const filters = [];
    if (status) {
      filters.push({ column: 'status', value: status });
    }
    if (specialty) {
      filters.push({ column: 'specialty', value: specialty });
    }
    
    const clients = await dbService.executeQuery(
      'clients',
      'select',
      {
        filters,
        order: { column: 'created_at', desc: true },
        limit: parseInt(limit)
      }
    );
    
    res.json(clients);
  } catch (error) {
    logger.error(`Error fetching clients: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/clients/summary
 * @desc Get client summary statistics
 * @access Private
 */
router.get('/summary', async (req, res) => {
  try {
    const clients = await dbService.executeQuery(
      'clients',
      'select'
    );
    
    const totalClients = clients.length;
    const operational = clients.filter(c => c.status === 'operational').length;
    const attention = clients.filter(c => c.status === 'attention').length;
    const critical = clients.filter(c => c.status === 'critical').length;
    
    // Calculate total revenue (simplified)
    const totalRevenue = clients.reduce((sum, client) => {
      if (client.revenue) {
        const revenueStr = client.revenue.replace('R$ ', '').replace('k', '000').replace('.', '');
        try {
          return sum + parseFloat(revenueStr);
        } catch (e) {
          return sum;
        }
      }
      return sum;
    }, 0);
    
    const totalPatients = clients.reduce((sum, client) => sum + (client.patients || 0), 0);
    
    res.json({
      total_clients: totalClients,
      operational,
      attention,
      critical,
      total_revenue: totalRevenue,
      total_patients: totalPatients
    });
  } catch (error) {
    logger.error(`Error fetching client summary: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/clients/:id
 * @desc Get client by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const clients = await dbService.executeQuery(
      'clients',
      'select',
      { filters: [{ column: 'id', value: parseInt(id) }] }
    );
    
    if (!clients || clients.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(clients[0]);
  } catch (error) {
    logger.error(`Error fetching client ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route POST /api/v1/clients
 * @desc Create a new client
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const clientData = req.body;
    
    // Validate client data
    const validation = validateClient(clientData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const result = await dbService.executeQuery(
      'clients',
      'insert',
      { data: clientData }
    );
    
    res.status(201).json(result[0]);
  } catch (error) {
    logger.error(`Error creating client: ${error.message}`);
    res.status(500).json({ error: 'Error creating client' });
  }
});

/**
 * @route PUT /api/v1/clients/:id
 * @desc Update a client
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const clientData = req.body;
    
    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(clientData).filter(([_, v]) => v !== undefined)
    );
    
    const result = await dbService.executeQuery(
      'clients',
      'update',
      {
        id: parseInt(id),
        data: filteredData
      }
    );
    
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    logger.error(`Error updating client ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error updating client' });
  }
});

/**
 * @route DELETE /api/v1/clients/:id
 * @desc Delete a client
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await dbService.executeQuery(
      'clients',
      'delete',
      { id: parseInt(id) }
    );
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting client ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error deleting client' });
  }
});

/**
 * @route GET /api/v1/clients/:id/metrics
 * @desc Get client metrics
 * @access Private
 */
router.get('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    
    const metrics = await dbService.executeQuery(
      'client_metrics',
      'select',
      {
        filters: [{ column: 'client_id', value: parseInt(id) }],
        order: { column: 'metric_date', desc: true }
      }
    );
    
    res.json(metrics);
  } catch (error) {
    logger.error(`Error fetching metrics for client ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;