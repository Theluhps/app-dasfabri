
import { useCallback } from 'react';

export function useNotificationSound() {
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/notification-sound.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => {
        // Silent fail - some browsers require user interaction before playing audio
        console.log("Couldn't play notification sound:", e);
      });
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, []);

  return { playNotificationSound };
}
