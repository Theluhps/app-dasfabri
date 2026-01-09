
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Company } from '../data/companiesData';

interface CompanyStatsProps {
  companies: Company[];
}

const CompanyStats: React.FC<CompanyStatsProps> = ({ companies }) => {
  const clientCount = companies.filter(company => company.type === 'Cliente').length;
  const supplierCount = companies.filter(company => company.type === 'Fornecedor').length;
  const partnerCount = companies.filter(company => company.type === 'Parceiro').length;
  const totalCount = companies.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Estatísticas de Empresas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Clientes</h3>
            <p className="text-3xl font-bold">{clientCount}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Fornecedores</h3>
            <p className="text-3xl font-bold">{supplierCount}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">Parceiros</h3>
            <p className="text-3xl font-bold">{partnerCount}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">Total</h3>
            <p className="text-3xl font-bold">{totalCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyStats;
