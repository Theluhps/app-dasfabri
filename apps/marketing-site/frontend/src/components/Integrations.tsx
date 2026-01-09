
import React from 'react';
import { Database, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const integrations = [
  { name: "Oracle ERP", logo: "Or" },
  { name: "SAP", logo: "SA" },
  { name: "Microsoft Dynamics", logo: "Mi" },
  { name: "TOTVS", logo: "TO" },
  { name: "Siscomex", logo: "Si" },
  { name: "Salesforce", logo: "Sa" },
  { name: "Conta Azul", logo: "Co" },
  { name: "Bling", logo: "Bl" },
];

const Integrations: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-gradient-to-br from-dasfabri-skyBlue/5 via-white to-dasfabri-blue/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            {t('integrations.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('integrations.title')}</h2>
          <p className="text-lg text-gray-600">
            {t('integrations.subtitle')}
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-5 border border-gray-100 rounded-lg hover:border-dasfabri-blue/30 transition-all hover-card"
              >
                <div className="w-14 h-14 bg-dasfabri-blue/10 rounded-full flex items-center justify-center mb-3 text-dasfabri-blue">
                  {index % 2 === 0 ? 
                    <Database className="h-6 w-6" /> : 
                    <FileText className="h-6 w-6" />
                  }
                </div>
                <span className="text-gray-800 font-medium">{integration.name}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-sm w-full">
                <div className="w-12 h-12 bg-dasfabri-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-dasfabri-blue font-bold">
                  API
                </div>
                <h4 className="font-semibold mb-2">{t('integrations.api.title')}</h4>
                <p className="text-gray-600 text-sm">
                  {t('integrations.api.description')}
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-sm w-full">
                <div className="w-12 h-12 bg-dasfabri-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 text-dasfabri-blue font-bold">
                  EDI
                </div>
                <h4 className="font-semibold mb-2">{t('integrations.edi.title')}</h4>
                <p className="text-gray-600 text-sm">
                  {t('integrations.edi.description')}
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-2">{t('integrations.custom.title')}</p>
            <p className="text-dasfabri-blue font-medium">
              {t('integrations.custom.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
