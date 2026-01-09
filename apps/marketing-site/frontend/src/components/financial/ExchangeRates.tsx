
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Plus, FileDown, RefreshCw, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExchangeRate {
  id: string;
  currency: string;
  rate: number;
  variation: number;
  lastUpdate: string;
}

const ExchangeRates: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRates(mockRates);
      setLoading(false);
    }, 500);
  };

  const mockRates: ExchangeRate[] = [
    {
      id: 'USD',
      currency: 'Dólar Americano',
      rate: 5.02,
      variation: 0.75,
      lastUpdate: '11/05/2025 14:30'
    },
    {
      id: 'EUR',
      currency: 'Euro',
      rate: 5.45,
      variation: -0.25,
      lastUpdate: '11/05/2025 14:30'
    },
    {
      id: 'GBP',
      currency: 'Libra Esterlina',
      rate: 6.38,
      variation: 0.15,
      lastUpdate: '11/05/2025 14:30'
    },
    {
      id: 'CNY',
      currency: 'Yuan Chinês',
      rate: 0.78,
      variation: -0.12,
      lastUpdate: '11/05/2025 14:30'
    },
    {
      id: 'JPY',
      currency: 'Iene Japonês',
      rate: 0.0468,
      variation: 0.05,
      lastUpdate: '11/05/2025 14:30'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getVariationBadge = (variation: number) => {
    if (variation > 0) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          +{variation.toFixed(2)}%
          <TrendingUp className="h-3 w-3" />
        </Badge>
      );
    } else if (variation < 0) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          {variation.toFixed(2)}%
          <TrendingUp className="h-3 w-3 transform rotate-180" />
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          0.00%
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Taxas de Câmbio</CardTitle>
          <CardDescription>Cotação atual das principais moedas</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchRates}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando taxas de câmbio...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Moeda</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Cotação (BRL)</TableHead>
                <TableHead className="text-right">Variação</TableHead>
                <TableHead className="text-right">Última Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.currency}</TableCell>
                  <TableCell>{rate.id}</TableCell>
                  <TableCell className="text-right">{formatCurrency(rate.rate)}</TableCell>
                  <TableCell className="text-right">{getVariationBadge(rate.variation)}</TableCell>
                  <TableCell className="text-right">{rate.lastUpdate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ExchangeRates;
