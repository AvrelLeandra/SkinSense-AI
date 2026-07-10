import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw, Bot, User, CornerDownLeft } from 'lucide-react';
import { ChatMessage, FacialAnalysisResult } from '../types';

interface DermatologyAssistantProps {
  skinProfile: FacialAnalysisResult | null;
}

export default function DermatologyAssistant({ skinProfile }: DermatologyAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Dr. Sam, your personal AI Dermatology Companion at SkinSense AI. I can answer questions about cosmetic ingredients, explain your facial metrics, decode product labels, or help structure your morning/night routines. How can I guide you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    const textClean = textToSend.trim();
    if (!textClean) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textClean,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textClean,
          history: messages,
          skinProfile
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);

        // Speak response if sound is enabled
        if (soundEnabled) {
          speakText(data.text);
        }
      } else {
        throw new Error('Chat failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Speak Text using Web Speech API
  const speakText = (text: string) => {
    window.speechSynthesis?.cancel(); // stop current speaking
    const cleanText = text.replace(/[*#_`]/g, ''); // remove markdown syntax
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis?.speak(utterance);
  };

  // Toggle speech synthesis read out
  const toggleSpeechRead = (text: string) => {
    speakText(text);
  };

  // Voice Speech Recognition (STT)
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    rec.onerror = (e: any) => {
      console.error("Speech Recognition error:", e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  };

  const startingQuestions = [
    "Tell me about Retinol layering",
    "What is the ABCDE rule for moles?",
    "Suggest a simple oily skin routine",
    "Can I mix Vitamin C and Niacinamide?"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 flex flex-col h-[640px]" id="chat-workspace">
      {/* Chat Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl" id="chat-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">Dr. Sam</h3>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">ONLINE SUPPORT</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Board-Certified Dermatology Advisor AI</p>
          </div>
        </div>

        {/* Audio control button */}
        <button
          onClick={() => {
            const nextVal = !soundEnabled;
            setSoundEnabled(nextVal);
            if (!nextVal) window.speechSynthesis?.cancel();
          }}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
              : 'bg-white text-slate-400 border-slate-200'
          }`}
          title={soundEnabled ? 'Speech on message enabled' : 'Click to enable speech output'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40" id="chat-messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-teal-500 text-white'
            }`}>
              {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>

            <div className="space-y-1">
              <div className={`p-4 rounded-2xl shadow-sm border ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white border-indigo-600 rounded-tr-none'
                  : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
              }`}>
                <p className="text-xs leading-relaxed font-normal whitespace-pre-wrap">{m.text}</p>
                
                {/* Audio speaker trigger for bot replies */}
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => toggleSpeechRead(m.text)}
                    className="mt-2 text-slate-400 hover:text-teal-600 transition-all flex items-center gap-1 text-[9px] font-bold uppercase cursor-pointer"
                  >
                    <Volume2 size={12} /> Read out loud
                  </button>
                )}
              </div>
              <p className={`text-[9px] font-mono text-slate-400 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {m.timestamp}
              </p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
              <RefreshCw className="animate-spin text-teal-500" size={14} />
              <span className="text-xs text-slate-500 font-medium">Dr. Sam is composing clinical advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex flex-wrap gap-2">
          {startingQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-xl text-xs font-medium border border-slate-100 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Area */}
      <div className="p-4 border-t border-slate-100 bg-white rounded-b-3xl" id="chat-input-pane">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-2xl p-1.5 focus-within:border-teal-400 focus-within:bg-white transition-all"
        >
          {/* STT dictation trigger */}
          <button
            type="button"
            onClick={startSpeechRecognition}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Dictate with voice input"
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening closely..." : "Ask Dr. Sam about ingredients, scores, or routines..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isListening}
            className="flex-1 bg-transparent px-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-2.5 bg-teal-500 text-white rounded-xl shadow-md shadow-teal-500/20 hover:bg-teal-600 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none transition-all cursor-pointer"
          >
            <Send size={14} />
          </button>
        </form>

        {/* Support disclaimer notice */}
        <div className="flex gap-2 items-center justify-center text-[10px] text-slate-400 mt-2">
          <AlertCircle size={12} className="text-slate-300" />
          <span>Advice is strictly educational. Seek medical consensus for diagnoses.</span>
        </div>
      </div>
    </div>
  );
}
