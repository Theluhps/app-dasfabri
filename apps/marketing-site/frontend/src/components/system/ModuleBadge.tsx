
import { useModule } from "@/contexts/ModuleContext";
import { MODULES } from "@/types/modules";
import { Badge } from "@/components/ui/badge";
import { Package, PackageCheck, DollarSign, FileText, Ship } from "lucide-react";

export default function ModuleBadge() {
  const { currentModule } = useModule();
  
  const moduleColors: Record<string, string> = {
    'import_full': 'bg-[#7E69AB] hover:bg-[#6a5590] text-white',
    'po_management': 'bg-blue-500 hover:bg-blue-600 text-white',
    'shipment_management': 'bg-green-500 hover:bg-green-600 text-white',
    'payment_documents': 'bg-amber-500 hover:bg-amber-600 text-white',
  };
  
  const moduleIcons = {
    'import_full': <Package className="h-3 w-3" />,
    'po_management': <PackageCheck className="h-3 w-3" />,
    'shipment_management': <Ship className="h-3 w-3" />,
    'payment_documents': <DollarSign className="h-3 w-3" />,
  };
  
  const module = MODULES[currentModule];
  const colorClass = moduleColors[currentModule] || 'bg-gray-500';
  const icon = moduleIcons[currentModule] || <FileText className="h-3 w-3" />;
  
  return (
    <Badge className={`flex items-center gap-1 ${colorClass}`}>
      {icon}
      {module.name}
    </Badge>
  );
}
