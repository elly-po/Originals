// Analytics tracking utility for frontend instrumentation
// Sends events to the backend /api/events endpoint

interface AnalyticsEvent {
  type: 'view' | 'favorite:add' | 'favorite:remove' | 'cart:add' | 'cart:remove' | 'cart:update' | 'search' | 'login' | 'signup' | 'order:created';
  userId?: string;
  anonId?: string;
  productId?: string;
  metadata?: Record<string, any>;
}

// Generate a persistent anonymous ID for non-authenticated users
const getAnonymousId = (): string => {
  let anonId = localStorage.getItem('originals-store-anon-id');
  if (!anonId) {
    anonId = 'anon-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('originals-store-anon-id', anonId);
  }
  return anonId;
};

// Simple deduplication for page/product views to prevent double-firing in StrictMode
const lastEvents = new Map<string, number>();
const DEDUPE_WINDOW = 1000; // 1 second

// Get current user ID or anonymous ID
const getCurrentUserId = (): { userId?: string; anonId?: string } => {
  // Try to get user from auth token and stored user data
  try {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('originals-store-user');
    if (token && userData) {
      const user = JSON.parse(userData);
      if (user?.id) {
        return { userId: user.id };
      }
    }
  } catch (error) {
    // Fall back to anonymous ID if error parsing auth data
  }
  
  return { anonId: getAnonymousId() };
};

// Send analytics event to backend
export const trackEvent = async (event: Omit<AnalyticsEvent, 'userId' | 'anonId'>): Promise<void> => {
  try {
    const { userId, anonId } = getCurrentUserId();
    
    const payload: AnalyticsEvent = {
      ...event,
      userId,
      anonId,
    };

    // Send to backend (fire and forget)
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      // Silent fail - don't interrupt user experience
      console.debug('Analytics tracking failed:', error);
    });
  } catch (error) {
    // Silent fail - don't interrupt user experience
    console.debug('Analytics event creation failed:', error);
  }
};

// Specific tracking functions for common events
export const trackPageView = (page: string, metadata?: Record<string, any>) => {
  // Deduplicate to prevent StrictMode double-firing
  const eventKey = `page:${page}`;
  const now = Date.now();
  const lastTime = lastEvents.get(eventKey);
  
  if (lastTime && now - lastTime < DEDUPE_WINDOW) {
    return; // Skip duplicate event
  }
  
  lastEvents.set(eventKey, now);
  trackEvent({
    type: 'view',
    metadata: { page, ...metadata },
  });
};

export const trackProductView = (productId: string, metadata?: Record<string, any>) => {
  // Deduplicate to prevent StrictMode double-firing
  const eventKey = `product:${productId}`;
  const now = Date.now();
  const lastTime = lastEvents.get(eventKey);
  
  if (lastTime && now - lastTime < DEDUPE_WINDOW) {
    return; // Skip duplicate event
  }
  
  lastEvents.set(eventKey, now);
  trackEvent({
    type: 'view',
    productId,
    metadata,
  });
};

export const trackSearch = (query: string, resultsCount?: number, metadata?: Record<string, any>) => {
  trackEvent({
    type: 'search',
    metadata: { query, resultsCount, ...metadata },
  });
};

export const trackFavoriteAdd = (productId: string, metadata?: Record<string, any>) => {
  trackEvent({
    type: 'favorite:add',
    productId,
    metadata,
  });
};

export const trackFavoriteRemove = (productId: string, metadata?: Record<string, any>) => {
  trackEvent({
    type: 'favorite:remove',
    productId,
    metadata,
  });
};

export const trackCartAdd = (productId: string, metadata?: Record<string, any>) => {
  trackEvent({
    type: 'cart:add',
    productId,
    metadata,
  });
};

export const trackLogin = (metadata?: Record<string, any>) => {
  trackEvent({
    type: 'login',
    metadata,
  });
};

export const trackSignup = (metadata?: Record<string, any>) => {
  trackEvent({
    type: 'signup',
    metadata,
  });
};

export const trackCartRemove = (productId: string, metadata?: Record<string, any>) => {
  trackEvent({
    type: 'cart:remove',
    productId,
    metadata,
  });
};

export const trackCartUpdate = (productId: string, metadata?: Record<string, any>) => {
  trackEvent({
    type: 'cart:update',
    productId,
    metadata,
  });
};

// Set user identity for analytics (called on login/signup)
export const setAnalyticsUser = (user: { id: string; email: string }) => {
  try {
    localStorage.setItem('originals-store-user', JSON.stringify(user));
  } catch (error) {
    console.debug('Failed to store user for analytics:', error);
  }
};

// Clear user identity for analytics (called on logout)
export const clearAnalyticsUser = () => {
  try {
    localStorage.removeItem('originals-store-user');
  } catch (error) {
    console.debug('Failed to clear user for analytics:', error);
  }
};

export const trackOrderCreated = (metadata?: Record<string, any>) => {
  trackEvent({
    type: 'order:created',
    metadata,
  });
};