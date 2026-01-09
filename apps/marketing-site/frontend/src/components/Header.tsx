
import React, { useState, useEffect } from 'react';
import DasfabriLogo from './DasfabriLogo';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: t('nav.home'), href: '#' },
    { label: t('nav.solutions'), href: '#problemas' },
    { label: t('nav.features'), href: '#funcionalidades' },
    { label: t('nav.benefits'), href: '#vantagens' },
    { label: t('nav.contact'), href: '#contato' },
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleDemoClick = () => {
    navigate('/auth/register');
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 shadow-sm backdrop-blur-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <DasfabriLogo className="flex-shrink-0" size="md" />
            <div className="ml-2 hidden sm:block">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-dasfabri-blue" />
                <span className="text-xs font-medium text-gray-600">Soluções em Comércio Exterior</span>
              </div>
            </div>
          </motion.div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-dasfabri-blue transition-colors duration-200 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Language Selector */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1">
              <Globe className="w-4 h-4 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'pt-BR' | 'en-US')}
                className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="pt-BR">PT</option>
                <option value="en-US">EN</option>
              </select>
            </div>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 border-dasfabri-blue text-dasfabri-blue hover:bg-dasfabri-blue/5 font-medium px-4 py-2 h-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleLoginClick}
            >
              {t('nav.login')}
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white font-medium px-4 py-2 h-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleDemoClick}
            >
              {t('nav.demo')}
            </button>
          </motion.div>

          {/* Menu Mobile Toggle */}
          <motion.button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-dasfabri-blue hover:bg-gray-100"
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden py-4 shadow-lg bg-white absolute left-0 right-0 border-b z-50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3 px-4">
              {menuItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="px-2 py-2 text-base font-medium text-gray-700 hover:text-dasfabri-blue hover:bg-gray-50 rounded"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                {/* Language Selector Mobile */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 justify-center">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'pt-BR' | 'en-US')}
                    className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
                  >
                    <option value="pt-BR">Português</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
                <button 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 border-dasfabri-blue text-dasfabri-blue hover:bg-dasfabri-blue/5 font-medium px-4 py-2 h-10 w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  onClick={handleLoginClick}
                >
                  {t('nav.login')}
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white font-medium px-4 py-2 h-10 w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  onClick={handleDemoClick}
                >
                  {t('nav.demo')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
