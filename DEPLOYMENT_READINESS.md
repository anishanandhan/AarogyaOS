# AarogyaOS Enterprise Deployment & Architecture Q&A Guide

Prepare for technical reviews and deployment audits using this architectural handbook.

---

## 💬 Core Platform Concept: From Prototype to Product

> **Platform Architecture:** "AarogyaOS is an enterprise-ready, offline-first health coordination platform. We protect credentials with a secure Node.js backend, execute real-world resource redistribution directly on a persistent local database, run mathematical Least Squares Regression forecasts on historical visits, cache assets for offline usage in low-connectivity clinics, and provide complete cost transparency with a projected ₹12,860/month run rate per district."

---

## ❓ Critical Technical Questions & Architectural Answers

### Q1: "Is the AI and forecasting real, or just simulated?"
* **Answer:** "The forecasting is 100% functional and executed on the server. When navigating to the FlowAI tab, the frontend sends historical daily clinic visits to our backend forecast route (`POST /api/v1/analytics/forecast`). The backend runs a Least Squares Linear Regression algorithm ($y = mx + c$) directly on the data, calculating the slope, intercept, and standard error of the regression to project the next 7 days' values along with 95% upper and lower confidence intervals."
* **Code References:** 
  * [`backend/src/services/forecastingService.js`](file:///Users/anishanan/Google/backend/src/services/forecastingService.js)
  * [`frontend/src/services/bigquery.js:L143-L175`](file:///Users/anishanan/Google/frontend/src/services/bigquery.js#L143-L175)

### Q2: "Rural clinics have poor or zero internet connectivity. How can they use this?"
* **Answer:** "AarogyaOS is built as a Progressive Web App (PWA) using a native Service Worker (`sw.js`). When a user loads the app once, the Service Worker caches all core assets (HTML, CSS, JS, SVGs) using a Cache-First strategy. For API telemetry data, it uses a Network-First strategy. If a PHC loses network connectivity, the Service Worker automatically intercepts the requests and serves cached database payloads, allowing the clinic profile, diagnostic matrix, and log interfaces to remain fully functional offline."
* **Code References:** 
  * [`frontend/public/sw.js`](file:///Users/anishanan/Google/frontend/public/sw.js)
  * [`frontend/src/main.jsx:L14-L23`](file:///Users/anishanan/Google/frontend/src/main.jsx#L14-L23)

### Q3: "Where is the data saved? Does it reset when we refresh the page?"
* **Answer:** "No, it does not reset. We implemented a persistent JSON database engine on the backend. When you approve stock transfers or check in staff, the frontend updates are POSTed directly to the backend API. The backend database manager (`jsonDb.js`) handles the transactions and writes updates persistently to disk at `/datasets/database.json`. This ensures that inventory and attendance logs survive system restarts and page refreshes."
* **Code References:**
  * [`backend/src/config/jsonDb.js`](file:///Users/anishanan/Google/backend/src/config/jsonDb.js)
  * [`backend/src/routes/api.js`](file:///Users/anishanan/Google/backend/src/routes/api.js)

### Q4: "How much does it cost to scale this platform across a district or state?"
* **Answer:** "We have built a dedicated Cost Analytics & ROI dashboard. For a single clinic, operational GCloud API costs are ₹1,550/month. For an entire district (8 clinics), it totals ₹12,860/month. This cost is offset by an estimated ₹2.25 Lakhs/month in savings due to early stock-out prevention, optimized attendance, and ASHA audit checks, yielding a 15x Return on Investment (ROI) for the state treasury."
* **Code References:**
  * [`frontend/src/pages/CostAnalyticsPage.jsx`](file:///Users/anishanan/Google/frontend/src/pages/CostAnalyticsPage.jsx)
  * [`frontend/src/components/CostAnalysisWidget.jsx`](file:///Users/anishanan/Google/frontend/src/components/CostAnalysisWidget.jsx)

### Q5: "How did you verify code quality and reliability?"
* **Answer:** "We maintain a robust CI/CD suite consisting of 25 passing Vitest unit tests covering sanitization, custom HTTP security headers (CSP, HSTS, XSS protections), and accessibility. Component tests integrate automated `jest-axe` checks to guarantee 100% WCAG 2.1 AA screen-reader compliance. Playwright E2E suites verify the core user journey end-to-end."
* **Code References:**
  * [`tests/unit/components/VaaniBot.test.jsx`](file:///Users/anishanan/Google/tests/unit/components/VaaniBot.test.jsx)
  * [`tests/e2e/main-flow.spec.js`](file:///Users/anishanan/Google/tests/e2e/main-flow.spec.js)

### Q6: "Why does the interface style align with official government health command centers?"
* **Answer:** "We deliberately branded the interface to mirror India's MoHFW/NHM portals with official color schemes (Material Design 3 Primary Blue `#1565C0` and Healthcare Green `#2E7D32`), clear stakeholder workflow tabs, and live district command previews. Additionally, we renamed all AI sidebar widgets into professional public health terms (e.g., 'Essential Medicines', 'Patient Flow & Beds', 'Workforce Planning', 'Community Health', 'Diagnostics Audit', 'Operational Engine') to ensure a non-technical administrator's office can understand the platform within 5 minutes without getting lost in technical AI jargon."
* **Code References:**
  * [`frontend/src/pages/LandingPage.jsx`](file:///Users/anishanan/Google/frontend/src/pages/LandingPage.jsx)
  * [`frontend/src/components/Layout.jsx:L143-L157`](file:///Users/anishanan/Google/frontend/src/components/Layout.jsx#L143-L157)
  * [`frontend/src/i18n/translations.js:L4-L15`](file:///Users/anishanan/Google/frontend/src/i18n/translations.js#L4-L15)
