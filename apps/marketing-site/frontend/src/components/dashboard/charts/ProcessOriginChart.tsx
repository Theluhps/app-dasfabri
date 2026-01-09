
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ProcessOriginChartProps {
  data: Array<{ name: string; value: number }>;
}

const ProcessOriginChart: React.FC<ProcessOriginChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
          Processos por Origem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={20}
              layout="vertical"
            >
              <XAxis type="number" tick={{ fill: textColor }} />
              <YAxis dataKey="name" type="category" tick={{ fill: textColor }} width={80} />
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <Tooltip 
                contentStyle={{ backgroundColor, borderColor: gridColor }}
                labelStyle={{ color: textColor }}
              />
              <Bar dataKey="value" name="Processos" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessOriginChart;
