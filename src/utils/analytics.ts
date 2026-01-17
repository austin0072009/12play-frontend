/**
 * GA4 Analytics Helper
 *
 * Provides a safe wrapper around gtag for event tracking.
 * Assumes gtag.js is already installed in the HTML.
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Safely sends a GA4 event.
 * Does nothing if gtag is not available.
 *
 * @param eventName - The GA4 event name
 * @param params - Event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | null | undefined>
): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    // Silently ignore any errors to avoid breaking the app
  }
}

/**
 * Storage key for tracking first deposit
 */
const FIRST_DEPOSIT_KEY = 'ga4_first_deposit_tracked';

/**
 * Checks if first deposit has already been tracked
 */
export function hasTrackedFirstDeposit(): boolean {
  try {
    return localStorage.getItem(FIRST_DEPOSIT_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Marks first deposit as tracked
 */
export function markFirstDepositTracked(): void {
  try {
    localStorage.setItem(FIRST_DEPOSIT_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

/**
 * Tracks the first deposit event (only fires once per user)
 *
 * @param refCode - Referral code if any
 * @param value - Deposit amount
 * @returns true if event was tracked, false if already tracked before
 */
export function trackFirstDeposit(refCode: string | null, value: number): boolean {
  if (hasTrackedFirstDeposit()) {
    return false;
  }

  trackEvent('first_deposit', {
    ref_code: refCode || '',
    value: value,
  });

  markFirstDepositTracked();
  return true;
}
