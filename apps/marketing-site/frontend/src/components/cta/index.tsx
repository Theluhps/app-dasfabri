
import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import CTAForm from './CTAForm';
import CTAFeatures from './CTAFeatures';
import CTAStats from './CTAStats';

const CTA: React.FC = () => {
  return (
    <section id="contato" className="py-24 bg-gradient-to-b from-dasfabri-blue to-dasfabri-darkBlue text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <ImageWithFallback 
          src="/images/world-connections-bg.jpg" 
          alt="Conexões globais" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-dasfabri-blue to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dasfabri-darkBlue to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <CTAFeatures />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CTAForm />
          </motion.div>
        </div>

        {/* Estatísticas */}
        <CTAStats />
      </div>
    </section>
  );
};

export default CTA;
