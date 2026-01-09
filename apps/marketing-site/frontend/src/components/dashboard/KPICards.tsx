
import React from 'react';
import { FileText, TrendingUp, Ship, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';

const KPICards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Processos"
        value="156"
        description="+12% em relação ao mês passado"
        trend="up"
        icon={<FileText size={18} />}
        color="blue"
        href="/import/processes"
      />
      <StatCard
        title="Processos Liberados"
        value="89"
        description="+5% em relação ao mês passado"
        trend="up"
        icon={<TrendingUp size={18} />}
        color="green"
        href="/import/processes?status=liberado"
      />
      <StatCard
        title="Em Trânsito"
        value="32"
        description="12 chegando esta semana"
        icon={<Ship size={18} />}
        color="purple"
        href="/import/processes?status=em_transito"
      />
      <StatCard
        title="Pendências"
        value="14"
        description="3 críticas requerem atenção"
        trend="down"
        icon={<AlertTriangle size={18} />}
        color="red"
        href="/import/processes?status=pendencias"
      />
    </div>
  );
};

export default KPICards;
