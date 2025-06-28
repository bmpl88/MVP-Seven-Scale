-- Seed data para desenvolvimento

-- Inserir clientes de exemplo
INSERT INTO clients (name, specialty, email, phone, city, status, performance, revenue, patients) VALUES
('Dr. Silva', 'Clínica Médica', 'silva@clinica.com', '(11) 99999-9999', 'São Paulo - SP', 'operational', 87, 'R$ 285k', 78),
('Clínica CardioVida', 'Cardiologia', 'contato@cardiovida.com', '(11) 98888-8888', 'São Paulo - SP', 'operational', 92, 'R$ 320k', 95),
('Dermatologia Plus', 'Dermatologia', 'admin@dermaplus.com', '(21) 97777-7777', 'Rio de Janeiro - RJ', 'operational', 89, 'R$ 295k', 82),
('Dr. Oliveira', 'Endocrinologia', 'oliveira@endocrino.com', '(31) 96666-6666', 'Belo Horizonte - MG', 'operational', 84, 'R$ 270k', 65),
('Clínica OrtoLife', 'Ortopedia', 'contato@ortolife.com', '(51) 95555-5555', 'Porto Alegre - RS', 'operational', 91, 'R$ 310k', 88),
('Pediatria Feliz', 'Pediatria', 'admin@pediatriafeliz.com', '(61) 94444-4444', 'Brasília - DF', 'operational', 86, 'R$ 265k', 72),
('Dr. Costa', 'Clínica Geral', 'costa@clinica.com', '(71) 93333-3333', 'Salvador - BA', 'operational', 83, 'R$ 245k', 58),
('Clínica Visão', 'Oftalmologia', 'contato@clinicavisao.com', '(85) 92222-2222', 'Fortaleza - CE', 'operational', 88, 'R$ 280k', 76),
('Dr. Lima', 'Urologia', 'lima@urologia.com', '(81) 91111-1111', 'Recife - PE', 'operational', 85, 'R$ 275k', 69),
('Neuro Center', 'Neurologia', 'admin@neurocenter.com', '(41) 90000-0000', 'Curitiba - PR', 'operational', 90, 'R$ 300k', 85),
('Dr. Santos', 'Pediatria', 'santos@pediatria.com', '(62) 98888-9999', 'Goiânia - GO', 'attention', 76, 'R$ 180k', 45),
('Clínica OrthoMed', 'Ortopedia', 'contato@orthomed.com', '(92) 97777-8888', 'Manaus - AM', 'attention', 71, 'R$ 165k', 38);

-- Inserir agentes IA
INSERT INTO ai_agents (name, agent_type, status, performance, config) VALUES
('Diagnosticador', 'diagnosticador', 'active', 97, '{"temperature": 0.3, "max_tokens": 2000, "priority": "alta"}'),
('Arquiteto Clínico', 'arquiteto', 'active', 89, '{"temperature": 0.4, "max_tokens": 2500, "priority": "normal"}'),
('Prototipador Médico', 'prototipador', 'active', 92, '{"temperature": 0.6, "max_tokens": 1800, "priority": "alta"}'),
('Implementador Clínico', 'implementador', 'active', 85, '{"temperature": 0.2, "max_tokens": 3000, "priority": "critica"}'),
('Lapidador Clínico', 'lapidador', 'active', 94, '{"temperature": 0.5, "max_tokens": 2200, "priority": "alta"}'),
('Sistematizador Médico', 'sistematizador', 'active', 88, '{"temperature": 0.3, "max_tokens": 2000, "priority": "normal"}'),
('Monitor Clínico', 'monitor', 'active', 96, '{"temperature": 0.4, "max_tokens": 1500, "priority": "critica"}');

-- Inserir métricas de exemplo
INSERT INTO client_metrics (client_id, metric_type, metric_value, metric_date) VALUES
-- Dr. Silva (id: 1)
(1, 'roi', 245, CURRENT_DATE),
(1, 'leads', 156, CURRENT_DATE),
(1, 'conversions', 78, CURRENT_DATE),
(1, 'revenue', 285000, CURRENT_DATE),

-- CardioVida (id: 2)
(2, 'roi', 312, CURRENT_DATE),
(2, 'leads', 189, CURRENT_DATE),
(2, 'conversions', 95, CURRENT_DATE),
(2, 'revenue', 320000, CURRENT_DATE),

-- Dermatologia Plus (id: 3)
(3, 'roi', 298, CURRENT_DATE),
(3, 'leads', 167, CURRENT_DATE),
(3, 'conversions', 82, CURRENT_DATE),
(3, 'revenue', 295000, CURRENT_DATE);

-- Inserir integrações de exemplo
INSERT INTO integrations (client_id, integration_type, status, last_sync, config, metrics) VALUES
-- Dr. Silva (id: 1)
(1, 'hubspot', 'connected', NOW() - INTERVAL '3 minutes', '{"api_key": "mock_key", "portal_id": "12345"}', '{"contacts": 1247, "deals": 89}'),
(1, 'meta-ads', 'connected', NOW() - INTERVAL '1 minute', '{"account_id": "123456789", "access_token": "mock_token"}', '{"spend": 47850, "conversions": 2156}'),
(1, 'google-calendar', 'connected', NOW() - INTERVAL '1 minute', '{"calendar_id": "primary"}', '{"appointments": 47, "slots": 156}'),
(1, 'whatsapp', 'connected', NOW() - INTERVAL '30 seconds', '{"phone_number": "+5511999999999"}', '{"messages": 234, "delivery_rate": 89}'),

-- CardioVida (id: 2)
(2, 'hubspot', 'connected', NOW() - INTERVAL '5 minutes', '{"api_key": "mock_key", "portal_id": "67890"}', '{"contacts": 1892, "deals": 124}'),
(2, 'meta-ads', 'connected', NOW() - INTERVAL '2 minutes', '{"account_id": "987654321", "access_token": "mock_token"}', '{"spend": 52450, "conversions": 2789}'),
(2, 'google-calendar', 'connected', NOW() - INTERVAL '3 minutes', '{"calendar_id": "primary"}', '{"appointments": 95, "slots": 210}'),

-- OrthoMed (id: 12)
(12, 'hubspot', 'connected', NOW() - INTERVAL '8 hours', '{"api_key": "mock_key", "portal_id": "13579"}', '{"contacts": 456, "deals": 23}'),
(12, 'meta-ads', 'disconnected', NOW() - INTERVAL '4 hours', '{"account_id": "246810", "access_token": "expired_token"}', '{"spend": 12450, "conversions": 345}');

-- Inserir logs do sistema
INSERT INTO system_logs (log_type, message, details, client_id, agent_id, created_at) VALUES
('info', 'Sistema inicializado', '{"version": "1.0.0"}', NULL, NULL, NOW() - INTERVAL '1 day'),
('agent_execution', 'Agente executado com sucesso', '{"execution_id": "abc123"}', 1, 1, NOW() - INTERVAL '15 minutes'),
('integration_synced', 'Sincronização executada - 156 registros processados', '{"integration_id": 1}', 2, NULL, NOW() - INTERVAL '30 minutes'),
('warning', 'Agente Inativo', '{"agent_id": 6}', 11, 6, NOW() - INTERVAL '2 hours'),
('critical', 'Meta Ads Offline', '{"integration_id": 8}', 12, NULL, NOW() - INTERVAL '4 hours');