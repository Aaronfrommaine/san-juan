import { useState, useEffect } from 'react';

interface EasterEgg {
  message: string;
  type: 'bonus' | 'discount' | 'tip';
  duration?: number;
  code?: string; // Discount or bonus code
  value?: number; // Discount percentage or bonus value
}

export function useEasterEgg() {
  const [activeEgg, setActiveEgg] = useState<EasterEgg | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>([]);

  const easterEggs: EasterEgg[] = [
    {
      message: "🎉 Congratulations! Use code BONUS100 for a $100 resource credit",
      type: 'bonus',
      duration: 0, // Won't auto-dismiss
      code: 'BONUS100',
      value: 100
    },
    {
      message: "🌟 Early Bird Special! Use EARLY10 for 10% off",
      type: 'discount',
      duration: 0,
      code: 'EARLY10',
      value: 10
    },
    {
      message: "💡 Pro Tip: VIP members get exclusive property listings",
      type: 'tip',
      duration: 4000
    }
  ];

  const triggerEasterEgg = () => {
    setClickCount(prev => prev + 1);
    
    // Show easter egg every 5 clicks
    if (clickCount % 5 === 4) {
      const availableEggs = easterEggs.filter(egg => 
        !egg.code || !unlockedCodes.includes(egg.code)
      );
      
      if (availableEggs.length === 0) return;
      
      const randomEgg = availableEggs[Math.floor(Math.random() * availableEggs.length)];
      setActiveEgg(randomEgg);

      // Add code to unlocked codes if it exists
      if (randomEgg.code) {
        setUnlockedCodes(prev => [...prev, randomEgg.code!]);
      }

      if (randomEgg.duration) {
        setTimeout(() => setActiveEgg(null), randomEgg.duration);
      }
    }
  };

  const dismissEasterEgg = () => setActiveEgg(null);

  return { 
    activeEgg, 
    triggerEasterEgg, 
    dismissEasterEgg,
    unlockedCodes 
  };
}