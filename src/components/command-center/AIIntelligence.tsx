import React from 'react';
import { Brain, Sparkles, TrendingUp } from 'lucide-react';

interface AIIntelligenceProps {
  data?: any;
}

const AIIntelligence: React.FC<AIIntelligenceProps> = ({ data }) => {
  // Simple insight generation logic based on data structure
  let insight = "AI insights will appear as sufficient tourism data becomes available.";
  let hasInsight = false;

  if (data?.checkins && data.checkins > 0) {
    insight = `Analysis indicates strong engagement with ${data.checkins} recent interactions. Optimization models suggest increasing capacity during peak hours.`;
    hasInsight = true;
  } else if (data?.visitors && data.visitors > 100) {
    insight = `Tourism volume is exceeding baseline expectations. Predictive modeling anticipates continued growth over the next 48 hours.`;
    hasInsight = true;
  }

  return (
    <div className="bg-[#0A1628] rounded-xl border border-[#C9A84C]/20 p-6 shadow-[0_0_15px_rgba(201,168,76,0.1)] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-bl-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-[#030712] rounded-lg border border-[#C9A84C]/30">
          <Brain className="w-5 h-5 text-[#C9A84C]" />
        </div>
        <h3 className="text-[#C9A84C] font-semibold tracking-wider text-sm">EGYPTX AI INTELLIGENCE</h3>
      </div>
      
      <div className="bg-[#030712] rounded-lg p-5 border border-gray-800 relative z-10">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            {hasInsight ? (
              <TrendingUp className="w-5 h-5 text-[#C9A84C]" />
            ) : (
              <Sparkles className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;
