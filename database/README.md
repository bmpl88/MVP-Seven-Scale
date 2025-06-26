# 🗄️ Database - Estrutura do Banco de Dados

> **Schema completo do Supabase PostgreSQL para SevenScale Health Dashboard**

Esta pasta contém a estrutura completa do banco de dados, extraída dos arquivos locais mais atualizados.

## 📁 Conteúdo:

- **banco-dados-atual.json** - Schema JSON completo (Desktop/Banco_de_Dados)
- **supabase-schema.sql** - Script SQL para criação das tabelas
- **views-optimized.sql** - Views otimizadas para dashboard
- **data-relationships.md** - Relacionamentos entre tabelas
- **performance-indexes.sql** - Índices para performance

## 🏗️ Estrutura:

### **Módulos:**
- **ai_agents** - 7 Agentes Impulso® Health + Execuções
- **clients** - Clínicas, Métricas e Performance
- **integrations** - Integrações APIs Externas
- **system** - Logs e Configurações

### **Tabelas Principais:**
- `ai_agents` - 7 Agentes especializados
- `clients` - Clínicas médicas (tabela central)
- `integrations` - Integrações disponíveis
- `dashboard_metrics` - Métricas consolidadas

### **Views Otimizadas:**
- `client_dashboard_view` - Cards dos clientes
- `vw_agent_analytics` - Performance agentes
- `vw_dashboard_overview` - KPIs gerais

---

*Fonte: C:\\Users\\Skul\\Desktop\\Banco_de_Dados\\Banco de Dados Atual.json*