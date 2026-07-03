# AarogyaOS Developer Client SDK

Integrate AarogyaOS primary health telemetry and multi-agent AI analysis into third-party clinical portals or government monitoring dashboards in just 3 lines of code.

## Installation

```bash
npm install @aarogyaos/sdk
```

## Quick Start (3 Lines of Code)

```javascript
import { AarogyaOSClient } from '@aarogyaos/sdk';
const client = new AarogyaOSClient({ apiUrl: 'http://localhost:8080/api/v1' });
const report = await client.runAnalysis([{ role: 'user', content: 'Shortage status of ORS' }]);
```

## Methods Available

*   `checkHealth()`: Returns status of backend service connections.
*   `getClinics()`: Returns all Primary Health Centres telemetry data.
*   `runAnalysis(messages, language)`: Generates Gemini multi-agent supervisor report.
*   `auditVisitPhoto({ base64Image, workerName, householdId })`: Submits ASHA photo for vision anomaly check.
