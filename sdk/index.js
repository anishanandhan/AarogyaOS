/**
 * AarogyaOS Client SDK
 * Production-ready developer library to programmatically interface with the
 * AarogyaOS District Decision Intelligence endpoints in just 3 lines of code.
 */
export class AarogyaOSClient {
  /**
   * Initializes the AarogyaOS Client
   * @param {Object} options
   * @param {string} options.apiUrl - Base URL of the AarogyaOS backend service (default: http://localhost:8080/api/v1)
   */
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'http://localhost:8080/api/v1';
  }

  /**
   * Helper to perform fetch requests securely
   */
  async _request(endpoint, method = 'GET', body = null) {
    const url = `${this.apiUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const headers = { 'Content-Type': 'application/json' };
    const config = { method, headers };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`AarogyaOS SDK Error: Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[AarogyaOS Client SDK] Request to ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Verifies backend connection health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    return this._request('/health', 'GET');
  }

  /**
   * Fetches full clinical telemetry from all Primary Health Centres
   * @returns {Promise<Object>} District clinic registers
   */
  async getClinics() {
    return this._request('/telemetry/clinics', 'GET');
  }

  /**
   * Runs multi-agent intelligence query on the district state
   * @param {Array<Object>} messages - Message history
   * @param {string} language - Target language ('en' | 'hi' | 'ta')
   * @returns {Promise<Object>} Unified supervisor analysis report
   */
  async runAnalysis(messages, language = 'en') {
    if (!messages || !Array.isArray(messages)) {
      throw new Error('AarogyaOS SDK: messages array is required for analysis.');
    }
    return this._request('/analyze', 'POST', { messages, language });
  }

  /**
   * Audits ASHA field worker visit logs for metadata & vision fraud
   * @param {Object} params
   * @param {string} params.base64Image - Base64 encoded verification photo
   * @param {string} params.workerName - Name of ASHA worker
   * @param {string} params.householdId - Assigned household target
   * @returns {Promise<Object>} Verification status & confidence ranking
   */
  async auditVisitPhoto({ base64Image, workerName, householdId }) {
    if (!base64Image || !workerName || !householdId) {
      throw new Error('AarogyaOS SDK: base64Image, workerName, and householdId are required for visit audits.');
    }
    return this._request('/audit', 'POST', { base64Image, workerName, householdId });
  }
}
