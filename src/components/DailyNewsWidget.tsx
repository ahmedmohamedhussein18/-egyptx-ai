'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Newspaper,
  X,
  Send,
  Sparkles,
  Search,
  Globe,
  Radio,
  ExternalLink,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface NewsMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const NEWS_TOPICS = [
  '🏛️ Grand Egyptian Museum Opening & Schedule',
  '🏙️ New Administrative Capital Developments',
  '🏺 Latest Saqqara & Luxor Discoveries',
  '📈 Egypt Tourism & Aviation Updates',
  '🇪🇬 Modern Infrastructure & Monorail Projects',
];

interface FormattedNewsMessageProps {
  content: string;
}

function FormattedNewsMessage({ content }: FormattedNewsMessageProps) {
  const isArabic = /[\u0600-\u06FF]/.test(content);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`text-sm leading-relaxed text-slate-100 ${
        isArabic ? 'text-right font-sans' : 'text-left'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-[#00E5FF] tracking-wide">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
          ul: ({ children }) => (
            <ul className={`my-2 space-y-1 list-disc ${isArabic ? 'pr-5' : 'pl-5'}`}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={`my-2 space-y-1 list-decimal ${isArabic ? 'pr-5' : 'pl-5'}`}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed marker:text-[#00E5FF] pl-1">{children}</li>
          ),
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-[#00E5FF] mt-2.5 mb-1 border-b border-[#00E5FF]/20 pb-0.5">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-[#00E5FF] mt-2 mb-1">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-[#4CC9F0] mt-1.5 mb-1">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={`my-2 py-1 italic text-slate-300 bg-white/5 rounded border-[#00E5FF]/60 ${
                isArabic ? 'border-r-2 pr-3' : 'border-l-2 pl-3'
              }`}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, children }: any) => {
            if (inline) {
              return (
                <code className="bg-[#030712]/60 text-[#00E5FF] px-1.5 py-0.5 rounded text-xs font-mono border border-white/10">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-[#030712]/80 text-[#00E5FF] p-2.5 rounded-lg text-xs font-mono overflow-x-auto my-2 border border-white/10">
                <code>{children}</code>
              </pre>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E5FF] underline underline-offset-2 hover:text-cyan-300 transition-colors font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function DailyNewsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<NewsMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting upon first opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            "Welcome to the **EgyptX Daily News Wire**! Powered by real-time Google Search Grounding. Ask me about today's headlines, national mega-projects, museum opening updates, economic news, or recent archaeological finds in Egypt.",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: NewsMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/news-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch live news');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'No new updates returned from live search.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('[DailyNewsWidget] Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ Live News Wire is momentarily unavailable. Please check your internet connection or try again shortly.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Positioned comfortably next to the main guide) */}
      <div className="fixed bottom-6 right-24 z-[99]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#06182B] via-[#0A2647] to-[#041220] border border-[#00E5FF]/40 rounded-full shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] transition-all duration-300"
              aria-label="Open EgyptX Daily News AI"
            >
              {/* Outer pulsing radar ring */}
              <div className="absolute inset-0 rounded-full border border-[#00E5FF] opacity-30 animate-ping" />

              <div className="relative flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-[#00E5FF] group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-[#0A2647] animate-pulse" />
              </div>

              {/* Hover Badge */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#06182B]/95 backdrop-blur-md border border-[#00E5FF]/30 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transform translate-x-3 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                <span>Daily News AI</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Sleek News Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 right-0 w-full h-[100dvh] md:bottom-24 md:right-24 md:w-[440px] md:h-[620px] z-[100] flex flex-col bg-[#05111E]/95 backdrop-blur-2xl md:rounded-2xl border-t md:border border-[#00E5FF]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,229,255,0.2)] overflow-hidden"
          >
            {/* Header: Cyber-Newsroom Aesthetic */}
            <div className="px-5 py-4 border-b border-[#00E5FF]/20 bg-gradient-to-r from-[#071E36]/80 via-[#0A2C4C]/60 to-[#05111E]/80 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  <Globe className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-sm tracking-wide">
                      EgyptX Live News Wire
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-white/50 text-[11px] flex items-center gap-1">
                    <span>Google Search Grounded</span>
                    <span>•</span>
                    <span className="text-[#00E5FF]">Real-Time Verified</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close News Widget"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Ticker Bar */}
            <div className="px-4 py-2 bg-[#020914] border-b border-white/5 flex items-center gap-2 text-[11px] text-[#00E5FF]/80">
              <TrendingUp className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span className="font-semibold text-white/90 shrink-0">Live Topics:</span>
              <span className="truncate text-white/60">
                New Capital, GEM Openings, Saqqara Discoveries, Red Sea Ports
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-[#030712] font-semibold'
                        : 'bg-[#091D33]/90 text-white/90 border border-[#00E5FF]/20 backdrop-blur-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <FormattedNewsMessage content={msg.content} />
                    ) : (
                      <div dir={/[\u0600-\u06FF]/.test(msg.content) ? 'rtl' : 'ltr'}>
                        {msg.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick News Topic Pills (Shown when only greeting exists) */}
              {messages.length === 1 && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-white/50 font-medium px-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Popular Live Queries</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {NEWS_TOPICS.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(topic)}
                        className="text-left px-3.5 py-2.5 rounded-xl bg-[#09223D]/60 hover:bg-[#00E5FF]/10 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 text-white/80 hover:text-white text-xs transition-all duration-200 flex items-center justify-between group"
                      >
                        <span className="truncate">{topic}</span>
                        <Search className="w-3 h-3 text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Grounding Loading State */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#091D33]/90 border border-[#00E5FF]/30 rounded-2xl px-4 py-3 text-xs text-[#00E5FF] flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                    <span>Searching live Google News & web grounding...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-[#020A14] border-t border-[#00E5FF]/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Search today's Egypt news or projects..."
                    className="w-full bg-[#081B30] border border-white/10 focus:border-[#00E5FF]/60 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-white/35 outline-none transition-colors"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="p-2.5 bg-gradient-to-r from-[#00E5FF] to-[#0099FF] hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 text-[#030712] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0"
                  aria-label="Send News Query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/40 px-1">
                <span>Direct Live Grounding</span>
                <span>Historical facts? Use the Gold Guide</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
