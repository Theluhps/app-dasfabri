"""
Serviço de envio de emails
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Configurações de email (variáveis de ambiente)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USER)
SMTP_TO_EMAIL = os.getenv("SMTP_TO_EMAIL", "dasfsociais@gmail.com")

def send_email(
    to_email: str,
    subject: str,
    body_html: str,
    body_text: Optional[str] = None
) -> bool:
    """
    Envia um email usando SMTP
    
    Args:
        to_email: Email do destinatário
        subject: Assunto do email
        body_html: Corpo do email em HTML
        body_text: Corpo do email em texto (opcional)
    
    Returns:
        True se enviado com sucesso, False caso contrário
    """
    try:
        # Se não houver configuração de SMTP, apenas loga
        if not SMTP_USER or not SMTP_PASSWORD:
            logger.warning("SMTP não configurado. Email não será enviado.")
            logger.info(f"Email que seria enviado para {to_email}: {subject}")
            return False
        
        # Criar mensagem
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = SMTP_FROM_EMAIL
        msg['To'] = to_email
        
        # Adicionar corpo em texto
        if body_text:
            part1 = MIMEText(body_text, 'plain', 'utf-8')
            msg.attach(part1)
        
        # Adicionar corpo em HTML
        part2 = MIMEText(body_html, 'html', 'utf-8')
        msg.attach(part2)
        
        # Conectar e enviar
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email enviado com sucesso para {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Erro ao enviar email para {to_email}: {str(e)}")
        return False

def send_contact_notification(
    name: str,
    email: str,
    company: str,
    phone: Optional[str] = None,
    country: Optional[str] = None,
    message: Optional[str] = None
) -> bool:
    """
    Envia notificação profissional de novo contato para a equipe de vendas
    """
    subject = f"Nova Solicitação de Demonstração - {company}"
    
    body_html = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                                    Nova Solicitação de Demonstração
                                </h1>
                                <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">
                                    Sistema Dasfabri - Comércio Exterior
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                                    Você recebeu uma nova solicitação de demonstração através do site Dasfabri.
                                </p>
                                
                                <!-- Contact Information Card -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <h2 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                                                Informações do Contato
                                            </h2>
                                            
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Nome:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 600;">{name}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Email:</span>
                                                        <a href="mailto:{email}" style="color: #2563eb; font-size: 14px; text-decoration: none; font-weight: 500;">{email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Empresa:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 600;">{company}</span>
                                                    </td>
                                                </tr>
                                                {f'''
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">País:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 500;">{country}</span>
                                                    </td>
                                                </tr>
                                                ''' if country else ''}
                                                {f'''
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Telefone:</span>
                                                        <a href="tel:{phone}" style="color: #111827; font-size: 14px; text-decoration: none; font-weight: 500;">{phone}</a>
                                                    </td>
                                                </tr>
                                                ''' if phone else ''}
                                                {f'''
                                                <tr>
                                                    <td style="padding: 12px 0;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: block; margin-bottom: 8px;">Mensagem:</span>
                                                        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">{message}</p>
                                                    </td>
                                                </tr>
                                                ''' if message else ''}
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Action Items -->
                                <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #2563eb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                                    <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px; font-weight: 600;">
                                        📋 Próximos Passos
                                    </h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                                        <li>Entrar em contato com o cliente em até <strong>24 horas</strong></li>
                                        <li>Agendar demonstração personalizada da plataforma</li>
                                        <li>Verificar solicitação no painel administrativo</li>
                                    </ul>
                                </div>
                                
                                <!-- CTA Button -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                    <tr>
                                        <td align="center" style="padding: 0;">
                                            <a href="mailto:{email}?subject=Re: Solicitação de Demonstração - {company}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
                                                Responder ao Cliente
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; line-height: 1.6;">
                                    Este email foi gerado automaticamente pelo sistema Dasfabri.
                                </p>
                                <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                                    © {datetime.now().year} Dasfabri. Todos os direitos reservados.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    body_text = f"""
NOVA SOLICITAÇÃO DE DEMONSTRAÇÃO
================================

Você recebeu uma nova solicitação de demonstração através do site Dasfabri.

INFORMAÇÕES DO CONTATO
----------------------
Nome: {name}
Email: {email}
Empresa: {company}
{f'País: {country}' if country else ''}
{f'Telefone: {phone}' if phone else ''}
{f'Mensagem: {message}' if message else ''}

PRÓXIMOS PASSOS
---------------
• Entrar em contato com o cliente em até 24 horas
• Agendar demonstração personalizada da plataforma
• Verificar solicitação no painel administrativo

Responder ao cliente: {email}

---
Este email foi gerado automaticamente pelo sistema Dasfabri.
© {datetime.now().year} Dasfabri. Todos os direitos reservados.
"""
    
    return send_email(SMTP_TO_EMAIL, subject, body_html, body_text)

def send_access_request_notification(
    name: str,
    email: str,
    company: str,
    phone: Optional[str] = None,
    country: Optional[str] = None,
    position: Optional[str] = None
) -> bool:
    """
    Envia notificação profissional de nova solicitação de acesso para admins
    """
    subject = f"Nova Solicitação de Acesso ao Sistema - {company}"
    
    body_html = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa; padding: 20px;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                                    Nova Solicitação de Acesso
                                </h1>
                                <p style="margin: 10px 0 0; color: #d1fae5; font-size: 14px;">
                                    Sistema Dasfabri - Comércio Exterior
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                                    Uma nova solicitação de acesso ao sistema foi recebida e requer sua aprovação.
                                </p>
                                
                                <!-- Applicant Information Card -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                                    <tr>
                                        <td style="padding: 25px;">
                                            <h2 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #059669; padding-bottom: 10px;">
                                                Informações do Solicitante
                                            </h2>
                                            
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Nome:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 600;">{name}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Email:</span>
                                                        <a href="mailto:{email}" style="color: #059669; font-size: 14px; text-decoration: none; font-weight: 500;">{email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Empresa:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 600;">{company}</span>
                                                    </td>
                                                </tr>
                                                {f'''
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">País:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 500;">{country}</span>
                                                    </td>
                                                </tr>
                                                ''' if country else ''}
                                                {f'''
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Telefone:</span>
                                                        <a href="tel:{phone}" style="color: #111827; font-size: 14px; text-decoration: none; font-weight: 500;">{phone}</a>
                                                    </td>
                                                </tr>
                                                ''' if phone else ''}
                                                {f'''
                                                <tr>
                                                    <td style="padding: 12px 0;">
                                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500; display: inline-block; width: 100px;">Cargo:</span>
                                                        <span style="color: #111827; font-size: 14px; font-weight: 500;">{position}</span>
                                                    </td>
                                                </tr>
                                                ''' if position else ''}
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Status Badge -->
                                <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin-bottom: 30px; text-align: center;">
                                    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                        ⏳ Status: <span style="color: #d97706;">Aguardando Aprovação</span>
                                    </p>
                                </div>
                                
                                <!-- Action Items -->
                                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #059669; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                                    <h3 style="margin: 0 0 15px; color: #047857; font-size: 16px; font-weight: 600;">
                                        ✅ Ações Necessárias
                                    </h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                                        <li>Revisar informações do solicitante</li>
                                        <li>Aprovar ou rejeitar a solicitação no painel administrativo</li>
                                        <li>Enviar email de confirmação ao solicitante após aprovação</li>
                                    </ul>
                                </div>
                                
                                <!-- CTA Button -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                    <tr>
                                        <td align="center" style="padding: 0;">
                                            <a href="#" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
                                                Acessar Painel Administrativo
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; line-height: 1.6;">
                                    Este email foi gerado automaticamente pelo sistema Dasfabri.
                                </p>
                                <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                                    © {datetime.now().year} Dasfabri. Todos os direitos reservados.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    body_text = f"""
NOVA SOLICITAÇÃO DE ACESSO AO SISTEMA
=====================================

Uma nova solicitação de acesso ao sistema foi recebida e requer sua aprovação.

INFORMAÇÕES DO SOLICITANTE
---------------------------
Nome: {name}
Email: {email}
Empresa: {company}
{f'País: {country}' if country else ''}
{f'Telefone: {phone}' if phone else ''}
{f'Cargo: {position}' if position else ''}

STATUS: ⏳ Aguardando Aprovação

AÇÕES NECESSÁRIAS
-----------------
• Revisar informações do solicitante
• Aprovar ou rejeitar a solicitação no painel administrativo
• Enviar email de confirmação ao solicitante após aprovação

---
Este email foi gerado automaticamente pelo sistema Dasfabri.
© {datetime.now().year} Dasfabri. Todos os direitos reservados.
"""
    
    return send_email(SMTP_TO_EMAIL, subject, body_html, body_text)

