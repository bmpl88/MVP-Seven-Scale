import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Layout, 
  Database, 
  Save,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useDashboardContext } from '../context/DashboardContext';

export default function Settings() {
  const { userPreferences, updateUserPreferences, loading } = useDashboardContext();
  const [theme, setTheme] = useState('light');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    alerts: {
      critical: true,
      warning: true,
      info: false
    }
  });
  const [favoriteMetrics, setFavoriteMetrics] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Carregar preferências do usuário
  useEffect(() => {
    if (userPreferences) {
      setTheme(userPreferences.theme || 'light');
      setNotificationSettings(userPreferences.notification_settings || {
        email: true,
        push: true,
        alerts: {
          critical: true,
          warning: true,
          info: false
        }
      });
      setFavoriteMetrics(userPreferences.favorite_metrics || []);
    }
  }, [userPreferences]);

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      
      await updateUserPreferences({
        theme,
        notification_settings: notificationSettings,
        favorite_metrics: favoriteMetrics
      });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotification = (type: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleToggleAlert = (type: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [type]: !prev.alerts[type]
      }
    }));
  };

  const handleToggleMetric = (metric: string) => {
    setFavoriteMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };

  if (loading && !userPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Personalize sua experiência na plataforma</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Alterações
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Exportar Configurações
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Importar Configurações
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-8">
        {/* Status de salvamento */}
        {saveStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">Configurações salvas com sucesso!</p>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">Erro ao salvar configurações. Tente novamente.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configurações de Perfil */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Perfil</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue="Bruno Monteiro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="bruno@sevenscale.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <input
                  type="text"
                  defaultValue="Admin SevenScale"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Editar Perfil
              </button>
            </div>
          </div>
          
          {/* Configurações de Aparência */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-100">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Aparência</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="h-24 bg-white border border-gray-200 rounded-lg mb-2"></div>
                    <p className="text-center font-medium">Claro</p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="h-24 bg-gray-900 border border-gray-700 rounded-lg mb-2"></div>
                    <p className="text-center font-medium">Escuro</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout do Dashboard
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="default">Padrão</option>
                  <option value="compact">Compacto</option>
                  <option value="expanded">Expandido</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Densidade de Informação
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="comfortable">Confortável</option>
                  <option value="compact">Compacta</option>
                  <option value="dense">Densa</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Configurações de Notificações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-amber-100">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canais de Notificação
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email</span>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notificationSettings.email}
                        onChange={() => handleToggleNotification('email')}
                      />
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.email ? 'bg-blue-600 transform translate-x-6' : 'bg-white'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Push</span>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notificationSettings.push}
                        onChange={() => handleToggleNotification('push')}
                      />
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.push ? 'bg-blue-600 transform translate-x-6' : 'bg-white'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de Alertas
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-gray-700">Críticos</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notificationSettings.alerts?.critical}
                        onChange={() => handleToggleAlert('critical')}
                      />
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.alerts?.critical ? 'bg-blue-600 transform translate-x-6' : 'bg-white'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-gray-700">Avisos</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notificationSettings.alerts?.warning}
                        onChange={() => handleToggleAlert('warning')}
                      />
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.alerts?.warning ? 'bg-blue-600 transform translate-x-6' : 'bg-white'
                        }`}
                      ></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Informativos</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notificationSettings.alerts?.info}
                        onChange={() => handleToggleAlert('info')}
                      />
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                          notificationSettings.alerts?.info ? 'bg-blue-600 transform translate-x-6' : 'bg-white'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Métricas Favoritas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100">
                <Layout className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Métricas Favoritas</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'roi', label: 'ROI' },
                { id: 'performance', label: 'Performance Score' },
                { id: 'revenue', label: 'Receita' },
                { id: 'patients', label: 'Pacientes' },
                { id: 'leads', label: 'Leads' },
                { id: 'conversions', label: 'Conversões' },
                { id: 'appointments', label: 'Agendamentos' },
                { id: 'no_show', label: 'No-Show' }
              ].map(metric => (
                <div key={metric.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{metric.label}</span>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={favoriteMetrics.includes(metric.id)}
                      onChange={() => handleToggleMetric(metric.id)}
                    />
                    <span
                      className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                        favoriteMetrics.includes(metric.id) ? 'bg-blue-600 transform translate-x-6' : 'bg-white'
                      }`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Configurações de Segurança */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-100">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Segurança</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Alterar Senha
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autenticação de Dois Fatores
                </label>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Configurar 2FA
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sessões Ativas
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">Este dispositivo</p>
                      <p className="text-gray-500 text-sm">Chrome • Windows • São Paulo, BR</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Atual
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Configurações de Banco de Dados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Banco de Dados</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status da Conexão
                </label>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Conectado ao Supabase</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ações de Manutenção
                </label>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Executar Migrações
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Backup de Dados
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Limpar Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}