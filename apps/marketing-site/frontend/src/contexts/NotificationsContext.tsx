
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItemProps } from '@/components/notifications/NotificationItem';
import { toast } from '@/hooks/use-toast';

interface NotificationsContextType {
  notifications: NotificationItemProps[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItemProps, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Initial notifications for demo purposes
const initialNotifications: NotificationItemProps[] = [
  {
    id: '1',
    title: 'Licença de importação aprovada',
    message: 'A licença para o processo IMP-2023-001 foi aprovada pela autoridade competente.',
    type: 'success',
    category: 'license',
    date: '15/05/2025 - 10:23',
    read: false
  },
  {
    id: '2',
    title: 'Documentos pendentes',
    message: 'Há documentos pendentes que precisam ser enviados para o processo EXP-2023-003.',
    type: 'warning',
    category: 'document',
    date: '14/05/2025 - 14:45',
    read: false
  },
  {
    id: '3',
    title: 'Vencimento próximo',
    message: 'O contrato de câmbio CC-2023-002 vence em 3 dias.',
    type: 'alert',
    category: 'process',
    date: '14/05/2025 - 08:30',
    read: true
  },
  {
    id: '4',
    title: 'Fatura recebida',
    message: 'Uma nova fatura do fornecedor foi recebida para o processo IMP-2023-002.',
    type: 'info',
    category: 'document',
    date: '13/05/2025 - 16:15',
    read: true
  }
];

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>(initialNotifications);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Format the current date
  const formatDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };
  
  // Add a new notification
  const addNotification = useCallback((notification: Omit<NotificationItemProps, 'id' | 'date' | 'read'>) => {
    const newNotification: NotificationItemProps = {
      ...notification,
      id: generateId(),
      date: formatDate(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show a toast for the new notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  }, []);
  
  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);
  
  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
