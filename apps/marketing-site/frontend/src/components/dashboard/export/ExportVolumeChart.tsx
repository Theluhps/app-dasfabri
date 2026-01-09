
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

const areaData = [
  { month: 'Jan', valor: 120000 },
  { month: 'Feb', valor: 180000 },
  { month: 'Mar', valor: 150000 },
  { month: 'Apr', valor: 220000 },
  { month: 'May', valor: 300000 },
];

const ExportVolumeChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';

  return (
    <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : ''} lg:col-span-2`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
          Volume de Exportação (USD)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={areaData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="valor"
                name="Valor"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportVolumeChart;
