
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const supplierData = [
  { name: 'China', value: 45 },
  { name: 'Índia', value: 20 },
  { name: 'Alemanha', value: 15 },
  { name: 'Taiwan', value: 12 },
  { name: 'Outros', value: 8 },
];

const monthlyOrderData = [
  { name: 'Jan', pedidos: 12, valor: 150000 },
  { name: 'Fev', pedidos: 15, valor: 180000 },
  { name: 'Mar', pedidos: 18, valor: 220000 },
  { name: 'Abr', pedidos: 22, valor: 280000 },
  { name: 'Mai', pedidos: 25, valor: 310000 },
];

const categoryData = [
  { name: 'Eletrônicos', value: 35 },
  { name: 'Têxtil', value: 25 },
  { name: 'Maquinário', value: 20 },
  { name: 'Químicos', value: 10 },
  { name: 'Outros', value: 10 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

const ReportsContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Relatórios de Pedidos</h2>
        <p className="text-gray-500">
          Visualize estatísticas e relatórios sobre seus pedidos de compra internacionais
        </p>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pedidos por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyOrderData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pedidos" fill="#8884d8" name="Número de Pedidos" />
                    <Bar dataKey="valor" fill="#82ca9d" name="Valor Total (USD)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Distribuição de Fornecedores por País</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={supplierData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {supplierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Distribuição de Produtos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsContent;
