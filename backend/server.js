import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';

// Environment variables loaded in database.js

import logger from './lib/logger.js';
import { initDb } from './lib/database.js';

// Import routes
import clientsRouter from './routes/clients.js';
import agentsRouter from './routes/agents.js';
import analyticsRouter from './routes/analytics.js';
import integrationsRouter from './routes/integrations.js';
import dashboardRouter from './routes/dashboard.js';
import authRouter from './routes/auth.js';
import agentRouter from './routes/agent.js'; // MVP Agent Consolidator

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or matches a pattern with wildcard
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === origin) return true;
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return false;
    });
    
    if (!isAllowed) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Initialize database
(async () => {
  try {
    await initDb();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize database: ${error.message}`);
    // Continue running the server even if DB init fails
  }
})();

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SevenScale Medical Dashboard API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      api: 'operational'
    }
  });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/agents', agentsRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/integrations', integrationsRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/agent', agentRouter); // MVP Agent Consolidator

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, HOST, () => {
  logger.info(`🚀 SevenScale Backend running on http://${HOST}:${PORT}`);
  logger.info(`📚 API documentation available at http://${HOST}:${PORT}/api-docs`);
});

export default app;