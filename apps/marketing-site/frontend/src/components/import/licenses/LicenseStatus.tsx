
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type LicenseStatus = 'Em análise' | 'Aprovada' | 'Rejeitada' | 'Pendente' | 'Expirada' | 'Deferida';

interface License {
  id: string;
  number: string;
  type: string;
  status: LicenseStatus;
  issueDate: Date | string;
  expirationDate: Date | string;
  requestDate: Date | string;
  productDescription: string;
  ncm?: string;
  comments?: string;
  processId: string;
}

interface LicenseStatusProps {
  license: License;
  onView?: (license: License) => void;
}

const LicenseStatus: React.FC<LicenseStatusProps> = ({ license, onView }) => {
  const getStatusColor = (status: LicenseStatus) => {
    switch (status) {
      case 'Aprovada':
      case 'Deferida':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
      case 'Em análise':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeitada':
        return 'bg-red-100 text-red-800';
      case 'Expirada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: LicenseStatus) => {
    switch (status) {
      case 'Aprovada':
      case 'Deferida':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pendente':
      case 'Em análise':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Rejeitada':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'Expirada':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <FileCheck className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatDate = (date: Date | string): string => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return String(date);
    }
  };
  
  const getDaysUntilExpiration = (expirationDate: Date | string): number => {
    if (!expirationDate) return 0;
    try {
      const expDate = new Date(expirationDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (e) {
      return 0;
    }
  };

  const daysUntilExpiration = getDaysUntilExpiration(license.expirationDate);

  return (
    <Card className="border-t-2 border-t-[#7E69AB] shadow-sm">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#7E69AB]" />
              {license.type}
            </CardTitle>
            <CardDescription>
              Número: {license.number}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(license.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(license.status)}
              {license.status}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Solicitação</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {formatDate(license.requestDate)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Emissão</p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-500" />
                {formatDate(license.issueDate)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Data de Expiração</p>
              <div className="flex justify-between items-center">
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {formatDate(license.expirationDate)}
                </p>
                {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    {daysUntilExpiration} dias restantes
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">NCM</p>
              <p>{license.ncm || 'Não informado'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Descrição do Produto</p>
            <p className="text-sm bg-gray-50 p-2 rounded-md border mt-1">
              {license.productDescription}
            </p>
          </div>
          
          {license.comments && (
            <div>
              <p className="text-sm font-medium text-gray-500">Observações</p>
              <p className="text-sm bg-gray-50 p-2 rounded-md border mt-1">
                {license.comments}
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView && onView(license)}
              className="text-[#7E69AB] border-[#7E69AB] hover:bg-[#7E69AB]/10"
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LicenseStatus;
