
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useModule } from '@/contexts/ModuleContext';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

// Mock data for demonstration
const crossModuleData = {
  importExport: [
    { name: 'Jan', importCount: 65, exportCount: 35 },
    { name: 'Feb', importCount: 59, exportCount: 40 },
    { name: 'Mar', importCount: 80, exportCount: 45 },
    { name: 'Apr', importCount: 81, exportCount: 55 },
    { name: 'May', importCount: 56, exportCount: 60 },
    { name: 'Jun', importCount: 55, exportCount: 45 },
  ],
  poShipment: [
    { name: 'Jan', poCount: 45, shipmentCount: 30 },
    { name: 'Feb', poCount: 50, shipmentCount: 35 },
    { name: 'Mar', poCount: 55, shipmentCount: 40 },
    { name: 'Apr', poCount: 60, shipmentCount: 45 },
    { name: 'May', poCount: 65, shipmentCount: 50 },
    { name: 'Jun', poCount: 70, shipmentCount: 55 },
  ],
  financialMetrics: [
    { name: 'Jan', payment: 40000, exchange: 35000 },
    { name: 'Feb', payment: 45000, exchange: 40000 },
    { name: 'Mar', payment: 50000, exchange: 45000 },
    { name: 'Apr', payment: 55000, exchange: 50000 },
    { name: 'May', payment: 60000, exchange: 55000 },
    { name: 'Jun', payment: 65000, exchange: 60000 },
  ],
};

const CrossModuleAnalytics: React.FC = () => {
  const { moduleColor } = useModule();
  const [activeTab, setActiveTab] = React.useState('import-export');
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: moduleColor }} />
            Análises Integradas
          </CardTitle>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            +12% crescimento
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="import-export">Importação vs Exportação</TabsTrigger>
            <TabsTrigger value="po-shipment">Pedidos vs Embarques</TabsTrigger>
            <TabsTrigger value="financial">Métricas Financeiras</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import-export">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={crossModuleData.importExport}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="importCount" name="Importações" fill="#7E69AB" />
                  <Bar dataKey="exportCount" name="Exportações" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground pt-2 text-center">
              Comparativo mensal entre processos de importação e exportação
            </p>
          </TabsContent>
          
          <TabsContent value="po-shipment">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={crossModuleData.poShipment}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="poCount" name="Pedidos" fill="#3B82F6" />
                  <Bar dataKey="shipmentCount" name="Embarques" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground pt-2 text-center">
              Relação entre pedidos de compra emitidos e embarques realizados
            </p>
          </TabsContent>
          
          <TabsContent value="financial">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={crossModuleData.financialMetrics}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="payment" name="Pagamentos" fill="#F59E0B" />
                  <Bar dataKey="exchange" name="Câmbio" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground pt-2 text-center">
              Valores de pagamentos e operações de câmbio processados mensalmente
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CrossModuleAnalytics;
