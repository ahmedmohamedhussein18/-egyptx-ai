const fs = require('fs');

let text = fs.readFileSync('src/components/AIGuideContent.tsx', 'utf8');

// 1. Replace scroll tracking ref and handleSendChat
const newFunctions = `
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const handleSendChat = async (overrideMsg?: string) => {
    const msgToSend = overrideMsg || chatInput.trim();
    if (!msgToSend || isChatLoading || !result || result.confidence_level === 'unable') return;
    
    if (!overrideMsg) setChatInput('');
    
    const newMessages = [...chatMessages, { role: 'user' as const, content: msgToSend }];
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
      setChatMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };
`;

const handleSendStart = text.indexOf('const chatEndRef = useRef<HTMLDivElement>(null);');
const handleSendEnd = text.indexOf('const fileInputRef = useRef<HTMLInputElement>(null);');
text = text.substring(0, handleSendStart) + newFunctions + text.substring(handleSendEnd);

// 2. Replace the Chat UI completely
const newChatUI = `                    {/* Follow-up Chat UI */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                        Ask About This Artifact
                      </h3>
                      
                      <div className="bg-[#030712]/50 border border-white/10 rounded-2xl flex flex-col h-[400px] shadow-lg relative overflow-hidden">
                        
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                          {chatMessages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
                              <p className="text-gray-400 text-sm">
                                I am your dedicated AI guide for this artifact. Ask me anything about its history, architecture, or significance!
                              </p>
                              
                              <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {["When was this built?", "Who built it?", "What is it famous for?", "How do I get here?"].map((q, i) => (
                                  <button 
                                    key={i}
                                    onClick={() => handleSendChat(q)}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#C9A84C] text-xs py-2 px-3 rounded-full transition-colors"
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {chatMessages.map((msg, i) => (
                            <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full\`}>
                              
                              {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-[#1B6B93]/30 border border-[#1B6B93] flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                  <Sparkles className="w-4 h-4 text-[#4CC9F0]" />
                                </div>
                              )}
                              
                              <div className={\`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm \${
                                msg.role === 'user' 
                                  ? 'bg-gradient-to-br from-[#C9A84C] to-[#b39542] text-black rounded-tr-none font-medium' 
                                  : 'bg-[#121a2f] border border-white/5 text-gray-200 rounded-tl-none'
                              }\`}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                          
                          {isChatLoading && (
                            <div className="flex justify-start w-full">
                              <div className="w-8 h-8 rounded-full bg-[#1B6B93]/30 border border-[#1B6B93] flex items-center justify-center mr-3 flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-[#4CC9F0]" />
                              </div>
                              <div className="bg-[#121a2f] border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#4CC9F0] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-[#4CC9F0] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-[#4CC9F0] rounded-full animate-bounce"></span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3 bg-[#0A1628] border-t border-white/10 z-10 flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-gray-500"
                          />
                          <button
                            onClick={() => handleSendChat()}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="w-12 h-12 bg-gradient-to-r from-[#C9A84C] to-[#D4B05A] hover:brightness-110 text-black rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:brightness-100 flex-shrink-0"
                          >
                            <Send className="w-5 h-5 -ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
`;

const uiStart = text.indexOf('{/* Follow-up Chat UI */}');
const uiEnd = text.indexOf('</div>\n                )}', uiStart) + 24;
text = text.substring(0, uiStart) + newChatUI + text.substring(uiEnd);

fs.writeFileSync('src/components/AIGuideContent.tsx', text, 'utf8');
console.log('Fixed component successfully.');
