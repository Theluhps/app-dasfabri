
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';

const exchangeRateData = [
  { date: '01/05', usd: 5.21, eur: 5.65 },
  { date: '02/05', usd: 5.18, eur: 5.62 },
  { date: '03/05', usd: 5.22, eur: 5.68 },
  { date: '04/05', usd: 5.25, eur: 5.71 },
  { date: '05/05', usd: 5.20, eur: 5.67 },
  { date: '06/05', usd: 5.19, eur: 5.66 },
  { date: '07/05', usd: 5.23, eur: 5.69 },
  { date: '08/05', usd: 5.22, eur: 5.68 },
  { date: '09/05', usd: 5.23, eur: 5.70 },
  { date: '10/05', usd: 5.25, eur: 5.72 },
  { date: '11/05', usd: 5.27, eur: 5.74 },
  { date: '12/05', usd: 5.28, eur: 5.75 },
  { date: '13/05', usd: 5.24, eur: 5.71 },
  { date: '14/05', usd: 5.23, eur: 5.70 },
  { date: '15/05', usd: 5.23, eur: 5.68 },
];

const cashflowData = [
  { month: 'Jan', entrada: 350000, saida: 320000, saldo: 30000 },
  { month: 'Feb', entrada: 380000, saida: 350000, saldo: 30000 },
  { month: 'Mar', entrada: 400000, saida: 380000, saldo: 20000 },
  { month: 'Apr', entrada: 450000, saida: 420000, saldo: 30000 },
  { month: 'May', entrada: 480000, saida: 460000, saldo: 20000 },
];

const operationsData = [
  { type: 'Compra USD', amount: 450000 },
  { type: 'Venda USD', amount: 380000 },
  { type: 'Compra EUR', amount: 320000 },
  { type: 'Venda EUR', amount: 280000 },
  { type: 'Venda GBP', amount: 150000 },
];

const contractsData = [
  { status: 'Liquidado', count: 15, value: 350000 },
  { status: 'Contratado', count: 8, value: 180000 },
  { status: 'Em andamento', count: 5, value: 120000 },
];

const FinancialDashboard: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#E5E7EB' : '#374151';
  const gridColor = isDark ? '#374151' : '#E5E7EB';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';

  // Dados de resumo financeiro
  const financialSummary = [
    {
      title: 'Saldo Total',
      value: 'R$ 2.450.000',
      change: '+12.5%',
      trend: 'up',
      description: 'Em relação ao mês anterior',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'blue',
      href: '/financial/dashboard'
    },
    {
      title: 'Receitas do Mês',
      value: 'R$ 480.000',
      change: '+8.2%',
      trend: 'up',
      description: 'Maio 2025',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'green',
      href: '/financial/payments?status=pago'
    },
    {
      title: 'Despesas do Mês',
      value: 'R$ 460.000',
      change: '-3.1%',
      trend: 'down',
      description: 'Maio 2025',
      icon: <TrendingDown className="h-5 w-5" />,
      color: 'red',
      href: '/financial/payments?status=pagamento'
    },
    {
      title: 'Operações de Câmbio',
      value: '28',
      change: '+5',
      trend: 'up',
      description: 'Este mês',
      icon: <ArrowUpRight className="h-5 w-5" />,
      color: 'purple',
      href: '/financial/exchange'
    }
  ];

  const getSummaryCardClass = (index: number) => {
    const baseClasses = "p-4 rounded-lg flex flex-col";
    
    switch (index) {
      case 0:
        return `${baseClasses} ${isDark ? 'bg-blue-900/50' : 'bg-blue-50'}`;
      case 1:
        return `${baseClasses} ${isDark ? 'bg-green-900/50' : 'bg-green-50'}`;
      case 2:
        return `${baseClasses} ${isDark ? 'bg-purple-900/50' : 'bg-purple-50'}`;
      default:
        return baseClasses;
    }
  };
  
  const getSummaryTextClass = (index: number) => {
    switch (index) {
      case 0:
        return isDark ? 'text-blue-300' : 'text-blue-800';
      case 1:
        return isDark ? 'text-green-300' : 'text-green-800';
      case 2:
        return isDark ? 'text-purple-300' : 'text-purple-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialSummary.map((item, index) => (
          <Card 
            key={index}
            className={`cursor-pointer hover:shadow-lg transition-shadow ${isDark ? 'bg-gray-800 border-gray-700' : ''} border-l-4 ${
              item.color === 'blue' ? 'border-l-blue-500' :
              item.color === 'green' ? 'border-l-green-500' :
              item.color === 'red' ? 'border-l-red-500' :
              'border-l-purple-500'
            }`}
            onClick={() => item.href && navigate(item.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.title}
              </CardTitle>
              <div className={`${
                item.color === 'blue' ? 'text-blue-500' :
                item.color === 'green' ? 'text-green-500' :
                item.color === 'red' ? 'text-red-500' :
                'text-purple-500'
              }`}>
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isDark ? 'text-gray-100' : ''}`}>
                {item.value}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs flex items-center gap-1 ${
                  item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {item.change}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards de Contratos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contractsData.map((item, index) => (
          <Card 
            key={index}
            className={`cursor-pointer hover:shadow-md transition-shadow ${getSummaryCardClass(index)} ${isDark ? 'border-gray-700' : ''}`}
            onClick={() => navigate('/financial/exchange')}
          >
            <div className="p-4">
              <p className={`text-sm ${getSummaryTextClass(index)}`}>
                Contratos {item.status}
              </p>
              <p className={`text-2xl font-bold mt-1 ${getSummaryTextClass(index)}`}>
                {item.count}
              </p>
              <p className={`text-sm ${getSummaryTextClass(index)}`}>
                R$ {item.value.toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
                  Taxas de Câmbio - Últimos 15 dias
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-400' : ''}>
                  Acompanhe a evolução das cotações
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/financial/exchange')}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={exchangeRateData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" tick={{ fill: textColor }} />
                  <YAxis 
                    tick={{ fill: textColor }} 
                    domain={['dataMin - 0.05', 'dataMax + 0.05']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor, borderColor: gridColor }}
                    labelStyle={{ color: textColor }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usd"
                    name="USD"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="eur"
                    name="EUR"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
                  Operações por Moeda
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-400' : ''}>
                  Volume de operações realizadas
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/financial/exchange')}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Ver Detalhes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={operationsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="type" tick={{ fill: textColor }} />
                  <YAxis 
                    tick={{ fill: textColor }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor, borderColor: gridColor }}
                    labelStyle={{ color: textColor }}
                    formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Valor']}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Valor" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-lg ${isDark ? 'text-gray-100' : ''}`}>
                Fluxo de Caixa
              </CardTitle>
              <CardDescription className={isDark ? 'text-gray-400' : ''}>
                Entradas, saídas e saldo mensal
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/financial/payments')}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Ver Detalhes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cashflowData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fill: textColor }} />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: textColor }}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fill: textColor }}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor, borderColor: gridColor }}
                  labelStyle={{ color: textColor }}
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="entrada" name="Entrada" fill="#10B981" />
                <Bar yAxisId="left" dataKey="saida" name="Saída" fill="#EF4444" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="saldo"
                  name="Saldo"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;
