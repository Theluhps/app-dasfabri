
import { useCallback, useRef } from 'react';

/**
 * A hook that returns a debounced version of the callback function
 * 
 * @param callback The function to be debounced
 * @param delay Delay in milliseconds
 * @returns Debounced version of the callback
 */
export const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

export default useDebounce;
