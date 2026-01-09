
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import NotificationsList from './NotificationsList';
import { useNavigate } from 'react-router-dom';

interface NotificationBellProps {
  maxNotifications?: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ maxNotifications = 5 }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const { playNotificationSound } = useNotificationSound();
  const [open, setOpen] = useState(false);
  
  const handleToggle = (newState: boolean) => {
    setOpen(newState);
    
    // Play notification sound when opening the popover and there are unread notifications
    if (newState && unreadCount > 0) {
      playNotificationSound();
    }
  };
  
  const handleViewAll = () => {
    setOpen(false);
    navigate('/notifications/center');
  };
  
  const recentNotifications = notifications
    .sort((a, b) => {
      const dateA = new Date(a.date.split(' - ')[0].split('/').reverse().join('-'));
      const dateB = new Date(b.date.split(' - ')[0].split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, maxNotifications);
  
  return (
    <Popover open={open} onOpenChange={handleToggle}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          <Bell className={`${isDark ? 'text-gray-300' : 'text-gray-600'} h-5 w-5`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`w-[380px] p-0 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}
        align="end"
      >
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notificações
            </h2>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => markAllAsRead()}
                className={`text-xs ${isDark ? 'text-gray-300 hover:text-white' : ''}`}
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-2">
          <NotificationsList 
            notifications={recentNotifications}
            onMarkAsRead={markAsRead}
            showFilters={false}
            emptyMessage="Você não possui notificações"
          />
        </div>
        
        <div className={`p-3 border-t text-center ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={handleViewAll}
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
