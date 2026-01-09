
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

interface ProgressItem {
  id: number;
  name: string;
  porcentagem: number;
}

interface ProcessProgressCardProps {
  data: ProgressItem[];
}

const ProcessProgressCard: React.FC<ProcessProgressCardProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-gray-100' : ''}>Andamento dos Processos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item.name}</span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item.porcentagem}%</span>
              </div>
              <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${item.porcentagem}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessProgressCard;
