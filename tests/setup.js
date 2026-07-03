import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech APIs
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.SpeechSynthesisUtterance = vi.fn();
  window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
  };
  
  // Mock Web Speech Recognition
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}
