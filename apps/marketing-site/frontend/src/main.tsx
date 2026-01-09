import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './hooks/use-theme';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial', minHeight: '100vh', background: '#f5f5f5' }}>
          <h1 style={{ color: '#d32f2f' }}>❌ Erro ao carregar aplicação</h1>
          <p style={{ color: '#666' }}>Ocorreu um erro ao renderizar a aplicação.</p>
          <details style={{ marginTop: '20px', background: '#fff', padding: '15px', borderRadius: '4px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Detalhes do erro</summary>
            <pre style={{ marginTop: '10px', overflow: 'auto', fontSize: '12px' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '10px 20px', 
              marginTop: '20px', 
              cursor: 'pointer',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById('root');
if (!root) {
  console.error('❌ Elemento root não encontrado!');
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-family: Arial;">Erro: Elemento root não encontrado! Verifique o index.html</div>';
} else {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <ThemeProvider>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </ThemeProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('✅ Aplicação renderizada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao renderizar:', error);
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <h1 style="color: red;">Erro ao renderizar aplicação</h1>
        <p>Verifique o console para mais detalhes.</p>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto; font-size: 12px;">${error}</pre>
      </div>
    `;
  }
}
