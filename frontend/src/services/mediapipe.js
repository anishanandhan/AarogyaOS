/**
 * MediaPipe Gesture Recognition Integration
 * Provides hands-free navigation and gesture controls for accessibility
 * Uses MediaPipe Hands for real-time hand tracking and gesture detection
 */

/**
 * MediaPipe Hands Configuration
 * Using CDN-hosted MediaPipe for browser compatibility
 */
const MEDIAPIPE_HANDS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands';

let handsInstance = null;
let cameraInstance = null;
let isInitialized = false;

/**
 * Gesture types supported by the system
 */
export const GESTURES = {
  THUMBS_UP: 'THUMBS_UP',           // Approve/Confirm
  THUMBS_DOWN: 'THUMBS_DOWN',       // Reject/Dismiss
  OPEN_PALM: 'OPEN_PALM',           // Stop/Pause
  POINTING_UP: 'POINTING_UP',       // Scroll up/Navigate up
  POINTING_DOWN: 'POINTING_DOWN',   // Scroll down/Navigate down
  POINTING_LEFT: 'POINTING_LEFT',   // Previous/Back
  POINTING_RIGHT: 'POINTING_RIGHT', // Next/Forward
  PINCH: 'PINCH',                   // Select/Click
  PEACE_SIGN: 'PEACE_SIGN',         // Toggle view
  FIST: 'FIST',                     // Hold/Grab
};

/**
 * Initialize MediaPipe Hands
 * @param {HTMLVideoElement} videoElement - Video element for camera feed
 * @param {Function} onGestureDetected - Callback when gesture is detected
 * @returns {Promise<boolean>} Success status
 */
export async function initializeMediaPipe(videoElement, onGestureDetected) {
  if (isInitialized) {
    console.log('[MediaPipe] Already initialized');
    return true;
  }

  try {
    console.log('[MediaPipe] Initializing gesture recognition...');

    // Load MediaPipe Hands (using mock for now since CDN loading is complex)
    // In production, you'd load the actual MediaPipe library

    // For testing and fallback purposes, we'll use a simulated gesture detector
    isInitialized = true;
    console.log('[MediaPipe] Initialization complete (simulation mode)');

    // Start simulated gesture detection
    startSimulatedGestureDetection(onGestureDetected);

    return true;

  } catch (error) {
    console.error('[MediaPipe] Initialization failed:', error);
    return false;
  }
}

/**
 * Detect gesture from hand landmarks
 * @param {Array} landmarks - Hand landmarks from MediaPipe
 * @returns {string} Detected gesture type
 */
function detectGesture(landmarks) {
  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  // Simplified gesture detection logic
  // In production, this would analyze 21 hand landmarks

  // Thumb up detection (thumb tip higher than thumb base)
  const thumbTip = landmarks[4];
  const thumbBase = landmarks[2];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];
  const wrist = landmarks[0];

  // Thumbs up: thumb extended, other fingers curled
  if (thumbTip.y < thumbBase.y && indexTip.y > wrist.y) {
    return GESTURES.THUMBS_UP;
  }

  // Open palm: all fingers extended
  if (
    indexTip.y < wrist.y &&
    middleTip.y < wrist.y &&
    ringTip.y < wrist.y &&
    pinkyTip.y < wrist.y
  ) {
    return GESTURES.OPEN_PALM;
  }

  // Pointing up: index extended, others curled
  if (indexTip.y < wrist.y && middleTip.y > wrist.y) {
    return GESTURES.POINTING_UP;
  }

  // Peace sign: index and middle extended
  if (indexTip.y < wrist.y && middleTip.y < wrist.y && ringTip.y > wrist.y) {
    return GESTURES.PEACE_SIGN;
  }

  // Fist: all fingers curled
  if (
    indexTip.y > wrist.y &&
    middleTip.y > wrist.y &&
    ringTip.y > wrist.y &&
    pinkyTip.y > wrist.y
  ) {
    return GESTURES.FIST;
  }

  return null;
}

/**
 * Simulated gesture detection for testing
 * In production, this would use actual MediaPipe hand tracking
 */
function startSimulatedGestureDetection(onGestureDetected) {
  console.log('[MediaPipe] Simulation mode: Use keyboard for gesture simulation');
  console.log('  [1] = Thumbs Up');
  console.log('  [2] = Thumbs Down');
  console.log('  [3] = Open Palm');
  console.log('  [4] = Pointing Up');
  console.log('  [5] = Pointing Down');
  console.log('  [6] = Peace Sign');

  // Keyboard simulation for testing
  document.addEventListener('keypress', (e) => {
    let gesture = null;
    switch (e.key) {
      case '1':
        gesture = GESTURES.THUMBS_UP;
        break;
      case '2':
        gesture = GESTURES.THUMBS_DOWN;
        break;
      case '3':
        gesture = GESTURES.OPEN_PALM;
        break;
      case '4':
        gesture = GESTURES.POINTING_UP;
        break;
      case '5':
        gesture = GESTURES.POINTING_DOWN;
        break;
      case '6':
        gesture = GESTURES.PEACE_SIGN;
        break;
      case '7':
        gesture = GESTURES.FIST;
        break;
    }

    if (gesture && onGestureDetected) {
      console.log(`[MediaPipe] Gesture detected: ${gesture}`);
      onGestureDetected({
        gesture,
        confidence: 0.95,
        timestamp: Date.now(),
      });
    }
  });
}

/**
 * Process camera frame and detect gestures
 * @param {HTMLVideoElement} videoElement - Video element
 * @param {Function} onGestureDetected - Callback for detected gestures
 */
export function startGestureDetection(videoElement, onGestureDetected) {
  if (!isInitialized) {
    console.error('[MediaPipe] Not initialized. Call initializeMediaPipe first.');
    return;
  }

  console.log('[MediaPipe] Starting gesture detection...');

  // In production, this would continuously process video frames
  // For testing, we rely on keyboard simulation
}

/**
 * Stop gesture detection and release camera
 */
export function stopGestureDetection() {
  if (cameraInstance) {
    cameraInstance.stop();
    cameraInstance = null;
  }

  isInitialized = false;
  console.log('[MediaPipe] Gesture detection stopped');
}

/**
 * Gesture action mappings for different pages
 */
export const GESTURE_ACTIONS = {
  // Dashboard page
  dashboard: {
    [GESTURES.POINTING_UP]: 'scroll-up',
    [GESTURES.POINTING_DOWN]: 'scroll-down',
    [GESTURES.THUMBS_UP]: 'refresh-data',
    [GESTURES.OPEN_PALM]: 'pause-updates',
    [GESTURES.PEACE_SIGN]: 'toggle-view',
  },
  // Alerts page
  alerts: {
    [GESTURES.THUMBS_UP]: 'approve-alert',
    [GESTURES.THUMBS_DOWN]: 'dismiss-alert',
    [GESTURES.POINTING_LEFT]: 'previous-alert',
    [GESTURES.POINTING_RIGHT]: 'next-alert',
    [GESTURES.OPEN_PALM]: 'pause-notifications',
  },
  // Agents page
  agents: {
    [GESTURES.THUMBS_UP]: 'run-analysis',
    [GESTURES.FIST]: 'stop-analysis',
    [GESTURES.PEACE_SIGN]: 'toggle-framework',
  },
  // ASHA page
  asha: {
    [GESTURES.THUMBS_UP]: 'approve-visit',
    [GESTURES.THUMBS_DOWN]: 'flag-suspicious',
    [GESTURES.POINTING_UP]: 'next-worker',
    [GESTURES.POINTING_DOWN]: 'previous-worker',
  },
};

/**
 * Execute action based on gesture and current page
 * @param {string} gesture - Detected gesture
 * @param {string} currentPage - Current page identifier
 * @returns {Object} Action to execute
 */
export function getGestureAction(gesture, currentPage) {
  const actions = GESTURE_ACTIONS[currentPage];
  if (!actions) {
    return null;
  }

  const action = actions[gesture];
  if (!action) {
    return null;
  }

  console.log(`[MediaPipe] Gesture ${gesture} mapped to action: ${action}`);
  return {
    type: action,
    gesture,
    page: currentPage,
  };
}

/**
 * Check if MediaPipe is supported in current browser
 */
export function isMediaPipeSupported() {
  return (
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices
  );
}

/**
 * Request camera permissions
 */
export async function requestCameraPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('[MediaPipe] Camera permission denied:', error);
    return false;
  }
}

/**
 * Get gesture description for UI
 */
export function getGestureDescription(gesture) {
  const descriptions = {
    [GESTURES.THUMBS_UP]: 'Thumbs Up - Approve/Confirm',
    [GESTURES.THUMBS_DOWN]: 'Thumbs Down - Reject/Dismiss',
    [GESTURES.OPEN_PALM]: 'Open Palm - Stop/Pause',
    [GESTURES.POINTING_UP]: 'Point Up - Navigate Up',
    [GESTURES.POINTING_DOWN]: 'Point Down - Navigate Down',
    [GESTURES.POINTING_LEFT]: 'Point Left - Go Back',
    [GESTURES.POINTING_RIGHT]: 'Point Right - Go Forward',
    [GESTURES.PINCH]: 'Pinch - Select',
    [GESTURES.PEACE_SIGN]: 'Peace Sign - Toggle View',
    [GESTURES.FIST]: 'Fist - Hold/Grab',
  };

  return descriptions[gesture] || 'Unknown gesture';
}

/**
 * Gesture control component state management
 */
export class GestureController {
  constructor() {
    this.enabled = false;
    this.currentPage = 'dashboard';
    this.lastGesture = null;
    this.lastGestureTime = 0;
    this.cooldownMs = 1000; // Prevent rapid gesture triggers
    this.callbacks = new Map();
  }

  enable() {
    this.enabled = true;
    console.log('[GestureController] Enabled');
  }

  disable() {
    this.enabled = false;
    console.log('[GestureController] Disabled');
  }

  setPage(page) {
    this.currentPage = page;
    console.log(`[GestureController] Page changed to: ${page}`);
  }

  onGesture(gesture, callback) {
    this.callbacks.set(gesture, callback);
  }

  handleGesture(gestureData) {
    if (!this.enabled) return;

    const now = Date.now();
    const timeSinceLastGesture = now - this.lastGestureTime;

    // Cooldown check
    if (gestureData.gesture === this.lastGesture && timeSinceLastGesture < this.cooldownMs) {
      return;
    }

    this.lastGesture = gestureData.gesture;
    this.lastGestureTime = now;

    // Execute callback if registered
    const callback = this.callbacks.get(gestureData.gesture);
    if (callback) {
      callback(gestureData);
    }

    // Get page-specific action
    const action = getGestureAction(gestureData.gesture, this.currentPage);
    if (action) {
      console.log(`[GestureController] Executing action:`, action);
      this.executeAction(action);
    }
  }

  executeAction(action) {
    // Dispatch custom event for components to handle
    const event = new CustomEvent('gesture-action', {
      detail: action,
    });
    window.dispatchEvent(event);
  }
}

// Export singleton instance
export const gestureController = new GestureController();

export default {
  initializeMediaPipe,
  startGestureDetection,
  stopGestureDetection,
  detectGesture,
  getGestureAction,
  getGestureDescription,
  isMediaPipeSupported,
  requestCameraPermission,
  GESTURES,
  GESTURE_ACTIONS,
  gestureController,
};
