/*
  # Schema para Dashboard SevenScale

  1. Novas Tabelas
    - `dashboard_metrics` - Métricas consolidadas para dashboard
    - `client_performance_history` - Histórico de performance dos clientes
    - `agent_executions` - Registro de execuções dos agentes IA
    - `integration_syncs` - Histórico de sincronizações das integrações
    - `user_preferences` - Preferências de usuário para dashboard

  2. Views
    - `vw_client_performance` - Visão consolidada de performance dos clientes
    - `vw_agent_analytics` - Análise de performance dos agentes IA
    - `vw_integration_health` - Saúde das integrações
    - `vw_revenue_analytics` - Análise de receita por especialidade
    - `vw_dashboard_overview` - Visão geral para dashboard principal
*/

-- Tabela de métricas consolidadas para dashboard
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    metric_date DATE DEFAULT CURRENT_DATE,
    roi NUMERIC,
    patients_total INTEGER,
    patients_new INTEGER,
    patients_recurring INTEGER,
    revenue NUMERIC,
    appointments_total INTEGER,
    appointments_completed INTEGER,
    appointments_no_show INTEGER,
    leads_total INTEGER,
    leads_qualified INTEGER,
    conversion_rate NUMERIC,
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de performance dos clientes
CREATE TABLE IF NOT EXISTS client_performance_history (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    record_date DATE DEFAULT CURRENT_DATE,
    performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
    revenue NUMERIC,
    patients INTEGER,
    roi NUMERIC,
    growth_rate NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de execuções dos agentes IA
CREATE TABLE IF NOT EXISTS agent_executions (
    id BIGSERIAL PRIMARY KEY,
    agent_id BIGINT REFERENCES ai_agents(id) ON DELETE CASCADE,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    execution_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_ms INTEGER,
    status TEXT CHECK (status IN ('success', 'error', 'timeout')),
    tokens_used INTEGER,
    insights_generated INTEGER,
    execution_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sincronizações das integrações
CREATE TABLE IF NOT EXISTS integration_syncs (
    id BIGSERIAL PRIMARY KEY,
    integration_id BIGINT REFERENCES integrations(id) ON DELETE CASCADE,
    sync_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_ms INTEGER,
    status TEXT CHECK (status IN ('success', 'partial', 'error')),
    records_processed INTEGER,
    records_created INTEGER,
    records_updated INTEGER,
    records_failed INTEGER,
    error_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de preferências de usuário para dashboard
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light',
    dashboard_layout JSONB DEFAULT '{}',
    favorite_metrics TEXT[],
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- View de performance dos clientes
CREATE OR REPLACE VIEW vw_client_performance AS
SELECT 
    c.id,
    c.name,
    c.specialty,
    c.status,
    c.performance,
    c.revenue,
    c.patients,
    c.plan,
    COALESCE(
        (SELECT metric_value FROM client_metrics 
         WHERE client_id = c.id AND metric_type = 'roi' 
         ORDER BY metric_date DESC LIMIT 1),
        0
    ) AS roi,
    COALESCE(
        (SELECT COUNT(*) FROM integrations 
         WHERE client_id = c.id AND status = 'connected'),
        0
    ) AS connected_integrations,
    COALESCE(
        (SELECT COUNT(*) FROM integrations 
         WHERE client_id = c.id),
        0
    ) AS total_integrations,
    c.created_at,
    c.updated_at
FROM 
    clients c;

-- View de analytics dos agentes
CREATE OR REPLACE VIEW vw_agent_analytics AS
SELECT 
    a.id,
    a.name,
    a.agent_type,
    a.status,
    a.performance,
    a.executions_today,
    a.success_rate,
    COALESCE(
        (SELECT COUNT(*) FROM agent_executions 
         WHERE agent_id = a.id AND execution_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS executions_24h,
    COALESCE(
        (SELECT AVG(duration_ms) FROM agent_executions 
         WHERE agent_id = a.id AND execution_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS avg_duration_ms,
    COALESCE(
        (SELECT COUNT(*) FROM agent_executions 
         WHERE agent_id = a.id AND status = 'success' AND execution_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS successful_executions_24h,
    a.last_execution,
    a.created_at,
    a.updated_at
FROM 
    ai_agents a;

-- View de saúde das integrações
CREATE OR REPLACE VIEW vw_integration_health AS
SELECT 
    i.id,
    i.client_id,
    c.name AS client_name,
    i.integration_type,
    i.status,
    i.last_sync,
    COALESCE(
        (SELECT COUNT(*) FROM integration_syncs 
         WHERE integration_id = i.id AND sync_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS syncs_24h,
    COALESCE(
        (SELECT AVG(duration_ms) FROM integration_syncs 
         WHERE integration_id = i.id AND sync_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS avg_sync_duration_ms,
    COALESCE(
        (SELECT SUM(records_processed) FROM integration_syncs 
         WHERE integration_id = i.id AND sync_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS records_processed_24h,
    COALESCE(
        (SELECT COUNT(*) FROM integration_syncs 
         WHERE integration_id = i.id AND status = 'success' AND sync_date > NOW() - INTERVAL '24 hours'),
        0
    ) AS successful_syncs_24h,
    i.created_at,
    i.updated_at
FROM 
    integrations i
JOIN 
    clients c ON i.client_id = c.id;

-- View de análise de receita por especialidade
CREATE OR REPLACE VIEW vw_revenue_analytics AS
SELECT 
    specialty,
    COUNT(*) AS client_count,
    SUM(
        CASE 
            WHEN revenue LIKE 'R$ %k' THEN 
                CAST(REPLACE(REPLACE(revenue, 'R$ ', ''), 'k', '') AS NUMERIC) * 1000
            ELSE 0
        END
    ) AS total_revenue,
    AVG(
        COALESCE(
            (SELECT metric_value FROM client_metrics 
             WHERE client_id = c.id AND metric_type = 'roi' 
             ORDER BY metric_date DESC LIMIT 1),
            0
        )
    ) AS avg_roi,
    SUM(patients) AS total_patients,
    AVG(performance) AS avg_performance
FROM 
    clients c
GROUP BY 
    specialty
ORDER BY 
    total_revenue DESC;

-- View de visão geral para dashboard principal
CREATE OR REPLACE VIEW vw_dashboard_overview AS
SELECT 
    (SELECT COUNT(*) FROM clients) AS total_clients,
    (SELECT COUNT(*) FROM clients WHERE status = 'operational') AS operational_clients,
    (SELECT COUNT(*) FROM clients WHERE status = 'attention') AS attention_clients,
    (SELECT COUNT(*) FROM clients WHERE status = 'critical') AS critical_clients,
    (SELECT COUNT(*) FROM ai_agents WHERE status = 'active') AS active_agents,
    (SELECT COUNT(*) FROM ai_agents) AS total_agents,
    (SELECT COUNT(*) FROM integrations WHERE status = 'connected') AS connected_integrations,
    (SELECT COUNT(*) FROM integrations) AS total_integrations,
    (SELECT SUM(
        CASE 
            WHEN revenue LIKE 'R$ %k' THEN 
                CAST(REPLACE(REPLACE(revenue, 'R$ ', ''), 'k', '') AS NUMERIC) * 1000
            ELSE 0
        END
    ) FROM clients) AS total_revenue,
    (SELECT AVG(performance) FROM clients) AS avg_client_performance,
    (SELECT AVG(performance) FROM ai_agents) AS avg_agent_performance,
    (SELECT COUNT(*) FROM system_logs WHERE created_at > NOW() - INTERVAL '24 hours') AS logs_24h,
    NOW() AS generated_at;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_client_id ON dashboard_metrics(client_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_date ON dashboard_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_client_performance_history_client_id ON client_performance_history(client_id);
CREATE INDEX IF NOT EXISTS idx_client_performance_history_date ON client_performance_history(record_date);
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_client_id ON agent_executions(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_date ON agent_executions(execution_date);
CREATE INDEX IF NOT EXISTS idx_integration_syncs_integration_id ON integration_syncs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_syncs_date ON integration_syncs(sync_date);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Trigger para user_preferences
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_syncs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow all for authenticated users" ON dashboard_metrics
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON client_performance_history
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON agent_executions
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON integration_syncs
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow users to manage their own preferences" ON user_preferences
    FOR ALL TO authenticated USING (auth.uid() = user_id);