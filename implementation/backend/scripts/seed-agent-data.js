/**
 * Script para criar dados simulados do agente
 * Roda uma vez para popular o banco com dados realistas
 */

import { dbService } from '../lib/database.js';
import logger from '../lib/logger.js';

export async function seedAgentData() {
  try {
    console.log('🌱 Criando dados simulados do agente...');
    
    // 1. Criar agente consolidador se não existir
    const existingAgents = await dbService.executeQuery('ai_agents', 'select', {
      filters: [{ column: 'agent_type', value: 'consolidator' }]
    });
    
    if (existingAgents.length === 0) {
      console.log('📝 Criando agente consolidador...');
      await dbService.executeQuery('ai_agents', 'insert', {
        data: {
          name: 'SevenScale MVP Consolidator',
          agent_type: 'consolidator',
          status: 'active',
          performance: 85,
          executions_today: 12,
          success_rate: 94,
          last_execution: new Date().toISOString()
        }
      });
      console.log('✅ Agente consolidador criado');
    }
    
    // 2. Buscar o ID do agente criado
    const agentResults = await dbService.executeQuery('ai_agents', 'select', {
      filters: [{ column: 'agent_type', value: 'consolidator' }]
    });
    
    const agentId = agentResults[0]?.id;
    if (!agentId) {
      throw new Error('Agente consolidador não encontrado após inserção');
    }
    
    console.log(`🔍 Agente encontrado com ID: ${agentId}`);
    
    // 3. Criar logs de execução recentes
    const logs = [];
    const now = new Date();
    
    // Criar logs das últimas 24 horas (a cada 2 horas)
    for (let i = 0; i < 12; i++) {
      const logTime = new Date(now.getTime() - (i * 2 * 60 * 60 * 1000));
      
      logs.push({
        log_type: 'agent_execution',
        message: `Agente consolidador executado com sucesso - ${i === 0 ? 'mais recente' : `${i * 2}h atrás`}`,
        details: JSON.stringify({
          clients_processed: Math.floor(Math.random() * 5) + 3,
          insights_generated: Math.floor(Math.random() * 8) + 5,
          processing_time: Math.floor(Math.random() * 45) + 15,
          status: 'success'
        }),
        agent_id: agentId,
        created_at: logTime.toISOString()
      });
    }
    
    console.log('📝 Criando logs de execução...');
    for (const log of logs) {
      await dbService.executeQuery('system_logs', 'insert', { data: log });
    }
    console.log(`✅ ${logs.length} logs criados`);
    
    // 4. Buscar ID do primeiro cliente para insights
    const clientResults = await dbService.executeQuery('clients', 'select', {
      limit: 1
    });
    
    const clientId = clientResults[0]?.id;
    if (!clientId) {
      console.log('⚠️ Nenhum cliente encontrado, pulando criação de insights');
    } else {
      console.log(`🔍 Cliente encontrado com ID: ${clientId}`);
      
      // 5. Criar alguns insights de exemplo
      const insights = [
      {
      client_id: clientId,
      agent_type: 'consolidator',
      insights_data: JSON.stringify({
      insights: [
      'Taxa de conversão HubSpot subiu 15% nos últimos 7 dias',
      'Google Ads com ROAS de 4.2x - acima da média do setor',
      'WhatsApp com tempo de resposta médio de 8 min - excelente'
      ],
      action_items: [
      'Aumentar orçamento Google Ads em 20%',
      'Implementar chatbot WhatsApp para horário noturno',
      'Criar sequência email para leads não convertidos'
      ],
      roi_analysis: {
      roi_percent: '287%',
      revenue_impact: 'R$ 45.2k',
      key_drivers: ['Google Ads', 'WhatsApp', 'HubSpot CRM']
      }
      }),
      processed_at: new Date().toISOString(),
      status: 'completed'
      }
      ];
      
      console.log('📝 Criando insights de exemplo...');
      for (const insight of insights) {
      await dbService.executeQuery('agent_insights', 'insert', { data: insight });
      }
      console.log(`✅ ${insights.length} insights criados`);
    }
    
    console.log('🎉 Dados simulados do agente criados com sucesso!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao criar dados simulados:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAgentData()
    .then(() => {
      console.log('✅ Script concluído');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script falhou:', error);
      process.exit(1);
    });
}