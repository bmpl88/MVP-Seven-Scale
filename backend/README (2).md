# SevenScale Medical Dashboard Backend

API backend para o dashboard de análise de clínicas médicas da SevenScale.

## Tecnologias

- **Express.js**: Framework web rápido e minimalista para Node.js
- **Supabase**: Banco de dados PostgreSQL e autenticação
- **Node.js**: Ambiente de execução JavaScript
- **OpenAI**: API para inteligência artificial

## Estrutura do Projeto

```
backend/
├── server.js             # Aplicação principal Express
├── lib/                  # Bibliotecas e utilitários
│   ├── database.js       # Configuração do Supabase
│   ├── logger.js         # Configuração de logs
│   └── agent-runner.js   # Lógica do agente IA
├── routes/               # Rotas da API
│   ├── auth.js           # Autenticação
│   ├── clients.js        # Clientes médicos
│   ├── agents.js         # Agentes IA
│   ├── analytics.js      # Analytics
│   ├── integrations.js   # Integrações
│   └── dashboard.js      # Dashboard
├── types/                # Definições de tipos
│   └── models.js         # Modelos de dados
├── package.json          # Dependências Node.js
└── .env.example          # Exemplo de variáveis de ambiente
```

## Instalação e Execução

### Configuração

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas configurações
```

### Execução

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## Endpoints da API

### Autenticação
- `POST /api/v1/auth/login` - Login de usuário
- `POST /api/v1/auth/register` - Registro de usuário
- `POST /api/v1/auth/logout` - Logout

### Clientes
- `GET /api/v1/clients/` - Listar clientes
- `GET /api/v1/clients/summary` - Resumo dos clientes
- `GET /api/v1/clients/{client_id}` - Obter cliente por ID
- `POST /api/v1/clients/` - Criar cliente
- `PUT /api/v1/clients/{client_id}` - Atualizar cliente
- `DELETE /api/v1/clients/{client_id}` - Deletar cliente
- `GET /api/v1/clients/{client_id}/metrics` - Métricas do cliente

### Agentes IA
- `GET /api/v1/agents/` - Listar agentes
- `GET /api/v1/agents/performance` - Performance dos agentes
- `GET /api/v1/agents/{agent_id}` - Obter agente por ID
- `PUT /api/v1/agents/{agent_id}` - Atualizar agente
- `POST /api/v1/agents/{agent_id}/execute` - Executar agente
- `POST /api/v1/agents/{agent_id}/toggle` - Alternar status do agente
- `GET /api/v1/agents/{agent_id}/logs` - Logs do agente
- `POST /api/v1/agents/run-daily-analysis` - Executar análise diária
- `POST /api/v1/agents/process-client/{client_id}` - Processar cliente específico

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard de analytics
- `GET /api/v1/analytics/clients/performance` - Performance dos clientes
- `GET /api/v1/analytics/specialties/roi` - ROI por especialidade
- `GET /api/v1/analytics/funnel` - Dados do funil
- `GET /api/v1/analytics/agents/performance` - Performance dos agentes
- `GET /api/v1/analytics/integrations/metrics` - Métricas das integrações
- `GET /api/v1/analytics/revenue/evolution` - Evolução da receita
- `GET /api/v1/analytics/export` - Exportar analytics

### Integrações
- `GET /api/v1/integrations/` - Listar integrações
- `GET /api/v1/integrations/status` - Status das integrações
- `GET /api/v1/integrations/{integration_id}` - Obter integração por ID
- `POST /api/v1/integrations/` - Criar integração
- `PUT /api/v1/integrations/{integration_id}` - Atualizar integração
- `DELETE /api/v1/integrations/{integration_id}` - Deletar integração
- `POST /api/v1/integrations/{integration_id}/test` - Testar integração
- `POST /api/v1/integrations/{integration_id}/sync` - Sincronizar integração
- `GET /api/v1/integrations/client/{client_id}` - Integrações do cliente

### Dashboard
- `GET /api/v1/dashboard/overview` - Visão geral
- `GET /api/v1/dashboard/metrics` - Métricas principais
- `GET /api/v1/dashboard/alerts` - Alertas do sistema
- `GET /api/v1/dashboard/health` - Saúde do sistema
- `GET /api/v1/dashboard/recent-activity` - Atividade recente

## Documentação

A documentação da API está disponível em:

- API Docs: http://localhost:8000/api-docs