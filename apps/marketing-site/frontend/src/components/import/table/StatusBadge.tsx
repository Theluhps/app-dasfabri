
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Function to get the color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Liberado': return 'bg-green-100 text-green-800';
      case 'Aguardando documentos': return 'bg-yellow-100 text-yellow-800';
      case 'Em análise': return 'bg-purple-100 text-purple-800';
      case 'Documentação completa': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
      getStatusColor(status)
    }`}>
      {status}
    </span>
  );
};

export default StatusBadge;
