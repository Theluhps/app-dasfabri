
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'indigo' | 'emerald';
  trend?: 'up' | 'down';
  onClick?: () => void;
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  color = 'blue',
  trend,
  onClick,
  href
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };
  
  const getColorClass = () => {
    switch(color) {
      case 'blue':
        return 'text-blue-500';
      case 'green':
        return 'text-green-500';
      case 'red':
        return 'text-red-500';
      case 'purple':
        return 'text-purple-500';
      case 'amber':
        return 'text-amber-500';
      case 'indigo':
        return 'text-indigo-500';
      case 'emerald':
        return 'text-emerald-500';
      default:
        return 'text-blue-500';
    }
  };
  
  const getBorderColorClass = () => {
    switch(color) {
      case 'blue':
        return 'border-l-blue-500';
      case 'green':
        return 'border-l-green-500';
      case 'red':
        return 'border-l-red-500';
      case 'purple':
        return 'border-l-purple-500';
      case 'amber':
        return 'border-l-amber-500';
      case 'indigo':
        return 'border-l-indigo-500';
      case 'emerald':
        return 'border-l-emerald-500';
      default:
        return 'border-l-blue-500';
    }
  };
  
  const getTrendClass = () => {
    if (!trend) return 'text-muted-foreground';
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  };
  
  const isClickable = onClick || href;
  
  return (
    <Card 
      className={cn(
        isDark ? 'bg-gray-800 border-gray-700' : '',
        `border-l-4 ${getBorderColorClass()}`,
        isClickable && 'cursor-pointer hover:shadow-lg transition-shadow hover:scale-[1.02]'
      )}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          {title}
        </CardTitle>
        <div className={getColorClass()}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isDark ? 'text-gray-100' : ''}`}>
          {value}
        </div>
        <p className={`text-xs ${getTrendClass()}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
