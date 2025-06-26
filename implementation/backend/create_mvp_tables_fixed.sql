-- SevenScale MVP Database Schema - VERSÃO CORRIGIDA
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

-- 2. Tabela de agentes IA (NOVA - necessária para o código)
CREATE TABLE IF NOT EXISTS ai_agents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  agent_type VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  performance INTEGER DEFAULT 0 CHECK (performance >= 0 AND performance <= 100),
  executions_today INTEGER DEFAULT 0,
  success_rate INTEGER DEFAULT 0 CHECK (success_rate >= 0 AND success_rate <= 100),
  last_execution TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de logs do sistema (NOVA - necessária para o código)
CREATE TABLE IF NOT EXISTS system_logs (
  id SERIAL PRIMARY KEY,
  log_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  agent_id INTEGER REFERENCES ai_agents(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir agente consolidador
INSERT INTO ai_agents (name, agent_type, description, status, performance, executions_today, success_rate, last_execution) VALUES
('SevenScale MVP Consolidator', 'consolidator', 'Agente unificado que processa todas as integrações usando GPT-4', 'active', 85, 12, 94, NOW())
ON CONFLICT DO NOTHING;

-- Inserir logs recentes de exemplo
INSERT INTO system_logs (log_type, message, details, agent_id) VALUES
('agent_execution', 'Agente consolidador executado com sucesso', '{"clients_processed": 3, "insights_generated": 5, "processing_time": 25, "status": "success"}', 1),
('agent_execution', 'Agente consolidador executado com sucesso - 2h atrás', '{"clients_processed": 3, "insights_generated": 7, "processing_time": 31, "status": "success"}', 1),
('agent_execution', 'Agente consolidador executado com sucesso - 4h atrás', '{"clients_processed": 4, "insights_generated": 6, "processing_time": 19, "status": "success"}', 1)
ON CONFLICT DO NOTHING;

-- Verificar se as tabelas foram criadas corretamente
SELECT 'clients' as table_name, count(*) as records FROM clients
UNION ALL
SELECT 'ai_agents' as table_name, count(*) as records FROM ai_agents  
UNION ALL
SELECT 'system_logs' as table_name, count(*) as records FROM system_logs
UNION ALL
SELECT 'agent_insights' as table_name, count(*) as records FROM agent_insights
UNION ALL  
SELECT 'client_integrations' as table_name, count(*) as records FROM client_integrations;