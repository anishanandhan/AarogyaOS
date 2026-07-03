/**
 * Google Cloud Speech-to-Text & Text-to-Speech Integration
 * Provides voice input/output for accessibility and field worker convenience
 */

// Cloud Speech API configuration
const SPEECH_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
const SPEECH_TO_TEXT_ENDPOINT = 'https://speech.googleapis.com/v1/speech:recognize';
const TEXT_TO_SPEECH_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/**
 * Check if Speech APIs are available
 */
const isSpeechAPIEnabled = () => {
  return SPEECH_API_KEY && SPEECH_API_KEY.trim() !== '';
};

/**
 * Check if Web Speech API is available (browser fallback)
 */
const isWebSpeechAvailable = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

/**
 * Convert speech to text using Google Cloud Speech-to-Text API
 * @param {Blob} audioBlob - Audio recording blob
 * @param {string} languageCode - Language code (en-US, hi-IN, ta-IN)
 * @returns {Promise<string>} Transcribed text
 */
export async function speechToText(audioBlob, languageCode = 'en-US') {
  console.log('[Speech-to-Text] Starting transcription...');

  try {
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob);

    const response = await fetch(`${SPEECH_TO_TEXT_ENDPOINT}?key=${SPEECH_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: languageCode,
          enableAutomaticPunctuation: true,
          model: 'default',
        },
        audio: {
          content: base64Audio,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Speech API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return '';
    }

    const transcript = data.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');

    console.log('[Speech-to-Text] Transcription successful:', transcript);
    return transcript;

  } catch (error) {
    console.error('[Speech-to-Text] Error:', error);
    throw error;
  }
}

/**
 * Convert text to speech using Google Cloud Text-to-Speech API
 * @param {string} text - Text to convert to speech
 * @param {string} languageCode - Language code (en-US, hi-IN, ta-IN)
 * @param {string} voiceGender - MALE or FEMALE
 * @returns {Promise<AudioBuffer>} Audio buffer that can be played
 */
export async function textToSpeech(text, languageCode = 'en-US', voiceGender = 'FEMALE') {
  console.log('[Text-to-Speech] Converting text to speech:', text.substring(0, 50));

  if (!isSpeechAPIEnabled()) {
    // Fallback to Web Speech API
    return textToSpeechWebAPI(text, languageCode);
  }

  try {
    const response = await fetch(`${TEXT_TO_SPEECH_ENDPOINT}?key=${SPEECH_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode,
          ssmlGender: voiceGender,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1.0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Text-to-Speech API error: ${response.status}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    // Convert base64 audio to blob
    const audioBlob = base64ToBlob(audioContent, 'audio/mp3');
    const audioUrl = URL.createObjectURL(audioBlob);

    console.log('[Text-to-Speech] Audio generated successfully');
    return audioUrl;

  } catch (error) {
    console.error('[Text-to-Speech] Error:', error);
    // Fallback to Web Speech API
    return textToSpeechWebAPI(text, languageCode);
  }
}

/**
 * Web Speech API fallback for text-to-speech
 */
function textToSpeechWebAPI(text, languageCode) {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      console.log('[Text-to-Speech] Web API playback complete');
      resolve(null);
    };

    utterance.onerror = (error) => {
      reject(error);
    };

    window.speechSynthesis.speak(utterance);
    resolve('web-speech-api');
  });
}

/**
 * Web Speech API for real-time speech recognition
 * @param {string} languageCode - Language code
 * @param {Function} onResult - Callback for interim and final results
 * @param {Function} onEnd - Callback when recognition ends
 * @returns {SpeechRecognition} Recognition instance for control
 */
export function startContinuousSpeechRecognition(languageCode = 'en-US', onResult, onEnd) {
  if (!isWebSpeechAvailable()) {
    console.error('[Speech Recognition] Web Speech API not available');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = languageCode;

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    if (onResult) {
      onResult({
        interim: interimTranscript,
        final: finalTranscript,
        isFinal: finalTranscript.length > 0,
      });
    }
  };

  recognition.onerror = (event) => {
    console.error('[Speech Recognition] Error:', event.error);
  };

  recognition.onend = () => {
    console.log('[Speech Recognition] Stopped');
    if (onEnd) onEnd();
  };

  recognition.start();
  console.log('[Speech Recognition] Started');

  return recognition;
}

/**
 * Record audio from microphone
 * @param {number} maxDurationMs - Maximum recording duration
 * @returns {Promise<Blob>} Audio blob
 */
export async function recordAudio(maxDurationMs = 30000) {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      };

      mediaRecorder.start();
      console.log('[Audio Recording] Started');

      // Auto-stop after max duration
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          console.log('[Audio Recording] Auto-stopped after timeout');
        }
      }, maxDurationMs);

      // Return control functions
      resolve({
        stop: () => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        },
        promise: new Promise((res) => {
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
            res(audioBlob);
          };
        }),
      });

    } catch (error) {
      console.error('[Audio Recording] Error:', error);
      reject(error);
    }
  });
}

/**
 * Play audio alert with text-to-speech
 * @param {string} alertText - Alert message to speak
 * @param {string} language - Language code
 */
export async function playAudioAlert(alertText, language = 'en') {
  const languageMap = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
  };

  const languageCode = languageMap[language] || 'en-US';

  try {
    const audioUrl = await textToSpeech(alertText, languageCode);

    if (audioUrl === 'web-speech-api' || audioUrl === null) {
      // Web Speech API already played the audio
      return;
    }

    // Play the audio
    const audio = new Audio(audioUrl);
    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

  } catch (error) {
    console.error('[Audio Alert] Failed to play:', error);
  }
}

/**
 * Utility: Convert blob to base64
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Utility: Convert base64 to blob
 */
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Get language-specific voice alert for different alert types
 */
export function getAlertVoiceMessage(alert, language = 'en') {
  const messages = {
    en: {
      STOCK_OUT: `Critical alert: ${alert.message}. Immediate action required.`,
      DOCTOR_ABSENT: `Staff alert: ${alert.message}. Please verify attendance.`,
      BED_CAPACITY: `Capacity alert: ${alert.message}. Consider patient transfer.`,
      FOOTFALL_SURGE: `Patient surge detected: ${alert.message}. Prepare additional resources.`,
    },
    hi: {
      STOCK_OUT: `गंभीर चेतावनी: दवाई की कमी। तुरंत कार्रवाई आवश्यक है।`,
      DOCTOR_ABSENT: `स्टाफ चेतावनी: डॉक्टर अनुपस्थित। कृपया उपस्थिति सत्यापित करें।`,
      BED_CAPACITY: `बिस्तर क्षमता चेतावनी। रोगी स्थानांतरण पर विचार करें।`,
      FOOTFALL_SURGE: `रोगी वृद्धि का पता चला। अतिरिक्त संसाधन तैयार करें।`,
    },
    ta: {
      STOCK_OUT: `முக்கிய எச்சரிக்கை: மருந்து பற்றாக்குறை। உடனடி நடவடிக்கை தேவை.`,
      DOCTOR_ABSENT: `பணியாளர் எச்சரிக்கை: மருத்துவர் இல்லை. வருகையை சரிபார்க்கவும்.`,
      BED_CAPACITY: `படுக்கை திறன் எச்சரிக்கை। நோயாளி மாற்றத்தை பரிசீலிக்கவும்.`,
      FOOTFALL_SURGE: `நோயாளர் எண்ணிக்கை அதிகரிப்பு கண்டறியப்பட்டது. கூடுதல் வளங்களைத் தயார் செய்யவும்.`,
    },
  };

  return messages[language]?.[alert.type] || messages.en[alert.type] || alert.message;
}

export default {
  speechToText,
  textToSpeech,
  startContinuousSpeechRecognition,
  recordAudio,
  playAudioAlert,
  getAlertVoiceMessage,
  isAvailable: isSpeechAPIEnabled,
  isWebSpeechAvailable,
};
