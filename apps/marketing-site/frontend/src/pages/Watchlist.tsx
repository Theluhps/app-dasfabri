import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, RefreshCw, Loader2 } from 'lucide-react';
import { watchlistService } from '@/services/watchlistService';
import { Process } from '@/components/import/processes/data/types';
import { useToast } from '@/hooks/use-toast';
import ProcessesTable from '@/components/import/ProcessesTable';
import { useNavigate } from 'react-router-dom';

const Watchlist: React.FC = () => {
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
      const data = await watchlistService.getFavorites({ limit: 100 });
      setFavorites(data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os processos favoritos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDetails = (process: Process) => {
    const processNumber = process.id.split('-').pop();
    navigate(`/import/process/${processNumber}`);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
              Processos Favoritos
            </h1>
            <p className="text-muted-foreground mt-2">
              Acompanhe seus processos prioritários em um só lugar
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadFavorites}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Favoritos</CardTitle>
            <CardDescription>
              {favorites.length} {favorites.length === 1 ? 'processo favoritado' : 'processos favoritados'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#7E69AB]" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Nenhum processo favoritado</h3>
                <p className="text-muted-foreground mb-4">
                  Clique na estrela nos processos para adicionar aos favoritos
                </p>
                <Button onClick={() => navigate('/import/processes')}>
                  Ver Processos
                </Button>
              </div>
            ) : (
              <ProcessesTable
                processes={favorites}
                handleShowDetails={handleShowDetails}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Watchlist;

