
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface ProcessFiltersProps {
  onSearch: (searchTerm: string, filters: any[]) => void;
  onReset: () => void;
}

const ProcessFilters: React.FC<ProcessFiltersProps> = ({ onSearch, onReset }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  
  const handleSearch = () => {
    const filters = [];
    
    if (status) {
      filters.push({ id: 'status', value: status });
    }
    
    if (origin) {
      filters.push({ id: 'origin', value: origin });
    }
    
    onSearch(searchTerm, filters);
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setStatus('');
    setOrigin('');
    onReset();
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            className={`pl-10 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
            placeholder="Buscar por ID, cliente ou produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="em-andamento">Em andamento</SelectItem>
            <SelectItem value="liberado">Liberado</SelectItem>
            <SelectItem value="aguardando-documentos">Aguardando documentos</SelectItem>
            <SelectItem value="em-analise">Em análise</SelectItem>
            <SelectItem value="documentacao-completa">Documentação completa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="china">China</SelectItem>
            <SelectItem value="alemanha">Alemanha</SelectItem>
            <SelectItem value="estados-unidos">Estados Unidos</SelectItem>
            <SelectItem value="india">Índia</SelectItem>
            <SelectItem value="japao">Japão</SelectItem>
            <SelectItem value="coreia-do-sul">Coreia do Sul</SelectItem>
            <SelectItem value="taiwan">Taiwan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
        <Button
          onClick={handleSearch}
          className="bg-[#7E69AB] hover:bg-[#6a5590] flex items-center gap-1"
        >
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default ProcessFilters;
