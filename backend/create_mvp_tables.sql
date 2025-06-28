-- SevenScale MVP Database Schema
-- Execute este script no Supabase SQL Editor para criar as tabelas necessárias

-- 1. Tabela de clientes (principal)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_clinica VARCHAR(255) NOT NULL,
  especialidade VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  email_contato VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  website VARCHAR(255),
  status VARCHAR(20) DEFAULT 'operational' CHECK (status IN ('operational', 'attention', 'critical')),
  revenue VARCHAR(50), -- "R$ 89.5k" format
  patients INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de insights do agente (essencial para MVP)
CREATE TABLE IF NOT EXISTS agent_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) DEFAULT 'mvp-consolidator',
  insights_data JSONB NOT NULL, -- Insights estruturados do GPT-4
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de integrações por cliente (opcional por enquanto)
CREATE TABLE IF NOT EXISTS client_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL, -- 'hubspot', 'analytics', 'meta_ads', etc.
  status VARCHAR(20) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  credentials JSONB, -- API keys (será criptografado depois)
  last_sync TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(client_id, integration_type)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_especialidade ON clients(especialidade);
CREATE INDEX IF NOT EXISTS idx_agent_insights_client ON agent_insights(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_insights_processed ON agent_insights(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_insights_status ON agent_insights(status);
CREATE INDEX IF NOT EXISTS idx_integrations_client ON client_integrations(client_id);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON client_integrations(status);

-- Inserir dados de exemplo para testar
INSERT INTO clients (nome_clinica, especialidade, cidade, email_contato, telefone, website, status, revenue, patients) VALUES
('Dr. Silva - Cardiologia', 'Cardiologia', 'São Paulo, SP', 'contato@cardiosilva.com.br', '(11) 99999-9999', 'cardiosilva.com.br', 'operational', 'R$ 89.5k', 150),
('Clínica Derma Plus', 'Dermatologia', 'Rio de Janeiro, RJ', 'contato@dermaplus.com.br', '(21) 88888-8888', 'dermaplus.com.br', 'operational', 'R$ 52.4k', 89),
('OdontoVita Centro', 'Odontologia', 'Belo Horizonte, MG', 'contato@odontovita.com.br', '(31) 77777-7777', 'odontovita.com.br', 'attention', 'R$ 65.8k', 203)
ON CONFLICT (email_contato) DO NOTHING;

-- Inserir integrações de exemplo
INSERT INTO client_integrations (client_id, integration_type, status, last_sync) VALUES
((SELECT id FROM clients WHERE email_contato = 'contato@cardiosilva.com.br'), 'hubspot', 'connected', NOW()),
((SELECT id FROM clients WHERE email_contato = 'contato@cardiosilva.com.br'), 'google_analytics', 'connected', NOW()),
((SELECT id FROM clients WHERE email_contato = 'contato@cardiosilva.com.br'), 'meta_ads', 'error', NOW() - INTERVAL '2 hours'),
((SELECT id FROM clients WHERE email_contato = 'contato@cardiosilva.com.br'), 'google_calendar', 'connected', NOW()),
((SELECT id FROM clients WHERE email_contato = 'contato@cardiosilva.com.br'), 'whatsapp', 'connected', NOW())
ON CONFLICT (client_id, integration_type) DO NOTHING;

-- Verificar se as tabelas foram criadas corretamente
SELECT 'clients' as table_name, count(*) as records FROM clients
UNION ALL
SELECT 'agent_insights' as table_name, count(*) as records FROM agent_insights
UNION ALL  
SELECT 'client_integrations' as table_name, count(*) as records FROM client_integrations;