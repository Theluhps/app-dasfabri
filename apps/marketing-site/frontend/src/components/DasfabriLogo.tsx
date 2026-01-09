
import React from 'react';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface DasfabriLogoProps {
  variant?: 'default' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DasfabriLogo: React.FC<DasfabriLogoProps> = ({ 
  variant = 'default', 
  className = '',
  size = 'md'
}) => {
  // Define o tamanho do logo baseado no prop size
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      case 'md':
      default:
        return 'w-12 h-12';
    }
  };

  const sizeClass = getSizeClass();
  const logoSrc = '/images/dasfabri-logo-full.png';
  
  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn(sizeClass, 'relative overflow-hidden')}>
        <AspectRatio ratio={1} className="h-full">
          <img 
            src={logoSrc} 
            alt="Dasfabri" 
            className={cn(
              'w-full h-full object-contain',
              variant === 'white' && 'brightness-0 invert'
            )}
          />
        </AspectRatio>
      </div>
    </div>
  );
};

export default DasfabriLogo;
