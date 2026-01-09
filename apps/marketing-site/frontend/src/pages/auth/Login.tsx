
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#email') as HTMLInputElement;
    const passwordInput = form.querySelector('#password') as HTMLInputElement;
    const email = emailInput?.value || 'demo@dasfabri.com';
    const password = passwordInput?.value || 'demo123';
    
    // Criar usuário mock diretamente (modo desenvolvimento)
    const mockUser = {
      id: 1,
      name: email.includes('@') ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Usuário Demo',
      email: email || 'demo@dasfabri.com',
      role: 'admin' as const,
      company_id: 1
    };
    
    // Salvar token e usuário
    localStorage.setItem('auth_token', 'demo_token_' + Date.now());
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast({
      title: "Login bem-sucedido (Modo Demo)",
      description: "Redirecionando...",
    });
    
    // Redirecionar para dashboard (rota que existe)
    window.location.href = '/dashboard';
  };

  const handleRegisterClick = () => {
    navigate('/auth/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-dasfabri-blue rounded-md w-16 h-16 flex items-center justify-center">
              <img 
                src="/images/dasfabri-logo-icon.png" 
                alt="Dasfabri" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Dasfabri</h1>
          <p className="text-gray-600 mt-2">
            Sistema de gestão de importação e exportação
          </p>
        </div>
        
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Acesso ao sistema</CardTitle>
            <CardDescription className="text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Senha</Label>
                  <a href="#" className="text-sm text-dasfabri-blue hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  className="bg-white border-gray-300 text-gray-900"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white font-medium px-4 py-2 h-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Entrar
              </button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-white">
            <div className="text-center text-sm text-gray-600">
              Não tem uma conta ainda?{' '}
              <a 
                onClick={handleRegisterClick}
                className="text-dasfabri-blue hover:underline cursor-pointer"
              >
                Registre-se
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
