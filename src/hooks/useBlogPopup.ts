import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const POPUP_STORAGE_KEY = 'blog_popup_last_shown';
const POPUP_DELAY = 3000; // 3 seconds delay before showing popup
const POPUP_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const DEV_MODE = true; // Set to false in production - bypasses cooldown for testing

// Check if there are any published blogs
const checkBlogExists = async (): Promise<boolean> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/blog/stats`);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    if (data.success && data.publishedCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('[BlogPopup] Error checking blog existence:', error);
    return false;
  }
};

export const useBlogPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownRef = useRef(false);

  useEffect(() => {
    const checkAndShowPopup = async () => {
      try {
        // Check if we're on the homepage
        const isHomePage = location.pathname === '/';
        if (!isHomePage) {
          console.log('[BlogPopup] Not on homepage, skipping popup');
          return;
        }

        // Prevent multiple popups in the same session (unless in dev mode)
        if (hasShownRef.current && !DEV_MODE) {
          console.log('[BlogPopup] Already shown in this session, skipping');
          return;
        }

        // Check if popup was shown recently (skip in dev mode)
        if (!DEV_MODE) {
          const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
          const now = Date.now();
          
          if (lastShown) {
            const timeSinceLastShown = now - parseInt(lastShown);
            if (timeSinceLastShown < POPUP_COOLDOWN) {
              console.log('[BlogPopup] Within cooldown period, skipping popup');
              return; // Don't show popup if shown within cooldown period
            }
          }
        } else {
          console.log('[BlogPopup] Dev mode active, bypassing cooldown');
        }

        // Check if there are any blogs before showing popup
        const blogExists = await checkBlogExists();
        if (!blogExists) {
          console.log('[BlogPopup] No blogs found, skipping popup');
          return;
        }

        // Clear any existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // Show popup after delay
        console.log('[BlogPopup] Scheduling popup to show in 3 seconds');
        timerRef.current = setTimeout(() => {
          console.log('[BlogPopup] Opening popup');
          setIsPopupOpen(true);
          hasShownRef.current = true;
          localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
        }, POPUP_DELAY);
      } catch (error) {
        console.error('[BlogPopup] Error managing blog popup:', error);
      }
    };

    checkAndShowPopup();

    // Cleanup timer on unmount or pathname change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [location.pathname]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopup = async () => {
    // Check if there are any blogs before opening popup
    const blogExists = await checkBlogExists();
    if (!blogExists) {
      console.log('[BlogPopup] No blogs found, cannot open popup');
      return;
    }
    
    setIsPopupOpen(true);
    hasShownRef.current = true;
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
  };

  // Export function to reset popup cooldown (for testing/development)
  const resetPopupCooldown = () => {
    localStorage.removeItem(POPUP_STORAGE_KEY);
    hasShownRef.current = false;
    console.log('[BlogPopup] Cooldown reset - popup will show on next page load');
  };

  return {
    isPopupOpen,
    closePopup,
    openPopup,
    resetPopupCooldown
  };
};
