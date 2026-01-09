
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

const performanceMetrics = [
  { 
    id: 1, 
    name: 'Tempo médio de liberação', 
    current: 8.5, 
    previous: 10.2, 
    unit: 'dias',
    change: 'decrease',
    target: 9
  },
  { 
    id: 2, 
    name: 'Taxa de conformidade', 
    current: 98.3, 
    previous: 97.1, 
    unit: '%',
    change: 'increase',
    target: 98
  },
  { 
    id: 3, 
    name: 'Custo médio por processo', 
    current: 2850, 
    previous: 3100, 
    unit: 'USD',
    change: 'decrease',
    target: 3000
  },
  { 
    id: 4, 
    name: 'Tempo em inspeção aduaneira', 
    current: 3.2, 
    previous: 3.5, 
    unit: 'dias',
    change: 'decrease',
    target: 3
  },
  { 
    id: 5, 
    name: 'Processos com atraso', 
    current: 4.8, 
    previous: 7.2, 
    unit: '%',
    change: 'decrease',
    target: 5
  }
];

const ImportPerformance = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-gray-100' : ''}>
          Performance e KPIs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric) => (
            <div 
              key={metric.id} 
              className={`p-4 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {metric.name}
                </span>
                <span 
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    metric.current < metric.target && metric.change === 'decrease' ? 'bg-green-100 text-green-800' :
                    metric.current > metric.target && metric.change === 'increase' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <Target className="h-3 w-3" />
                  {metric.current < metric.target && metric.change === 'decrease' ? 'Na meta' :
                   metric.current > metric.target && metric.change === 'increase' ? 'Na meta' :
                   'Fora da meta'}
                </span>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <div className="text-xl font-semibold">
                  {metric.unit === 'USD' ? `$${metric.current.toLocaleString()}` : `${metric.current}${metric.unit}`}
                </div>
                <div className={`text-xs flex items-center ${metric.change === 'decrease' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change === 'decrease' 
                    ? <><ArrowDownRight className="h-3 w-3 mr-0.5" /> {((metric.previous - metric.current) / metric.previous * 100).toFixed(1)}%</> 
                    : <><ArrowUpRight className="h-3 w-3 mr-0.5" /> {((metric.current - metric.previous) / metric.previous * 100).toFixed(1)}%</>}
                </div>
              </div>
              <div className="mt-1">
                <div className="text-xs text-muted-foreground">
                  Meta: {metric.unit === 'USD' ? `$${metric.target.toLocaleString()}` : `${metric.target}${metric.unit}`}
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    metric.current < metric.target && metric.change === 'decrease' ? 'bg-green-500' :
                    metric.current > metric.target && metric.change === 'increase' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`} 
                  style={{ 
                    width: `${metric.change === 'decrease' 
                      ? 100 - Math.min((metric.current / metric.target) * 100, 100) + 100 
                      : Math.min((metric.current / metric.target) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportPerformance;
