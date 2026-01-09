
import React, { useState } from 'react';
import PageLayout from '@/components/system/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useNotifications } from '@/contexts/NotificationsContext';
import NotificationsList from '@/components/notifications/NotificationsList';
import { NotificationItemProps } from '@/components/notifications/NotificationItem';
import {
  BarChart3,
  Bell,
  BellOff,
  Calendar,
  Check,
  Clock,
  FileText,
  Filter,
  Package,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const NotificationsCenter = () => {
  const { theme } = useTheme();
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  // Filter state
  const [currentFilter, setCurrentFilter] = useState<'all' | 'process' | 'document' | 'license' | 'system'>('all');
  
  // Get filtered notifications based on the current filter
  const filteredNotifications = currentFilter === 'all'
    ? notifications
    : notifications.filter(notification => notification.category === currentFilter);
  
  const getFilterBadgeCount = (category: 'process' | 'document' | 'license' | 'system') => {
    return notifications.filter(notification => notification.category === category).length;
  };
  
  return (
    <PageLayout
      title="Central de Notificações"
      description="Gerencie e visualize todas as suas notificações"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-gray-100' : ''}>
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={currentFilter === 'all' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setCurrentFilter('all')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Todas</span>
                  <Badge className="ml-auto" variant="secondary">
                    {notifications.length}
                  </Badge>
                </Button>
                
                <Button
                  variant={currentFilter === 'process' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setCurrentFilter('process')}
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>Processos</span>
                  <Badge className="ml-auto" variant="secondary">
                    {getFilterBadgeCount('process')}
                  </Badge>
                </Button>
                
                <Button
                  variant={currentFilter === 'document' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setCurrentFilter('document')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Documentos</span>
                  <Badge className="ml-auto" variant="secondary">
                    {getFilterBadgeCount('document')}
                  </Badge>
                </Button>
                
                <Button
                  variant={currentFilter === 'license' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setCurrentFilter('license')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Licenças</span>
                  <Badge className="ml-auto" variant="secondary">
                    {getFilterBadgeCount('license')}
                  </Badge>
                </Button>
                
                <Button
                  variant={currentFilter === 'system' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setCurrentFilter('system')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Sistema</span>
                  <Badge className="ml-auto" variant="secondary">
                    {getFilterBadgeCount('system')}
                  </Badge>
                </Button>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => markAllAsRead()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  <span>Marcar todas como lidas</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => clearAll()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Limpar todas</span>
                </Button>
                
                <Button
                  variant="default"
                  className="w-full justify-start mt-4"
                  onClick={() => navigate('/notifications/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`mt-6 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-gray-100' : ''}>
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-blue-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Total
                    </span>
                  </div>
                  <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {notifications.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BellOff className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Não lidas
                    </span>
                  </div>
                  <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {unreadCount}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-red-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Urgentes
                    </span>
                  </div>
                  <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {notifications.filter(notif => notif.type === 'alert').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-green-500" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Hoje
                    </span>
                  </div>
                  <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {notifications.filter(notif => notif.date.includes(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/'))).length}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Ver relatório completo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className={isDark ? 'text-gray-100' : ''}>
                    {currentFilter === 'all' ? 'Todas as Notificações' : 
                     currentFilter === 'process' ? 'Notificações de Processos' :
                     currentFilter === 'document' ? 'Notificações de Documentos' :
                     currentFilter === 'license' ? 'Notificações de Licenças' : 'Notificações do Sistema'}
                  </CardTitle>
                  <CardDescription className={isDark ? 'text-gray-400' : ''}>
                    {filteredNotifications.length} notificações {currentFilter !== 'all' ? `de ${currentFilter}` : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="unread">Não lidas ({unreadCount})</TabsTrigger>
                  <TabsTrigger value="read">Lidas ({notifications.length - unreadCount})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <NotificationsList
                    notifications={filteredNotifications}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                </TabsContent>
                
                <TabsContent value="unread">
                  <NotificationsList
                    notifications={filteredNotifications.filter(n => !n.read)}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                </TabsContent>
                
                <TabsContent value="read">
                  <NotificationsList
                    notifications={filteredNotifications.filter(n => n.read)}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotificationsCenter;
