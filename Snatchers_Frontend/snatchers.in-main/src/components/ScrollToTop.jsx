import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Get the current URL pathname
  const { pathname } = useLocation();

  // This 'useEffect' hook will run every time the 'pathname' changes
  useEffect(() => {
    // Scroll the window to the top (x: 0, y: 0)
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this runs on page change

  // This component doesn't render any visible HTML
  return null;
}
