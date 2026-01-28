import { useEffect, useState } from 'react';

/**
 * Custom hook to detect screen size changes based on media queries.
 * @param query Media query string, e.g., '(max-width: 768px)'
 * @returns A boolean indicating whether the query matches or not
 */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
