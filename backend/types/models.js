/**
 * SevenScale Data Models and Validation - MVP Version
 * Combines existing structure with MVP-specific enhancements
 */

/**
 * Client status enum
 * @enum {string}
 */
export const ClientStatus = {
  OPERATIONAL: 'operational',
  ATTENTION: 'attention',
  CRITICAL: 'critical'
};

/**
 * Client plan enum (future use)
 * @enum {string}
 */
export const ClientPlan = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

/**
 * Agent type enum - MVP includes consolidated agent
 * @enum {string}
 */
export const AgentType = {
  MVP_CONSOLIDATOR: 'mvp-consolidator',
  DIAGNOSTICADOR: 'diagnosticador',
  ARQUITETO: 'arquiteto',
  PROTOTIPADOR: 'prototipador',
  IMPLEMENTADOR: 'implementador',
  LAPIDADOR: 'lapidador',
  SISTEMATIZADOR: 'sistematizador',
  MONITOR: 'monitor'
};

/**
 * Agent status enum
 * @enum {string}
 */
export const AgentStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ERROR: 'error'
};

/**
 * Integration status enum
 * @enum {string}
 */
export const IntegrationStatus = {
  CONNECTED: 'connected',
  WARNING: 'warning',
  DISCONNECTED: 'disconnected'
};

/**
 * Medical specialties for Brazilian market
 * @enum {string}
 */
export const MedicalSpecialties = {
  CARDIOLOGIA: 'cardiologia',
  DERMATOLOGIA: 'dermatologia',
  OFTALMOLOGIA: 'oftalmologia',
  PEDIATRIA: 'pediatria',
  GINECOLOGIA: 'ginecologia',
  ORTOPEDIA: 'ortopedia',
  NEUROLOGIA: 'neurologia',
  PSIQUIATRIA: 'psiquiatria',
  ENDOCRINOLOGIA: 'endocrinologia',
  GASTROENTEROLOGIA: 'gastroenterologia'
};

/**
 * Core integrations for MVP
 * @enum {string}
 */
export const CoreIntegrations = {
  HUBSPOT: 'hubspot',
  GOOGLE_ANALYTICS: 'google_analytics',
  META_ADS: 'meta_ads',
  GOOGLE_CALENDAR: 'google_calendar',
  WHATSAPP: 'whatsapp',
  RD_STATION: 'rd_station'
};

/**
 * Validate client data - Enhanced for medical practices
 * @param {Object} client - Client data to validate
 * @returns {Object} - Validation result with errors if any
 */
export function validateClient(client) {
  const errors = {};
  
  // Required fields
  if (!client.name || client.name.trim().length === 0) {
    errors.name = 'Nome da clínica é obrigatório';
  }
  
  if (!client.specialty || !Object.values(MedicalSpecialties).includes(client.specialty)) {
    errors.specialty = `Especialidade deve ser uma das: ${Object.values(MedicalSpecialties).join(', ')}`;
  }
  
  if (!client.email || !isValidEmail(client.email)) {
    errors.email = 'Email válido é obrigatório';
  }
  
  // Optional validations
  if (client.phone && !isValidBrazilianPhone(client.phone)) {
    errors.phone = 'Telefone deve ter formato brasileiro válido';
  }
  
  if (client.performance !== undefined && (client.performance < 0 || client.performance > 100)) {
    errors.performance = 'Performance deve estar entre 0 e 100';
  }
  
  if (client.status && !Object.values(ClientStatus).includes(client.status)) {
    errors.status = `Status deve ser: ${Object.values(ClientStatus).join(', ')}`;
  }
  
  if (client.patients && (!Number.isInteger(client.patients) || client.patients < 0)) {
    errors.patients = 'Número de pacientes deve ser um inteiro positivo';
  }
  
  // MVP limit: maximum 10 clients
  if (client.id === undefined) { // New client
    // This would need to be checked against database count
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate agent data
 * @param {Object} agent - Agent data to validate
 * @returns {Object} - Validation result with errors if any
 */
export function validateAgent(agent) {
  const errors = {};
  
  if (!agent.name || agent.name.trim().length === 0) {
    errors.name = 'Nome do agente é obrigatório';
  }
  
  if (!agent.agent_type || !Object.values(AgentType).includes(agent.agent_type)) {
    errors.agent_type = `Tipo do agente deve ser: ${Object.values(AgentType).join(', ')}`;
  }
  
  if (agent.status && !Object.values(AgentStatus).includes(agent.status)) {
    errors.status = `Status deve ser: ${Object.values(AgentStatus).join(', ')}`;
  }
  
  if (agent.performance !== undefined && (agent.performance < 0 || agent.performance > 100)) {
    errors.performance = 'Performance deve estar entre 0 e 100';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate integration data - Enhanced for core integrations
 * @param {Object} integration - Integration data to validate
 * @returns {Object} - Validation result with errors if any
 */
export function validateIntegration(integration) {
  const errors = {};
  
  if (!integration.client_id || !Number.isInteger(integration.client_id)) {
    errors.client_id = 'ID do cliente é obrigatório';
  }
  
  if (!integration.integration_type || !Object.values(CoreIntegrations).includes(integration.integration_type)) {
    errors.integration_type = `Tipo de integração deve ser: ${Object.values(CoreIntegrations).join(', ')}`;
  }
  
  if (integration.status && !Object.values(IntegrationStatus).includes(integration.status)) {
    errors.status = `Status deve ser: ${Object.values(IntegrationStatus).join(', ')}`;
  }
  
  // Validate credentials if provided
  if (integration.credentials && typeof integration.credentials !== 'object') {
    errors.credentials = 'Credenciais devem ser um objeto';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate agent insights data
 * @param {Object} insights - Insights data to validate
 * @returns {Object} - Validation result
 */
export function validateAgentInsights(insights) {
  const errors = {};
  
  if (!insights.client_id || !Number.isInteger(insights.client_id)) {
    errors.client_id = 'ID do cliente é obrigatório';
  }
  
  if (!insights.agent_type || !Object.values(AgentType).includes(insights.agent_type)) {
    errors.agent_type = 'Tipo de agente inválido';
  }
  
  if (!insights.insights_data || typeof insights.insights_data !== 'object') {
    errors.insights_data = 'Dados dos insights são obrigatórios';
  }
  
  // Validate insights structure
  if (insights.insights_data) {
    const required = ['insights', 'action_items', 'roi_analysis'];
    for (const field of required) {
      if (!insights.insights_data[field]) {
        errors[field] = `Campo ${field} é obrigatório`;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate agent processing request
 * @param {Object} request - Processing request data
 * @returns {Object} - Validation result
 */
export function validateAgentRequest(request) {
  const errors = {};
  
  if (!request.client_id || !Number.isInteger(request.client_id)) {
    errors.client_id = 'ID do cliente é obrigatório';
  }
  
  if (request.agent_type && !Object.values(AgentType).includes(request.agent_type)) {
    errors.agent_type = 'Tipo de agente inválido';
  }
  
  if (request.force_refresh !== undefined && typeof request.force_refresh !== 'boolean') {
    errors.force_refresh = 'Force refresh deve ser um boolean';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate Brazilian phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean} - Whether the phone is valid
 */
function isValidBrazilianPhone(phone) {
  // Brazilian formats: (11) 99999-9999, 11999999999, +5511999999999
  const phoneRegex = /^(\+55)?(\(?\d{2}\)?)?[\s-]?(\d{4,5})[\s-]?(\d{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize client data
 * @param {Object} client - Raw client data
 * @returns {Object} - Sanitized client data
 */
export function sanitizeClient(client) {
  return {
    name: sanitizeString(client.name),
    email: sanitizeEmail(client.email),
    phone: sanitizePhone(client.phone),
    specialty: client.specialty,
    status: client.status || ClientStatus.OPERATIONAL,
    patients: parseInt(client.patients) || 0,
    performance: parseInt(client.performance) || 0,
    revenue: sanitizeString(client.revenue),
    created_at: client.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Sanitize integration data
 * @param {Object} integration - Raw integration data
 * @returns {Object} - Sanitized integration data
 */
export function sanitizeIntegration(integration) {
  return {
    client_id: parseInt(integration.client_id),
    integration_type: integration.integration_type,
    status: integration.status || IntegrationStatus.DISCONNECTED,
    credentials: integration.credentials || {},
    settings: integration.settings || {},
    last_sync: integration.last_sync || null,
    created_at: integration.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Helper sanitization functions
 */
function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().slice(0, 255);
}

function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/\D/g, ''); // Remove non-digits
}

/**
 * Response formatting functions
 */
export function formatSuccessResponse(data, message = 'Sucesso') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

export function formatErrorResponse(error, status = 500) {
  return {
    success: false,
    error: error.message || 'Erro interno do servidor',
    status,
    timestamp: new Date().toISOString()
  };
}

export function formatValidationErrorResponse(errors) {
  return {
    success: false,
    error: 'Falha na validação',
    errors,
    status: 400,
    timestamp: new Date().toISOString()
  };
}

/**
 * Export all for easy importing
 */
export default {
  // Enums
  ClientStatus,
  ClientPlan,
  AgentType,
  AgentStatus,
  IntegrationStatus,
  MedicalSpecialties,
  CoreIntegrations,
  
  // Validation functions
  validateClient,
  validateAgent,
  validateIntegration,
  validateAgentInsights,
  validateAgentRequest,
  
  // Sanitization functions
  sanitizeClient,
  sanitizeIntegration,
  
  // Response formatting
  formatSuccessResponse,
  formatErrorResponse,
  formatValidationErrorResponse,
  
  // Helper functions
  isValidEmail,
  isValidBrazilianPhone
};