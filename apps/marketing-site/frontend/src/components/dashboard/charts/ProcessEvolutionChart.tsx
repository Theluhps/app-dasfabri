
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ProcessEvolutionChartProps {
  data: Array<{ month: string; processos: number }>;
}

const ProcessEvolutionChart: React.FC<ProcessEvolutionChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
          Evolução de Processos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: textColor }} />
              <YAxis tick={{ fill: textColor }} />
              <Tooltip 
                contentStyle={{ backgroundColor, borderColor: gridColor }}
                labelStyle={{ color: textColor }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="processos"
                name="Processos"
                stroke="#3B82F6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessEvolutionChart;
