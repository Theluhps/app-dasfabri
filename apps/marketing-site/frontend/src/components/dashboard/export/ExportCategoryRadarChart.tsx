
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

const categoryData = [
  { category: 'Alimentos', valor: 150 },
  { category: 'Maquinário', valor: 120 },
  { category: 'Têxtil', valor: 90 },
  { category: 'Químicos', valor: 60 },
  { category: 'Automotivo', valor: 110 },
  { category: 'Tecnologia', valor: 80 },
];

const ExportCategoryRadarChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';

  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
          Exportação por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={80} data={categoryData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="category" tick={{ fill: textColor }} />
              <PolarRadiusAxis tick={{ fill: textColor }} />
              <Radar
                name="Valor"
                dataKey="valor"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip 
                contentStyle={{ backgroundColor, borderColor: gridColor }}
                labelStyle={{ color: textColor }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportCategoryRadarChart;
