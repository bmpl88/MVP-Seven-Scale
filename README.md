# 🏥 SevenScale Health Dashboard - MVP Tier 1

> **Plataforma de transformação digital para clínicas médicas através de IA especializada + Growth Marketing**

## 🎯 COMMIT MVP COMPLETO - JUNHO 2025

Este repositório contém o **MVP completo** do SevenScale Health Dashboard, pronto para deploy em produção.

---

## 🚀 STACK TECNOLÓGICO IMPLEMENTADO

### **Frontend** (💱 React + TypeScript)
- **React 18.3.1** + **TypeScript 5.5.3**
- **Tailwind CSS 3.4.1** para styling
- **React Router DOM** para navegação
- **Lucide React** para ícones
- **Vite** para build e desenvolvimento
- **4 páginas essenciais**: Dashboard, Clientes, Integrações, Acesso Cliente

### **Backend** (🚀 Node.js + Express)
- **Node.js + Express** servidor API
- **Supabase PostgreSQL** banco de dados
- **OpenAI GPT-4** integração IA
- **12 tabelas + 6 views** otimizadas
- **Processamento sequencial** (1 cliente por vez)
- **Rate limiting** e controles de timeout

### **IA & Processamento** (🤖 GPT-4)
- **1 Agente Consolidador** MVP
- **6 Integrações Core**: HubSpot, Google Analytics, Meta Ads, Google Calendar, WhatsApp, RD Station
- **Insights automatizados** diários
- **ROI tracking** em tempo real

---

## 📁 ESTRUTURA DO REPOSITÓRIO

```
MVP-Seven-Scale/
├── 📄 README.md                    # Este arquivo
├── 📁 database/                    # Schema e estrutura DB
│   ├── schema.json               # Estrutura completa do banco
│   ├── mvp_tables.sql            # Script SQL para criação
│   └── endpoints.md              # Documentação da API
├── 📁 backend/                     # Servidor Node.js
│   ├── server.js                 # Servidor principal
│   ├── package.json              # Dependências backend
│   ├── routes/                   # Rotas da API
│   │   ├── agent.js              # Endpoints do agente IA
│   │   ├── clients.js            # CRUD clientes
│   │   └── dashboard.js          # Métricas dashboard
│   ├── services/                 # Lógica de negócio
│   │   └── agentConsolidator.js  # Agente GPT-4
│   └── lib/                      # Utilitários
│       └── database.js           # Conexão Supabase
└── 📁 frontend/                    # Aplicação React
    ├── package.json              # Dependências frontend
    ├── index.html                # HTML principal
    ├── vite.config.ts            # Configuração Vite
    ├── tailwind.config.js        # Configuração Tailwind
    └── src/                      # Código fonte React
        ├── App.tsx               # Componente principal
        ├── main.tsx              # Entry point
        ├── index.css             # Estilos globais
        ├── components/           # Componentes reutilizáveis
        │   ├── Layout.tsx        # Layout principal
        │   └── Sidebar.tsx       # Navegação lateral
        ├── pages/                # Páginas da aplicação
        │   ├── Dashboard.tsx     # Dashboard principal
        │   ├── Clients.tsx       # Gestão de clientes
        │   └── Login.tsx         # Autenticação
        ├── context/              # Contextos React
        │   ├── AuthContext.tsx   # Autenticação
        │   └── DashboardContext.tsx # Dashboard
        ├── hooks/                # Hooks customizados
        │   ├── useDashboard.ts   # Lógica dashboard
        │   └── useSupabase.ts    # Integração Supabase
        └── services/             # Serviços e APIs
            ├── api.ts            # Cliente HTTP
            └── supabase.ts       # Configuração Supabase
```

---

## ⚙️ SETUP E INSTALAÇÃO

### **1. Pré-requisitos**
```bash
# Node.js 18+ e npm
node --version  # v18.0.0+
npm --version   # v8.0.0+

# Git
git --version   # v2.0.0+
```

### **2. Clone o repositório**
```bash
git clone https://github.com/bmpl88/MVP-Seven-Scale.git
cd MVP-Seven-Scale
```

### **3. Setup do Backend**
```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY  
# - OPENAI_API_KEY
```

### **4. Setup do Frontend**
```bash
cd ../frontend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_API_URL=http://localhost:8000/api/v1
```

### **5. Setup do Banco de Dados**
```bash
# No Supabase SQL Editor, execute:
# database/mvp_tables.sql

# Isso criará:
# - 5 tabelas principais
# - Índices otimizados
# - Dados de exemplo
```

---

## 🚀 EXECUTAR EM DESENVOLVIMENTO

### **Terminal 1 - Backend**
```bash
cd backend
npm run dev
# 🚀 Servidor rodando em http://localhost:8000
```

### **Terminal 2 - Frontend**
```bash
cd frontend  
npm run dev
# 🌐 Aplicação rodando em http://localhost:5173
```

### **Acessar a aplicação**
- 🌍 **Frontend**: http://localhost:5173
- 🔧 **API Backend**: http://localhost:8000
- 📊 **Health Check**: http://localhost:8000/health

---

## 📊 FUNCIONALIDADES IMPLEMENTADAS

### **✅ Dashboard Principal**
- Métricas de clientes ativos
- Status do agente IA em tempo real
- Últimas atualizações do sistema
- Alertas e notificações
- Botão "Acionar Agente" funcional

### **✅ Gestão de Clientes**
- Lista de clientes médicos
- Filtros por especialidade
- Status operacional
- Última sincronização
- Acesso ao dashboard do cliente

### **✅ Agente IA GPT-4**
- Processamento sequencial otimizado
- Máximo 2 clientes por execução
- Timeout de 60 segundos por cliente
- Rate limiting inteligente
- Insights automatizados

### **✅ Integrações**
- HubSpot CRM
- Google Analytics
- Meta Ads (Facebook/Instagram)
- Google Calendar
- WhatsApp Business
- RD Station (preparado)

### **✅ Autenticação**
- Login via Supabase Auth
- Sessões persistentes
- Proteção de rotas
- Logout seguro

---

## 🛠️ API ENDPOINTS

### **🤖 Agente IA**
- `POST /api/v1/agent/process/:clientId` - Processar cliente
- `POST /api/v1/agent/process-all` - Processar todos (máx 2)
- `GET /api/v1/agent/status` - Status do agente
- `GET /api/v1/agent/insights/:clientId` - Insights do cliente
- `POST /api/v1/agent/test` - Testar agente

### **👥 Clientes**
- `GET /api/v1/clients` - Listar clientes
- `POST /api/v1/clients` - Criar cliente
- `PUT /api/v1/clients/:id` - Atualizar cliente
- `DELETE /api/v1/clients/:id` - Deletar cliente
- `GET /api/v1/clients/:id/metrics` - Métricas do cliente

### **📊 Dashboard**
- `GET /api/v1/dashboard/overview` - Visão geral
- `GET /api/v1/dashboard/metrics` - Métricas
- `GET /api/v1/dashboard/alerts` - Alertas
- `GET /api/v1/dashboard/health` - Saúde do sistema

---

## 💾 BANCO DE DADOS

### **Tabelas Principais**
1. **`clients`** - Clínicas e médicos
2. **`ai_agents`** - Agentes de IA
3. **`agent_insights`** - Insights gerados
4. **`client_integrations`** - Integrações por cliente
5. **`system_logs`** - Logs do sistema

### **Views Otimizadas**
- `client_dashboard_view` - Dashboard consolidado
- `vw_agent_analytics` - Analytics dos agentes
- `vw_integration_health` - Saúde das integrações

---

## 🔒 SEGURANÇA

- **Autenticação**: JWT via Supabase
- **Autorização**: Row Level Security (RLS)
- **Rate Limiting**: Proteção contra spam
- **CORS**: Configurado para origens autorizadas
- **Input Validation**: Sanitização de dados
- **Timeout Controls**: Previne travamentos

---

## 🚀 DEPLOY EM PRODUÇÃO

### **Backend (Recomendado: Railway/Render)**
```bash
# Build
cd backend
npm install --production

# Variáveis de ambiente necessárias:
PORT=8000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
ALLOWED_ORIGINS=https://yourfrontend.com

# Comando de start
npm start
```

### **Frontend (Recomendado: Vercel/Netlify)**
```bash
cd frontend
npm run build

# Variáveis de ambiente necessárias:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://yourbackend.com/api/v1
```

---

## 💰 INVESTIMENTO & ROI

### **Custos Operacionais (MVP)**
- **Infraestrutura**: $200/mês
- **APIs**: $100/mês
- **GPT-4**: $50/mês (10 clientes)
- **Total**: $350/mês

### **Break-even**
- **Revenue needed**: $350/mês = 3 clientes × $150/mês
- **Time to break-even**: 6-8 semanas

---

## 😮‍💫 ROADMAP MVP → SCALE

### **Fase 1 - MVP (ATUAL)**
- ✅ 4 páginas essenciais
- ✅ 1 Agente Consolidador
- ✅ 6 Integrações core
- ✅ Máx 10 clientes

### **Fase 2 - Growth (Q3 2025)**
- 7 páginas completas
- 7 Agentes Impulso® Health
- 12 integrações
- Máx 50 clientes

### **Fase 3 - Scale (Q4 2025)**
- White-label solution
- API pública
- Marketplace de agentes
- Clientes ilimitados

---

## 🚑 SUPORTE & CONTATO

**Bruno Monteiro** - Fundador SevenScale  
📧 **Email**: bruno@sevenscale.com.br  
📱 **GitHub**: [@bmpl88](https://github.com/bmpl88)  
🎓 **Background**: Biomedicina + Biotecnologia + IA + Growth Marketing  

---

## 🏆 STATUS DO PROJETO

**🎯 Status atual: MVP COMPLETO • PRONTO PARA DEPLOY**

**📅 Última atualização**: 27 Junho 2025  
**🔖 Versão**: v1.0.0-mvp  
**🚀 Próximo milestone**: Deploy em produção + primeiros clientes beta  

---

*🌟 Criado com ❤️ por SevenScale - Transformando clínicas médicas com IA especializada*