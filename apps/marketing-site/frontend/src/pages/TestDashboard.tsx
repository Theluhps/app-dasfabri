import React from 'react';

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">✅ TESTE - Dashboard Funcionando!</h1>
        <p className="text-gray-600 mb-4">
          Se você está vendo esta página, significa que o bypass está funcionando!
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Informações do Sistema:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Hostname: {window.location.hostname}</li>
            <li>Token: {localStorage.getItem('auth_token') ? '✅ Existe' : '❌ Não existe'}</li>
            <li>Usuário: {localStorage.getItem('user') ? '✅ Existe' : '❌ Não existe'}</li>
          </ul>
        </div>
        <div className="mt-6">
          <a 
            href="/dashboard" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ir para Dashboard Real
          </a>
        </div>
      </div>
    </div>
  );
}
