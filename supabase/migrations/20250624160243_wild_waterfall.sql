/*
  # Schema Inicial SevenScale

  1. Tabelas Principais
    - `clients` - Clientes médicos da SevenScale
    - `client_metrics` - Métricas de performance dos clientes
    - `ai_agents` - Configuração dos 7 agentes IA
    - `integrations` - Status das integrações por cliente
    - `system_logs` - Logs do sistema

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas em autenticação
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de clientes médicos
CREATE TABLE IF NOT EXISTS clients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    city TEXT,
    status TEXT DEFAULT 'operational' CHECK (status IN ('operational', 'attention', 'critical')),
    performance INTEGER DEFAULT 0 CHECK (performance >= 0 AND performance <= 100),
    revenue TEXT,
    patients INTEGER DEFAULT 0,
    plan TEXT DEFAULT 'pro' CHECK (plan IN ('basic', 'pro', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de métricas dos clientes
CREATE TABLE IF NOT EXISTS client_metrics (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela dos 7 agentes IA
CREATE TABLE IF NOT EXISTS ai_agents (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    agent_type TEXT NOT NULL CHECK (agent_type IN ('diagnosticador', 'arquiteto', 'prototipador', 'implementador', 'lapidador', 'sistematizador', 'monitor')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    performance INTEGER DEFAULT 0 CHECK (performance >= 0 AND performance <= 100),
    last_execution TIMESTAMP WITH TIME ZONE,
    executions_today INTEGER DEFAULT 0,
    success_rate NUMERIC DEFAULT 0.0,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de integrações por cliente
CREATE TABLE IF NOT EXISTS integrations (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL,
    status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'warning', 'disconnected')),
    last_sync TIMESTAMP WITH TIME ZONE,
    config JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs do sistema
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    log_type TEXT NOT NULL,
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
    agent_id BIGINT REFERENCES ai_agents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_specialty ON clients(specialty);
CREATE INDEX IF NOT EXISTS idx_client_metrics_client_id ON client_metrics(client_id);
CREATE INDEX IF NOT EXISTS idx_client_metrics_date ON client_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_integrations_client_id ON integrations(client_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir tudo para usuários autenticados por enquanto)
CREATE POLICY "Allow all for authenticated users" ON clients
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON client_metrics
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON ai_agents
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON integrations
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all for authenticated users" ON system_logs
    FOR ALL TO authenticated USING (true);