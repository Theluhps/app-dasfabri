
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

const performanceData = [
  {
    month: 'Jan',
    planejado: 100000,
    realizado: 120000,
  },
  {
    month: 'Feb',
    planejado: 150000,
    realizado: 180000,
  },
  {
    month: 'Mar',
    planejado: 180000,
    realizado: 150000,
  },
  {
    month: 'Apr',
    planejado: 200000,
    realizado: 220000,
  },
  {
    month: 'May',
    planejado: 250000,
    realizado: 300000,
  },
];

const ExportPerformanceBarChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
          Desempenho vs. Planejado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: textColor }} />
              <YAxis 
                tick={{ fill: textColor }}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor, borderColor: gridColor }}
                labelStyle={{ color: textColor }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Valor']}
              />
              <Legend />
              <Bar dataKey="planejado" name="Planejado" fill="#64748b" />
              <Bar dataKey="realizado" name="Realizado" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportPerformanceBarChart;
