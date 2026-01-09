import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, User, Mail, Building, Phone, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { sendAccessRequestEmail, isEmailJSConfigured } from '@/services/emailService';

// Esquema de validação para o formulário de solicitação de acesso
const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  company: z.string().min(2, { message: 'Nome da empresa deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string()
    .min(8, { message: 'Telefone deve ter pelo menos 8 dígitos' })
    .regex(/^[\d\s\+\-\(\)]+$/, { message: 'Telefone deve conter apenas números, espaços, +, - e parênteses' }),
  country: z.string().optional(),
  position: z.string().min(2, { message: 'Cargo deve ter pelo menos 2 caracteres' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  passwordConfirm: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' }),
  terms: z.boolean().refine(val => val === true, { message: 'Você deve aceitar os termos' })
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
      defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      position: '',
      password: '',
      passwordConfirm: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      
      let emailSent = false;
      
      // PRIORIDADE 1: Tentar enviar via EmailJS (funciona sem backend)
      if (isEmailJSConfigured()) {
        try {
          emailSent = await sendAccessRequestEmail({
            name: data.name,
            email: data.email,
            company: data.company,
            phone: data.phone,
            country: data.country,
            position: data.position,
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
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_BASE_URL}/api/v1/public/access-request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: data.name,
              company: data.company,
              email: data.email,
              phone: data.phone,
              country: data.country,
              position: data.position,
            }),
          });

          if (response.ok) {
            emailSent = true;
            console.log('Email enviado com sucesso via backend');
          }
        } catch (backendError) {
          console.warn('Backend não disponível:', backendError);
        }
      }
      
      // PRIORIDADE 3: Salvar no localStorage como backup
      const submissions = JSON.parse(localStorage.getItem('access_requests') || '[]');
      submissions.push({
        ...data,
        timestamp: new Date().toISOString(),
        emailSent,
      });
      localStorage.setItem('access_requests', JSON.stringify(submissions));

      toast({
        title: "Solicitação enviada",
        description: emailSent
          ? "Sua solicitação de acesso foi enviada com sucesso. Você receberá um email quando for aprovado."
          : "Sua solicitação foi recebida. Entraremos em contato em breve.",
      });
      
      // Redirecionar para página de confirmação
      navigate('/auth/request-sent');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="bg-dasfabri-blue rounded-md w-12 h-12 flex items-center justify-center">
              <img 
                src="/images/dasfabri-logo-icon.png" 
                alt="Dasfabri" 
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Solicitar Acesso</h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados abaixo para solicitar acesso à plataforma
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nome completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        {...field} 
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                        placeholder="João da Silva" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Empresa</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        {...field} 
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                        placeholder="Sua Empresa Ltda" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Cargo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        {...field} 
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                        placeholder="Seu cargo na empresa" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email corporativo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        {...field} 
                        type="email" 
                        className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                        placeholder="seu-email@empresa.com" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">País</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-dasfabri-blue focus:border-dasfabri-blue"
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-gray-700">Telefone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input 
                          {...field} 
                          type="tel"
                          className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                          placeholder="+55 (11) 99999-9999 ou formato internacional" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato internacional aceito: +1 (555) 123-4567, +44 20 1234 5678, etc.
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                        placeholder="******" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        {...field} 
                        type={showPasswordConfirm ? "text" : "password"} 
                        className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                        placeholder="******" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswordConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-700">
                      Eu concordo com os <a href="#" className="text-dasfabri-blue hover:underline">termos de serviço</a> e <a href="#" className="text-dasfabri-blue hover:underline">política de privacidade</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-dasfabri-blue hover:bg-dasfabri-darkBlue text-white font-medium px-4 py-2 h-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dasfabri-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando solicitação...' : 'Solicitar acesso'}
            </button>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/auth/login" className="text-dasfabri-blue hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
