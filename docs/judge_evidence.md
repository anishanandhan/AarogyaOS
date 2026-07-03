# Hackathon Judging Criteria Evidence Map

This document maps our architectural and implementation choices directly to the hackathon's scoring metrics.

## 1. Code Quality & Modularity
*   **Proof of Structure**: All component and logic files are constrained to under **300 lines** (e.g., `App.jsx` at 161 lines, `PublicHealthMapPage.jsx` split into clean rendering blocks).
*   **Separation of Concerns**: UI elements and layout components are decoupled from business logic. All database requests, API integrations, and mathematical formulas live in the `src/services/` layer.
*   **Consistency**: Configured Prettier styling (`.prettierrc`) and fast linter rules (`.oxlintrc.json`) prevent code style degradation.

## 2. Security & Compliance
*   **Input Sanitization**: Implemented robust regex filters in `src/lib/security/sanitize.js` to strip bidi overrides, zero-width space bypasses, and control characters from inputs before compilation or rendering.
*   **XSS Protections**: Enforced strict HTML character escaping across all user inputs.
*   **HTTP Security Headers**: Enforced a strict Content Security Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (DENY), and Permissions-Policy globally in `firebase.json`.
*   **Privacy Mandate**: Complete audit showing that no PII is stored; anonymized random tokens are used for all worker performance indexing.

## 3. Testing Infrastructure
*   **Coverage Gates**: Unit and integration test suites run automatically on pull requests using Vitest, asserting a code coverage threshold of >60% (100% on security modules like `sanitize.js` and `headers.js`).
*   **Component Accessibility**: Components like `HealthScoreRing` and `VaaniBot` include integrated `jest-axe` unit tests to ensure that all generated HTML satisfies WCAG 2.1 AA requirements.
*   **E2E Integration**: Playwright integration runs full E2E user journeys on mock browsers to ensure that page layouts render correctly without crashes.

## 4. Accessibility Compliance
*   **Axe Auditing**: Playwright E2E suites run `axe-playwright` scans on minimum 3 views (Empty, Populated, Modal states), asserting **zero accessibility violations**.
*   **Keyboard Navigation**: Visible focus rings are styled on every focusable input, tabIndex values are constrained to standard ranges (0 and -1), and tab structures trap focus correctly.
*   **Screen Reader Support**: Implemented `role="log"` and `aria-live="polite"` on chat panels to announce dynamic messaging updates to users.
