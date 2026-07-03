/**
 * Sanitizes input strings by stripping control characters, zero-width spaces,
 * and bidirectional override markers. Applies Unicode NFC normalization.
 * @param {string} raw - Raw input string
 * @returns {string} Sanitized string
 */
export function sanitizeInput(raw) {
  if (raw === null || raw === undefined) return '';
  if (typeof raw !== 'string') return String(raw);
  
  // Unicode NFC normalization
  let clean = raw.normalize('NFC');
  
  // Strip control characters U+0000 - U+001F and U+007F - U+009F
  clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Strip zero-width spaces / markers
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // Strip bidi override characters
  clean = clean.replace(/[\u202E\u202D\u202A-\u202C]/g, '');
  
  return clean;
}

/**
 * Escapes HTML characters to prevent cross-site scripting (XSS).
 * @param {string} input - Input string
 * @returns {string} Escaped HTML string
 */
export function escapeHtml(input) {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') return String(input);
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Redacts sensitive credentials (like API keys and Bearer tokens) from text logs.
 * @param {string} input - Log message text
 * @returns {string} Redacted log text
 */
export function redactSecrets(input) {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') return String(input);
  
  let redacted = input;
  
  // Match Gemini API Key or other Google API Keys (AIzaSy...)
  redacted = redacted.replace(/AIzaSy[A-Za-z0-9_-]{30,45}/g, '[REDACTED_API_KEY]');
  
  // Match General API keys / secrets (sk-...)
  redacted = redacted.replace(/sk-[A-Za-z0-9]{32,48}/g, '[REDACTED_SECRET]');
  
  // Match Bearer tokens
  redacted = redacted.replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED_TOKEN]');
  
  // Match email addresses
  redacted = redacted.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]');
  
  return redacted;
}

export default {
  sanitizeInput,
  escapeHtml,
  redactSecrets
};
