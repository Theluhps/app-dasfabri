
import React from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationsList from '@/components/notifications/NotificationsList';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <PageLayout 
      title="Notificações" 
      description="Gerencie todas as notificações do sistema"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button 
            variant="outline"
            onClick={() => navigate('/notifications/settings')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações de Notificação</span>
          </Button>
        </div>
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Suas Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationsList 
              notifications={notifications} 
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Notifications;
