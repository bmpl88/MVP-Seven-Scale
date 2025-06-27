import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Link2,
  Monitor,
  ChevronLeft,
  ChevronRight,
  User,
  Circle,
  ChevronDown,
  Bell,
  Shield,
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/dashboard',
    description: 'Visão geral da plataforma'
  },
  { 
    icon: Users, 
    label: 'Clientes', 
    path: '/clientes',
    description: 'Gestão de clientes médicos'
  },
  { 
    icon: Link2, 
    label: 'Integrações', 
    path: '/integracoes',
    description: 'APIs e conectores'
  },
  { 
    icon: Monitor, 
    label: 'Acesso Cliente', 
    path: '/cliente',
    description: 'Interface do cliente médico'
  }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuAction = (action: string) => {
    setIsDropdownOpen(false);
    
    switch (action) {
      case 'profile':
        console.log('Abrir perfil');
        break;
      case 'notifications':
        console.log('Abrir notificações');
        break;
      case 'security':
        console.log('Configurações de segurança');
        break;
      case 'logout':
        alert('Logout realizado!');
        signOut();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`bg-gray-900 h-screen flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-60'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7E5EF2' }}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">SevenScale</h1>
                <p className="text-gray-400 text-xs">Medical AI Platform</p>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto" style={{ backgroundColor: '#7E5EF2' }}>
              <Activity className="w-6 h-6 text-white" />
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#0468BF' } : {}}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm block truncate">{item.label}</span>
                    <span className="text-xs text-gray-400 block truncate">{item.description}</span>
                  </div>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer com Dropdown de Usuário */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">BM</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white text-sm font-medium truncate">Bruno Monteiro</p>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                  <span className="text-green-400 text-xs">Admin SevenScale</span>
                </div>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Overlay invisível para capturar cliques */}
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  {/* Meu Perfil */}
                  <button
                    onClick={() => handleMenuAction('profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <User className="w-5 h-5 text-gray-400" />
                    <span>Meu Perfil</span>
                  </button>

                  {/* Notificações */}
                  <button
                    onClick={() => handleMenuAction('notifications')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">3</span>
                      </div>
                    </div>
                    <span>Notificações</span>
                  </button>

                  {/* Segurança */}
                  <button
                    onClick={() => handleMenuAction('security')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span>Segurança</span>
                  </button>

                  {/* Divisor */}
                  <div className="border-t border-gray-200 my-1" />

                  {/* Sair */}
                  <button
                    onClick={() => handleMenuAction('logout')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative group"
              >
                <span className="text-white text-sm font-semibold">BM</span>
                <Circle className="w-3 h-3 fill-green-400 text-green-400 absolute -bottom-0.5 -right-0.5" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                  <div className="font-medium">Bruno Monteiro</div>
                  <div className="text-xs text-green-400">Admin SevenScale</div>
                </div>
              </button>

              {/* Dropdown Menu para modo collapsed */}
              {isDropdownOpen && (
                <>
                  {/* Overlay invisível */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  
                  <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    {/* Header do dropdown */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">BM</span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-sm font-medium">Bruno Monteiro</p>
                          <p className="text-green-600 text-xs">Admin SevenScale</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => handleMenuAction('profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-gray-400" />
                        <span>Meu Perfil</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction('notifications')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative">
                          <Bell className="w-5 h-5 text-gray-400" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">3</span>
                          </div>
                        </div>
                        <span>Notificações</span>
                      </button>

                      <button
                        onClick={() => handleMenuAction('security')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span>Segurança</span>
                      </button>

                      <div className="border-t border-gray-200 my-1" />

                      <button
                        onClick={() => handleMenuAction('logout')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5 text-red-500" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}