import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const UrgencyBanner: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-gradient-to-r from-dasfabri-blue to-dasfabri-darkBlue text-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Clock className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  {t('urgency.title')}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {t('urgency.subtitle')}
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('urgency.metric')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button
                size="lg"
                className="bg-white text-dasfabri-blue hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl"
                onClick={() => navigate('/auth/register')}
              >
                {t('urgency.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default UrgencyBanner;

