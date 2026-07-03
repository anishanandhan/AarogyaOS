# Security Architecture & Vulnerability Mitigation

AarogyaOS implements a defense-in-depth security model to safeguard rural health metrics, clinical telemetry, and field worker locations.

## Security Layers

### 1. HTTP Security Headers
All page requests are served with security headers configured via `firebase.json`:
*   **Content Security Policy (CSP)**: Restrictions on script/style/image source hosts to mitigate cross-site scripting (XSS) and code injection vectors.
*   **HSTS (Strict-Transport-Security)**: Enforces HTTPS connection pathways globally.
*   **X-Frame-Options (DENY)**: Prevents clickjacking and framing attacks.
*   **X-Content-Type-Options (nosniff)**: Prevents browser mime-type sniffing.
*   **Permissions Policy**: Disables camera access, and limits microphone and geolocation access to the app's hostname.

### 2. Input Sanitization & XSS Protections
All user-entered text (including queries input to VaaniBot and visit notes) passes through a sanitization step (`src/lib/security/sanitize.js`):
*   **Unicode NFC Normalization**: Normalizes input strings.
*   **Control Character Removal**: Strips ASCII control markers (U+0000–U+001F) to prevent command injections.
*   **Zero-Width Character Stripping**: Strips zero-width spacing markers to mitigate obfuscation.
*   **HTML Escaping**: Converts `<`, `>`, `&`, `"`, `'` to safe HTML entities to prevent XSS payloads.

### 3. Log Redaction & Secret Management
To prevent credential leaks in logging outputs (such as browser console logs and deployment build outputs):
*   **`redactSecrets()`**: Matches and masks patterns resembling Google API keys (`AIzaSy...`), general secret keys (`sk-...`), Bearer tokens, and email addresses.
*   **Environment Isolation**: Credentials are never hardcoded in source code; they are loaded via Vite's `import.meta.env` references.

### 4. Vulnerability Disclosure & Machine Contact
*   **`SECURITY.md`**: Provides a clear workflow for security researchers to report vulnerabilities privately.
*   **`security.txt`**: Served at the standardized path `public/.well-known/security.txt` for machine-readable discovery by automated scanners.
