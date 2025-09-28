import React from 'react';
import { BookOpen } from 'lucide-react';

interface BlogPopupTriggerProps {
  onTrigger: () => void;
  className?: string;
  variant?: 'button' | 'icon' | 'text';
}

const BlogPopupTrigger: React.FC<BlogPopupTriggerProps> = ({ 
  onTrigger, 
  className = '', 
  variant = 'button' 
}) => {
  const baseClasses = "transition-all duration-300 cursor-pointer";

  if (variant === 'icon') {
    return (
      <button
        onClick={onTrigger}
        className={`${baseClasses} p-2 rounded-full bg-white/10 hover:bg-white/20 text-white ${className}`}
        title="View Latest Blog Post"
      >
        <BookOpen size={20} />
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        onClick={onTrigger}
        className={`${baseClasses} text-blue-400 hover:text-blue-300 underline ${className}`}
      >
        Latest Blog Post
      </button>
    );
  }

  return (
    <button
      onClick={onTrigger}
      className={`${baseClasses} px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium flex items-center space-x-2 ${className}`}
    >
      <BookOpen size={18} />
      <span>Latest Blog</span>
    </button>
  );
};

export default BlogPopupTrigger;
