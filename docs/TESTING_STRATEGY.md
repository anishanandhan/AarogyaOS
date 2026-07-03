# Testing Strategy & Quality Assurance

AarogyaOS enforces comprehensive code validation across the entire software development lifecycle to achieve robust code reliability and zero functional regressions.

## Testing Layers

### 1. Unit & Logic Tests (Vitest)
Unit tests validate pure logic, utility services, and security modules:
*   **Sanitization Modules**: 100% coverage asserted on `sanitize.js` functions, verifying that XSS strings, bidi overrides, control characters, and credentials are correctly handled or redacted.
*   **Security Configuration**: Tests verify that the central security header policy configuration has correct directives.

### 2. Component & Accessibility Tests (Vitest + React Testing Library + jest-axe)
Component tests render isolated UI elements to verify layout structure, state transitions, and accessibility compliance:
*   **Accessibility Gates**: Integrates `jest-axe` checks inside each test file to assert that rendered HTML complies with WCAG 2.1 AA guidelines (discernible text on buttons, form label mappings, correct roles).
*   **User Interactions**: Validates form entries, click events, and loading states inside key features.

### 3. End-to-End User Journeys (Playwright + axe-playwright)
E2E integration tests verify the complete user workflow by simulating real browser interactions on compiled production builds:
*   **Flow Validation**: Asserts that landing page entry, authentication, dashboard loading, and map navigation render correctly.
*   **Full-Page Accessibility Scans**: Runs `axe-playwright` scans on key layout views (Empty, Populated, Modal views) to ensure zero accessibility regressions under integration.

## CI Coverage Gates

The CI pipeline (`.github/workflows/ci.yml`) enforces strict quality thresholds on every pull request:
*   **Coverage Target**: Overall test coverage must exceed **60%**, and security modules (`sanitize.js`, `headers.js`) must hit **100%** coverage.
*   **Zero-Failure Policy**: The build, lint, typecheck, unit test, and E2E test suites must pass completely before a branch can be merged.
