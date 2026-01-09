
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProcessFormValues } from './FormSchema';
import { TextFormField, TextareaFormField } from './FormFields';

interface BasicInfoSectionProps {
  form: UseFormReturn<ProcessFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextFormField
          form={form}
          name="client"
          label="Cliente"
          placeholder="Nome do cliente"
        />
        
        <TextFormField
          form={form}
          name="supplier"
          label="Fornecedor"
          placeholder="Nome do fornecedor"
        />
        
        <TextFormField
          form={form}
          name="product"
          label="Produto"
          placeholder="Descrição do produto"
        />
        
        <TextareaFormField
          form={form}
          name="description"
          label="Descrição Detalhada"
          placeholder="Detalhes adicionais..."
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
