
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqItems = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6')
    }
  ];
  
  const toggleItem = (index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            {t('faq.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{t('faq.title')}</h2>
          <p className="text-lg text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className={`flex justify-between items-center w-full p-5 text-left font-medium transition-colors ${
                    openIndex === index 
                    ? 'bg-dasfabri-blue text-white' 
                    : 'bg-white text-gray-800 hover:bg-dasfabri-blue/5'
                  }`}
                  onClick={() => toggleItem(index)}
                >
                  <span className={openIndex === index ? 'text-white' : 'text-gray-800'}>
                    {item.question}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 ${openIndex === index ? 'text-white transform rotate-180' : 'text-gray-800'}`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="p-5 bg-white border-t border-gray-200 animate-fade-in">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-dasfabri-blue/5 rounded-xl text-center">
            <h3 className="text-xl font-medium mb-3 text-gray-900">{t('faq.cta.title')}</h3>
            <p className="text-gray-700 mb-6">
              {t('faq.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contato" 
                className="inline-flex items-center justify-center bg-dasfabri-blue text-white hover:bg-dasfabri-darkBlue py-3 px-6 rounded-lg font-medium transition-colors shadow-md"
              >
                {t('faq.cta.contact')}
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center bg-white border border-dasfabri-blue text-dasfabri-blue hover:bg-dasfabri-blue/5 py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {t('faq.cta.docs')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
