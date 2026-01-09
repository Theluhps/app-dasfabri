
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RecentDocuments: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium">Contrato de Prestação</p>
                <p className="text-sm text-gray-500">Empresa ABC Ltda</p>
              </div>
            </div>
            <Badge>10/05/2025</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium">Termo de Parceria</p>
                <p className="text-sm text-gray-500">Global Trading Corp</p>
              </div>
            </div>
            <Badge>05/05/2025</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium">Acordo de Confidencialidade</p>
                <p className="text-sm text-gray-500">XYZ Importadora S.A.</p>
              </div>
            </div>
            <Badge>02/05/2025</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDocuments;
