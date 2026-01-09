
import React from 'react';
import DasfabriLogo from './DasfabriLogo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <DasfabriLogo variant="white" size="md" />
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-dasfabri-skyBlue transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-dasfabri-skyBlue transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-dasfabri-skyBlue transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-dasfabri-skyBlue transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-dasfabri-skyBlue transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">{t('footer.product.title')}</h4>
            <ul className="space-y-2">
              <li><a href="#funcionalidades" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.product.features')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.product.pricing')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.product.cases')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.product.security')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.product.api')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">{t('footer.company.title')}</h4>
            <ul className="space-y-2">
              <li><a href="#sobre" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.company.about')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.company.careers')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.company.blog')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.company.press')}</a></li>
              <li><a href="#contato" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.company.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">{t('footer.support.title')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.support.help')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.support.docs')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.support.status')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.support.tutorials')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors">{t('footer.support.webinars')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="p-2 rounded bg-dasfabri-blue/20 text-dasfabri-skyBlue">
                <Shield className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-400">
                {t('footer.security')}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors text-sm">{t('footer.terms')}</a>
              <a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors text-sm">{t('footer.privacy')}</a>
              <a href="#" className="text-gray-400 hover:text-dasfabri-skyBlue transition-colors text-sm">{t('footer.cookies')}</a>
            </div>
          </div>
          
          <div className="mt-6 text-center md:text-left">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Dasfabri. {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
