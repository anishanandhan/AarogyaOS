import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Mic, Volume2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendMessage } from '../services/gemini';
import { startContinuousSpeechRecognition, textToSpeech } from '../services/speech';
import { translateBotResponse } from '../services/cloudTranslation';
import { getTranslation } from '../i18n/translations';
import { detectIntent, executeAction } from '../services/agentActions';

export default function VaaniBot() {
  const appContext = useApp();
  const { language, setLanguage } = appContext;
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am VaaniBot, your AI health assistant with action execution powers. I can:\n• Approve stock transfers\n• Update attendance\n• Send WhatsApp alerts\n• Open the health map\n• Dismiss alerts\n\nTry saying: "Approve the ORS transfer" or "Send WhatsApp alert"'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  // Adjust greeting when language changes
  useEffect(() => {
    const greetingText = {
      en: 'Hello! I am VaaniBot, your AI health assistant with action execution powers. I can:\n• Approve stock transfers\n• Update attendance\n• Send WhatsApp alerts\n• Open the health map\n• Dismiss alerts\n\nTry saying: "Approve the ORS transfer" or "Send WhatsApp alert"',
      hi: 'नमस्ते! मैं वाणीबॉट हूँ, आपका स्वास्थ्य सहायक। मैं ये कर सकती हूँ:\n• स्टॉक ट्रांसफर अप्रूव करना\n• उपस्थिति अपडेट करना\n• WhatsApp अलर्ट भेजना\n\nआज़माएं: "ORS ट्रांसफर अप्रूव करो"',
      ta: 'வணக்கம்! நான் வாணிபோட், உங்கள் செயல்திறன் AI உதவியாளர். நான் செய்யலாம்:\n• பங்கு பரிமாற்றங்களை ஒப்புக்கொள்\n• வருகையை புதுப்பிக்க\n• WhatsApp எச்சரிக்கைகள் அனுப்ப\n\nமுயற்சி செய்யுங்கள்: "ORS பரிமாற்றம் ஒப்புக்கொள்"'
    };

    setChatHistory(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: greetingText[language] || greetingText.en }];
      }
      return prev;
    });
  }, [language]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputText.trim() };
    setChatHistory(prev => [...prev, userMessage]);
    const userQuery = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Step 1: Detect if this is an actionable command
      const intent = detectIntent(userQuery);

      // Step 2: If action detected, execute it
      if (intent.intent !== 'CHAT_ONLY') {
        const actionResult = await executeAction(intent, appContext);
        if (actionResult) {
          setChatHistory(prev => [...prev, {
            role: 'assistant',
            content: actionResult.message,
            isAction: true
          }]);
          setIsLoading(false);
          return;
        }
      }

      // Step 3: Otherwise, normal chat flow
      const historyToSend = [...chatHistory, userMessage];
      const rawResponse = await sendMessage(historyToSend, language);

      // Dynamically translate the raw response if target is Hindi/Tamil
      const translatedResponse = await translateBotResponse(rawResponse, language);

      setChatHistory(prev => [...prev, { role: 'assistant', content: translatedResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const langCode = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      const rec = startContinuousSpeechRecognition(
        langCode,
        (result) => {
          if (result.final) {
            setInputText(prev => prev + result.final);
          }
        },
        () => {
          setIsListening(false);
        }
      );

      if (rec) {
        recognitionRef.current = rec;
        setIsListening(true);
      } else {
        alert('Voice recognition not supported by browser or permission denied.');
      }
    }
  };

  const handleSpeak = async (text) => {
    const langCode = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    try {
      const audioUrl = await textToSpeech(text, langCode);
      if (audioUrl && audioUrl !== 'web-speech-api') {
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error("[TTS Error] Playback failed:", error);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 hover:rotate-12 active:scale-95 transition-all duration-200 cursor-pointer group"
        title="Ask VaaniBot - AI Agent"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
        {/* Pulsing indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border border-white"></span>
        </span>
        {/* Action indicator */}
        <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 shadow-lg">
          <Zap size={12} />
        </span>
      </button>

      {/* Slide-out Chat Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-gray-200 bg-white shadow-2xl transition-all duration-300 ease-in-out sm:max-w-[420px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-1">
                VaaniBot
                <span className="flex h-5 w-5 items-center justify-center rounded bg-yellow-400 text-emerald-900">
                  <Zap size={10} />
                </span>
              </h2>
              <p className="text-[10px] text-emerald-100">AI Agent with Action Powers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Local language selection toggle */}
            <div className="flex rounded-lg bg-white/20 p-0.5 backdrop-blur">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded px-2 py-1 text-[9px] font-bold transition-all ${
                  language === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`rounded px-2 py-1 text-[9px] font-bold transition-all ${
                  language === 'hi' ? 'bg-white text-emerald-600 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                हि
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`rounded px-2 py-1 text-[9px] font-bold transition-all ${
                  language === 'ta' ? 'bg-white text-emerald-600 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                த
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-slate-50 to-emerald-50/20">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-sm'
                    : msg.isAction
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-400 text-gray-900 rounded-bl-sm'
                    : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                }`}
              >
                {msg.isAction && (
                  <div className="flex items-center gap-1 mb-2 text-yellow-700 font-bold">
                    <Zap size={14} />
                    <span className="text-[10px] uppercase tracking-wide">Action Executed</span>
                  </div>
                )}
                <div className="whitespace-pre-line font-mono">{msg.content}</div>
              </div>

              {/* Playback Voice controls for Assistant Responses */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleSpeak(msg.content)}
                  className="mt-1.5 text-[10px] text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-all cursor-pointer"
                  title="Speak Response"
                >
                  <Volume2 size={12} />
                  <span>{getTranslation('readAloud', language)}</span>
                </button>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Panel */}
        <form onSubmit={handleSend} className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              aria-label="Toggle voice input"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all cursor-pointer shadow-sm ${
                isListening
                  ? 'bg-red-500 border-red-600 text-white animate-pulse scale-110'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-600'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic size={18} className={isListening ? 'animate-bounce' : ''} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'ta' ? 'குரல் அல்லது உரையை பயன்படுத்துங்கள்...' :
                language === 'hi' ? 'आवाज या टेक्स्ट का इस्तेमाल करें...' : 'Use voice or type a command...'
              }
              className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-emerald-500/30"
              disabled={isLoading || !inputText.trim()}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[9px] text-gray-500 font-medium">
              🎤 Voice • 💬 Chat • ⚡ Actions
            </p>
            <p className="text-[9px] text-gray-400 font-mono">
              Powered by Gemini
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
