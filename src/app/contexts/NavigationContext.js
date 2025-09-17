'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Enhanced navigation function with loading state
  const navigateWithLoading = (href, options = {}) => {
    // Don't show loading for same page navigation
    if (href === pathname) {
      return;
    }

    setIsNavigating(true);
    
    // Use router.push with the provided options
    router.push(href, options);
  };

  // Enhanced replace function with loading state
  const replaceWithLoading = (href, options = {}) => {
    // Don't show loading for same page navigation
    if (href === pathname) {
      return;
    }

    setIsNavigating(true);
    
    // Use router.replace with the provided options
    router.replace(href, options);
  };

  // Reset loading state when pathname changes (navigation complete)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100); // Small delay to ensure smooth transition

    return () => clearTimeout(timer);
  }, [pathname]);

  // Auto-hide loading after 5 seconds as fallback
  useEffect(() => {
    if (isNavigating) {
      const fallbackTimer = setTimeout(() => {
        setIsNavigating(false);
      }, 5000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isNavigating]);

  const value = {
    isNavigating,
    navigateWithLoading,
    replaceWithLoading,
    setIsNavigating,
    // Expose original router methods for backwards compatibility
    push: navigateWithLoading,
    replace: replaceWithLoading,
    back: () => {
      setIsNavigating(true);
      router.back();
    },
    forward: () => {
      setIsNavigating(true);
      router.forward();
    },
    refresh: () => {
      setIsNavigating(true);
      router.refresh();
    }
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
