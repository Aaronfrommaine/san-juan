import { useState, useEffect, useRef } from 'react';

export function useChecklistEasterEgg(checkedItems: string[], totalItems: number) {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const prevCheckedCountRef = useRef(checkedItems.length);
  const wasCompleteRef = useRef(false);

  useEffect(() => {
    const currentCount = checkedItems.length;
    const isComplete = currentCount === totalItems;
    
    // Update wasComplete ref when all items are checked
    if (isComplete) {
      wasCompleteRef.current = true;
    }

    // Show easter egg when unchecking items after having all checked
    if (wasCompleteRef.current && currentCount < totalItems) {
      setShowEasterEgg(true);
      wasCompleteRef.current = false; // Reset the complete state
      
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setShowEasterEgg(false);
      }, 4000);

      return () => clearTimeout(timer);
    }

    prevCheckedCountRef.current = currentCount;
  }, [checkedItems.length, totalItems]);

  const dismissEasterEgg = () => setShowEasterEgg(false);

  return { showEasterEgg, dismissEasterEgg };
}