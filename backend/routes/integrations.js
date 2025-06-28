import express from 'express';
import { dbService } from '../lib/database.js';
import { validateIntegration } from '../types/models.js';
import logger from '../lib/logger.js';

const router = express.Router();

/**
 * @route GET /api/v1/integrations
 * @desc Get all integrations
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const integrations = await dbService.executeQuery(
      'integrations',
      'select',
      { order: { column: 'created_at', desc: true } }
    );
    
    res.json(integrations);
  } catch (error) {
    logger.error(`Error fetching integrations: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/integrations/status
 * @desc Get integration status summary
 * @access Private
 */
router.get('/status', async (req, res) => {
  try {
    const integrations = await dbService.executeQuery(
      'integrations',
      'select'
    );
    
    const statusSummary = {
      total: integrations.length,
      connected: integrations.filter(i => i.status === 'connected').length,
      warning: integrations.filter(i => i.status === 'warning').length,
      disconnected: integrations.filter(i => i.status === 'disconnected').length,
      last_sync: integrations.reduce((latest, i) => {
        if (!i.last_sync) return latest;
        return !latest || new Date(i.last_sync) > new Date(latest) ? i.last_sync : latest;
      }, null)
    };
    
    res.json(statusSummary);
  } catch (error) {
    logger.error(`Error fetching integration status: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route GET /api/v1/integrations/:id
 * @desc Get integration by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const integrations = await dbService.executeQuery(
      'integrations',
      'select',
      { filters: [{ column: 'id', value: parseInt(id) }] }
    );
    
    if (!integrations || integrations.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    res.json(integrations[0]);
  } catch (error) {
    logger.error(`Error fetching integration ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route POST /api/v1/integrations
 * @desc Create a new integration
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const integrationData = req.body;
    
    // Validate integration data
    const validation = validateIntegration(integrationData);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    // Add last_sync if not provided
    if (!integrationData.last_sync) {
      integrationData.last_sync = new Date().toISOString();
    }
    
    const result = await dbService.executeQuery(
      'integrations',
      'insert',
      { data: integrationData }
    );
    
    res.status(201).json(result[0]);
  } catch (error) {
    logger.error(`Error creating integration: ${error.message}`);
    res.status(500).json({ error: 'Error creating integration' });
  }
});

/**
 * @route PUT /api/v1/integrations/:id
 * @desc Update an integration
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const integrationData = req.body;
    
    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(integrationData).filter(([_, v]) => v !== undefined)
    );
    
    const result = await dbService.executeQuery(
      'integrations',
      'update',
      {
        id: parseInt(id),
        data: filteredData
      }
    );
    
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    logger.error(`Error updating integration ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error updating integration' });
  }
});

/**
 * @route DELETE /api/v1/integrations/:id
 * @desc Delete an integration
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await dbService.executeQuery(
      'integrations',
      'delete',
      { id: parseInt(id) }
    );
    
    res.json({ message: 'Integration deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting integration ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error deleting integration' });
  }
});

/**
 * @route POST /api/v1/integrations/:id/test
 * @desc Test an integration
 * @access Private
 */
router.post('/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    const testData = req.body;
    
    // Simulate integration test
    // In a real implementation, this would test the actual integration
    
    // Get integration
    const integrations = await dbService.executeQuery(
      'integrations',
      'select',
      { filters: [{ column: 'id', value: parseInt(id) }] }
    );
    
    if (!integrations || integrations.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    const integration = integrations[0];
    
    // Simulate test results
    const testResults = {
      integration_id: parseInt(id),
      integration_type: integration.integration_type,
      test_timestamp: new Date().toISOString(),
      results: [
        { test: 'Authentication', status: 'success', message: 'Valid credentials' },
        { test: 'Connectivity', status: 'success', message: 'Connection established' },
        { test: 'Permissions', status: 'success', message: 'Adequate permissions' },
        { test: 'Rate Limits', status: 'success', message: 'Within limits' }
      ],
      overall_status: 'success'
    };
    
    // Log test
    await dbService.executeQuery(
      'system_logs',
      'insert',
      {
        data: {
          log_type: 'integration_test',
          message: `Integration ${id} test executed`,
          details: testResults
        }
      }
    );
    
    res.json(testResults);
  } catch (error) {
    logger.error(`Error testing integration ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error testing integration' });
  }
});

/**
 * @route POST /api/v1/integrations/:id/sync
 * @desc Sync an integration
 * @access Private
 */
router.post('/:id/sync', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simulate sync
    const syncResult = {
      integration_id: parseInt(id),
      sync_timestamp: new Date().toISOString(),
      records_processed: 156,
      status: 'success',
      duration_ms: 1250
    };
    
    // Update last sync
    await dbService.executeQuery(
      'integrations',
      'update',
      {
        id: parseInt(id),
        data: { last_sync: new Date().toISOString() }
      }
    );
    
    // Log sync
    await dbService.executeQuery(
      'system_logs',
      'insert',
      {
        data: {
          log_type: 'integration_sync',
          message: `Integration ${id} sync completed`,
          details: syncResult
        }
      }
    );
    
    res.json(syncResult);
  } catch (error) {
    logger.error(`Error syncing integration ${req.params.id}: ${error.message}`);
    res.status(500).json({ error: 'Error syncing integration' });
  }
});

/**
 * @route GET /api/v1/integrations/client/:clientId
 * @desc Get integrations for a specific client
 * @access Private
 */
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const integrations = await dbService.executeQuery(
      'integrations',
      'select',
      { filters: [{ column: 'client_id', value: parseInt(clientId) }] }
    );
    
    res.json(integrations);
  } catch (error) {
    logger.error(`Error fetching integrations for client ${req.params.clientId}: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;