
import React from 'react';
import { useModule } from '@/contexts/ModuleContext';
import { ModuleType, MODULES } from '@/types/modules';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Package, PackageCheck, DollarSign, Ship } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModuleSelectorProps {
  onSelect?: () => void;
}

export default function ModuleSelector({ onSelect }: ModuleSelectorProps) {
  const { userModules, currentModule, setCurrentModule, isAdmin, isManager } = useModule();
  const navigate = useNavigate();
  
  // Determine which modules to show
  const availableModules = isAdmin || isManager 
    ? Object.keys(MODULES) as ModuleType[]
    : userModules;

  const getModuleIcon = (moduleId: ModuleType) => {
    switch(moduleId) {
      case 'import_full':
        return <Package className="h-6 w-6 text-[#7E69AB]" />;
      case 'po_management':
        return <PackageCheck className="h-6 w-6 text-blue-500" />;
      case 'shipment_management':
        return <Ship className="h-6 w-6 text-green-500" />;
      case 'payment_documents':
        return <DollarSign className="h-6 w-6 text-amber-500" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const handleSelectModule = (moduleId: ModuleType) => {
    setCurrentModule(moduleId);
    if (onSelect) {
      onSelect();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {availableModules.map((moduleId) => {
        const module = MODULES[moduleId];
        const isActive = moduleId === currentModule;
        const moduleColor = module.color || '#7E69AB';
        
        return (
          <Card 
            key={moduleId}
            className={`cursor-pointer hover:border-[${moduleColor}] transition-all ${
              isActive ? `border-[${moduleColor}] border-2 bg-[${moduleColor}]/10` : ''
            }`}
            onClick={() => handleSelectModule(moduleId)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {getModuleIcon(moduleId)}
                {isActive && (
                  <span className={`bg-[${moduleColor}] text-white p-1 rounded-full`}>
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ul className="text-xs space-y-1">
                {module.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-[${moduleColor}]`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={isActive ? "default" : "outline"} 
                className={isActive ? `bg-[${moduleColor}] hover:bg-[${moduleColor}]/90 w-full` : "w-full"}
              >
                {isActive ? 'Módulo Ativo' : 'Selecionar Módulo'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
