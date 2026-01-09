/**
 * Serviço de envio de email via EmailJS
 * Permite enviar emails diretamente do frontend sem backend
 */
import emailjs from '@emailjs/browser';

// Configurações do EmailJS (serão configuradas via variáveis de ambiente)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT || '';
const EMAILJS_TEMPLATE_ID_ACCESS = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ACCESS || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Inicializar EmailJS
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  country?: string;
  message?: string;
}

export interface AccessRequestFormData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  country?: string;
  position?: string;
}

/**
 * Envia email de contato/demonstração
 */
export const sendContactEmail = async (data: ContactFormData): Promise<boolean> => {
  try {
    // Se EmailJS não estiver configurado, retorna false
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_CONTACT || !EMAILJS_PUBLIC_KEY) {
      console.warn('EmailJS não configurado. Email não será enviado.');
      return false;
    }

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      company: data.company,
      phone: data.phone || 'Não informado',
      country: data.country || 'Não informado',
      message: data.message || 'Nenhuma mensagem adicional',
      to_email: 'dasfsociais@gmail.com',
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONTACT,
      templateParams
    );

    console.log('Email de contato enviado com sucesso via EmailJS');
    return true;
  } catch (error) {
    console.error('Erro ao enviar email via EmailJS:', error);
    return false;
  }
};

/**
 * Envia email de solicitação de acesso
 */
export const sendAccessRequestEmail = async (data: AccessRequestFormData): Promise<boolean> => {
  try {
    // Se EmailJS não estiver configurado, retorna false
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID_ACCESS || !EMAILJS_PUBLIC_KEY) {
      console.warn('EmailJS não configurado. Email não será enviado.');
      return false;
    }

    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      company: data.company,
      phone: data.phone || 'Não informado',
      country: data.country || 'Não informado',
      position: data.position || 'Não informado',
      to_email: 'dasfsociais@gmail.com',
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ACCESS,
      templateParams
    );

    console.log('Email de solicitação de acesso enviado com sucesso via EmailJS');
    return true;
  } catch (error) {
    console.error('Erro ao enviar email via EmailJS:', error);
    return false;
  }
};

/**
 * Verifica se EmailJS está configurado
 */
export const isEmailJSConfigured = (): boolean => {
  return !!(
    EMAILJS_SERVICE_ID &&
    EMAILJS_TEMPLATE_ID_CONTACT &&
    EMAILJS_TEMPLATE_ID_ACCESS &&
    EMAILJS_PUBLIC_KEY
  );
};

