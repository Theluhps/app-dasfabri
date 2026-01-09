
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { companies } from './data/companiesData';
import CompanySearch from './components/CompanySearch';
import AddCompanyDialog from './components/AddCompanyDialog';
import CompaniesTable from './components/CompaniesTable';
import CompanyStats from './components/CompanyStats';
import RecentDocuments from './components/RecentDocuments';
import CompanyTypeFilter from './components/CompanyTypeFilter';

const ParamsCompanies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredCompanies = companies.filter(company => {
    // First, filter by search term
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.segment.toLowerCase().includes(searchTerm.toLowerCase());

    // Then, filter by company type if a specific type is selected
    const matchesType = selectedType === 'all' || company.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <PageLayout 
      title="Gestão de Empresas" 
      description="Administre as empresas relacionadas ao seu negócio"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <CompanySearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <CompanyTypeFilter selectedType={selectedType} setSelectedType={setSelectedType} />
          </div>
          <AddCompanyDialog />
        </div>
        
        <CompaniesTable companies={filteredCompanies} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyStats companies={companies} />
          <RecentDocuments />
        </div>
      </div>
    </PageLayout>
  );
};

export default ParamsCompanies;
