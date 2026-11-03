/**
 * Configuration and constants for PasswordGate staging protection
 */

export const PASSWORD_GATE_CONFIG = {
  // Hardcoded default fallback password (overridable via environment variable)
  PASSWORD: process.env.SITE_PASSWORD || 'CR3W#R3public!2026_x9K',
  COOKIE_NAME: 'crew_access_token',
  TOKEN_VALUE: 'granted_access_crew_republic_2026',
  MAX_AGE_DAYS: 30,
};

export function checkPassword(input: string): boolean {
  if (!input) return false;
  return input.trim() === PASSWORD_GATE_CONFIG.PASSWORD;
}

