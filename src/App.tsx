import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { DashboardProvider } from './context/DashboardContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Integrations from './pages/Integrations';
import ClientAccess from './pages/ClientAccess';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ApiProvider>
        <DashboardProvider>
          <Router>
            <Routes>
              {/* Rota de autenticação */}
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="clientes" element={<Clients />} />
                <Route path="integracoes" element={<Integrations />} />
                <Route path="cliente" element={<ClientAccess />} />
              </Route>
            </Routes>
          </Router>
        </DashboardProvider>
      </ApiProvider>
    </AuthProvider>
  );
}

export default App;