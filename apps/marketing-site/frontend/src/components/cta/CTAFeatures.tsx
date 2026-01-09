
import React from 'react';
import { Calendar, Phone, Globe, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTAFeatures: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm font-medium">
        {t('cta.features.badge')}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold">{t('cta.features.title')}</h2>
      <p className="text-white/90 text-lg">
        {t('cta.features.subtitle')}
      </p>
      
      <div className="space-y-4 mt-8">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">{t('cta.features.item1.title')}</h4>
            <p className="text-white/70 text-sm">{t('cta.features.item1.description')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">{t('cta.features.item2.title')}</h4>
            <p className="text-white/70 text-sm">{t('cta.features.item2.description')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">{t('cta.features.item3.title')}</h4>
            <p className="text-white/70 text-sm">{t('cta.features.item3.description')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium">{t('cta.features.item4.title')}</h4>
            <p className="text-white/70 text-sm">{t('cta.features.item4.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAFeatures;
