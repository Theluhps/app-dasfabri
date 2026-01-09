
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProcessFormValues, currencies } from './FormSchema';
import { TextFormField, SelectFormField } from './FormFields';

interface FinancialSectionProps {
  form: UseFormReturn<ProcessFormValues>;
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Financeiras</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextFormField
          form={form}
          name="ncm"
          label="NCM"
          placeholder="Código NCM"
        />
        
        <TextFormField
          form={form}
          name="referenceNumber"
          label="Número de Referência"
          placeholder="Referência externa"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <TextFormField
            form={form}
            name="invoiceValue"
            label="Valor da Invoice"
            placeholder="Valor"
          />
          
          <SelectFormField
            form={form}
            name="currency"
            label="Moeda"
            options={currencies}
            placeholder="Selecione a moeda"
          />
        </div>

        <TextFormField
          form={form}
          name="freightValue"
          label="Valor do Frete"
          placeholder="Valor do frete"
        />
        
        <TextFormField
          form={form}
          name="insuranceValue"
          label="Valor do Seguro"
          placeholder="Valor do seguro"
        />

        <TextFormField
          form={form}
          name="customsValue"
          label="Valor Aduaneiro"
          placeholder="Valor aduaneiro"
        />
        
        <TextFormField
          form={form}
          name="taxValue"
          label="Valor de Impostos"
          placeholder="Impostos estimados"
        />
      </div>
    </div>
  );
};

export default FinancialSection;
