import { useState, useEffect } from 'react';
import { supabase, authService } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar usuário e sessão ao inicializar
  useEffect(() => {
    async function loadUserAndSession() {
      try {
        setLoading(true);
        
        // Carregar sessão
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
        }
        
        // Configurar listener para mudanças de autenticação
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }
    
    loadUserAndSession();
  }, []);

  // Funções de autenticação
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.signIn(email, password);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.signUp(email, password);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await authService.resetPassword(email);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    supabase
  };
}

export default useSupabase;