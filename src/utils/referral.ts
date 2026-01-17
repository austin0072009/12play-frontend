/**
 * Referral Attribution Utility
 *
 * Persists referral codes using both localStorage and cookies to ensure
 * attribution survives across different contexts:
 * - Web browser registration
 * - PWA installation and later registration
 * - iOS "Add to Home Screen" (which has isolated storage)
 * - Android APK/WebView/TWA
 *
 * The cookie serves as a bridge for iOS Home Screen apps which don't share
 * localStorage with Safari but do share cookies (same domain).
 *
 * Once a referral code is stored, it is NEVER overwritten by subsequent visits.
 */

const STORAGE_KEY = 'referral_code';
const COOKIE_NAME = 'ref';
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Sets a cookie with the given name, value, and expiration in days
 */
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Use SameSite=Lax for cross-context compatibility while maintaining security
  // Path=/ ensures cookie is available across all routes
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Gets a cookie value by name
 */
function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

/**
 * Checks if a referral code is already stored (in either storage)
 */
export function hasReferralCode(): boolean {
  const fromLocalStorage = localStorage.getItem(STORAGE_KEY);
  const fromCookie = getCookie(COOKIE_NAME);
  return !!(fromLocalStorage || fromCookie);
}

/**
 * Saves a referral code to both localStorage and cookie.
 *
 * This function is idempotent - it will NOT overwrite an existing referral code.
 * This ensures the first referral attribution is preserved even if the user
 * later visits with a different referral link.
 *
 * @param code - The referral code to save
 * @returns true if the code was saved, false if a code already existed
 */
export function saveReferralCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return false;
  }

  // Never overwrite an existing referral code
  if (hasReferralCode()) {
    return false;
  }

  // Save to both storages for maximum compatibility
  try {
    localStorage.setItem(STORAGE_KEY, trimmedCode);
  } catch {
    // localStorage might be unavailable in some contexts (e.g., private browsing)
  }

  setCookie(COOKIE_NAME, trimmedCode, COOKIE_EXPIRY_DAYS);

  return true;
}

/**
 * Retrieves the stored referral code.
 *
 * Checks localStorage first (faster), falls back to cookie.
 * This handles the iOS Home Screen case where localStorage might be different
 * but cookies are shared.
 *
 * @returns The referral code or null if none is stored
 */
export function getReferralCode(): string | null {
  // Try localStorage first
  const fromLocalStorage = localStorage.getItem(STORAGE_KEY);
  if (fromLocalStorage) {
    return fromLocalStorage;
  }

  // Fall back to cookie (handles iOS Home Screen isolation)
  const fromCookie = getCookie(COOKIE_NAME);
  if (fromCookie) {
    // Sync to localStorage for faster future access
    try {
      localStorage.setItem(STORAGE_KEY, fromCookie);
    } catch {
      // Ignore localStorage errors
    }
    return fromCookie;
  }

  return null;
}

/**
 * Captures a referral code from the current URL's query parameters.
 *
 * Looks for the 'ref' parameter (e.g., ?ref=MK001)
 * Only saves if no referral code is already stored.
 *
 * This should be called once at app initialization.
 *
 * @returns The captured referral code, or null if none was captured
 */
export function captureReferralFromUrl(): string | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
      const saved = saveReferralCode(refCode);
      // Return the stored code (could be different if one already existed)
      return saved ? refCode : getReferralCode();
    }
  } catch {
    // URLSearchParams might not be available in very old browsers
  }

  return null;
}

/**
 * Clears the stored referral code from both storages.
 *
 * This should typically only be called after successful registration
 * when the referral has been attributed on the backend.
 */
export function clearReferralCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore localStorage errors
  }

  // Clear cookie by setting expiration in the past
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}
