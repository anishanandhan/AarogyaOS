# AarogyaOS
The Operating System for Rural Health. AI-driven multi-agent coordination, field worker visit auditing, and real-time clinical telemetry for primary health centres.

[Live Demo](https://aarogyaos.web.app) | [Documentation](#) | [Architecture](#architecture)

## Table of Contents
* [About](#about)
* [Key Highlights](#key-highlights)
* [Chosen Vertical](#chosen-vertical)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Configuration](#configuration)
* [Security](#security)
* [Privacy](#privacy)
* [Data Sources](#data-sources)
* [Accessibility](#accessibility)
* [Testing](#testing)
* [Assumptions](#assumptions)
* [How to Contribute](#how-to-contribute)
* [License](#license)
* [Acknowledgements](#acknowledgements)
* [Author](#author)

## About
Primary health networks in rural sectors face significant coordination gaps. Local health coordinators and ASHA field workers log household checks on paper registers, leading to a complete lack of operational visibility at the district level. Because visits are logged manually, supervisors cannot verify field audits, leading to inaccurate reporting. Furthermore, Primary Health Centres (PHCs) lack real-time coordination for doctor attendance, laboratory diagnostics availability, and critical medicine stock levels.

AarogyaOS addresses this coordination gap by providing a unified decision intelligence layer. The platform aggregates field check-ins and clinical telemetry, rendering them on an interactive district map. It runs a multi-agent orchestration workflow to parse telemetry data, flag discrepancies, and suggest administrative actions.

The application runs as a static client-side dashboard with serverless integrations. Telemetry analysis is performed using Gemini LLM agents configured with specific roles. Geospatial data is visualized via Google Maps and heatmap layers, and predictions are generated using ARIMA models.

### Key Highlights
* **Agentic Orchestration:** Coordination of four specialized LLM agents (StockSense, AttendAI, ASHATrack, and Supervisor) using the Agent Development Kit (ADK) workflow model.
* **Geospatial Hotspots:** Real-time clinic mapping color-coded by performance index, with a togglable heatmap layer showing disease surge density.
* **Field Auditing:** Geolocation verification of ASHA worker visits with metadata anomaly detection to verify home checks.

---

## Chosen Vertical
Rural Health Worker Attendance & PHC Operations Track.

| Pillar | What this platform does |
|--------|------------------------|
| Attendance Accountability | Verifies ASHA worker home visits via metadata mismatch checks and logs doctor presence. |
| Resource Coordination | Coordinates medicine stocks across PHCs to prevent stockouts using redirection models. |
| Clinical Telemetry | Aggregates footfalls, bed occupancy, and diagnostic availability into a district dashboard. |

---

## Features
### Core Features
| Feature | Description |
|---|---|
| ADK Multi-Agent Orchestration | Runs parallel agents (StockSense, AttendAI, ASHATrack) consolidated by a Supervisor Agent to assess district health status. |
| Geolocation Verification | Flags ASHA worker check-ins where photo upload metadata does not match the assigned village location. |
| Interactive Health Map | Renders clinics on a custom-styled dark theme Google Map with score-based pin colors and a disease surge heatmap. |
| VaaniBot Assistant | Voice-enabled assistant supporting English, Hindi, and Tamil queries using Speech-to-Text and Text-to-Speech APIs. |
| Gesture Navigation | Supports hands-free interface navigation using keyboard keys 1-7 in simulated gesture mode. |
| ARIMA Footfall Forecast | Predicts patient surges and bed occupancy trends for the next 7 days using simulated BigQuery ML models. |
| Satellite Environmental Report | Displays vegetation (NDVI) and water body indexes (NDWI) from Sentinel-2 and Landsat-8 imagery to identify disease risk. |

### User Experience
| Feature | Description |
|---|---|
| Loading States | Displays skeletons and spinning indicators during API fetches, speech processing, and report generations. |
| Error Handling | Displays user-facing banners for network failures, missing API keys, and invalid form inputs. |
| Accessibility | Implements complete ARIA tags, sequential keyboard focus, skip links, and screen reader-friendly live regions. |

---

## Tech Stack
| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | React 19 + Vite 8 | UI rendering and hot module reloading build tooling |
| CSS styling | Tailwind CSS v4 | Utility-first styling framework |
| Router | React Router Dom v7 | Client-side routing and path parameter handling |
| Icons | Lucide React | Clean, scalable vector icon elements |
| Charting | Recharts | SVG-based dashboard telemetry rendering |
| Machine Learning | Gemini 1.5 Flash | Multi-agent evaluation and natural language query processing |
| Hosting (CDN) | Firebase Hosting | Secure static asset delivery and edge routing |
| Hosting (Container) | Google Cloud Run | Docker-based runtime container hosting |
| Testing | Vitest + RTL | Unit and component testing with v8 code coverage |
| E2E Testing | Playwright | Full user journey and accessibility automation |

---

## Architecture
```
                  ┌───────────────────────────────────────────────┐
                  │                 Browser SPA                   │
                  │   ┌───────────────────┐ ┌─────────────────┐   │
                  │   │   React Views     │ │  VaaniBot Voice │   │
                  │   └─────────┬─────────┘ └────────┬────────┘   │
                  └─────────────┼────────────────────┼────────────┘
                                │                    │
                                ▼                    ▼
                  ┌───────────────────────────────────────────────┐
                  │           Vite Client Services Layer          │
                  │   ┌───────────────────┐ ┌─────────────────┐   │
                  │   │   gemini.js       │ │  speech.js      │   │
                  │   ├───────────────────┤ ├─────────────────┤   │
                  │   │   earthEngine.js  │ │  bigquery.js    │   │
                  │   └─────────┬─────────┘ └────────┬────────┘   │
                  └─────────────┼────────────────────┼────────────┘
                                │                    │
                                ▼                    ▼
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                        Google Cloud Platform Backend                    │
   │  ┌────────────────────┐ ┌────────────────────┐ ┌─────────────────────┐  │
   │  │   Vertex AI API    │ │   Cloud Functions  │ │ Google Maps Platform│  │
   │  │ (Gemini 1.5 Flash) │ │ (Scheduled Audits) │ │ (Maps JS / Heatmap) │  │
   │  └────────────────────┘ └────────────────────┘ └─────────────────────┘  │
   └─────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure
```
AarogyaOS/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline (lint, typecheck, test, build, E2E)
│       └── lighthouse.yml      # Automated Lighthouse performance audit
├── docs/
│   ├── architecture.md         # System design details
│   ├── judge_evidence.md       # Compliance evidence for judges
│   └── prd.md                  # Product requirements document
├── public/
│   ├── .well-known/
│   │   └── security.txt        # Machine-readable security contact details
│   └── mock_visit.png          # Sample image for ASHA visit testing
├── src/
│   ├── components/
│   │   ├── HealthScoreRing.jsx # SVG-based custom health score ring
│   │   ├── Layout.jsx          # Header, navigation, and sidebar wrapper
│   │   └── VaaniBot.jsx        # Voice-enabled chat drawer
│   ├── context/
│   │   └── AppContext.jsx      # Global state context for telemetry and alerts
│   ├── data/
│   │   └── mockData.js         # Base data structures for PHCs and workers
│   ├── lib/
│   │   └── security/
│   │       ├── headers.js      # Central HTTP security headers policy
│   │       └── sanitize.js     # Input cleaning and log redaction utilities
│   ├── pages/
│   │   ├── DashboardPage.jsx   # Analytics dashboard
│   │   ├── PublicHealthMapPage.jsx # Google Map showing clinic telemetry
│   │   └── ...                 # Additional page layouts
│   └── services/
│       ├── bigquery.js         # BigQuery ARIMA forecast service
│       ├── earthEngine.js      # Earth Engine satellite report service
│       ├── gemini.js           # Gemini API multi-agent coordination
│       ├── qdrant.js           # Qdrant mock RAG vector lookup
│       └── speech.js           # Voice input and speech synthesis service
├── test/
│   ├── components/             # React component test specs (jest-axe)
│   ├── security/               # Sanitizer and security header test specs
│   └── setup.js                # Test suite configuration and API mocks
├── Dockerfile                  # Multi-stage production container build file
├── firebase.json               # Firebase hosting routing and header configuration
├── package.json                # Project dependencies and script declarations
├── vite.config.js              # Vite compiler configuration
└── vitest.config.js            # Vitest test runner configuration
```

---

## Getting Started
### Prerequisites
* Node.js v20+
* npm v10+

### 1. Clone & Install
```bash
git clone https://github.com/anishanandhan/AarogyaOS.git
cd AarogyaOS
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_CLOUD_TRANSLATION_API_KEY=your_translation_key_here
```
*Note: If these keys are left empty, the application will fallback to sandbox mode with simulated outputs.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Tests
Execute the unit and component test suite:
```bash
npm run test
```
To run tests with code coverage outputs:
```bash
npm run test:coverage
```

### 5. Build & Deploy
Compile the production assets:
```bash
npm run build
```
To deploy to Firebase Hosting:
```bash
npx firebase-tools deploy --only hosting --project your-firebase-project
```

---

## Configuration
| Setting | Default | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | `""` | Gemini API credential. Fallbacks to mock reports if empty. |
| `VITE_GOOGLE_MAPS_API_KEY` | `""` | Google Maps API key. Renders in developer sandbox if missing. |
| `VITE_CLOUD_TRANSLATION_API_KEY` | `""` | Translation API key. Disables dynamic translation if empty. |

---

## Security
### Authentication
Static client-side role assignment ("District Medical Officer" or "ASHA Worker") selected at login. Sessions are stored in the application context.

### HTTP Security Headers
| Header | Value | Purpose |
|---|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' ...` | Prevents XSS and unauthorized script execution. |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains; preload` | Forces SSL/TLS connection pathways. |
| X-Frame-Options | `DENY` | Mitigates clickjacking attacks. |
| X-Content-Type-Options | `nosniff` | Blocks MIME-type sniffing. |
| Referrer-Policy | `strict-origin-when-cross-origin` | Limits referrer metadata leaks. |
| Permissions-Policy | `camera=(), microphone=(self) ...` | Controls device permissions. |

### Input Validation
All text input received by VaaniBot is sanitized via `sanitizeInput` to strip control characters and escape HTML tags before compilation.

### Sensitive Data Redaction
Any log statements generated by services pass through `redactSecrets`, which masks API credentials (`AIzaSy...`), tokens, and emails to prevent leakage.

---

## Privacy
* **No PII Stored:** No patient names or contact details are recorded. ASHA logs reference anonymous household tokens.
* **Logs Excluded:** API keys, authorization tokens, and personal email addresses are masked by the redaction filter.
* **Data Flow:** Clinical telemetry is kept in local state. Audio streams for Speech-to-Text are processed in-memory and are not stored.

---

## Data Sources
| Factor | Source |
|--------|--------|
| PHC Registry Guidelines | National Health Mission (NHM) India, 2024 |
| Community Health Indicators | NFHS-5 Tamil Nadu State Factsheet, 2021 |
| ASHA Training Modules | Ministry of Health & Family Welfare (MoHFW), 2023 |
| Air Quality Indices | Central Pollution Control Board (CPCB) India, 2025 |

---

## Accessibility
### WCAG 2.1 AA Compliance
* **Keyboard Navigation:** Focus rings are configured for all buttons, inputs, and tabs. Interactive list containers implement appropriate keyboard indexing.
* **ARIA Attributes:** Screen reader labels (`aria-label`) are attached to all icon buttons. Modals use `aria-modal="true"`.
* **Contrast Ratios:** Color selections meet the minimum 4.5:1 ratio for normal text.

### Screen Reader Support
* The VaaniBot chat drawer uses `role="log"` with `aria-live="polite"` to announce new incoming messages automatically.
* Dynamic warnings on the alerts feed are highlighted with assertive alerts when critical.

---

## Testing
### Unit Tests
* Evaluates input sanitizers, HTML escaping, and logging credential redactions.
* Verifies security header output configurations.

### Component Tests
* Renders `HealthScoreRing` and `VaaniBot` views.
* Asserts structural rendering, state transitions, and interaction callbacks.
* Runs `jest-axe` checks to verify WCAG compliance.

### E2E + Accessibility
* Playwright integration tests verify landing, navigation, and dashboard interaction flows.
* Full-page audits using `axe-playwright` scan modal overlays to verify zero accessibility violations.

---

## Assumptions
* **Local Telemetry Cache:** Telemetry data is simulated via mock files. It is cached in React Context for local execution.
* **API Sandbox Fallbacks:** In the absence of cloud credentials, the application reverts to mock responses so that it remains functional.
* **Audio Recording Formats:** Voice recording uses standard container types supported by modern browsers (WebM/Opus).

---

## How to Contribute
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -am 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## What's Next?
- [ ] Integration with state-wide HMIS API endpoints.
- [ ] Offline support for ASHA worker logs using Service Workers.
- [ ] High-resolution satellite overlay rendering via Earth Engine REST API.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements
* [Google Cloud Translation API](https://cloud.google.com/translate)
* [Google Maps JavaScript API](https://developers.google.com/maps)
* [Vertex AI Gemini API](https://cloud.google.com/vertex-ai)
* [Lucide Icons](https://lucide.dev)
* [Recharts Library](https://recharts.org)

## Author
**Anish Anandhan**
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=flat&logo=github&logoColor=white)](https://github.com/anishanandhan)
