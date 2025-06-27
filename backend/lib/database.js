/**
 * SevenScale Database Service - Supabase Integration
 * Handles all database operations with Supabase PostgreSQL
 */

// Load environment variables first thing in database.js
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import logger from './logger.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Database service with CRUD operations
 */
export const dbService = {
  /**
   * Execute database queries
   * @param {string} table - Table name
   * @param {string} operation - Operation type (select, insert, update, delete)
   * @param {object} options - Query options
   */
  async executeQuery(table, operation, options = {}) {
    try {
      let query;
      
      switch (operation) {
        case 'select':
          query = supabase.from(table).select('*');
          
          // Apply filters
          if (options.filters) {
            options.filters.forEach(filter => {
              query = query.eq(filter.column, filter.value);
            });
          }
          
          // Apply ordering
          if (options.order) {
            query = query.order(options.order.column, { 
              ascending: !options.order.desc 
            });
          }
          
          // Apply limit
          if (options.limit) {
            query = query.limit(options.limit);
          }
          
          break;
          
        case 'insert':
          query = supabase.from(table).insert(options.data).select();
          break;
          
        case 'update':
          query = supabase.from(table)
            .update(options.data)
            .eq('id', options.id)
            .select();
          break;
          
        case 'delete':
          query = supabase.from(table).delete().eq('id', options.id);
          break;
          
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error(`Database error on ${operation} ${table}:`, error);
        throw error;
      }
      
      logger.info(`Database ${operation} on ${table}: ${data?.length || 0} records`);
      return data || [];
      
    } catch (error) {
      logger.error(`Database service error:`, error);
      throw error;
    }
  },

  /**
   * Get client summary statistics
   */
  async getClientSummary() {
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*');
        
      if (error) throw error;
      
      const summary = {
        total_clients: clients.length,
        operational: clients.filter(c => c.status === 'operational').length,
        attention: clients.filter(c => c.status === 'attention').length,
        critical: clients.filter(c => c.status === 'critical').length,
        total_revenue: this.calculateTotalRevenue(clients),
        total_patients: clients.reduce((sum, c) => sum + (c.patients || 0), 0)
      };
      
      return summary;
    } catch (error) {
      logger.error('Error getting client summary:', error);
      throw error;
    }
  },

  /**
   * Calculate total revenue from clients
   */
  calculateTotalRevenue(clients) {
    return clients.reduce((total, client) => {
      if (!client.revenue) return total;
      
      // Parse revenue string like "R$ 89.5k" to number
      const cleanRevenue = client.revenue
        .replace('R$ ', '')
        .replace('k', '000')
        .replace('.', '');
        
      const value = parseFloat(cleanRevenue) || 0;
      return total + value;
    }, 0);
  },

  /**
   * Save agent insights to database
   */
  async saveAgentInsights(clientId, insights, agentType = 'mvp-consolidator') {
    try {
      const { data, error } = await supabase
        .from('agent_insights')
        .insert({
          client_id: clientId,
          agent_type: agentType,
          insights_data: insights,
          processed_at: new Date().toISOString(),
          status: 'completed'
        })
        .select();
        
      if (error) throw error;
      
      logger.info(`Saved insights for client ${clientId}`);
      return data[0];
    } catch (error) {
      logger.error('Error saving agent insights:', error);
      throw error;
    }
  },

  /**
   * Get latest insights for client
   */
  async getLatestInsights(clientId) {
    try {
      const { data, error } = await supabase
        .from('agent_insights')
        .select('*')
        .eq('client_id', clientId)
        .order('processed_at', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      return data[0] || null;
    } catch (error) {
      logger.error('Error getting latest insights:', error);
      throw error;
    }
  },

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('count')
        .limit(1);
        
      if (error) throw error;
      
      logger.info('✅ Database connection successful');
      return true;
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      return false;
    }
  }
};

/**
 * Initialize database connection
 */
export async function initDb() {
  try {
    logger.info('🔄 Initializing database connection...');
    
    const isConnected = await dbService.testConnection();
    
    if (isConnected) {
      logger.info('✅ Supabase connection established');
    } else {
      logger.error('❌ Failed to establish Supabase connection');
    }
    
    return isConnected;
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  }
}

// Export the supabase client for auth routes
export { supabase };

export default dbService;