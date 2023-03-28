import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';

const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isTablet = useMediaQuery('(max-width: 1200px)');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWindowWidth(window?.innerWidth);
    };

    window.addEventListener('resize', handleWindowSizeChange);

    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  return { isMobile, isTablet, windowWidth };
};

export default useResponsive;
