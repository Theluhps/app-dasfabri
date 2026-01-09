import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { watchlistService } from '@/services/watchlistService';
import { Process } from '@/components/import/processes/data/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface WatchlistWidgetProps {
  maxItems?: number;
  className?: string;
}

const WatchlistWidget: React.FC<WatchlistWidgetProps> = ({ 
  maxItems = 5,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await watchlistService.getFavorites({ limit: maxItems });
      setFavorites(data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      // Fallback: usar localStorage
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites([]); // Mock data would go here
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProcess = (process: Process) => {
    const processNumber = process.id.split('-').pop();
    navigate(`/import/process/${processNumber}`);
  };

  const handleViewAll = () => {
    navigate('/watchlist');
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            Processos Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#7E69AB]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          Processos Favoritos
          {favorites.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {favorites.length}
            </Badge>
          )}
        </CardTitle>
        {favorites.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleViewAll}>
            Ver todos
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Nenhum processo favoritado ainda</p>
            <p className="text-xs mt-2">Clique na estrela nos processos para adicionar aos favoritos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((process) => (
              <div
                key={process.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleViewProcess(process)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{process.id}</p>
                    <Badge variant="outline" className="text-xs">
                      {process.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {process.product} - {process.client}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProcess(process);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {favorites.length >= maxItems && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={handleViewAll}
              >
                Ver todos os favoritos
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistWidget;

