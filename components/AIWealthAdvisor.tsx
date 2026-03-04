
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2, Minimize2, Maximize2, MessageSquare } from 'lucide-react';
import { User, Transaction } from '../types';

interface AIWealthAdvisorProps {
  currentUser: User;
  transactions: Transaction[];
}

const AIWealthAdvisor: React.FC<AIWealthAdvisorProps> = ({ currentUser, transactions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const context = `
        User Name: ${currentUser.name}
        Current Balance: $${currentUser.balance.toLocaleString()}
        Recent Transactions: ${transactions.slice(0, 5).map(t => `${t.date}: ${t.description} ($${t.amount})`).join(', ')}
        
        System Instruction: You are the High SL Global Bank AI Wealth Advisor. 
        You are sophisticated, professional, and helpful. 
        Help the user with financial planning, investment insights (referencing the Tesla partnership where relevant), 
        and general bank support. Keep responses concise and high-class.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: context }] },
            ...messages.map(m => ({
                role: m.role === 'ai' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
        ],
      });

      const aiResponse = response.text || "I apologize, I'm having trouble processing that request at the moment.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Our systems are experiencing a high-priority update. Please try again shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 z-50 group"
      >
        <div className="absolute inset-0 bg-amber-500 rounded-full blur group-hover:blur-md transition-all opacity-40"></div>
        <div className="relative bg-slate-900 text-white p-4 rounded-full shadow-2xl border border-amber-500/30 flex items-center gap-3 hover:scale-105 transition-transform">
          <Sparkles className="text-amber-500 animate-pulse-slow" size={24} />
          <span className="hidden md:inline font-bold text-sm tracking-wide pr-2">Wealth Advisor</span>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-24 md:bottom-8 right-6 z-50 w-[90vw] md:w-96 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'} flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden`}>
      {/* Header */}
      <div className="bg-slate-950 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-500 rounded-lg">
            <Bot size={18} className="text-slate-900" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Wealth Advisor</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50 dark:bg-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <Sparkles size={24} className="text-amber-500" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Elite AI Financial Support</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 px-8">
                  Ask me about your spending, investment opportunities with Tesla, or bank services.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center px-4">
                  {['Analyze my spending', 'TSLA Stock update', 'Transfer limits'].map(tip => (
                    <button 
                      key={tip} 
                      onClick={() => setInput(tip)}
                      className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full hover:border-amber-500 transition-colors"
                    >
                      {tip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === 'ai' 
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700' 
                    : 'bg-amber-500 text-slate-900 font-medium'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-700">
                  <Loader2 className="animate-spin text-amber-500" size={18} />
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your advisor..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/50 text-sm transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIWealthAdvisor;
