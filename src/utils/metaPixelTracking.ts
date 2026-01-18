/**
 * Meta Pixel PageView tracking for SPA navigation
 * Tracks route changes in React Router without double-firing on initial load
 */

declare global {
  interface Window {
    fbq: ((...args: unknown[]) => void) | undefined;
  }
}

let isInitialLoad = true;

/**
 * Track PageView event with Meta Pixel
 */
function trackPageView(): void {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Initialize Meta Pixel tracking for route changes
 * Call this once after router is mounted
 */
export function initMetaPixelTracking(): void {
  // Skip initial PageView (already tracked by base pixel code in index.html)
  isInitialLoad = true;

  // Track subsequent navigation events
  // React Router updates the browser history, so we listen to popstate
  // and intercept pushState/replaceState
  
  // Listen to back/forward button navigation
  window.addEventListener('popstate', () => {
    if (!isInitialLoad) {
      trackPageView();
    }
  });

  // Intercept history.pushState
  const originalPushState = window.history.pushState;
  window.history.pushState = function(...args) {
    originalPushState.apply(window.history, args);
    if (!isInitialLoad) {
      trackPageView();
    }
  };

  // Intercept history.replaceState
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function(...args) {
    originalReplaceState.apply(window.history, args);
    if (!isInitialLoad) {
      trackPageView();
    }
  };

  // Mark that initial load is complete after a short delay
  // This ensures the initial pixel PageView fires first
  setTimeout(() => {
    isInitialLoad = false;
  }, 100);
}
