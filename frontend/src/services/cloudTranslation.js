/**
 * Google Cloud Translation API Integration
 * Provides dynamic translation for AI responses, alerts, and user-generated content
 * Complements static UI translations with real-time language conversion
 */

const TRANSLATION_API_KEY = import.meta.env.VITE_CLOUD_TRANSLATION_API_KEY;
const TRANSLATION_ENDPOINT = `https://translation.googleapis.com/language/translate/v2`;

/**
 * Supported language codes
 */
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil'
};

/**
 * Check if Translation API key is configured
 */
const isTranslationEnabled = () => {
  return TRANSLATION_API_KEY && TRANSLATION_API_KEY !== 'your_translation_api_key_here' && TRANSLATION_API_KEY.trim() !== '';
};

/**
 * Translate text using Google Cloud Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (en, hi, ta)
 * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLanguage, sourceLanguage = null) {
  // Return original text if already in target language or translation disabled
  if (!isTranslationEnabled()) {
    console.log('[Cloud Translation] API key not configured, returning original text');
    return text;
  }

  // Skip translation if text is empty
  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const params = new URLSearchParams({
      key: TRANSLATION_API_KEY,
      q: text,
      target: targetLanguage,
      format: 'text'
    });

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    const response = await fetch(`${TRANSLATION_ENDPOINT}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    console.log(`[Cloud Translation] Translated: "${text.substring(0, 50)}..." → ${targetLanguage}`);
    return translatedText;

  } catch (error) {
    console.error('[Cloud Translation] Error:', error);
    // Fallback: return original text if translation fails
    return text;
  }
}

/**
 * Translate multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateBatch(texts, targetLanguage, sourceLanguage = null) {
  if (!isTranslationEnabled()) {
    return texts;
  }

  if (!texts || texts.length === 0) {
    return texts;
  }

  try {
    const params = new URLSearchParams({
      key: TRANSLATION_API_KEY,
      target: targetLanguage,
      format: 'text'
    });

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    // Add all texts as separate q parameters
    texts.forEach(text => {
      if (text && text.trim() !== '') {
        params.append('q', text);
      }
    });

    const response = await fetch(`${TRANSLATION_ENDPOINT}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const translatedTexts = data.data.translations.map(t => t.translatedText);

    console.log(`[Cloud Translation] Batch translated ${translatedTexts.length} texts → ${targetLanguage}`);
    return translatedTexts;

  } catch (error) {
    console.error('[Cloud Translation] Batch error:', error);
    return texts; // Fallback to original texts
  }
}

/**
 * Detect language of given text
 * @param {string} text - Text to analyze
 * @returns {Promise<{language: string, confidence: number}>} Detected language and confidence
 */
export async function detectLanguage(text) {
  if (!isTranslationEnabled()) {
    return { language: 'en', confidence: 0 };
  }

  if (!text || text.trim() === '') {
    return { language: 'en', confidence: 0 };
  }

  try {
    const params = new URLSearchParams({
      key: TRANSLATION_API_KEY,
      q: text
    });

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Detection API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const detection = data.data.detections[0][0];

    console.log(`[Cloud Translation] Detected language: ${detection.language} (confidence: ${detection.confidence})`);
    return {
      language: detection.language,
      confidence: detection.confidence
    };

  } catch (error) {
    console.error('[Cloud Translation] Detection error:', error);
    return { language: 'en', confidence: 0 };
  }
}

/**
 * Translate alert messages dynamically based on user's language preference
 * @param {Object} alert - Alert object with message and recommendation
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<Object>} Alert with translated fields
 */
export async function translateAlert(alert, targetLanguage) {
  if (targetLanguage === 'en' || !isTranslationEnabled()) {
    return alert;
  }

  try {
    const [translatedMessage, translatedRecommendation] = await translateBatch(
      [alert.message, alert.recommendation],
      targetLanguage,
      'en'
    );

    return {
      ...alert,
      message: translatedMessage,
      recommendation: translatedRecommendation
    };
  } catch (error) {
    console.error('[Cloud Translation] Alert translation error:', error);
    return alert;
  }
}

/**
 * Translate AI agent report dynamically
 * @param {string} report - Agent report text
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} Translated report
 */
export async function translateAgentReport(report, targetLanguage) {
  if (targetLanguage === 'en' || !isTranslationEnabled()) {
    return report;
  }

  return translateText(report, targetLanguage, 'en');
}

/**
 * Translate VaaniBot response based on detected user language
 * @param {string} response - Bot response text
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} Translated response
 */
export async function translateBotResponse(response, targetLanguage) {
  if (targetLanguage === 'en' || !isTranslationEnabled()) {
    return response;
  }

  return translateText(response, targetLanguage, 'en');
}

/**
 * Get list of supported languages
 * @returns {Promise<Array>} List of supported language codes and names
 */
export async function getSupportedLanguages() {
  if (!isTranslationEnabled()) {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({ code, name }));
  }

  try {
    const params = new URLSearchParams({
      key: TRANSLATION_API_KEY,
      target: 'en'
    });

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/languages?${params}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Languages API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.languages;

  } catch (error) {
    console.error('[Cloud Translation] Languages fetch error:', error);
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => ({ code, name }));
  }
}

/**
 * Check if Translation API is configured and working
 * @returns {Promise<boolean>} True if API is functional
 */
export async function testTranslationAPI() {
  if (!isTranslationEnabled()) {
    return false;
  }

  try {
    const testText = await translateText('Hello', 'hi', 'en');
    return testText !== 'Hello'; // Should return "नमस्ते" or similar
  } catch (error) {
    console.error('[Cloud Translation] API test failed:', error);
    return false;
  }
}

export default {
  translateText,
  translateBatch,
  detectLanguage,
  translateAlert,
  translateAgentReport,
  translateBotResponse,
  getSupportedLanguages,
  testTranslationAPI,
  isEnabled: isTranslationEnabled
};
