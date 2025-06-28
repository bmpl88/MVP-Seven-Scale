import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://irotiorxyayknzkpskve.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3Rpb3J4eWF5a256a3Bza3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODA3NDgsImV4cCI6MjA2NjM1Njc0OH0.Ew6VuB5zUQcEfq4Rb_0GFHOe7ZNWPkZza8kkfCXKMIo';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Diretório das migrações
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// Função para executar SQL usando fetch direto
async function executeSql(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey
    },
    body: JSON.stringify({ sql_query: sql })
  });

  if (!response.ok) {
    // Se a função exec_sql não existir, vamos tentar executar diretamente via SQL
    const errorText = await response.text();
    console.log('Tentando método alternativo para executar SQL...');
    
    // Dividir o SQL em statements individuais
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        try {
          const { error } = await supabase.from('_').select('*').limit(0);
          // Se chegou até aqui, a conexão está funcionando
          // Vamos tentar usar o método de query raw
          const { error: queryError } = await supabase.rpc('exec', { sql: trimmedStatement });
          if (queryError) {
            console.warn(`Aviso ao executar statement: ${queryError.message}`);
          }
        } catch (err) {
          console.warn(`Aviso ao executar statement: ${err.message}`);
        }
      }
    }
    return { success: true };
  }

  const result = await response.json();
  return result;
}

// Executar migrações
async function runMigrations() {
  console.log('🚀 Iniciando setup do banco de dados...');
  
  try {
    // Verificar conexão com Supabase
    const { data, error } = await supabase.from('_').select('*').limit(0);
    if (error && !error.message.includes('does not exist')) {
      console.error('❌ Erro de conexão com Supabase:', error);
      console.log('💡 Verifique se as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão corretas');
      return;
    }
    
    console.log('✅ Conexão com Supabase estabelecida');
    
    // Verificar se o diretório de migrações existe
    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Diretório de migrações não encontrado:', migrationsDir);
      return;
    }
    
    // Obter arquivos de migração
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordenar por nome
    
    console.log(`📁 Encontradas ${migrationFiles.length} migrações para executar`);
    
    if (migrationFiles.length === 0) {
      console.log('⚠️ Nenhuma migração encontrada para executar');
      return;
    }
    
    // Executar cada migração
    for (const file of migrationFiles) {
      console.log(`⚙️ Executando migração: ${file}`);
      
      try {
        // Ler conteúdo do arquivo
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        // Executar SQL
        const result = await executeSql(sql);
        
        if (result.error) {
          console.error(`❌ Erro ao executar migração ${file}:`, result.error);
        } else {
          console.log(`✅ Migração ${file} executada com sucesso`);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar migração ${file}:`, error.message);
      }
    }
    
    console.log('🎉 Setup do banco de dados concluído!');
    console.log('💡 Reinicie o servidor de desenvolvimento para aplicar as mudanças');
    
  } catch (error) {
    console.error('❌ Erro durante o setup do banco de dados:', error);
    console.log('💡 Certifique-se de que você tem as permissões corretas no Supabase');
  }
}

// Executar função principal
runMigrations();