
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import DasfabriLogo from '@/components/DasfabriLogo';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  fallbackClassName?: string;
  showPlaceholder?: boolean;
  aspectRatio?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallback = "Imagem",
  fallbackClassName,
  showPlaceholder = true,
  aspectRatio,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const imageContent = () => {
    if (!src || hasError) {
      return (
        <div className={cn(
          "flex items-center justify-center bg-gray-100 rounded-md w-full h-full",
          fallbackClassName || className
        )}>
          {showPlaceholder && (
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
              <DasfabriLogo className="w-auto" size="md" />
              <span className="text-sm text-gray-500 mt-2">{fallback}</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover", className)}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    );
  };

  if (aspectRatio) {
    return (
      <AspectRatio ratio={aspectRatio}>
        {imageContent()}
      </AspectRatio>
    );
  }

  return imageContent();
};

export default ImageWithFallback;
