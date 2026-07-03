# Code Quality & Architecture Standards

AarogyaOS is built to high code quality and modularity standards, ensuring the codebase is robust, easy to test, and ready for production-level extensions.

## Modular Component Architecture

We adhere to a strict size limitation across all files:
*   **300-Line Limit**: No single React component or service file exceeds 300 lines of code. This ensures focused, single-responsibility files that are easy to test.
*   **Decoupled Services**: Business and API integration logic is extracted from components into a clean service layer (`src/services/`):
    *   `gemini.js` for ADK multi-agent execution.
    *   `speech.js` for Speech-to-Text and Text-to-Speech logic.
    *   `cloudTranslation.js` for Google Cloud Translation integrations.
    *   `bigquery.js` for BigQuery ARIMA ML forecasts.
    *   `earthEngine.js` for Earth Engine satellite telemetry.
*   **Static Context Isolation**: Mocks and test data are stored in a dedicated data directory (`src/data/mockData.js`), isolating telemetry structures from layout components.

## Linting and Code Style Gates

We enforce automated syntax and code quality checks:
*   **oxlint**: A fast linter configured via `.oxlintrc.json` to scan the codebase and block commits on warnings or syntax problems.
*   **Prettier**: Standard formatting rules specified in `.prettierrc` for clean, consistent formatting.
*   **TypeScript Declarations**: JS files utilize complete JSDoc annotations to document functions, parameters, and return types clearly.

## Continuous Integration Quality Gates

The `.github/workflows/ci.yml` pipeline enforces the following sequence on every code push:
1.  **lint**: Run linter (`npm run lint`).
2.  **typecheck**: Run type check validator (`npm run typecheck`).
3.  **test**: Execute unit and component tests with code coverage (`npm run test:coverage`).
4.  **build**: Compile production bundles (`npm run build`).
5.  **test:e2e**: Trigger Playwright integration checks (`npm run test:e2e`).
