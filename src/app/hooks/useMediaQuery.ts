import { useEffect, useState } from 'react';

/**
 * SSR/initial-render-safe media query hook. Returns `null` until the first
 * client render so callers can render a neutral placeholder and avoid a
 * flash of the wrong layout (e.g. the desktop deck before hydration).
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}