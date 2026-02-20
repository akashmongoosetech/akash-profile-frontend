// API utility functions for authenticated requests

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Normalize image URL to ensure it's an absolute URL
export const normalizeImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return '';
  }
  
  // If it's already an absolute URL (starts with http:// or https://), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL, prepend the API base URL
  return `${API_BASE_URL}${imageUrl}`;
};

// Check if image URL is valid (for display purposes)
export const isValidImageUrl = (imageUrl: string | undefined | null): boolean => {
  return !!imageUrl && imageUrl.trim() !== '';
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('adminToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API fetch with authentication header
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

// Strip HTML tags from text (useful for excerpts displayed in lists)
export const stripHtmlTags = (html: string | undefined | null): string => {
  if (!html) return '';
  
  // Create a temporary DOM element to strip HTML tags
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content and clean up extra whitespace
  const text = temp.textContent || temp.innerText || '';
  return text.replace(/\s+/g, ' ').trim();
};

// Export base URL for direct API calls
export { API_BASE_URL };
