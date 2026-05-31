import { useState, useEffect } from 'react';

/**
 * Returns true when the screen is iPad-sized (≥768px wide).
 * Reacts to orientation changes automatically.
 */
export function useIsPad(): boolean {
  const [isPad, setIsPad] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth >= 768
  );

  useEffect(() => {
    const handler = () => setIsPad(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isPad;
}
