'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { trackEvent } from '@/lib/analytics';
import Link from 'next/link';

export default function AIGuideContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=/ai-guide');
    } else if (user) {
      trackEvent('ai_guide_started');
    }
  }, [user, authLoading, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleIdentify = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    setError(null);
    try {
      trackEvent('ai_guide_used');
      const base64Img = await convertToBase64(selectedFile);
      
      const res = await fetch('/api/ai-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Img })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze image');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-white/5 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-[#C9A84C]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-4"
          >
            AI Vision Guide
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Snap a photo of any monument, statue, or artifact to instantly identify it using EgyptX Vision AI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Upload Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A1628] border border-white/10 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-[80px] pointer-events-none" />
            
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
            />
            
            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-80 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A84C]/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-[#030712] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-[#C9A84C]" />
                </div>
                <p className="text-white font-bold text-lg mb-2">Tap to Use Camera</p>
                <p className="text-gray-500 text-sm">or upload an image</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/20">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResult(null); }}
                    className="absolute top-4 right-4 p-2 bg-black/60 text-white hover:text-red-400 rounded-full backdrop-blur-md"
                  >
                    Change
                  </button>
                </div>
                <button
                  onClick={handleIdentify}
                  disabled={analyzing}
                  className="w-full py-4 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(201,168,76,0.2)] hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 text-lg uppercase tracking-wider"
                >
                  {analyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Identify with AI</>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {/* Right: Results Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col h-full"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!result && !error && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex-grow flex flex-col items-center justify-center text-center">
                <Sparkles className="w-12 h-12 text-gray-600 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Awaiting Image</h3>
                <p className="text-gray-500">Capture a monument to see its verified history and details.</p>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A1628] border border-[#C9A84C]/30 rounded-3xl p-6 sm:p-8 flex-grow flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-[50px]" />
                
                {result.confidence_level === 'unable' ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Cannot Identify</h2>
                    <p className="text-gray-400">{result.ai_description}</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="mb-6 border-b border-white/10 pb-6">
                      <h2 className="text-3xl font-bold text-white mb-2">{result.identified_name}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                          result.confidence_level === 'high' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          result.confidence_level === 'medium' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {result.confidence_level} Confidence
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none mb-8">
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {result.ai_description}
                      </p>
                      <p className="text-xs text-orange-400/80 mt-4 font-medium flex items-start gap-1.5">
                        <span className="text-orange-400">⚠️</span> AI identification may not be 100% accurate. Always verify with official sources or on-site information.
                      </p>
                    </div>

                    {!result.db_match && (
                      <div className="mt-auto bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400">
                          <span className="font-bold text-gray-300">General AI Description</span> — Not from EgyptX verified database.
                        </p>
                      </div>
                    )}

                    {result.db_match && (
                      <div className="mt-auto">
                        <div className="bg-[#1B6B93]/10 border border-[#1B6B93]/30 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2 text-[#4CC9F0]">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Verified Location</span>
                          </div>
                          <p className="text-white font-bold">{result.db_match.name_en}</p>
                          <p className="text-gray-400 text-sm mt-1">{result.db_match.city} • {result.db_match.category}</p>
                        </div>
                        <Link href={`/destination/${result.db_match.id}`}>
                          <button className="w-full py-3 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] text-[#4CC9F0] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 uppercase text-sm tracking-wider">
                            View Full Details <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
