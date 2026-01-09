
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Database, Shield } from 'lucide-react';

const CommerceTechVisual: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            Tecnologia de Ponta
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comércio Exterior Transformado pela Tecnologia</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma integra tecnologias avançadas para automatizar e simplificar
            todos os aspectos da sua operação de importação e exportação
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dasfabri-blue/10 text-dasfabri-blue rounded-lg">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Conectividade Global</h3>
                  <p className="text-gray-600">
                    Integração com aduanas, transportadoras e sistemas governamentais em todo o mundo
                    para rastreamento em tempo real dos seus processos.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dasfabri-blue/10 text-dasfabri-blue rounded-lg">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Arquitetura Moderna</h3>
                  <p className="text-gray-600">
                    Plataforma cloud-native escalável que permite acesso de qualquer lugar
                    e processamento de grandes volumes de dados de forma eficiente.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dasfabri-blue/10 text-dasfabri-blue rounded-lg">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Análise de Dados</h3>
                  <p className="text-gray-600">
                    Algoritmos de machine learning analisam seus dados históricos para
                    identificar oportunidades de melhoria e prever possíveis gargalos.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-dasfabri-blue/10 text-dasfabri-blue rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Segurança Avançada</h3>
                  <p className="text-gray-600">
                    Proteção de dados em conformidade com LGPD e padrões internacionais,
                    garantindo a confidencialidade das suas informações comerciais.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-dasfabri-blue/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-dasfabri-blue/5 rounded-full blur-xl"></div>
            
            {/* Abstract visualization */}
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white">
              <div className="p-8">
                <div className="h-64 bg-gradient-to-br from-dasfabri-blue/10 to-dasfabri-skyBlue/30 rounded-lg flex items-center justify-center relative">
                  {/* Decorative elements */}
                  <div className="absolute w-24 h-24 rounded-full bg-dasfabri-blue/20 top-4 left-4 blur-sm"></div>
                  <div className="absolute w-32 h-32 rounded-full bg-dasfabri-skyBlue/10 bottom-4 right-4 blur-md"></div>
                  
                  {/* Network lines */}
                  <div className="absolute inset-0">
                    <div className="absolute h-px w-full top-1/4 bg-gradient-to-r from-transparent via-dasfabri-blue/40 to-transparent"></div>
                    <div className="absolute h-px w-full top-2/4 bg-gradient-to-r from-transparent via-dasfabri-blue/30 to-transparent"></div>
                    <div className="absolute h-px w-full top-3/4 bg-gradient-to-r from-transparent via-dasfabri-blue/20 to-transparent"></div>
                    
                    <div className="absolute w-px h-full left-1/4 bg-gradient-to-b from-transparent via-dasfabri-blue/40 to-transparent"></div>
                    <div className="absolute w-px h-full left-2/4 bg-gradient-to-b from-transparent via-dasfabri-blue/30 to-transparent"></div>
                    <div className="absolute w-px h-full left-3/4 bg-gradient-to-b from-transparent via-dasfabri-blue/20 to-transparent"></div>
                  </div>
                  
                  {/* Center element */}
                  <div className="w-20 h-20 rounded-full bg-dasfabri-blue flex items-center justify-center text-white text-xl font-bold shadow-lg relative z-10">
                    <Globe className="w-8 h-8" />
                  </div>
                  
                  {/* Connection nodes */}
                  <div className="absolute w-6 h-6 rounded-full bg-white shadow-md top-10 left-1/4"></div>
                  <div className="absolute w-4 h-4 rounded-full bg-white shadow-md top-1/3 right-1/4"></div>
                  <div className="absolute w-5 h-5 rounded-full bg-white shadow-md bottom-10 left-1/3"></div>
                  <div className="absolute w-3 h-3 rounded-full bg-white shadow-md bottom-1/4 right-1/3"></div>
                </div>
              </div>
            </div>
            
            {/* Floating abstract element */}
            <motion.div
              className="absolute -bottom-8 -right-8 w-3/4 rounded-lg overflow-hidden shadow-2xl border-4 border-white z-20 bg-white p-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-dasfabri-blue/20 flex items-center justify-center">
                    <Database className="w-5 h-5 text-dasfabri-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-dasfabri-blue/20 rounded-full w-2/3 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="h-20 bg-white rounded-md shadow-sm p-3">
                  {/* Abstract data visualization */}
                  <div className="flex gap-1 h-full items-end">
                    <div className="flex-1 bg-dasfabri-blue/20 rounded-sm" style={{height: '30%'}}></div>
                    <div className="flex-1 bg-dasfabri-blue/30 rounded-sm" style={{height: '50%'}}></div>
                    <div className="flex-1 bg-dasfabri-blue/40 rounded-sm" style={{height: '70%'}}></div>
                    <div className="flex-1 bg-dasfabri-blue/50 rounded-sm" style={{height: '60%'}}></div>
                    <div className="flex-1 bg-dasfabri-blue/60 rounded-sm" style={{height: '90%'}}></div>
                    <div className="flex-1 bg-dasfabri-blue/70 rounded-sm" style={{height: '40%'}}></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Small floating element */}
            <motion.div
              className="absolute top-10 -left-5 bg-white p-3 rounded-lg shadow-lg z-20 flex items-center gap-2 border border-gray-100"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Documento aprovado</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommerceTechVisual;
