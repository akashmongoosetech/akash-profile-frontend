// API utility functions for authenticated requests

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

const getApiOrigin = (): string => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return API_BASE_URL;
  }
};

const shouldRewriteToApiOrigin = (url: URL): boolean => {
  return url.pathname.startsWith('/uploads/');
};

const isUploadPath = (value: string): boolean => {
  return value.startsWith('/uploads/') || value.startsWith('uploads/');
};

// Normalize image URL to ensure it's an absolute URL
export const normalizeImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return '';
  }

  const trimmedUrl = imageUrl.trim();
  
  // If it's already an absolute URL (starts with http:// or https://), return as-is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (shouldRewriteToApiOrigin(parsedUrl)) {
        return `${getApiOrigin()}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
      }
    } catch {
      return trimmedUrl;
    }

    return trimmedUrl;
  }
  
  // If it's a relative URL, prepend the API base URL
  if (trimmedUrl.startsWith('/')) {
    return `${API_BASE_URL}${trimmedUrl}`;
  }

  return `${API_BASE_URL}/${trimmedUrl}`;
};

export const normalizeHtmlImageSources = (html: string | undefined | null): string => {
  if (!html || html.trim() === '') {
    return '';
  }

  return html.replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'][^>]*>)/gi, (_match, prefix, src, suffix) => {
    const normalizedSrc = isUploadPath(src) || src.includes('/uploads/')
      ? normalizeImageUrl(src)
      : src;

    return `${prefix}${normalizedSrc}${suffix}`;
  });
};

// Check if image URL is valid (for display purposes)
export const isValidImageUrl = (imageUrl: string | undefined | null): boolean => {
  return !!imageUrl && imageUrl.trim() !== '';
};

// External hosts that serve signed, short-lived image URLs which eventually 404.
const UNSTABLE_IMAGE_HOSTS = [
  'media.licdn.com',
  'media-exp1.licdn.com',
  'media-exp2.licdn.com',
  'media-exp3.licdn.com',
];

// Detect image URLs that are known to expire or break (e.g. LinkedIn's signed
// `profile-displayphoto` CDN links). When true, callers should render a
// fallback instead of issuing a request that is guaranteed to 404.
export const isUnstableImageUrl = (imageUrl: string | undefined | null): boolean => {
  if (!imageUrl) return false;

  const trimmed = imageUrl.trim();
  if (!trimmed) return false;

  const lower = trimmed.toLowerCase();
  if (UNSTABLE_IMAGE_HOSTS.some((host) => lower.includes(host))) {
    return true;
  }

  // Generic signed-URL expiry check (?e=<epoch>).
  try {
    const url = new URL(trimmed);
    const expiry = url.searchParams.get('e');
    if (expiry && /^\d+$/.test(expiry)) {
      let expiryMs = Number(expiry);
      // Some providers emit seconds rather than milliseconds.
      if (expiryMs < 1e12) expiryMs *= 1000;
      if (Number.isFinite(expiryMs) && expiryMs < Date.now()) {
        return true;
      }
    }
  } catch {
    // Not an absolute/parseable URL; nothing more to check.
  }

  return false;
};

// True only when a URL is present AND not a known-unstable/expired link.
export const isUsableImageUrl = (imageUrl: string | undefined | null): boolean => {
  return isValidImageUrl(imageUrl) && !isUnstableImageUrl(imageUrl);
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Get token expiration time from localStorage (deprecated, kept for backwards compatibility)
export const getTokenExpiration = (): number | null => {
  return null;
};

// Set auth token in localStorage (persistent login without inactivity expiration)
export const setAuthToken = (token: string): void => {
  localStorage.setItem('adminToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminTokenExpiration');
};

// Check if token is expired (always returns false unless token is completely missing)
export const isTokenExpired = (): boolean => {
  return !getAuthToken();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API fetch with authentication header
let refreshInFlight: Promise<boolean> | null = null;

// Attempt to rotate the refresh cookie for a fresh access token.
export const refreshAccessToken = async (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data?.token) {
          setAuthToken(data.token);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
};

const redirectToLogin = () => {
  removeAuthToken();
  if (!window.location.pathname.startsWith('/admin/login')) {
    window.location.href = '/admin/login';
  }
};

export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {},
  allowRetry = true
): Promise<Response> => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Access token expired/invalid: try a single silent refresh, then retry.
  if (response.status === 401 && allowRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return authenticatedFetch(endpoint, options, false);
    }
    redirectToLogin();
  }

  return response;
};

// Clear the server-side session (revokes the refresh token) and local state.
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Ignore network errors - clear local session regardless.
  } finally {
    removeAuthToken();
  }
};

// Upload image file
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/blog/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = 'Failed to upload image';

    try {
      const data = await response.json();
      errorMessage = data?.error || data?.message || errorMessage;
    } catch {
      // Ignore JSON parsing errors and keep the fallback message.
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  return normalizeImageUrl(data.imageUrl);
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
