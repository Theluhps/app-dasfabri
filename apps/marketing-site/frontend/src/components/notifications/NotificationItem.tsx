
import React from 'react';
import { Bell, FileText, Package, Users, Settings, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type NotificationType = 'info' | 'warning' | 'success' | 'alert';
export type NotificationCategory = 'process' | 'document' | 'license' | 'system' | 'workflow' | 'approval';

export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  date: string; // formato: "DD/MM/YYYY - HH:MM"
  read: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps & {
  onMarkAsRead?: (id: string) => void;
}> = ({ id, title, message, type, category, date, read, onMarkAsRead }) => {
  const handleClick = () => {
    if (!read && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'process':
        return <Package className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'license':
        return <Users className="h-5 w-5" />;
      case 'system':
        return <Settings className="h-5 w-5" />;
      case 'workflow':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Parse a data do formato "DD/MM/YYYY - HH:MM" para um objeto Date
  const parseDate = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(' - ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const getTimeAgo = (dateStr: string) => {
    try {
      const date = parseDate(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-3 border-b cursor-pointer transition-colors hover:bg-slate-50",
        !read && "bg-blue-50 hover:bg-blue-100"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">
        {getCategoryIcon()}
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h4 className={cn(
            "text-sm font-medium",
            !read && "font-semibold"
          )}>
            {title}
          </h4>
          <div className="flex items-center gap-1">
            {getTypeIcon()}
            {!read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {getTimeAgo(date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
