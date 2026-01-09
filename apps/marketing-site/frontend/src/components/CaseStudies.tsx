
import React from 'react';

const caseStudies = [
  {
    company: "TechImport Brasil",
    industry: "Importação de Eletrônicos",
    logo: "TI",
    quote: "Reduzimos o tempo de importação em 35% e os custos operacionais em 28% no primeiro ano de uso da plataforma.",
    author: "Carlos Mendes",
    position: "Diretor de Operações"
  },
  {
    company: "Global Foods",
    industry: "Alimentos Importados",
    logo: "GF",
    quote: "A visibilidade que a Dasfabri nos proporciona transformou completamente nosso controle de prazos e compliance.",
    author: "Ana Silva",
    position: "Gerente de Importação"
  },
  {
    company: "Medic Supply",
    industry: "Equipamentos Médicos",
    logo: "MS",
    quote: "Em um setor altamente regulado como o nosso, a automação da gestão documental foi um divisor de águas.",
    author: "Roberto Almeida",
    position: "CEO"
  }
];

const CaseStudies: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-dasfabri-blue/5 via-white to-dasfabri-skyBlue/5">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-dasfabri-blue/10 text-dasfabri-blue px-4 py-1 rounded-full text-sm font-medium mb-4">
            Casos de Sucesso
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
          <p className="text-lg text-gray-600">
            Empresas de diversos setores já transformaram suas operações de comércio exterior com a Dasfabri.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((caseStudy, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover-card"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl">{caseStudy.company}</h3>
                    <p className="text-gray-500 text-sm">{caseStudy.industry}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-dasfabri-blue text-white flex items-center justify-center font-bold">
                    {caseStudy.logo}
                  </div>
                </div>
                
                <svg className="h-8 w-8 text-dasfabri-blue/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <blockquote className="text-gray-700 mb-6">
                  "{caseStudy.quote}"
                </blockquote>
                
                <div className="flex items-center border-t border-gray-100 pt-4">
                  <div className="flex-1">
                    <p className="font-medium">{caseStudy.author}</p>
                    <p className="text-gray-500 text-sm">{caseStudy.position}</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16">
          <div className="bg-dasfabri-blue rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2 p-10 text-white">
                <h3 className="text-2xl font-bold mb-4">Resultados mensuráveis e reais</h3>
                <p className="mb-6 text-white/90">
                  Nossos clientes experimentam melhorias significativas em seus KPIs de comércio exterior. 
                  Agende uma demonstração e descubra como podemos ajudar sua empresa.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <span className="block text-3xl font-bold">98%</span>
                    <span className="text-sm text-white/80">Taxa de Renovação</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg text-center">
                    <span className="block text-3xl font-bold">84%</span>
                    <span className="text-sm text-white/80">NPS Score</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-white p-10">
                <h3 className="text-xl font-bold mb-4">Agende uma demonstração gratuita</h3>
                <p className="text-gray-600 mb-6">
                  Fale com um de nossos especialistas e veja a Dasfabri em ação com um caso de uso personalizado para sua empresa.
                </p>
                <a 
                  href="#contato" 
                  className="inline-flex items-center justify-center bg-dasfabri-blue text-white hover:bg-dasfabri-darkBlue py-3 px-6 rounded-lg font-medium transition-colors w-full shadow-md"
                >
                  Agendar agora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
