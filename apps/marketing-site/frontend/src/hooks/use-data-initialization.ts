
import { useState, useEffect, useRef } from 'react';
import { Process } from '@/pages/import/ProcessesAdvanced';

interface UseDataInitializationProps {
  initialData: Process[];
}

export function useDataInitialization({ initialData }: UseDataInitializationProps) {
  const [allProcesses, setAllProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);
  
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return;
    
    // Simulate initial data loading with controlled timing
    const loadData = async () => {
      setIsLoading(true);
      
      // Ensure loading state is visible for at least 500ms for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Batch state updates
      setAllProcesses(initialData);
      setIsLoading(false);
      isInitialized.current = true;
    };
    
    loadData();
  }, [initialData]);

  return {
    allProcesses,
    isLoading,
    setIsLoading
  };
}

export default useDataInitialization;
