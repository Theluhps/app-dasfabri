
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleDemoClick = () => {
    navigate('/auth/register');
  };
  
  return (
    <section className="bg-gradient-to-br from-dasfabri-lightBlue/10 via-white to-dasfabri-skyBlue/5 py-24 md:py-32 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-dasfabri-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-dasfabri-lightBlue/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium">
              {t('hero.badge')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-xl">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="text-dasfabri-blue bg-dasfabri-blue/10 rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-gray-700 font-medium">{t('hero.metric.time')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-dasfabri-blue bg-dasfabri-blue/10 rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-gray-700 font-medium">{t('hero.metric.accuracy')}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white py-6 px-8 font-medium text-lg shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => navigate('/auth/register')}
              >
                {t('hero.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-white border-2 border-dasfabri-blue text-dasfabri-blue hover:bg-dasfabri-blue hover:text-white py-6 px-8 font-medium text-lg shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleDemoClick}
              >
                <div className="bg-dasfabri-blue rounded-full p-1">
                  <Play className="h-4 w-4 text-white" />
                </div>
                {t('hero.cta.secondary')}
              </button>
            </div>
          </motion.div>
          
          {/* Dashboard preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-dasfabri-blue/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-dasfabri-lightBlue/20 rounded-full blur-xl"></div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Dashboard visualization */}
              <div className="bg-white p-5 rounded-xl shadow-2xl border border-gray-100">
                <div className="absolute -top-4 -right-4 bg-dasfabri-blue text-white text-sm px-3 py-1 rounded-full shadow-lg">
                  Nova versão
                </div>
                
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  {/* Barra superior */}
                  <div className="bg-gray-200 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-gray-700 text-sm">Dasfabri Platform</div>
                    </div>
                    <div className="w-16"></div> {/* Espaço para balancear */}
                  </div>
                  
                  {/* Conteúdo do Dashboard */}
                  <div className="p-4">
                    {/* Dashboard Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-gray-800 text-lg font-medium">Dashboard</div>
                      <div className="bg-dasfabri-blue/20 text-dasfabri-blue px-3 py-1 rounded text-xs">Online</div>
                    </div>
                    
                    {/* Cards informativos */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-500 text-xs mb-1">Importações ativas</div>
                        <div className="text-gray-800 font-bold text-lg">24</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-500 text-xs mb-1">Em trânsito</div>
                        <div className="text-gray-800 font-bold text-lg">12</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-500 text-xs mb-1">Documentos</div>
                        <div className="text-gray-800 font-bold text-lg">86</div>
                      </div>
                    </div>
                    
                    {/* Gráfico */}
                    <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-gray-700 text-sm">Atividade recente</div>
                        <div className="text-dasfabri-blue text-xs">Ver detalhes</div>
                      </div>
                      <div className="flex items-end h-12 gap-1">
                        <div className="w-full bg-dasfabri-blue/20 rounded-sm" style={{height: '20%'}}></div>
                        <div className="w-full bg-dasfabri-blue/20 rounded-sm" style={{height: '45%'}}></div>
                        <div className="w-full bg-dasfabri-blue/20 rounded-sm" style={{height: '30%'}}></div>
                        <div className="w-full bg-dasfabri-blue/20 rounded-sm" style={{height: '80%'}}></div>
                        <div className="w-full bg-dasfabri-blue/40 rounded-sm" style={{height: '60%'}}></div>
                        <div className="w-full bg-dasfabri-blue/60 rounded-sm" style={{height: '90%'}}></div>
                        <div className="w-full bg-dasfabri-blue rounded-sm" style={{height: '70%'}}></div>
                      </div>
                    </div>
                    
                    {/* Dados adicionais */}
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-700 text-sm">Status dos processos</div>
                        <div className="text-dasfabri-blue text-xs">Ver todos</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-gray-500 text-xs">A iniciar</div>
                          <div className="w-3/5 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <div className="text-gray-800 text-xs">25%</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-gray-500 text-xs">Em andamento</div>
                          <div className="w-3/5 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{width: '40%'}}></div>
                          </div>
                          <div className="text-gray-800 text-xs">40%</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-gray-500 text-xs">Concluídos</div>
                          <div className="w-3/5 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{width: '35%'}}></div>
                          </div>
                          <div className="text-gray-800 text-xs">35%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
