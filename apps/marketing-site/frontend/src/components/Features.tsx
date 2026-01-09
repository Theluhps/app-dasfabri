
import React from 'react';
import { FileText, Package, Globe, Database, Bell, Truck, Calculator, Users, BarChart, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const featuresData = [
    {
      icon: <FileText size={36} className="text-dasfabri-blue" />,
      title: t('features.documents.title'),
      description: t('features.documents.description'),
      metrics: t('features.documents.metrics')
    },
    {
      icon: <Calculator size={36} className="text-dasfabri-blue" />,
      title: t('features.taxes.title'),
      description: t('features.taxes.description'),
      metrics: t('features.taxes.metrics')
    },
    {
      icon: <Truck size={36} className="text-dasfabri-blue" />,
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      metrics: t('features.tracking.metrics')
    },
    {
      icon: <Users size={36} className="text-dasfabri-blue" />,
      title: t('features.customs.title'),
      description: t('features.customs.description'),
      metrics: t('features.customs.metrics')
    },
    {
      icon: <Package size={36} className="text-dasfabri-blue" />,
      title: t('features.suppliers.title'),
      description: t('features.suppliers.description'),
      metrics: t('features.suppliers.metrics')
    },
    {
      icon: <Database size={36} className="text-dasfabri-blue" />,
      title: t('features.costs.title'),
      description: t('features.costs.description'),
      metrics: t('features.costs.metrics')
    },
    {
      icon: <BarChart size={36} className="text-dasfabri-blue" />,
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
      metrics: t('features.analytics.metrics')
    },
    {
      icon: <Shield size={36} className="text-dasfabri-blue" />,
      title: t('features.compliance.title'),
      description: t('features.compliance.description'),
      metrics: t('features.compliance.metrics')
    },
    {
      icon: <Globe size={36} className="text-dasfabri-blue" />,
      title: t('features.erp.title'),
      description: t('features.erp.description'),
      metrics: t('features.erp.metrics')
    }
  ];
  return (
    <section id="funcionalidades" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            {t('features.title')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.subtitle')}</h2>
          <p className="text-lg text-gray-600">
            {t('features.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-dasfabri-blue/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-3 rounded-full bg-dasfabri-blue/10 mb-5 inline-flex">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-dasfabri-blue">{feature.metrics}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="bg-gray-50 rounded-xl p-8 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8 md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('features.customization.title')}</h3>
                <p className="text-gray-600">
                  {t('features.customization.description')}
                </p>
              </div>
              <div className="md:w-1/3 flex justify-end">
                <a href="#contato" className="inline-flex items-center justify-center bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white py-3 px-6 rounded-lg font-medium transition-colors whitespace-nowrap">
                  {t('features.customization.cta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
