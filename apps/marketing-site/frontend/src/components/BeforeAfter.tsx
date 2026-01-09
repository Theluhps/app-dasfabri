
import React from 'react';
import { XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BeforeAfter: React.FC = () => {
  const { t } = useLanguage();
  
  const beforeAfterData = [
    {
      before: t('beforeAfter.item1.before'),
      after: t('beforeAfter.item1.after')
    },
    {
      before: t('beforeAfter.item2.before'),
      after: t('beforeAfter.item2.after')
    },
    {
      before: t('beforeAfter.item3.before'),
      after: t('beforeAfter.item3.after')
    },
    {
      before: t('beforeAfter.item4.before'),
      after: t('beforeAfter.item4.after')
    },
    {
      before: t('beforeAfter.item5.before'),
      after: t('beforeAfter.item5.after')
    }
  ];

  return (
    <section className="py-20 bg-dasfabri-gray">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            {t('beforeAfter.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('beforeAfter.title')}</h2>
          <p className="text-lg text-gray-600">
            {t('beforeAfter.subtitle')}
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="md:col-span-3 p-6 bg-gray-50">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">{t('beforeAfter.before')}</h3>
              </div>
              
              <ul className="space-y-4">
                {beforeAfterData.map((item, index) => (
                  <li key={`before-${index}`} className="flex items-start">
                    <div className="mr-3 mt-1 text-red-500">
                      <XCircle className="h-4 w-4" />
                    </div>
                    <p className="text-gray-700">{item.before}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-center p-4 md:col-span-1">
              <div className="rounded-full bg-dasfabri-blue p-3 hidden md:flex">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <div className="md:hidden h-10 w-full flex items-center justify-center">
                <div className="w-10 h-10 flex justify-center items-center">
                  <ArrowRight className="h-6 w-6 text-dasfabri-blue transform rotate-90" />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 p-6 bg-white">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-dasfabri-blue/10 flex items-center justify-center mr-3">
                  <CheckCircle className="h-6 w-6 text-dasfabri-blue" />
                </div>
                <h3 className="text-xl font-bold">{t('beforeAfter.after')}</h3>
              </div>
              
              <ul className="space-y-4">
                {beforeAfterData.map((item, index) => (
                  <li key={`after-${index}`} className="flex items-start">
                    <div className="mr-3 mt-1 text-dasfabri-blue">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <p className="text-gray-700">{item.after}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            {t('beforeAfter.footer')}
          </p>
          <a 
            href="#contato" 
            className="inline-flex items-center justify-center bg-dasfabri-blue text-white hover:bg-dasfabri-darkBlue py-3 px-6 rounded-lg font-medium transition-colors shadow-md"
          >
            {t('beforeAfter.cta')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
