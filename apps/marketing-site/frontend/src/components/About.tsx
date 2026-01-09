
import React from 'react';
import { CheckCircle, Ship } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="sobre" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <div className="absolute -z-10 top-0 left-0 w-full h-full bg-dasfabri-blue/5 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8 space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-dasfabri-blue/10 flex items-center justify-center">
                      <Ship className="h-8 w-8 text-dasfabri-blue" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 mx-auto bg-dasfabri-blue/20 rounded-full"></div>
                      <div className="h-2 w-5/6 mx-auto bg-dasfabri-blue/15 rounded-full"></div>
                      <div className="h-2 w-2/3 mx-auto bg-dasfabri-blue/10 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <div className="h-2 w-12 bg-dasfabri-green/30 rounded-full mb-2"></div>
                        <div className="h-2 w-8 bg-dasfabri-green/20 rounded-full"></div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <div className="h-2 w-12 bg-dasfabri-brown/30 rounded-full mb-2"></div>
                        <div className="h-2 w-8 bg-dasfabri-brown/20 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-3">
                {t('about.badge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.title')}</h2>
              <p className="text-lg text-gray-700 mb-8">
                {t('about.description')}
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mt-1 text-dasfabri-green bg-dasfabri-green/10 p-2 rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{t('about.feature1.title')}</h4>
                  <p className="text-gray-600">{t('about.feature1.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mt-1 text-dasfabri-green bg-dasfabri-green/10 p-2 rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{t('about.feature2.title')}</h4>
                  <p className="text-gray-600">{t('about.feature2.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mt-1 text-dasfabri-green bg-dasfabri-green/10 p-2 rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{t('about.feature3.title')}</h4>
                  <p className="text-gray-600">{t('about.feature3.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
