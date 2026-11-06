export const AGE_GATE_CONFIG = {
  COOKIE_NAME: 'crew_age_verified',
  VERIFIED_VALUE: 'true',
  MAX_AGE_DAYS: 30,
  UNDERAGE_REDIRECT_URL: 'https://www.massvoll-geniessen.de/',
} as const;

const AGE_GATE_CHANGE_EVENT = 'crew:age-gate-change';

export function hasAgeVerifiedCookie(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie
    .split('; ')
    .some(
      (entry) =>
        entry ===
        `${AGE_GATE_CONFIG.COOKIE_NAME}=${AGE_GATE_CONFIG.VERIFIED_VALUE}`
    );
}

export function setAgeVerifiedCookie(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAgeSeconds = AGE_GATE_CONFIG.MAX_AGE_DAYS * 24 * 60 * 60;
  const secureAttr =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';

  document.cookie = `${AGE_GATE_CONFIG.COOKIE_NAME}=${AGE_GATE_CONFIG.VERIFIED_VALUE}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureAttr}`;

  window.dispatchEvent(new Event(AGE_GATE_CHANGE_EVENT));
}

export function subscribeAgeGateStatus(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(AGE_GATE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener(AGE_GATE_CHANGE_EVENT, callback);
  };
}

