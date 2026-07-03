/**
 * Centralized Security Header Policy Configuration
 * Serves as single source of truth for hosting files and test specs.
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' https://*.googleapis.com https://speech.googleapis.com https://texttospeech.googleapis.com https://translation.googleapis.com; img-src 'self' data: https://*.googleapis.com https://*.google.com https://*.gstatic.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(self)'
};

/**
 * Returns security headers in array tuple format
 * @returns {Array<[string, string]>} Header key-value pairs
 */
export function getSecurityHeadersArray() {
  return Object.entries(SECURITY_HEADERS);
}

export default {
  SECURITY_HEADERS,
  getSecurityHeadersArray
};
