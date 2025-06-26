# ⚙️ Backend - Node.js + GPT-4 Architecture

> **Especificações backend para MVP Tier 1**

Esta pasta contém as especificações e implementação do backend MVP.

## 📁 Conteúdo:

- **architecture.md** - Arquitetura Node.js + GPT-4
- **agent-consolidator.md** - Especificações do Agente Consolidador
- **api-endpoints.md** - Endpoints REST disponíveis
- **supabase-integration.md** - Integração com Supabase
- **gpt4-configuration.md** - Configuração OpenAI GPT-4
- **processing-pipeline.md** - Pipeline de processamento diário

## 🏗️ Arquitetura MVP:

```
6 APIs → Node.js → JSON Consolidado → GPT-4 → Insights → Supabase → Frontend
```

## 🤖 Agente Consolidador Único:

### **Especificações:**
- **Tecnologia:** Node.js + GPT-4 direto (não LangChain)
- **Input:** JSON consolidado das 6 APIs
- **Output:** 3-5 insights acionáveis diários
- **Frequência:** Processamento automático diário
- **Custo:** ~$3.4 USD/cliente/mês

### **Processamento:**
1. **Coleta dados** das 6 integrações
2. **Consolida JSON** estruturado
3. **Processa via GPT-4** com contexto médico
4. **Gera insights** específicos da especialidade
5. **Salva no Supabase** para dashboard

## 🔗 Integrações Core (6):

1. **HubSpot CRM** - Pipeline + marketing automation
2. **Google Analytics** - Tráfego + conversões
3. **Meta Ads** - Facebook/Instagram performance
4. **Google Calendar** - Agendamentos + ocupação
5. **WhatsApp Business** - Comunicação pacientes
6. **RD Station CRM** - CRM brasileiro (Fase 2)

---

*Base: Node.js + Express implementado e funcionando*