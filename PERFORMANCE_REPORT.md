# Performance Audit & Optimization Report

AarogyaOS is optimized for fast load times, minimal client-side CPU usage, and highly responsive page transitions, ensuring usability over low-bandwidth connections in rural clinics.

## Core Optimization Metrics

### 1. Bundle Splitting & Size Reductions
*   Vite 8 production builds use Rolldown for asset bundling, generating optimized chunks.
*   Large assets and third-party scripts (like the Google Maps SDK) are loaded **lazy/dynamically** at runtime only when entering pages that require them.
*   Production assets are gzipped to under **260kB**, allowing fast initial page load times.

### 2. Client-Side Rendering Efficiency
*   We utilize React's `useEffect` hooks and local state to prevent unnecessary component renders.
*   Data queries and API calls are cached locally or in state context to prevent redundant fetches.
*   CSS styling is built on Tailwind CSS v4, which outputs a single, clean utilities stylesheet.

### 3. Serverless Edge Caching
*   `firebase.json` specifies long-term caching for static JS/CSS assets:
    ```json
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
    ```

## Lighthouse Audit Thresholds
We track and assert performance scores in our GitHub Actions pipeline using Google Lighthouse CI (`.github/workflows/lighthouse.yml`). The workflow asserts the following quality thresholds:
*   **Performance**: > 90
*   **Accessibility**: > 95
*   **Best Practices**: > 90
*   **SEO**: > 90
