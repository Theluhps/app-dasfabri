
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import ProcessFilters from '@/components/import/ProcessFilters';

interface ProcessesFiltersCardProps {
  theme: string;
  onSearch: (searchTerm: string, filters: any[]) => void;
  onReset: () => void;
}

const ProcessesFiltersCard: React.FC<ProcessesFiltersCardProps> = ({
  theme,
  onSearch,
  onReset
}) => {
  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
          <Filter className="h-5 w-5 text-[#7E69AB]" />
          Filtros
        </CardTitle>
        <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
          Filtre os processos por cliente, status, produto ou origem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProcessFilters
          onSearch={onSearch}
          onReset={onReset}
        />
      </CardContent>
    </Card>
  );
};

export default ProcessesFiltersCard;
