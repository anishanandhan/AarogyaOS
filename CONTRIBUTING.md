# Contributing to AarogyaOS

We welcome contributions to AarogyaOS! Please read these enterprise-grade guidelines to ensure code quality, compliance, and security.

## Code Standards
* All JavaScript files must follow ES Modules (ESM) syntax.
* Any UI/UX changes must use the established custom HSL variables and Tailwind.
* Ensure all files are linted with `oxlint`.

## Security & Compliance
* Never commit credentials, keys, or passwords.
* Any user-input processing must pass through `sanitizeInput` and `redactSecrets` inside `frontend/src/lib/security/sanitize.js`.
* Code changes must align with GDPR and HIPAA data handling practices (e.g. strict anonymization of clinical telemetry).

## Pull Request Guidelines
1. Fork the repository and create your branch from `main`.
2. Add automated tests covering the success, failure, and edge conditions of your feature in `/tests`.
3. Verify that your tests pass locally (`npm run test` and `npm run test:coverage`).
4. Submit the PR with a detailed description of changes and compliance impact.
