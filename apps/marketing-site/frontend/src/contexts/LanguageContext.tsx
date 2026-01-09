import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt-BR' | 'en-US';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções
const translations: Record<Language, Record<string, string>> = {
  'pt-BR': {
    // Hero
    'hero.tagline': 'Automatize suas Operações de Comércio Exterior',
    'hero.title': 'Automatize suas Operações de Comércio Exterior',
    'hero.titleHighlight': 'Comércio Exterior',
    'hero.subtitle': 'Plataforma completa com IA para gerenciar importações, exportações e processos aduaneiros. Elimine erros, reduza custos e acelere suas operações internacionais.',
    'hero.cta.primary': 'Comece Gratuitamente',
    'hero.cta.secondary': 'Assista à Demo',
    'hero.badge': 'Economize até 40% de tempo em processos documentais',
    'hero.metric.time': 'Redução de 40% no tempo de processamento documental',
    'hero.metric.accuracy': '99.7% de precisão em OCR de documentos (47+ tipos, 200+ países)',
    
    // Features
    'features.title': 'Funcionalidades Completas',
    'features.subtitle': 'Uma Plataforma, Todas as Soluções',
    'features.description': 'Nossa plataforma foi desenvolvida por especialistas em comércio exterior para eliminar os gargalos e ineficiências que afetam o seu negócio.',
    'features.documents.title': 'Gestão de Documentos com IA',
    'features.documents.description': 'OCR + ML processa 47+ tipos de documentos com 99.7% de precisão em 200+ países. Organize e preencha automaticamente DI, ROI e NFI com integração direta aos sistemas governamentais.',
    'features.documents.metrics': 'Reduz em 60% o tempo de preparação documental',
    'features.taxes.title': 'Cálculo de Tributos',
    'features.taxes.description': 'Calcule automaticamente impostos como II, IPI, ICMS e PIS/COFINS com base nas informações do produto e da operação.',
    'features.taxes.metrics': 'Precisão de 99.7% nos cálculos tributários',
    'features.tracking.title': 'Rastreamento de Cargas',
    'features.tracking.description': 'Acompanhe em tempo real a localização e status de cada remessa, com notificações automáticas sobre mudanças.',
    'features.tracking.metrics': 'Visibilidade completa do status de 100% das cargas',
    'features.customs.title': 'Integração com Despachantes',
    'features.customs.description': 'Comunique-se diretamente com despachantes aduaneiros, compartilhando documentos e recebendo atualizações.',
    'features.customs.metrics': 'Redução de 75% em emails e mensagens trocadas',
    'features.suppliers.title': 'Gestão de Fornecedores',
    'features.suppliers.description': 'Cadastre, avalie e classifique fornecedores internacionais com base em critérios como qualidade, prazo e custo.',
    'features.suppliers.metrics': 'Aumento de 35% na qualificação de fornecedores',
    'features.costs.title': 'Gestão de Custos',
    'features.costs.description': 'Centralize todas as despesas relacionadas à importação e gere relatórios detalhados para análise financeira.',
    'features.costs.metrics': 'Economize até 12% em custos operacionais',
    'features.analytics.title': 'Relatórios e Analytics',
    'features.analytics.description': 'Gere insights valiosos sobre suas operações com relatórios personalizados sobre prazos, custos e fornecedores.',
    'features.analytics.metrics': 'Tomada de decisão baseada em dados reais',
    'features.compliance.title': 'Conformidade Legal',
    'features.compliance.description': 'Verifique se suas operações estão em conformidade com as normas brasileiras, com alertas para possíveis irregularidades.',
    'features.compliance.metrics': 'Redução de 90% em multas por não-conformidade',
    'features.erp.title': 'Integração com ERP',
    'features.erp.description': 'Conecte seu sistema ERP para sincronizar dados como notas fiscais, custos e informações de estoque automaticamente.',
    'features.erp.metrics': 'Elimina 100% da dupla digitação de dados',
    'features.customization.title': 'Personalização para seu Negócio',
    'features.customization.description': 'Cada empresa tem necessidades específicas. Nossa equipe de especialistas adapta a plataforma para atender perfeitamente ao seu fluxo de trabalho, garantindo máxima eficiência.',
    'features.customization.cta': 'Solicitar Demonstração',
    
    // Problems
    'problems.title': 'Problemas que Resolvemos',
    'problems.subtitle': 'Empresas que operam no comércio exterior enfrentam desafios únicos que atrasam operações e comprometem resultados.',
    'problems.delays.title': 'Atrasos Operacionais',
    'problems.delays.description': 'Processos de importação levam semanas a mais do que deveriam, causando prejuízos e incerteza.',
    'problems.delays.solution': 'Redução de até 40% no tempo total do processo de importação',
    'problems.errors.title': 'Erros Documentais',
    'problems.errors.description': 'Documentação incorreta ou incompleta que resulta em multas, retenções e retrabalho.',
    'problems.errors.solution': 'Diminuição de 85% nos erros de documentação com verificação automática',
    
    // Navigation
    'nav.home': 'Início',
    'nav.solutions': 'Soluções',
    'nav.features': 'Funcionalidades',
    'nav.benefits': 'Vantagens',
    'nav.contact': 'Contato',
    'nav.login': 'Login',
    'nav.demo': 'Agende uma Demo',
    
    // Urgency
    'urgency.title': 'Não perca mais tempo com processos manuais',
    'urgency.subtitle': 'Empresas que implementaram a Dasfabri reduziram custos em até 30% no primeiro trimestre',
    'urgency.cta': 'Comece Agora - Gratuito por 14 dias',
    'urgency.metric': '30% redução de custos no 1º trimestre',
    
    // BeforeAfter
    'beforeAfter.badge': 'Transformação Digital',
    'beforeAfter.title': 'Antes e Depois da Dasfabri',
    'beforeAfter.subtitle': 'Veja como nossa plataforma transforma completamente a maneira como sua empresa gerencia os processos de comércio exterior.',
    'beforeAfter.before': 'Antes',
    'beforeAfter.after': 'Com a Dasfabri',
    'beforeAfter.item1.before': 'Documentação dispersa em múltiplos sistemas',
    'beforeAfter.item1.after': 'Plataforma centralizada para toda a documentação',
    'beforeAfter.item2.before': 'Comunicação por emails e planilhas compartilhadas',
    'beforeAfter.item2.after': 'Comunicação integrada com todos os stakeholders',
    'beforeAfter.item3.before': 'Acompanhamento manual de deadlines',
    'beforeAfter.item3.after': 'Sistema de alertas e lembretes automáticos',
    'beforeAfter.item4.before': 'Falta de visibilidade sobre status dos processos',
    'beforeAfter.item4.after': 'Dashboard em tempo real com status atualizado',
    'beforeAfter.item5.before': 'Retrabalho devido a erros de informação',
    'beforeAfter.item5.after': 'Verificação automática e validação de dados',
    'beforeAfter.footer': 'O impacto financeiro e operacional da mudança é imediato e mensurável.',
    'beforeAfter.cta': 'Calcule sua economia',
    
    // Benefits
    'benefits.badge': 'Vantagens Exclusivas',
    'benefits.title': 'Por que investir na Dasfabri?',
    'benefits.subtitle': 'Nossa plataforma não é apenas uma ferramenta, mas uma vantagem competitiva para empresas que operam no mercado global.',
    'benefits.item1.title': 'Mercado em Expansão',
    'benefits.item1.description': 'O comércio exterior está em constante crescimento, com demanda por soluções inovadoras.',
    'benefits.item2.title': 'Tecnologia de Ponta',
    'benefits.item2.description': 'Utilizamos as melhores práticas de desenvolvimento para garantir um produto robusto e escalável.',
    'benefits.item3.title': 'Equipe Qualificada',
    'benefits.item3.description': 'Contamos com profissionais experientes em comércio exterior, tecnologia e experiência do usuário.',
    'benefits.item4.title': 'Retorno Garantido',
    'benefits.item4.description': 'A Dasfabri não é apenas uma ferramenta, é um investimento que gera resultados tangíveis.',
    'benefits.cta.title': 'Transforme sua operação de comércio exterior hoje',
    'benefits.cta.subtitle': 'Simplifique e otimize seus processos de comércio exterior com tecnologia de ponta e suporte especializado.',
    'benefits.stat1.value': '85%',
    'benefits.stat1.label': 'Redução em erros de documentação',
    'benefits.stat2.value': '40%',
    'benefits.stat2.label': 'Economia de tempo operacional',
    'benefits.stat3.value': '30%',
    'benefits.stat3.label': 'Redução de custos',
    
    // Footer
    'footer.description': 'A solução completa para simplificar e otimizar seus processos de comércio exterior, desde o planejamento até a entrega final.',
    'footer.product.title': 'Produto',
    'footer.product.features': 'Funcionalidades',
    'footer.product.pricing': 'Preços',
    'footer.product.cases': 'Cases de Sucesso',
    'footer.product.security': 'Segurança',
    'footer.product.api': 'API',
    'footer.company.title': 'Empresa',
    'footer.company.about': 'Sobre Nós',
    'footer.company.careers': 'Carreiras',
    'footer.company.blog': 'Blog',
    'footer.company.press': 'Imprensa',
    'footer.company.contact': 'Contato',
    'footer.support.title': 'Suporte',
    'footer.support.help': 'Central de Ajuda',
    'footer.support.docs': 'Documentação',
    'footer.support.status': 'Status do Sistema',
    'footer.support.tutorials': 'Tutoriais',
    'footer.support.webinars': 'Webinars',
    'footer.security': 'Dados protegidos com criptografia de ponta a ponta',
    'footer.terms': 'Termos de Uso',
    'footer.privacy': 'Privacidade',
    'footer.cookies': 'Cookies',
    'footer.copyright': 'Todos os direitos reservados.',
    
    // FAQ
    'faq.badge': 'Perguntas Frequentes',
    'faq.title': 'Dúvidas Comuns',
    'faq.subtitle': 'Encontre respostas para as perguntas mais frequentes sobre a Dasfabri e como ela pode ajudar sua empresa.',
    'faq.q1': 'Quanto tempo leva para implementar a Dasfabri?',
    'faq.a1': 'O tempo médio de implementação é de 2 a 4 semanas, dependendo da complexidade da sua operação e das integrações necessárias. Nossa equipe de onboarding acompanha todo o processo para garantir uma transição suave.',
    'faq.q2': 'A plataforma se integra com o sistema ERP da minha empresa?',
    'faq.a2': 'Sim, a Dasfabri possui conectores para os principais ERPs do mercado como SAP, Oracle, Microsoft Dynamics, TOTVS, entre outros. Também podemos desenvolver integrações personalizadas para sistemas específicos.',
    'faq.q3': 'Como funciona o modelo de precificação?',
    'faq.a3': 'Trabalhamos com um modelo de assinatura mensal ou anual, baseado no número de usuários e módulos utilizados. Oferecemos diferentes planos para atender desde PMEs até grandes corporações. Entre em contato para uma cotação personalizada.',
    'faq.q4': 'Quais tipos de suporte são oferecidos?',
    'faq.a4': 'Todos os planos incluem suporte por email, chat e base de conhecimento. Planos Business e Enterprise contam com suporte telefônico e gerente de sucesso do cliente dedicado. Também oferecemos treinamentos personalizados e consultoria especializada.',
    'faq.q5': 'Posso testar a plataforma antes de contratar?',
    'faq.a5': 'Sim, oferecemos uma demonstração personalizada e um período de teste gratuito de 14 dias. Durante este período, você terá acesso a todas as funcionalidades e poderá contar com nosso time de Customer Success para tirar suas dúvidas.',
    'faq.q6': 'A plataforma está em conformidade com as regulamentações aduaneiras brasileiras?',
    'faq.a6': 'Sim, mantemos nossa plataforma constantemente atualizada de acordo com as regulamentações aduaneiras brasileiras e internacionais. Nossa equipe de compliance monitora mudanças regulatórias para garantir que nossos clientes estejam sempre em conformidade.',
    'faq.cta.title': 'Ainda tem dúvidas?',
    'faq.cta.subtitle': 'Nossa equipe está pronta para ajudar com qualquer pergunta que você possa ter sobre a plataforma.',
    'faq.cta.contact': 'Fale Conosco',
    'faq.cta.docs': 'Ver Documentação',
    
    // CTA
    'cta.features.badge': 'Vamos Conversar',
    'cta.features.title': 'Transforme sua Operação de Importação Hoje',
    'cta.features.subtitle': 'Agende uma demonstração personalizada com nossos especialistas e descubra como a Dasfabri pode eliminar até 40% do tempo em seus processos de comércio exterior.',
    'cta.features.item1.title': 'Demonstração Personalizada',
    'cta.features.item1.description': 'Veja a plataforma em ação com um caso de uso para seu negócio',
    'cta.features.item2.title': 'Suporte Especializado',
    'cta.features.item2.description': 'Nossa equipe está pronta para tirar suas dúvidas',
    'cta.features.item3.title': 'Atuação Global',
    'cta.features.item3.description': 'Solução para importadores em todo o Brasil',
    'cta.features.item4.title': 'Consultoria Gratuita',
    'cta.features.item4.description': 'Análise inicial de sua operação sem compromisso',
    'cta.form.title': 'Solicite uma demonstração',
    'cta.form.name': 'Nome completo *',
    'cta.form.namePlaceholder': 'Seu nome',
    'cta.form.email': 'Email corporativo *',
    'cta.form.emailPlaceholder': 'seu@email.com',
    'cta.form.company': 'Empresa *',
    'cta.form.companyPlaceholder': 'Nome da empresa',
    'cta.form.message': 'Como podemos ajudar?',
    'cta.form.messagePlaceholder': 'Conte-nos sobre sua operação e principais desafios...',
    'cta.form.submit': 'Solicitar demonstração',
    'cta.form.privacy': 'Ao enviar, você concorda com nossa política de privacidade e termos de uso. Seus dados estão seguros conosco.',
    'cta.form.success.title': 'Solicitação enviada!',
    'cta.form.success.message': 'Entraremos em contato em até 24 horas para agendar sua demonstração.',
    'cta.form.success.redirect': 'Você será redirecionado para criar sua conta...',
    'cta.form.success.button': 'Ir para registro agora',
    
    // About
    'about.badge': 'Sobre a Plataforma',
    'about.title': 'O que é a Dasfabri?',
    'about.description': 'A Dasfabri é uma plataforma SaaS especializada em comércio exterior, projetada para simplificar e otimizar todas as etapas do processo de importação e exportação. Com uma interface intuitiva e funcionalidades robustas, centralizamos o controle completo de suas operações globais.',
    'about.feature1.title': 'Controle de Cargas',
    'about.feature1.description': 'Acompanhamento em tempo real da localização e status de cada remessa.',
    'about.feature2.title': 'Gestão de Custos',
    'about.feature2.description': 'Visão clara de todos os custos envolvidos, desde o frete até taxas e impostos.',
    'about.feature3.title': 'Centralização de Documentos',
    'about.feature3.description': 'Organização e acesso rápido a todos os documentos necessários para o comércio exterior.',
    
    // Integrations
    'integrations.badge': 'Ecossistema Conectado',
    'integrations.title': 'Integração com seus Sistemas',
    'integrations.subtitle': 'A Dasfabri se conecta facilmente aos sistemas que você já utiliza, garantindo um fluxo de dados contínuo e sem duplicações.',
    'integrations.api.title': 'API Aberta',
    'integrations.api.description': 'Acesse todos os recursos da plataforma programaticamente via nossa API RESTful documentada',
    'integrations.edi.title': 'EDI Standard',
    'integrations.edi.description': 'Compatível com padrões EDI do setor para troca de dados com parceiros comerciais',
    'integrations.custom.title': 'Não encontrou seu sistema? Não se preocupe.',
    'integrations.custom.description': 'Nossa equipe técnica desenvolve integrações personalizadas para seu ecossistema.',
    'integrations.stats.title': 'Programa Early Adopter - Seja um dos Primeiros',
    'integrations.stats.subtitle': 'Estamos buscando nossos primeiros 10 clientes para validar nossa plataforma. Produto 90% pronto, com suporte dedicado e condições especiais de lançamento.',
    'integrations.stats.cta': 'Saiba mais sobre integrações',
    'integrations.stats.stat1.value': '10',
    'integrations.stats.stat1.label': 'Vagas Early Adopter',
    'integrations.stats.stat2.value': '40%',
    'integrations.stats.stat2.label': 'Economia de tempo',
    'integrations.stats.stat3.value': '99,7%',
    'integrations.stats.stat3.label': 'Precisão nos processos',
    'integrations.stats.stat4.value': '24/7',
    'integrations.stats.stat4.label': 'Suporte especializado',
  },
  'en-US': {
    // Hero
    'hero.tagline': 'Automate Your International Trade Operations',
    'hero.title': 'Automate Your International Trade Operations',
    'hero.titleHighlight': 'International Trade',
    'hero.subtitle': 'Complete AI-powered platform to manage imports, exports, and customs processes. Eliminate errors, reduce costs, and accelerate your international operations.',
    'hero.cta.primary': 'Start Free Trial',
    'hero.cta.secondary': 'Watch Demo',
    'hero.badge': 'Save up to 40% time on document processing',
    'hero.metric.time': '40% reduction in document processing time',
    'hero.metric.accuracy': '99.7% accuracy in document OCR (47+ types, 200+ countries)',
    
    // Features
    'features.title': 'Complete Features',
    'features.subtitle': 'One Platform, All Solutions',
    'features.description': 'Our platform was developed by international trade experts to eliminate bottlenecks and inefficiencies affecting your business.',
    'features.documents.title': 'AI-Powered Document Management',
    'features.documents.description': 'OCR + ML processes 47+ document types with 99.7% accuracy across 200+ countries. Automatically organize and fill DI, ROI, and NFI with direct integration to government systems.',
    'features.documents.metrics': 'Reduces document preparation time by 60%',
    'features.taxes.title': 'Tax Calculation',
    'features.taxes.description': 'Automatically calculate taxes such as II, IPI, ICMS, and PIS/COFINS based on product and operation information.',
    'features.taxes.metrics': '99.7% accuracy in tax calculations',
    'features.tracking.title': 'Cargo Tracking',
    'features.tracking.description': 'Track in real-time the location and status of each shipment with automatic notifications about changes.',
    'features.tracking.metrics': 'Complete visibility of 100% of cargo status',
    'features.customs.title': 'Customs Broker Integration',
    'features.customs.description': 'Communicate directly with customs brokers, sharing documents and receiving updates.',
    'features.customs.metrics': '75% reduction in emails and messages exchanged',
    'features.suppliers.title': 'Supplier Management',
    'features.suppliers.description': 'Register, evaluate, and classify international suppliers based on criteria such as quality, delivery time, and cost.',
    'features.suppliers.metrics': '35% increase in supplier qualification',
    'features.costs.title': 'Cost Management',
    'features.costs.description': 'Centralize all import-related expenses and generate detailed reports for financial analysis.',
    'features.costs.metrics': 'Save up to 12% on operational costs',
    'features.analytics.title': 'Reports and Analytics',
    'features.analytics.description': 'Generate valuable insights about your operations with customized reports on deadlines, costs, and suppliers.',
    'features.analytics.metrics': 'Data-driven decision making',
    'features.compliance.title': 'Legal Compliance',
    'features.compliance.description': 'Verify if your operations comply with Brazilian regulations with alerts for possible irregularities.',
    'features.compliance.metrics': '90% reduction in non-compliance fines',
    'features.erp.title': 'ERP Integration',
    'features.erp.description': 'Connect your ERP system to automatically synchronize data such as invoices, costs, and inventory information.',
    'features.erp.metrics': 'Eliminates 100% of duplicate data entry',
    'features.customization.title': 'Customization for Your Business',
    'features.customization.description': 'Each company has specific needs. Our team of experts adapts the platform to perfectly fit your workflow, ensuring maximum efficiency.',
    'features.customization.cta': 'Request Demo',
    
    // Problems
    'problems.title': 'Problems We Solve',
    'problems.subtitle': 'Companies operating in international trade face unique challenges that delay operations and compromise results.',
    'problems.delays.title': 'Operational Delays',
    'problems.delays.description': 'Import processes take weeks longer than they should, causing losses and uncertainty.',
    'problems.delays.solution': 'Up to 40% reduction in total import process time',
    'problems.errors.title': 'Document Errors',
    'problems.errors.description': 'Incorrect or incomplete documentation that results in fines, detentions, and rework.',
    'problems.errors.solution': '85% decrease in documentation errors with automatic verification',
    
    // Navigation
    'nav.home': 'Home',
    'nav.solutions': 'Solutions',
    'nav.features': 'Features',
    'nav.benefits': 'Benefits',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.demo': 'Schedule a Demo',
    
    // Urgency
    'urgency.title': 'Stop wasting time with manual processes',
    'urgency.subtitle': 'Companies that implemented Dasfabri reduced costs by up to 30% in the first quarter',
    'urgency.cta': 'Start Now - Free for 14 Days',
    'urgency.metric': '30% cost reduction in Q1',
    
    // BeforeAfter
    'beforeAfter.badge': 'Digital Transformation',
    'beforeAfter.title': 'Before and After Dasfabri',
    'beforeAfter.subtitle': 'See how our platform completely transforms the way your company manages foreign trade processes.',
    'beforeAfter.before': 'Before',
    'beforeAfter.after': 'With Dasfabri',
    'beforeAfter.item1.before': 'Documentation scattered across multiple systems',
    'beforeAfter.item1.after': 'Centralized platform for all documentation',
    'beforeAfter.item2.before': 'Communication via emails and shared spreadsheets',
    'beforeAfter.item2.after': 'Integrated communication with all stakeholders',
    'beforeAfter.item3.before': 'Manual deadline tracking',
    'beforeAfter.item3.after': 'Automatic alerts and reminders system',
    'beforeAfter.item4.before': 'Lack of visibility on process status',
    'beforeAfter.item4.after': 'Real-time dashboard with updated status',
    'beforeAfter.item5.before': 'Rework due to information errors',
    'beforeAfter.item5.after': 'Automatic verification and data validation',
    'beforeAfter.footer': 'The financial and operational impact of the change is immediate and measurable.',
    'beforeAfter.cta': 'Calculate your savings',
    
    // Benefits
    'benefits.badge': 'Exclusive Benefits',
    'benefits.title': 'Why invest in Dasfabri?',
    'benefits.subtitle': 'Our platform is not just a tool, but a competitive advantage for companies operating in the global market.',
    'benefits.item1.title': 'Expanding Market',
    'benefits.item1.description': 'International trade is constantly growing, with demand for innovative solutions.',
    'benefits.item2.title': 'Cutting-Edge Technology',
    'benefits.item2.description': 'We use the best development practices to ensure a robust and scalable product.',
    'benefits.item3.title': 'Qualified Team',
    'benefits.item3.description': 'We have experienced professionals in international trade, technology, and user experience.',
    'benefits.item4.title': 'Guaranteed Return',
    'benefits.item4.description': 'Dasfabri is not just a tool, it\'s an investment that generates tangible results.',
    'benefits.cta.title': 'Transform your foreign trade operation today',
    'benefits.cta.subtitle': 'Simplify and optimize your foreign trade processes with cutting-edge technology and specialized support.',
    'benefits.stat1.value': '85%',
    'benefits.stat1.label': 'Reduction in documentation errors',
    'benefits.stat2.value': '40%',
    'benefits.stat2.label': 'Operational time savings',
    'benefits.stat3.value': '30%',
    'benefits.stat3.label': 'Cost reduction',
    
    // Footer
    'footer.description': 'The complete solution to simplify and optimize your foreign trade processes, from planning to final delivery.',
    'footer.product.title': 'Product',
    'footer.product.features': 'Features',
    'footer.product.pricing': 'Pricing',
    'footer.product.cases': 'Success Stories',
    'footer.product.security': 'Security',
    'footer.product.api': 'API',
    'footer.company.title': 'Company',
    'footer.company.about': 'About Us',
    'footer.company.careers': 'Careers',
    'footer.company.blog': 'Blog',
    'footer.company.press': 'Press',
    'footer.company.contact': 'Contact',
    'footer.support.title': 'Support',
    'footer.support.help': 'Help Center',
    'footer.support.docs': 'Documentation',
    'footer.support.status': 'System Status',
    'footer.support.tutorials': 'Tutorials',
    'footer.support.webinars': 'Webinars',
    'footer.security': 'Data protected with end-to-end encryption',
    'footer.terms': 'Terms of Use',
    'footer.privacy': 'Privacy',
    'footer.cookies': 'Cookies',
    'footer.copyright': 'All rights reserved.',
    
    // FAQ
    'faq.badge': 'Frequently Asked Questions',
    'faq.title': 'Common Questions',
    'faq.subtitle': 'Find answers to the most frequently asked questions about Dasfabri and how it can help your company.',
    'faq.q1': 'How long does it take to implement Dasfabri?',
    'faq.a1': 'The average implementation time is 2 to 4 weeks, depending on the complexity of your operation and necessary integrations. Our onboarding team accompanies the entire process to ensure a smooth transition.',
    'faq.q2': 'Does the platform integrate with my company\'s ERP system?',
    'faq.a2': 'Yes, Dasfabri has connectors for the main ERPs on the market such as SAP, Oracle, Microsoft Dynamics, TOTVS, among others. We can also develop custom integrations for specific systems.',
    'faq.q3': 'How does the pricing model work?',
    'faq.a3': 'We work with a monthly or annual subscription model, based on the number of users and modules used. We offer different plans to serve from SMEs to large corporations. Contact us for a personalized quote.',
    'faq.q4': 'What types of support are offered?',
    'faq.a4': 'All plans include email, chat, and knowledge base support. Business and Enterprise plans include phone support and dedicated customer success manager. We also offer personalized training and specialized consulting.',
    'faq.q5': 'Can I test the platform before hiring?',
    'faq.a5': 'Yes, we offer a personalized demonstration and a free 14-day trial period. During this period, you will have access to all features and can count on our Customer Success team to answer your questions.',
    'faq.q6': 'Is the platform compliant with Brazilian customs regulations?',
    'faq.a6': 'Yes, we keep our platform constantly updated according to Brazilian and international customs regulations. Our compliance team monitors regulatory changes to ensure our clients are always compliant.',
    'faq.cta.title': 'Still have questions?',
    'faq.cta.subtitle': 'Our team is ready to help with any questions you may have about the platform.',
    'faq.cta.contact': 'Contact Us',
    'faq.cta.docs': 'View Documentation',
    
    // CTA
    'cta.features.badge': 'Let\'s Talk',
    'cta.features.title': 'Transform Your Import Operation Today',
    'cta.features.subtitle': 'Schedule a personalized demonstration with our specialists and discover how Dasfabri can eliminate up to 40% of the time in your foreign trade processes.',
    'cta.features.item1.title': 'Personalized Demonstration',
    'cta.features.item1.description': 'See the platform in action with a use case for your business',
    'cta.features.item2.title': 'Specialized Support',
    'cta.features.item2.description': 'Our team is ready to answer your questions',
    'cta.features.item3.title': 'Global Presence',
    'cta.features.item3.description': 'Solution for importers throughout Brazil',
    'cta.features.item4.title': 'Free Consulting',
    'cta.features.item4.description': 'Initial analysis of your operation with no commitment',
    'cta.form.title': 'Request a demonstration',
    'cta.form.name': 'Full name *',
    'cta.form.namePlaceholder': 'Your name',
    'cta.form.email': 'Corporate email *',
    'cta.form.emailPlaceholder': 'your@email.com',
    'cta.form.company': 'Company *',
    'cta.form.companyPlaceholder': 'Company name',
    'cta.form.message': 'How can we help?',
    'cta.form.messagePlaceholder': 'Tell us about your operation and main challenges...',
    'cta.form.submit': 'Request demonstration',
    'cta.form.privacy': 'By submitting, you agree to our privacy policy and terms of use. Your data is safe with us.',
    'cta.form.success.title': 'Request sent!',
    'cta.form.success.message': 'We will contact you within 24 hours to schedule your demonstration.',
    'cta.form.success.redirect': 'You will be redirected to create your account...',
    'cta.form.success.button': 'Go to registration now',
    
    // About
    'about.badge': 'About the Platform',
    'about.title': 'What is Dasfabri?',
    'about.description': 'Dasfabri is a SaaS platform specialized in foreign trade, designed to simplify and optimize all stages of the import and export process. With an intuitive interface and robust features, we centralize complete control of your global operations.',
    'about.feature1.title': 'Cargo Control',
    'about.feature1.description': 'Real-time tracking of the location and status of each shipment.',
    'about.feature2.title': 'Cost Management',
    'about.feature2.description': 'Clear view of all costs involved, from freight to fees and taxes.',
    'about.feature3.title': 'Document Centralization',
    'about.feature3.description': 'Organization and quick access to all documents necessary for foreign trade.',
    
    // Integrations
    'integrations.badge': 'Connected Ecosystem',
    'integrations.title': 'Integration with Your Systems',
    'integrations.subtitle': 'Dasfabri easily connects to the systems you already use, ensuring continuous data flow without duplication.',
    'integrations.api.title': 'Open API',
    'integrations.api.description': 'Access all platform resources programmatically via our documented RESTful API',
    'integrations.edi.title': 'EDI Standard',
    'integrations.edi.description': 'Compatible with industry EDI standards for data exchange with trading partners',
    'integrations.custom.title': 'Didn\'t find your system? Don\'t worry.',
    'integrations.custom.description': 'Our technical team develops custom integrations for your ecosystem.',
    'integrations.stats.title': 'Early Adopter Program - Be One of the First',
    'integrations.stats.subtitle': 'We are looking for our first 10 clients to validate our platform. Product 90% ready, with dedicated support and special launch conditions.',
    'integrations.stats.cta': 'Learn more about integrations',
    'integrations.stats.stat1.value': '10',
    'integrations.stats.stat1.label': 'Early Adopter Spots',
    'integrations.stats.stat2.value': '40%',
    'integrations.stats.stat2.label': 'Time savings',
    'integrations.stats.stat3.value': '99.7%',
    'integrations.stats.stat3.label': 'Process accuracy',
    'integrations.stats.stat4.value': '24/7',
    'integrations.stats.stat4.label': 'Specialized support',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Detecta idioma do navegador ou usa português como padrão
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'pt-BR' || saved === 'en-US')) {
      return saved;
    }
    const browserLang = navigator.language;
    return browserLang.startsWith('en') ? 'en-US' : 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

