
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { StatCardData } from './modules/dashboardData';

interface StatCardsGridProps {
  cards: StatCardData[];
}

const StatCardsGrid: React.FC<StatCardsGridProps> = ({ cards }) => {
  // Função para determinar href baseado no título do card
  const getHrefForCard = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('total') || titleLower.includes('processos')) {
      return '/import/processes';
    }
    if (titleLower.includes('liberado')) {
      return '/import/processes?status=liberado';
    }
    if (titleLower.includes('trânsito') || titleLower.includes('transito')) {
      return '/import/processes?status=em_transito';
    }
    if (titleLower.includes('pendente') || titleLower.includes('pendência')) {
      return '/import/processes?status=pendencias';
    }
    if (titleLower.includes('ativo') || titleLower.includes('ativa')) {
      return '/import/processes?status=ativo';
    }
    if (titleLower.includes('pagamento') || titleLower.includes('financeiro')) {
      return '/financial/payments';
    }
    if (titleLower.includes('alerta')) {
      return '/notifications/center';
    }
    return undefined;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard 
          key={index}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          color={card.color}
          href={(card as any).href || getHrefForCard(card.title)}
        />
      ))}
    </div>
  );
};

export default StatCardsGrid;
