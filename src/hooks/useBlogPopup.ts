import { useState, useEffect } from 'react';

const POPUP_STORAGE_KEY = 'blog_popup_last_shown';
const POPUP_DELAY = 3000; // 3 seconds delay before showing popup
const POPUP_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useBlogPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = () => {
      try {
        // Check if we're on the homepage
        const isHomePage = window.location.pathname === '/';
        if (!isHomePage) return;

        // Check if popup was shown recently
        const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
        const now = Date.now();
        
        if (lastShown) {
          const timeSinceLastShown = now - parseInt(lastShown);
          if (timeSinceLastShown < POPUP_COOLDOWN) {
            return; // Don't show popup if shown within cooldown period
          }
        }

        // Show popup after delay
        const timer = setTimeout(() => {
          setIsPopupOpen(true);
          localStorage.setItem(POPUP_STORAGE_KEY, now.toString());
        }, POPUP_DELAY);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error managing blog popup:', error);
      }
    };

    checkAndShowPopup();
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
  };

  return {
    isPopupOpen,
    closePopup,
    openPopup
  };
};
