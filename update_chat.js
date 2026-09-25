const fs = require('fs');
let text = fs.readFileSync('src/components/AIGuideContent.tsx', 'utf8');

// 1. Add Send icon to lucide-react import
text = text.replace(
  "import { Camera, Upload, Loader2, Sparkles, AlertCircle, MapPin, ExternalLink, ArrowRight } from 'lucide-react';",
  "import { Camera, Upload, Loader2, Sparkles, AlertCircle, MapPin, ExternalLink, ArrowRight, Send } from 'lucide-react';"
);

// 2. Add chat states
const stateInjection = `  const [error, setError] = useState<string | null>(null);
  
  // Chat States
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatLoading || !result || result.confidence_level === 'unable') return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    
    const newMessages = [...chatMessages, { role: 'user' as const, content: userMsg }];
    setChatMessages(newMessages);
    setIsChatLoading(true);
    
    try {
      const res = await fetch('/api/ai-guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: result
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages([...newMessages, { role: 'assistant', content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };
`;

text = text.replace("  const [error, setError] = useState<string | null>(null);", stateInjection);

// 3. Clear chat messages on new file
text = text.replace(
  "setResult(null);\n      setError(null);",
  "setResult(null);\n      setError(null);\n      setChatMessages([]);"
);

// 4. Inject the Chat UI right after the result details
const chatUIInjection = `
                    {/* Follow-up Chat UI */}
                    <div className="mt-8 border-t border-[#C9A84C]/20 pt-6">
                      <h3 className="text-lg font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Ask About This Artifact
                      </h3>
                      
                      <div className="bg-black/40 border border-white/10 rounded-2xl flex flex-col h-[300px]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" dir="rtl">
                          {chatMessages.length === 0 && (
                            <div className="text-center text-gray-500 text-sm mt-10">
                              اسأل المرشد الذكي عن أي تفاصيل تاريخية أو معمارية تخص هذا المعلم...
                            </div>
                          )}
                          {chatMessages.map((msg, i) => (
                            <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-start' : 'justify-end'}\`}>
                              <div className={\`max-w-[85%] rounded-2xl px-4 py-3 text-sm \${
                                msg.role === 'user' 
                                  ? 'bg-[#1B6B93] text-white rounded-tr-none' 
                                  : 'bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-gray-200 rounded-tl-none'
                              }\`}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex justify-end">
                              <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl rounded-tl-none px-4 py-3">
                                <Loader2 className="w-4 h-4 text-[#C9A84C] animate-spin" />
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>
                        
                        <div className="p-3 border-t border-white/10 bg-white/5 rounded-b-2xl flex gap-2">
                          <input
                            type="text"
                            dir="rtl"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder="اكتب سؤالك هنا..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                          />
                          <button
                            onClick={handleSendChat}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="w-10 h-10 bg-[#C9A84C] hover:bg-[#D4B05A] text-black rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <Send className="w-4 h-4 -ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

text = text.replace("                  </div>\n                )}", chatUIInjection);

fs.writeFileSync('src/components/AIGuideContent.tsx', text, 'utf8');
console.log('Done modifying AIGuideContent.tsx');
