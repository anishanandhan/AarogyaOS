# Product Requirements Document (PRD)

## Problem Statement
Rural healthcare networks (Primary Health Centres, Sub-Centres) in India face a persistent challenge of accountability, real-time coordination, and operational insight:
1.  **Manual Field Records**: ASHA/ANM health workers log visits on paper, preventing real-time tracking of community health coverage.
2.  **Unverified Field Visits**: Supervisors cannot verify if assigned households were checked, allowing fake check-ins to slip through.
3.  **Critical Resource Latency**: District health offices lack live, unified insight into doctor absenteeism, medicine stockouts, and diagnostic laboratory shortages across clinics.

## User Personas
*   **District Medical Officer (DMO)**: Needs district-wide analytical telemetry to orchestrate medicine transfers, verify ASHA field performance, and manage medical personnel roster gaps.
*   **PHC Medical Officer**: Manages single facility operations, tracks daily patient footfalls, and manages local medicine stocks.
*   **ASHA Worker / ANM**: Delivers door-to-door community healthcare, registers patient details, and logs household health audits.

## Solution Goals
*   Provide a unified multi-agent district coordination portal powered by Gemini models and the Agent Development Kit (ADK) workflow model.
*   Deploy anti-fraud GPS/Photo verification controls to validate ASHA field worker household check-ins.
*   Leverage BigQuery ML forecasting to predict patient surges and Earth Engine satellite analysis to map environmental disease vector breeding risks.
*   Deliver dynamic voice assistant integrations (VaaniBot) in regional languages (English, Hindi, Tamil) for hands-free operational query resolution.
