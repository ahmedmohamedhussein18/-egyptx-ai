'use client';

import React, { useState } from 'react';
import { Send, FileText, Sparkles, Loader2 } from 'lucide-react';

export default function AIAssistantPanel() {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'ما هي أهم الأماكن الحيوية في القاهرة؟' },
    { role: 'ai', content: 'بناءً على بيانات المنصة وتحليل الزيارات:\n1. منطقة الأهرامات (الجيزة)\n2. وسط البلد (تسوق ومطاعم)\n3. خان الخليلي (تراث وثقافة)\n\nتم الاعتماد على بيانات الزيارات الموثقة.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/government-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, governorate: 'cairo' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || data.message || 'عذراً، لم أتمكن من الرد.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'حدث خطأ أثناء الاتصال بالمساعد الذكي.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="w-[280px] h-full flex flex-col bg-[#0B1F2A] text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="p-4 border-b border-[#122C38] flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            المساعد الذكي السياحي
            <Sparkles className="w-4 h-4 text-[#C8A24A]" />
          </h2>
          <span className="text-[10px] text-[#8A9BA8]">EgyptX AI</span>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col items-start gap-1 ${msg.role === 'ai' ? '' : 'items-end'}`}>
            {msg.role === 'ai' ? (
              <div className="bg-[#122C38] border border-[#C8A24A]/30 rounded-lg p-3 shadow-lg flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 text-[#C8A24A]">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] font-semibold">المساعد الذكي</span>
                </div>
                <div className="text-[11px] text-[#D1DFE8] whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="bg-[#1F3745] text-[11px] text-white px-3 py-2 rounded-lg shadow-sm max-w-[90%]">
                {msg.content}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-[#C8A24A]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px]">جاري التحليل...</span>
          </div>
        )}

        {/* Suggested Questions */}
        <div className="space-y-2 mt-4 border-t border-[#122C38] pt-4">
          <h3 className="text-[10px] font-semibold text-[#8A9BA8]">أسئلة مقترحة:</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setInput('تحليل الاتجاهات السياحية')} className="text-[10px] border border-[#1F3745] text-[#A6C0D1] hover:bg-[#1F3745] px-2 py-1 rounded-full transition-colors">
              تحليل الاتجاهات
            </button>
            <button onClick={() => setInput('قارن بين المحافظات')} className="text-[10px] border border-[#1F3745] text-[#A6C0D1] hover:bg-[#1F3745] px-2 py-1 rounded-full transition-colors">
              قارن بين المحافظات
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Input */}
      <div className="p-3 bg-[#0B1F2A] border-t border-[#122C38] shrink-0 space-y-3">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="اكتب سؤالك هنا..." 
            className="w-full bg-[#122C38] border border-[#1F3745] text-[11px] text-white rounded pl-8 pr-3 py-2 outline-none focus:border-[#C8A24A] transition-colors placeholder:text-[#5C7483]"
          />
          <button onClick={sendMessage} className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 text-[#C8A24A] hover:bg-[#1F3745] rounded-md transition-colors">
            <Send className="w-3 h-3 rotate-180" />
          </button>
        </div>
        
        <button className="w-full bg-[#C8A24A] hover:bg-[#b08e3e] text-black font-semibold text-[11px] py-2 rounded flex items-center justify-center gap-2 transition-colors shadow-sm">
          <FileText className="w-3 h-3" />
          تصدير التقرير الكامل
        </button>
      </div>
    </div>
  );
}
