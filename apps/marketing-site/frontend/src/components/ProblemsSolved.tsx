
import React from 'react';
import { CheckCircle, Clock, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProblemsSolved: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section id="problemas" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('problems.title')}</h2>
          <p className="text-lg text-gray-600">
            {t('problems.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-dasfabri-blue/10 p-3 rounded-lg">
                <Clock className="h-8 w-8 text-dasfabri-blue" />
              </div>
              <h3 className="text-xl font-semibold ml-4">{t('problems.delays.title')}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t('problems.delays.description')}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-dasfabri-blue flex-shrink-0" />
              <p className="ml-3 text-gray-700 font-medium">
                {t('problems.delays.solution')}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-dasfabri-blue/10 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-dasfabri-blue" />
              </div>
              <h3 className="text-xl font-semibold ml-4">{t('problems.errors.title')}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {t('problems.errors.description')}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-dasfabri-blue flex-shrink-0" />
              <p className="ml-3 text-gray-700 font-medium">
                {t('problems.errors.solution')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSolved;
