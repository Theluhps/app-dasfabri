
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationItem, { NotificationItemProps } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Bell, BellOff, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationsListProps {
  notifications: NotificationItemProps[];
  onMarkAllAsRead?: () => void;
  onMarkAsRead?: (id: string) => void;
  showFilters?: boolean;
  emptyMessage?: string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  showFilters = true,
  emptyMessage = 'Sem notificações'
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    
  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notification => !notification.read);
    
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const dateA = new Date(a.date.split(' - ')[0].split('/').reverse().join('-'));
    const dateB = new Date(b.date.split(' - ')[0].split('/').reverse().join('-'));
    return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });
    
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex items-center space-x-1"
            >
              <Bell className="h-4 w-4 mr-1" />
              <span>Todas ({notifications.length})</span>
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="flex items-center space-x-1"
            >
              <BellOff className="h-4 w-4 mr-1" />
              <span>Não lidas ({unreadCount})</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select 
              defaultValue="newest"
              onValueChange={(value) => setSortBy(value as 'newest' | 'oldest')}
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigas</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-none ${viewMode === 'list' ? 'bg-muted' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-none ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {unreadCount > 0 && onMarkAllAsRead && (
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            Marcar todas como lidas
          </Button>
        </div>
      )}

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-2'}>
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              id={notification.id}
              title={notification.title}
              message={notification.message}
              type={notification.type}
              category={notification.category}
              date={notification.date}
              read={notification.read}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {filter === 'all' ? emptyMessage : 'Não há notificações não lidas'}
          </div>
        )}
      </div>
      
      {sortedNotifications.length > 5 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/notifications/center')}
          >
            Ver mais notificações
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
