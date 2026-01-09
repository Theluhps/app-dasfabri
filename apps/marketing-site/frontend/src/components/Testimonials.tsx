
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/image-with-fallback';

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Diretor de Operações',
    company: 'Global Trade',
    image: '/images/testimonial-1.jpg',
    companyLogo: '/images/company-logo-1.png',
    text: 'A Dasfabri transformou completamente nossa operação de importação. O que antes levava semanas, agora é feito em dias com muito mais precisão e visibilidade.',
    stars: 5
  },
  {
    name: 'Ana Mendes',
    role: 'Gerente de Comex',
    company: 'BR Imports',
    image: '/images/testimonial-2.jpg',
    companyLogo: '/images/company-logo-2.png',
    text: 'Desde que implementamos a plataforma, reduzimos nossos custos operacionais em 25% e melhoramos significativamente o controle sobre processos e documentos.',
    stars: 5
  },
  {
    name: 'Rodrigo Martins',
    role: 'CEO',
    company: 'TechLead Importadora',
    image: '/images/testimonial-3.jpg',
    companyLogo: '/images/company-logo-3.png',
    text: 'Trabalhar com a Dasfabri nos deu o controle que precisávamos. A plataforma é intuitiva e a equipe de suporte é excepcional. Recomendo fortemente.',
    stars: 5
  }
];

const StarRating = ({ count }: { count: number }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-dasfabri-blue/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
          <p className="text-lg text-gray-600">
            Empresas de diversos setores já transformaram seus processos de comércio exterior com a Dasfabri
          </p>
        </div>
        
        {/* Background image of shipping containers or port */}
        <div className="absolute opacity-5 left-0 right-0 h-full max-h-[500px] overflow-hidden -z-10">
          <ImageWithFallback
            src="/images/shipping-port-bg.jpg"
            alt="Porto de contêineres"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden">
                  <ImageWithFallback 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                    fallback={testimonial.name.charAt(0)}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              
              <div className="mb-4 flex items-center">
                <StarRating count={testimonial.stars} />
              </div>
              
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-dasfabri-blue">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Cliente verificado</span>
                </div>
                {testimonial.companyLogo && (
                  <div className="h-8 w-auto opacity-60">
                    <ImageWithFallback
                      src={testimonial.companyLogo}
                      alt={`Logo ${testimonial.company}`}
                      className="h-full"
                      showPlaceholder={false}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#contato" 
            className="inline-flex items-center text-dasfabri-blue hover:text-dasfabri-darkBlue font-medium"
          >
            Quer ver mais depoimentos? Entre em contato
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>
        
        {/* Imagem de dashboard de cliente com resultados */}
        <motion.div 
          className="mt-16 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto bg-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="p-6 bg-gradient-to-r from-dasfabri-blue to-dasfabri-darkBlue text-white">
            <h3 className="text-xl font-bold mb-2">Resultados reais dos nossos clientes</h3>
            <p>Veja como a plataforma Dasfabri impactou positivamente os negócios</p>
          </div>
          <div className="p-4">
            <ImageWithFallback
              src="/images/client-dashboard-results.png"
              alt="Dashboard com resultados de cliente"
              aspectRatio={16/9}
              fallback="Dashboard de Resultados"
              className="rounded-lg border border-gray-200"
            />
            <div className="flex justify-center gap-8 mt-4 text-center">
              <div>
                <div className="text-2xl font-bold text-dasfabri-blue">40%</div>
                <div className="text-sm text-gray-600">Redução no tempo de processamento</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-dasfabri-blue">28%</div>
                <div className="text-sm text-gray-600">Diminuição de custos operacionais</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-dasfabri-blue">99.7%</div>
                <div className="text-sm text-gray-600">Precisão na documentação</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
