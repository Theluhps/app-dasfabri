
import React from 'react';

interface SidebarOverlayProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SidebarOverlay: React.FC<SidebarOverlayProps> = ({ 
  isSidebarOpen,
  setIsSidebarOpen 
}) => {
  if (!isSidebarOpen) return null;
  
  return (
    <div 
      className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-30" 
      onClick={() => setIsSidebarOpen(false)}
    />
  );
};

export default SidebarOverlay;
