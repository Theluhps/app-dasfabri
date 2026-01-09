/**
 * Utilitário para login demo em desenvolvimento
 * Cria um usuário mock automaticamente
 */

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  company_id: number;
}

export function createDemoUser(email: string = 'demo@dasfabri.com'): DemoUser {
  return {
    id: 1,
    name: email.includes('@') ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Usuário Demo',
    email: email || 'demo@dasfabri.com',
    role: 'admin',
    company_id: 1
  };
}

export function loginAsDemo(email?: string): void {
  const demoUser = createDemoUser(email);
  localStorage.setItem('auth_token', 'demo_token_' + Date.now());
  localStorage.setItem('user', JSON.stringify(demoUser));
  
  // Recarregar página para atualizar contexto
  window.location.href = '/module-selection';
}

// Auto-login em desenvolvimento
if (typeof window !== 'undefined') {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const hasToken = localStorage.getItem('auth_token');
  
  if (isDevelopment && !hasToken) {
    // Criar usuário demo automaticamente
    const demoUser = createDemoUser();
    localStorage.setItem('auth_token', 'demo_token_' + Date.now());
    localStorage.setItem('user', JSON.stringify(demoUser));
  }
}

