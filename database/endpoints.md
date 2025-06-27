# 🚀 SevenScale Health Dashboard - API Endpoints

## 🤖 AGENT ENDPOINTS (/api/v1/agent/)

### Processing
- **POST** `/api/v1/agent/process/:clientId` - Processar cliente específico
- **POST** `/api/v1/agent/process-all` - Processar todos os clientes  
- **POST** `/api/v1/agent/test` - Teste do agente (sem salvar)
- **POST** `/api/v1/agent/seed-data` - Criar dados simulados

### Insights
- **GET** `/api/v1/agent/insights/:clientId` - Obter insights de um cliente
- **GET** `/api/v1/agent/insights` - Listar todos os insights recentes
- **DELETE** `/api/v1/agent/insights/:insightId` - Deletar insight

### Status
- **GET** `/api/v1/agent/status` - Status do agente consolidador

---

## 📊 DASHBOARD ENDPOINTS (/api/v1/dashboard/)

### Overview
- **GET** `/api/v1/dashboard/overview` - Visão geral do dashboard
- **GET** `/api/v1/dashboard/metrics` - Métricas do dashboard
- **GET** `/api/v1/dashboard/health` - Saúde do sistema

### Activity
- **GET** `/api/v1/dashboard/alerts` - Alertas do sistema
- **GET** `/api/v1/dashboard/recent-activity` - Atividade recente

---

## 📈 ANALYTICS ENDPOINTS (/api/v1/analytics/)

### Performance
- **GET** `/api/v1/analytics/dashboard` - Dados de analytics
- **GET** `/api/v1/analytics/clients/performance` - Performance dos clientes
- **GET** `/api/v1/analytics/agents/performance` - Performance dos agentes

### Business Intelligence
- **GET** `/api/v1/analytics/specialties/roi` - ROI por especialidade
- **GET** `/api/v1/analytics/revenue/evolution` - Evolução de receita
- **GET** `/api/v1/analytics/funnel` - Dados do funil

### Integrations
- **GET** `/api/v1/analytics/integrations/metrics` - Métricas das integrações

### Export
- **GET** `/api/v1/analytics/export` - Exportar dados

---

## 👥 CLIENTS ENDPOINTS (/api/v1/clients/)

### CRUD Operations
- **GET** `/api/v1/clients` - Listar clientes
- **GET** `/api/v1/clients/:id` - Cliente específico
- **POST** `/api/v1/clients` - Criar cliente
- **PUT** `/api/v1/clients/:id` - Atualizar cliente
- **DELETE** `/api/v1/clients/:id` - Deletar cliente

### Analytics
- **GET** `/api/v1/clients/summary` - Resumo dos clientes
- **GET** `/api/v1/clients/:id/metrics` - Métricas do cliente

---

## 🔗 INTEGRATIONS ENDPOINTS (/api/v1/integrations/)

### Setup
- **GET** `/api/v1/integrations/:clientId` - Listar integrações do cliente
- **POST** `/api/v1/integrations/:clientId/:type` - Conectar integração
- **PUT** `/api/v1/integrations/:clientId/:type` - Atualizar configuração
- **DELETE** `/api/v1/integrations/:clientId/:type` - Desconectar integração

### Data Collection
- **POST** `/api/v1/integrations/sync/:clientId/:type` - Sincronizar dados específicos
- **POST** `/api/v1/integrations/sync-all/:clientId` - Sincronizar todas integrações

### Health Check
- **GET** `/api/v1/integrations/health` - Status geral das integrações
- **GET** `/api/v1/integrations/health/:clientId` - Status por cliente

---

## 📋 AUTHENTICATION & AUTHORIZATION

### Required Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Error Responses
- **400** - Bad Request
- **401** - Unauthorized 
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

### Success Responses
- **200** - OK
- **201** - Created
- **204** - No Content

---

## 🛡️ RATE LIMITING

- **General APIs**: 100 requests/minute
- **AI Processing**: 10 requests/minute  
- **Data Export**: 5 requests/minute

---

## 🚀 NEXT IMPLEMENTATION STEPS

1. **Authentication** - JWT + Supabase Auth
2. **Rate Limiting** - Express middleware
3. **Input Validation** - Joi/Zod schemas
4. **Error Handling** - Centralized error middleware
5. **Logging** - Winston + structured logs
6. **Monitoring** - Health checks + metrics

---

**Updated**: June 27, 2025 - MVP Tier 1 Ready
**Author**: Bruno Monteiro - SevenScale