
import React from 'react';
import { TrendingUp, Users, Database, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Benefits: React.FC = () => {
  const { t } = useLanguage();
  
  const benefitsData = [
    {
      icon: <TrendingUp size={28} className="text-dasfabri-blue" />,
      title: t('benefits.item1.title'),
      description: t('benefits.item1.description')
    },
    {
      icon: <Database size={28} className="text-dasfabri-blue" />,
      title: t('benefits.item2.title'),
      description: t('benefits.item2.description')
    },
    {
      icon: <Users size={28} className="text-dasfabri-blue" />,
      title: t('benefits.item3.title'),
      description: t('benefits.item3.description')
    },
    {
      icon: <BarChart size={28} className="text-dasfabri-blue" />,
      title: t('benefits.item4.title'),
      description: t('benefits.item4.description')
    },
  ];
  
  return (
    <section id="vantagens" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            {t('benefits.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('benefits.title')}</h2>
          <p className="text-lg text-gray-600">
            {t('benefits.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitsData.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover-card"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dasfabri-blue/10 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-8 bg-dasfabri-blue rounded-xl text-white text-center max-w-4xl mx-auto shadow-lg banner-gradient">
          <h3 className="text-2xl font-bold mb-4">{t('benefits.cta.title')}</h3>
          <p className="mb-8 text-white/90">
            {t('benefits.cta.subtitle')}
          </p>
          <div className="flex justify-center gap-10 flex-wrap">
            <div className="text-center">
              <span className="block text-3xl font-bold">{t('benefits.stat1.value')}</span>
              <span className="text-sm text-white/80">{t('benefits.stat1.label')}</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold">{t('benefits.stat2.value')}</span>
              <span className="text-sm text-white/80">{t('benefits.stat2.label')}</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold">{t('benefits.stat3.value')}</span>
              <span className="text-sm text-white/80">{t('benefits.stat3.label')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
