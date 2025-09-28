import React, { createContext, useContext, ReactNode } from 'react';
import { useBlogPopup } from '../hooks/useBlogPopup';

interface BlogPopupContextType {
  isPopupOpen: boolean;
  closePopup: () => void;
  openPopup: () => void;
}

const BlogPopupContext = createContext<BlogPopupContextType | undefined>(undefined);

interface BlogPopupProviderProps {
  children: ReactNode;
}

export const BlogPopupProvider: React.FC<BlogPopupProviderProps> = ({ children }) => {
  const blogPopupState = useBlogPopup();

  return (
    <BlogPopupContext.Provider value={blogPopupState}>
      {children}
    </BlogPopupContext.Provider>
  );
};

export const useBlogPopupContext = () => {
  const context = useContext(BlogPopupContext);
  if (context === undefined) {
    throw new Error('useBlogPopupContext must be used within a BlogPopupProvider');
  }
  return context;
};
