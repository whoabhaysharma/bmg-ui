import { useState, useEffect } from 'react';

export function useKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    let initialWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;

    const handleResize = () => {
      const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const currentWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;

      // Check if width has changed significantly (rotation)
      if (Math.abs(currentWidth - initialWidth) > 50) {
        initialWidth = currentWidth;
        initialHeight = currentHeight;
        setIsKeyboardOpen(false);
        return;
      }

      // If height shrinks significantly but width stays roughly the same, it's likely the keyboard
      // We use 0.85 as a threshold (15% reduction)
      if (currentHeight < initialHeight * 0.85) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
        // Update initial height if we are back to "full" view or if it grew larger (e.g. address bar hid)
        if (currentHeight > initialHeight) {
          initialHeight = currentHeight;
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return isKeyboardOpen;
}
