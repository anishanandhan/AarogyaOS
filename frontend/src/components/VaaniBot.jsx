import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Mic, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendMessage } from '../services/gemini';
import { startContinuousSpeechRecognition, textToSpeech } from '../services/speech';
import { translateBotResponse } from '../services/cloudTranslation';

export default function VaaniBot() {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am VaaniBot, your multilingual decision assistant. Ask me anything about Vellore stocks, doctor attendance, or ASHA field visits.'
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
      en: 'Hello! I am VaaniBot, your multilingual decision assistant. Ask me anything about Vellore stocks, doctor attendance, or ASHA field visits.',
      hi: 'नमस्ते! मैं वाणीबॉट हूँ, आपका बहुभाषी स्वास्थ्य सहायक। वेल्लोर जिला स्टॉक, डॉक्टर उपस्थिति या आशा दौरों के बारे में कुछ भी पूछें।',
      ta: 'வணக்கம்! நான் வாணிபோட், உங்கள் முடிவு உதவியாளர். வேலூர் மருந்துகள் இருப்பு, மருத்துவர்கள் வருகை அல்லது ஆஷா பணிகள் பற்றி கேளுங்கள்.'
    };
    
    setChatHistory(prev => {
      // Keep existing conversation history, but if it is only the default greeting, replace it
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
    setInputText('');
    setIsLoading(true);

    try {
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
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-navy shadow-lg shadow-emerald/20 hover:scale-110 hover:rotate-12 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Ask VaaniBot"
      >
        <MessageCircle size={24} />
        {/* Pulsing indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-info opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-info border border-navy"></span>
        </span>
      </button>

      {/* Slide-out Chat Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border-col bg-surface shadow-2xl transition-all duration-300 ease-in-out sm:max-w-[400px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border-col p-4 bg-navy/30">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald/20 text-emerald">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-text-primary">VaaniBot</h2>
              <p className="text-[10px] text-text-muted">AI District Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Local language selection toggle */}
            <div className="flex rounded bg-navy p-0.5 border border-border-col">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  language === 'en' ? 'bg-emerald text-navy' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  language === 'hi' ? 'bg-emerald text-navy' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                हि
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  language === 'ta' ? 'bg-emerald text-navy' : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                த
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1 text-text-muted hover:bg-white/5 hover:text-text-primary transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy/20">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs font-mono leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald text-navy rounded-br-none'
                    : 'bg-surface border border-border-col text-text-primary rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
              
              {/* Playback Voice controls for Assistant Responses */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleSpeak(msg.content)}
                  className="mt-1 text-[10px] text-text-muted hover:text-emerald flex items-center gap-1 transition-all cursor-pointer"
                  title="Speak Response"
                >
                  <Volume2 size={12} />
                  <span>Read aloud</span>
                </button>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border-col rounded-xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Panel */}
        <form onSubmit={handleSend} className="border-t border-border-col p-4 bg-navy/30">
          <div className="flex gap-2">
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              aria-label="Toggle voice input"
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                isListening 
                  ? 'bg-danger border-danger text-white animate-pulse' 
                  : 'bg-navy border-border-col text-text-secondary hover:text-text-primary'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic size={14} className={isListening ? 'animate-bounce' : ''} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'ta' ? 'கேள்விகளைக் கேளுங்கள்...' :
                language === 'hi' ? 'कुछ पूछें...' : 'Ask a question...'
              }
              className="flex-1 rounded-lg border border-border-col bg-navy px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald text-navy hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              disabled={isLoading || !inputText.trim()}
            >
              <Send size={14} />
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] text-text-muted font-mono">
            Powered by Gemini 1.5 Flash · Tamil, Hindi & English
          </p>
        </form>
      </div>
    </>
  );
}
