import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles, ShieldAlert, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello! I'm Cura AI. Please describe your symptoms or how you're feeling today, and I'll help analyze your condition.",
    time: '10:00 AM',
  },
];

const SUGGESTIONS = ['Fever & Headaches', 'Chest Tightness', 'Skin Rash', 'Persistent Cough'];

export default function CuraAI() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: messages })
      });
      
      const data = await response.json();
      
      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply || "I'm sorry, I am having trouble connecting to the medical database right now. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white h-screen sm:h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Top Header (Fixed) */}
        <div className="bg-white p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100 shadow-sm z-10 shrink-0">
          <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
            <ArrowLeft size={18} />
          </Link>
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <Sparkles size={16} className="text-teal-600" />
              <h1 className="text-sm font-bold text-slate-900">Cura AI Triage</h1>
            </div>
            <p className="text-[10px] text-teal-600 font-medium">Online • Instant Medical Analysis</p>
          </div>
          <button onClick={() => setMessages(INITIAL_MESSAGES)} className="text-slate-400 hover:text-slate-600 p-1">
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Disclaimer Banner (Fixed) */}
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-[10px] text-amber-800 shrink-0">
          <ShieldAlert size={14} className="shrink-0 text-amber-600" />
          <span>Cura AI provides informational guidance only. For medical emergencies, contact local emergency services immediately.</span>
        </div>

        {/* Chat Feed (Scrollable Area Only) */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/50 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700'
                }`}
              >
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <p className={`text-[9px] text-slate-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Fixed) */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {SUGGESTIONS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => handleSend(symptom)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-200/60"
            >
              + {symptom}
            </button>
          ))}
        </div>

        {/* Input Bar (Fixed) */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type your symptoms here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-xs outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSend()}
            className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-all shrink-0 shadow-md shadow-teal-600/20"
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}