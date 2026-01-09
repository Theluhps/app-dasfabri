
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ModuleFeatureHighlightProps {
  title: string;
  description: string;
  actionText: string;
  actionPath: string;
  moduleColor: string;
}

const ModuleFeatureHighlight: React.FC<ModuleFeatureHighlightProps> = ({
  title,
  description,
  actionText,
  actionPath,
  moduleColor
}) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 border">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        <Button 
          onClick={() => handleNavigate(actionPath)}
          style={{ backgroundColor: moduleColor }}
          className="hover:opacity-90"
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default ModuleFeatureHighlight;
