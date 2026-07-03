import { describe, it, expect } from 'vitest';
import { sanitizeInput, escapeHtml, redactSecrets } from '../../../frontend/src/lib/security/sanitize';

describe('Input Sanitization & Secrets Redaction Security Checks', () => {
  
  describe('sanitizeInput()', () => {
    it('should strip null, undefined or non-string inputs safely', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('123');
    });

    it('should strip control characters (U+0000 - U+001F)', () => {
      const input = 'Hello\u0000World\u001F';
      expect(sanitizeInput(input)).toBe('HelloWorld');
    });

    it('should strip zero-width characters', () => {
      const input = 'A\u200BB\u200CC\u200DD\uFEFF';
      expect(sanitizeInput(input)).toBe('ABCD');
    });

    it('should strip bidirectional override characters', () => {
      const input = 'A\u202EB\u202DC\u202AD';
      expect(sanitizeInput(input)).toBe('ABCD');
    });

    it('should apply Unicode NFC normalization', () => {
      const normalized = 'e\u0301'; // Decomposed e + acute accent
      expect(sanitizeInput(normalized)).toBe('é'); // Normalized e acute accent
    });
  });

  describe('escapeHtml()', () => {
    it('should safely render null or undefined inputs', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    it('should escape HTML characters & < > " and \'', () => {
      const xss = '<script>alert("XSS & breach");</script>';
      expect(escapeHtml(xss)).toBe('&lt;script&gt;alert(&quot;XSS &amp; breach&quot;);&lt;/script&gt;');
    });
  });

  describe('redactSecrets()', () => {
    it('should safely render null or undefined inputs', () => {
      expect(redactSecrets(null)).toBe('');
      expect(redactSecrets(undefined)).toBe('');
    });

    it('should redact Google API Keys', () => {
      const log = 'Connecting with key: ' + 'AIza' + 'Sy' + '_DUMMY_KEY_FOR_UNIT_TESTING_123';
      expect(redactSecrets(log)).toBe('Connecting with key: [REDACTED_API_KEY]');
    });

    it('should redact General API Keys (sk-...)', () => {
      const log = 'API secret was sk-12345678901234567890123456789012';
      expect(redactSecrets(log)).toBe('API secret was [REDACTED_SECRET]');
    });

    it('should redact Bearer authorization tokens', () => {
      const header = 'Authorization: Bearer mySecretTokenVal123';
      expect(redactSecrets(header)).toBe('Authorization: Bearer [REDACTED_TOKEN]');
    });

    it('should redact email addresses', () => {
      const log = 'User logged in: support@aarogyaos.in';
      expect(redactSecrets(log)).toBe('User logged in: [REDACTED_EMAIL]');
    });
  });
});
