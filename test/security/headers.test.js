import { describe, it, expect } from 'vitest';
import { SECURITY_HEADERS, getSecurityHeadersArray } from '../../src/lib/security/headers';

describe('HTTP Security Headers Standard Checklist Checks', () => {
  it('should define all recommended security headers', () => {
    expect(SECURITY_HEADERS['Content-Security-Policy']).toBeDefined();
    expect(SECURITY_HEADERS['Strict-Transport-Security']).toBeDefined();
    expect(SECURITY_HEADERS['X-Frame-Options']).toBeDefined();
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBeDefined();
    expect(SECURITY_HEADERS['Referrer-Policy']).toBeDefined();
    expect(SECURITY_HEADERS['Permissions-Policy']).toBeDefined();
  });

  it('should strictly deny clickjacking (X-Frame-Options: DENY)', () => {
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY');
  });

  it('should enforce strict-origin-when-cross-origin for referrer policy', () => {
    expect(SECURITY_HEADERS['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });

  it('should enable HSTS with max-age, includeSubdomains, and preload flags', () => {
    expect(SECURITY_HEADERS['Strict-Transport-Security']).toContain('max-age=31536000');
    expect(SECURITY_HEADERS['Strict-Transport-Security']).toContain('includeSubDomains');
    expect(SECURITY_HEADERS['Strict-Transport-Security']).toContain('preload');
  });

  it('should prevent mime sniffing (X-Content-Type-Options: nosniff)', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff');
  });

  it('should format headers correctly as tuples when requested', () => {
    const headerArr = getSecurityHeadersArray();
    expect(Array.isArray(headerArr)).toBe(true);
    expect(headerArr.length).toBe(6);
    expect(headerArr[0][0]).toBe('Content-Security-Policy');
  });
});
