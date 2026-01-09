
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { sendContactEmail, isEmailJSConfigured } from '@/services/emailService';

const CTAForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let emailSent = false;
      
      // PRIORIDADE 1: Tentar enviar via EmailJS (funciona sem backend)
      if (isEmailJSConfigured()) {
        try {
          emailSent = await sendContactEmail({
            name,
            email,
            company,
            phone,
            country,
            message,
          });
          
          if (emailSent) {
            console.log('Email enviado com sucesso via EmailJS');
          }
        } catch (emailJSError) {
          console.warn('Erro ao enviar via EmailJS:', emailJSError);
        }
      }
      
      // PRIORIDADE 2: Tentar enviar para o backend (se EmailJS não funcionou)
      if (!emailSent) {
        try {
          const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
          const API_BASE_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://api.dasfabri.com.br' : 'http://localhost:8000');
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(`${API_BASE_URL}/api/v1/public/contact`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              company,
              phone: phone || undefined,
              country: country || undefined,
              message,
            }),
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);

          if (response.ok) {
            emailSent = true;
            const data = await response.json();
            console.log('Email enviado com sucesso via backend:', data);
          }
        } catch (backendError: any) {
          console.warn('Backend não disponível:', backendError);
        }
      }
      
      // PRIORIDADE 3: Salvar no localStorage como backup (sempre)
      const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
      submissions.push({
        name,
        email,
        company,
        phone: phone || undefined,
        country: country || undefined,
        message,
        timestamp: new Date().toISOString(),
        emailSent,
      });
      localStorage.setItem('contact_submissions', JSON.stringify(submissions));
      
      // Sempre mostrar sucesso ao usuário
      setSubmitted(true);
      
      toast({
        title: t('cta.form.success.title'),
        description: emailSent 
          ? t('cta.form.success.message')
          : 'Sua solicitação foi recebida. Entraremos em contato em breve.',
      });
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/auth/register');
      }, 3000);
      
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar sua solicitação. Por favor, tente novamente ou entre em contato diretamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">{t('cta.form.title')}</h3>
      
      {submitted ? (
        <div className="text-center py-8">
          <motion.div 
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">{t('cta.form.success.title')}</h4>
          <p className="text-gray-600 mb-4">
            {t('cta.form.success.message')}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="text-sm">{t('cta.form.success.redirect')}</span>
          </p>
          <Button 
            className="bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white"
            onClick={() => navigate('/auth/register')}
          >
            {t('cta.form.success.button')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('cta.form.name')}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-dasfabri-blue focus:border-dasfabri-blue"
              placeholder={t('cta.form.namePlaceholder')}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('cta.form.email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-dasfabri-blue focus:border-dasfabri-blue"
              placeholder={t('cta.form.emailPlaceholder')}
              required
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              {t('cta.form.company')}
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-dasfabri-blue focus:border-dasfabri-blue"
              placeholder={t('cta.form.companyPlaceholder')}
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-dasfabri-blue focus:border-dasfabri-blue bg-white text-gray-900"
              >
                <option value="">Selecione</option>
                <option value="BR">🇧🇷 Brasil</option>
                <option value="US">🇺🇸 Estados Unidos</option>
                <option value="AR">🇦🇷 Argentina</option>
                <option value="CL">🇨🇱 Chile</option>
                <option value="CO">🇨🇴 Colômbia</option>
                <option value="MX">🇲🇽 México</option>
                <option value="PE">🇵🇪 Peru</option>
                <option value="UY">🇺🇾 Uruguai</option>
                <option value="PT">🇵🇹 Portugal</option>
                <option value="ES">🇪🇸 Espanha</option>
                <option value="DE">🇩🇪 Alemanha</option>
                <option value="FR">🇫🇷 França</option>
                <option value="GB">🇬🇧 Reino Unido</option>
                <option value="IT">🇮🇹 Itália</option>
                <option value="CN">🇨🇳 China</option>
                <option value="JP">🇯🇵 Japão</option>
                <option value="IN">🇮🇳 Índia</option>
                <option value="OTHER">🌍 Outro</option>
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-dasfabri-blue focus:border-dasfabri-blue"
                placeholder="+55 (11) 99999-9999 ou formato internacional"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato internacional aceito
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t('cta.form.message')}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-dasfabri-blue focus:border-dasfabri-blue"
              placeholder={t('cta.form.messagePlaceholder')}
            ></textarea>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white py-4 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Enviando...
              </>
            ) : (
              <>
                {t('cta.form.submit')}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            {t('cta.form.privacy')}
          </p>
        </form>
      )}
    </div>
  );
};

export default CTAForm;
