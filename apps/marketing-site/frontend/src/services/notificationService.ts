
import { NotificationType, NotificationCategory } from '@/components/notifications/NotificationItem';

// Define the notification data structure
export interface NotificationData {
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
}

// Define notification levels
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

// Helper function to determine if notification should trigger push notification
export const shouldSendPushNotification = (priority: NotificationPriority): boolean => {
  return priority === 'high' || priority === 'critical';
};

// Helper function to map notification priority to notification type
export const mapPriorityToType = (priority: NotificationPriority): NotificationType => {
  switch (priority) {
    case 'critical':
      return 'alert';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
    default:
      return 'info';
  }
};

// Create notification by process ID
export const createProcessNotification = (
  processId: string, 
  message: string, 
  priority: NotificationPriority = 'medium'
): NotificationData => {
  const type = mapPriorityToType(priority);
  
  return {
    title: `Processo ${processId}`,
    message,
    type,
    category: 'process'
  };
};

// Create document notification
export const createDocumentNotification = (
  documentName: string,
  message: string,
  priority: NotificationPriority = 'medium'
): NotificationData => {
  const type = mapPriorityToType(priority);
  
  return {
    title: `Documento: ${documentName}`,
    message,
    type,
    category: 'document'
  };
};

// Create license notification
export const createLicenseNotification = (
  licenseId: string,
  message: string,
  priority: NotificationPriority = 'high'
): NotificationData => {
  const type = mapPriorityToType(priority);
  
  return {
    title: `Licença ${licenseId}`,
    message,
    type,
    category: 'license'
  };
};

// Create system notification
export const createSystemNotification = (
  title: string,
  message: string,
  priority: NotificationPriority = 'low'
): NotificationData => {
  const type = mapPriorityToType(priority);
  
  return {
    title,
    message,
    type,
    category: 'system'
  };
};

// Create deadline notification
export const createDeadlineNotification = (
  processId: string,
  deadline: Date,
  message?: string
): NotificationData => {
  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  let priority: NotificationPriority = 'medium';
  let notificationMessage = message || '';
  
  if (daysLeft <= 0) {
    priority = 'critical';
    notificationMessage = `${notificationMessage || 'Prazo vencido para o processo'} ${processId}. Ação imediata necessária.`;
  } else if (daysLeft <= 3) {
    priority = 'high';
    notificationMessage = `${notificationMessage || 'Prazo próximo para o processo'} ${processId}. Restam ${daysLeft} dia(s).`;
  } else if (daysLeft <= 7) {
    priority = 'medium';
    notificationMessage = `${notificationMessage || 'Prazo se aproximando para o processo'} ${processId}. Restam ${daysLeft} dias.`;
  } else {
    priority = 'low';
    notificationMessage = `${notificationMessage || 'Prazo para o processo'} ${processId} em ${daysLeft} dias.`;
  }
  
  const type = mapPriorityToType(priority);
  
  return {
    title: `Prazo: ${processId}`,
    message: notificationMessage,
    type,
    category: 'process'
  };
};
