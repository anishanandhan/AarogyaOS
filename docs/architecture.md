# System Architecture & Design

AarogyaOS is structured as a client-first React 19 application decoupled from external microservices via a clean service interface layer, running on serverless Google Cloud platforms.

## System Topology

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

## Modular Layers

### 1. Presentation Layer (React + Tailwind CSS)
*   Provides fully responsive pages for Dashboard, Alerts, ASHA Worker Auditing, Stock Redistribution, and Laboratory Analytics.
*   Uses Lucide React for iconography and Recharts for custom SVG-based time-series visual rendering.

### 2. Service Layer (Client-Side SDKs)
*   **`gemini.js`**: Integrates Gemini 1.5 Flash with custom prompts to run our ADK Multi-Agent Orchestration workflow (StockSense, AttendAI, ASHATrack, and Supervisor coordination).
*   **`speech.js`**: Connects to the browser's Web Speech API and Google Cloud Speech endpoints for real-time transcription and speech synthesis (text-to-speech).
*   **`bigquery.js`**: Simulates the BigQuery ML ARIMA forecasting model, returning ARIMA_PLUS predictions and error bounds.
*   **`earthEngine.js`**: Wraps Landsat-8 and Sentinel-2 geospatial analysis formulas for health facility environmental risk assessment.

### 3. Google Cloud Backend
*   **Cloud Run Container**: Serves the application bundle using Nginx configured to listen on the default port `8080` for high performance and low startup latency.
*   **Firebase Hosting**: Delivers the compiled static assets globally via CDN, enforcing strict HTTPS policies and custom security headers on all paths.
