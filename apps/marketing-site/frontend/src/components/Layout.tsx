
import React, { useState } from 'react';
import Sidebar from './system/Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20'}`}
      >
        {/* Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Conteúdo da página */}
        <main className="flex-1 p-4 lg:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
