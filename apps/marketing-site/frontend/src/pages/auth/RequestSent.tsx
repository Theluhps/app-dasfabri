import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RequestSent: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="flex items-center justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Solicitação Enviada!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sua solicitação de acesso foi enviada com sucesso. Nossa equipe irá analisar e você receberá um email quando for aprovado.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Enquanto isso, você pode:
          </p>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = 'https://dasfabri.com'}
            >
              Visitar nosso site
            </Button>
          </div>
        </div>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/auth/login" className="text-dasfabri-blue hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestSent; 