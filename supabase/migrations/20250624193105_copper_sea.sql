-- Create user_preferences table
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

-- Create index for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create trigger for user_preferences (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_preferences_updated_at'
    ) THEN
        CREATE TRIGGER update_user_preferences_updated_at 
        BEFORE UPDATE ON user_preferences
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for user_preferences (drop if exists to avoid duplicates)
DROP POLICY IF EXISTS "Allow users to manage their own preferences" ON user_preferences;
CREATE POLICY "Allow users to manage their own preferences" ON user_preferences
    FOR ALL TO authenticated
    USING (auth.uid() = user_id);

-- Create view for client performance
DROP VIEW IF EXISTS vw_client_performance;
CREATE VIEW vw_client_performance AS
SELECT 
    c.id,
    c.name,
    c.specialty,
    c.status,
    c.performance,
    c.revenue,
    c.patients,
    c.plan,
    COALESCE((SELECT metric_value FROM client_metrics WHERE client_id = c.id AND metric_type = 'roi' ORDER BY metric_date DESC LIMIT 1), 0) as roi,
    COUNT(CASE WHEN i.status = 'connected' THEN 1 END) as connected_integrations,
    COUNT(i.id) as total_integrations,
    c.created_at,
    c.updated_at
FROM 
    clients c
LEFT JOIN 
    integrations i ON c.id = i.client_id
LEFT JOIN 
    client_metrics cm ON c.id = cm.client_id
GROUP BY 
    c.id;

-- Create view for agent analytics
DROP VIEW IF EXISTS vw_agent_analytics;
CREATE VIEW vw_agent_analytics AS
SELECT 
    a.id,
    a.name,
    a.agent_type,
    a.status,
    a.performance,
    a.executions_today,
    a.success_rate,
    COUNT(ae.id) FILTER (WHERE ae.execution_date >= NOW() - INTERVAL '24 hours') as executions_24h,
    COALESCE(AVG(ae.duration_ms) FILTER (WHERE ae.execution_date >= NOW() - INTERVAL '24 hours'), 0) as avg_duration_ms,
    COUNT(ae.id) FILTER (WHERE ae.execution_date >= NOW() - INTERVAL '24 hours' AND ae.status = 'success') as successful_executions_24h,
    a.last_execution,
    a.created_at,
    a.updated_at
FROM 
    ai_agents a
LEFT JOIN 
    agent_executions ae ON a.id = ae.agent_id
GROUP BY 
    a.id;

-- Create view for integration health
DROP VIEW IF EXISTS vw_integration_health;
CREATE VIEW vw_integration_health AS
SELECT 
    i.id,
    i.client_id,
    c.name as client_name,
    i.integration_type,
    i.status,
    i.last_sync,
    COUNT(sync.id) FILTER (WHERE sync.sync_date >= NOW() - INTERVAL '24 hours') as syncs_24h,
    COALESCE(AVG(sync.duration_ms) FILTER (WHERE sync.sync_date >= NOW() - INTERVAL '24 hours'), 0) as avg_sync_duration_ms,
    COALESCE(SUM(sync.records_processed) FILTER (WHERE sync.sync_date >= NOW() - INTERVAL '24 hours'), 0) as records_processed_24h,
    COUNT(sync.id) FILTER (WHERE sync.sync_date >= NOW() - INTERVAL '24 hours' AND sync.status = 'success') as successful_syncs_24h,
    i.created_at,
    i.updated_at
FROM 
    integrations i
LEFT JOIN 
    clients c ON i.client_id = c.id
LEFT JOIN 
    integration_syncs sync ON i.id = sync.integration_id
GROUP BY 
    i.id, c.name;

-- Create view for revenue analytics
DROP VIEW IF EXISTS vw_revenue_analytics;
CREATE VIEW vw_revenue_analytics AS
SELECT 
    c.specialty,
    COUNT(c.id) as client_count,
    COALESCE(SUM(CAST(REGEXP_REPLACE(c.revenue, '[^0-9]', '', 'g') AS NUMERIC)), 0) as total_revenue,
    COALESCE(AVG(cm.metric_value), 0) as avg_roi,
    COALESCE(SUM(c.patients), 0) as total_patients,
    COALESCE(AVG(c.performance), 0) as avg_performance
FROM 
    clients c
LEFT JOIN 
    client_metrics cm ON c.id = cm.client_id AND cm.metric_type = 'roi'
GROUP BY 
    c.specialty;

-- Create view for dashboard overview - Fixed to avoid aggregate functions in GROUP BY
DROP VIEW IF EXISTS vw_dashboard_overview;
CREATE VIEW vw_dashboard_overview AS
WITH client_stats AS (
    SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE status = 'operational') as operational_clients,
        COUNT(*) FILTER (WHERE status = 'attention') as attention_clients,
        COUNT(*) FILTER (WHERE status = 'critical') as critical_clients,
        COALESCE(AVG(performance), 0) as avg_client_performance,
        COALESCE(SUM(CAST(REGEXP_REPLACE(revenue, '[^0-9]', '', 'g') AS NUMERIC)), 0) as total_revenue
    FROM 
        clients
),
agent_stats AS (
    SELECT 
        COUNT(*) as total_agents,
        COUNT(*) FILTER (WHERE status = 'active') as active_agents,
        COALESCE(AVG(performance), 0) as avg_agent_performance
    FROM 
        ai_agents
),
integration_stats AS (
    SELECT 
        COUNT(*) as total_integrations,
        COUNT(*) FILTER (WHERE status = 'connected') as connected_integrations
    FROM 
        integrations
),
log_stats AS (
    SELECT 
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as logs_24h
    FROM 
        system_logs
)
SELECT 
    client_stats.total_clients,
    client_stats.operational_clients,
    client_stats.attention_clients,
    client_stats.critical_clients,
    agent_stats.active_agents,
    agent_stats.total_agents,
    integration_stats.connected_integrations,
    integration_stats.total_integrations,
    client_stats.total_revenue,
    client_stats.avg_client_performance,
    agent_stats.avg_agent_performance,
    log_stats.logs_24h,
    NOW() as generated_at
FROM 
    client_stats, agent_stats, integration_stats, log_stats;

-- Create tables for agent executions and integration syncs if they don't exist
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

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_client_id ON agent_executions(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_date ON agent_executions(execution_date);

CREATE INDEX IF NOT EXISTS idx_integration_syncs_integration_id ON integration_syncs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_syncs_date ON integration_syncs(sync_date);

-- Enable RLS on new tables
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_syncs ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables (drop if exists to avoid duplicates)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON agent_executions;
CREATE POLICY "Allow all for authenticated users" ON agent_executions
    FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON integration_syncs;
CREATE POLICY "Allow all for authenticated users" ON integration_syncs
    FOR ALL TO authenticated USING (true);

-- Insert some sample data for agent executions and integration syncs
-- Only insert if tables are empty to avoid duplicates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM agent_executions LIMIT 1) THEN
        INSERT INTO agent_executions (agent_id, client_id, duration_ms, status, tokens_used, insights_generated, execution_details)
        VALUES
        (1, 1, 1250, 'success', 2345, 3, '{"insights": ["Horário 14h-16h tem 35% mais agendamentos", "WhatsApp automatizado reduziu faltas em 23%"]}'),
        (2, 1, 1800, 'success', 3120, 2, '{"insights": ["Fluxo de agendamento otimizado", "Novo pipeline de follow-up"]}'),
        (3, 2, 950, 'success', 1890, 4, '{"insights": ["Campanha cardiologia com ROI potencial +67%", "Landing page otimizada +15% conversão"]}'),
        (4, 2, 2100, 'success', 4200, 1, '{"insights": ["Automação de follow-up implementada"]}'),
        (5, 3, 1450, 'success', 2780, 2, '{"insights": ["Previsão de demanda para próximos 3 meses", "Segmentação de pacientes otimizada"]}'),
        (6, 3, 1650, 'success', 3250, 3, '{"insights": ["Protocolo de atendimento padronizado", "Checklist operacional criado"]}'),
        (7, 1, 750, 'success', 1450, 5, '{"insights": ["Alerta: queda na taxa de conversão", "Oportunidade: ampliar horário 16-18h"]}');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM integration_syncs LIMIT 1) THEN
        INSERT INTO integration_syncs (integration_id, duration_ms, status, records_processed, records_created, records_updated, records_failed)
        VALUES
        (1, 850, 'success', 156, 23, 133, 0),
        (2, 1200, 'success', 89, 12, 77, 0),
        (3, 650, 'success', 47, 8, 39, 0),
        (4, 450, 'success', 234, 45, 189, 0),
        (5, 950, 'success', 124, 18, 106, 0),
        (6, 1100, 'success', 95, 15, 80, 0),
        (7, 1250, 'partial', 456, 389, 45, 22),
        (8, 1800, 'error', 0, 0, 0, 0);
    END IF;
END
$$;