import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Clock, Loader2, TestTube } from 'lucide-react';

interface TestConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    logo: string;
  } | null;
}

interface TestResult {
  test: string;
  status: 'success' | 'warning' | 'error' | 'testing';
  message: string;
  duration?: number;
}

export default function TestConnectionModal({ isOpen, onClose, integration }: TestConnectionModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState(0);

  const tests = [
    { name: 'Autenticação', key: 'auth' },
    { name: 'Permissões', key: 'permissions' },
    { name: 'Latência', key: 'latency' },
    { name: 'Endpoints', key: 'endpoints' },
    { name: 'Rate Limits', key: 'rateLimit' }
  ];

  useEffect(() => {
    if (isOpen && integration) {
      setResults([]);
      setCurrentTest(0);
      setIsRunning(false);
    }
  }, [isOpen, integration]);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setCurrentTest(0);

    for (let i = 0; i < tests.length; i++) {
      setCurrentTest(i);
      
      // Initialize test as running
      const testResult: TestResult = {
        test: tests[i].name,
        status: 'testing',
        message: 'Executando teste...'
      };
      
      setResults(prev => [...prev.slice(0, i), testResult]);

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate random result
      const success = Math.random() > 0.2; // 80% success rate
      const duration = Math.floor(50 + Math.random() * 200);
      
      const finalResult: TestResult = {
        test: tests[i].name,
        status: success ? 'success' : (Math.random() > 0.5 ? 'warning' : 'error'),
        message: success 
          ? `Teste concluído com sucesso (${duration}ms)`
          : 'Falha na verificação - verifique configurações',
        duration
      };

      setResults(prev => [...prev.slice(0, i), finalResult]);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'testing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-amber-700';
      case 'error':
        return 'text-red-700';
      case 'testing':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  if (!isOpen || !integration) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{integration.logo}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Testar Conexão - {integration.name}
                </h3>
                <p className="text-gray-600">Verificação completa da integração</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Test Progress */}
          {isRunning && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Executando testes... ({currentTest + 1}/{tests.length})
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentTest + 1) / tests.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentTest + 1) / tests.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="space-y-4 mb-6">
            {tests.map((test, index) => {
              const result = results[index];
              const isCompleted = result && result.status !== 'testing';
              const isCurrent = isRunning && index === currentTest;
              
              return (
                <div 
                  key={test.key}
                  className={`p-4 rounded-lg border ${
                    result 
                      ? result.status === 'success' ? 'border-green-200 bg-green-50' :
                        result.status === 'warning' ? 'border-amber-200 bg-amber-50' :
                        result.status === 'error' ? 'border-red-200 bg-red-50' :
                        'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {result ? getStatusIcon(result.status) : <Clock className="w-4 h-4 text-gray-400" />}
                      <div>
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        {result && (
                          <p className={`text-sm ${getStatusColor(result.status)}`}>
                            {result.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {isCompleted && result.duration && (
                      <span className="text-xs text-gray-500 font-mono">
                        {result.duration}ms
                      </span>
                    )}
                    {isCurrent && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-blue-600">Testando...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {results.length === tests.length && !isRunning && (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Resumo dos Testes</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {results.filter(r => r.status === 'success').length}
                  </p>
                  <p className="text-sm text-gray-600">Sucessos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">
                    {results.filter(r => r.status === 'warning').length}
                  </p>
                  <p className="text-sm text-gray-600">Avisos</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">
                    {results.filter(r => r.status === 'error').length}
                  </p>
                  <p className="text-sm text-gray-600">Erros</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Executar Testes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}