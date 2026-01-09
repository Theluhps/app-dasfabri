
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  ProcessFormValues, 
  importTypes, 
  shippingMethods, 
  incoterms,
  packageTypes,
  containerTypes
} from './FormSchema';
import { 
  TextFormField, 
  SelectFormField, 
  DateFormField,
  NumberFormField
} from './FormFields';

interface ImportDetailsSectionProps {
  form: UseFormReturn<ProcessFormValues>;
}

const ImportDetailsSection: React.FC<ImportDetailsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Detalhes da Importação</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectFormField
          form={form}
          name="importType"
          label="Tipo de Importação"
          options={importTypes}
          placeholder="Selecione o tipo de importação"
        />
        
        <TextFormField
          form={form}
          name="origin"
          label="Origem"
          placeholder="País de origem"
        />

        <SelectFormField
          form={form}
          name="incoterm"
          label="Incoterm"
          options={incoterms}
          placeholder="Selecione o incoterm"
        />
        
        <SelectFormField
          form={form}
          name="shippingMethod"
          label="Método de Transporte"
          options={shippingMethods}
          placeholder="Selecione o método de transporte"
        />

        <DateFormField
          form={form}
          name="estimatedArrival"
          label="Previsão de Chegada"
        />
        
        <TextFormField
          form={form}
          name="customsBroker"
          label="Despachante Aduaneiro"
          placeholder="Nome do despachante"
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-md font-medium mb-3">Informações Logísticas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberFormField
            form={form}
            name="quantity"
            label="Quantidade"
            placeholder="Quantidade de itens"
          />
          
          <SelectFormField
            form={form}
            name="packageType"
            label="Tipo de Embalagem"
            options={packageTypes}
            placeholder="Selecione o tipo de embalagem"
          />
          
          <NumberFormField
            form={form}
            name="unitWeight"
            label="Peso Unitário (kg)"
            placeholder="Peso de cada unidade"
          />
          
          <NumberFormField
            form={form}
            name="totalWeight"
            label="Peso Total (kg)"
            placeholder="Peso total da carga"
          />

          <TextFormField
            form={form}
            name="containerId"
            label="Número do Container"
            placeholder="Opcional - se já estiver disponível"
          />
          
          <SelectFormField
            form={form}
            name="containerType"
            label="Tipo de Container"
            options={containerTypes}
            placeholder="Selecione o tipo de container"
          />

          <TextFormField
            form={form}
            name="vesselName"
            label="Nome do Navio"
            placeholder="Opcional - se já estiver disponível"
          />

          <TextFormField
            form={form}
            name="bookingNumber"
            label="Número de Booking"
            placeholder="Opcional - booking de transporte"
          />
        </div>
      </div>
    </div>
  );
};

export default ImportDetailsSection;
