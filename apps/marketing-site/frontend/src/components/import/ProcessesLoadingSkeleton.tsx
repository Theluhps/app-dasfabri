
import React from 'react';

const ProcessesLoadingSkeleton = () => {
  return (
    <div className="py-8 space-y-4 opacity-90 transition-all duration-300 ease-in-out">
      {/* Use consistent heights and styling for each row to prevent layout shifts */}
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse" style={{ animationDelay: "0.1s" }}></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
      <div className="h-12 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
};

export default React.memo(ProcessesLoadingSkeleton);
