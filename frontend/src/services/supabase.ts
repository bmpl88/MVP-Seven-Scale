import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://irotiorxyayknzkpskve.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3Rpb3J4eWF5a256a3Bza3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODA3NDgsImV4cCI6MjA2NjM1Njc0OH0.Ew6VuB5zUQcEfq4Rb_0GFHOe7ZNWPkZza8kkfCXKMIo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Serviços de autenticação
export const authService = {
  // Registrar novo usuário
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Login com email e senha
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Salvar token para uso com a API
    localStorage.setItem('supabase_token', data.session.access_token);
    
    return data;
  },
  
  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    
    // Remover token
    localStorage.removeItem('supabase_token');
    
    if (error) throw error;
    return true;
  },
  
  // Obter usuário atual
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return data.user;
  },
  
  // Obter sessão atual
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    return data.session;
  },
  
  // Resetar senha
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) throw error;
    return true;
  },
  
  // Atualizar senha
  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    return true;
  }
};

// Serviços de acesso direto ao banco
export const dbService = {
  // Clientes
  clients: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    getById: async (id: number) => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    create: async (clientData: any) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    
    update: async (id: number, clientData: any) => {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    
    delete: async (id: number) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    }
  },
  
  // Agentes IA
  agents: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    
    getById: async (id: number) => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    update: async (id: number, agentData: any) => {
      const { data, error } = await supabase
        .from('ai_agents')
        .update(agentData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    }
  },
  
  // Integrações
  integrations: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    getByClient: async (clientId: number) => {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data;
    }
  },
  
  // Logs do sistema
  logs: {
    getRecent: async (limit = 20) => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    
    getByType: async (logType: string, limit = 20) => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('log_type', logType)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  }
};

export default {
  supabase,
  auth: authService,
  db: dbService
};