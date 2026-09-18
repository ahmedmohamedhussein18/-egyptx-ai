'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { 
  Camera, Plus, Calendar, MapPin, Sparkles, 
  Trash2, Edit2, X, Loader2, BookOpen
} from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  note: string;
  visited_at: string;
  attraction_id: string | null;
  attractions?: { name_en: string } | null;
}

interface Attraction {
  id: string;
  name_en: string;
}

export default function MemoriesContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', note: '', visited_at: '', attraction_id: '' });
  const [saving, setSaving] = useState(false);

  // Summary State
  const [summary, setSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=/memories');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [memRes, attrRes] = await Promise.all([
        supabase.from('ai_memories').select('*, attractions(name_en)').order('visited_at', { ascending: false }),
        supabase.from('attractions').select('id, name_en').eq('verified', true).order('name_en')
      ]);

      if (memRes.data) setMemories(memRes.data);
      if (attrRes.data) setAttractions(attrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ title: '', note: '', visited_at: new Date().toISOString().split('T')[0], attraction_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (memory: Memory) => {
    setIsEditing(true);
    setCurrentId(memory.id);
    setFormData({ 
      title: memory.title || '', 
      note: memory.note || '', 
      visited_at: memory.visited_at || '', 
      attraction_id: memory.attraction_id || '' 
    });
    setIsModalOpen(true);
  };

  const saveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        title: formData.title,
        note: formData.note,
        visited_at: formData.visited_at || null,
        attraction_id: formData.attraction_id || null
      };

      if (isEditing && currentId) {
        await supabase.from('ai_memories').update(payload).eq('id', currentId);
      } else {
        await supabase.from('ai_memories').insert(payload);
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await supabase.from('ai_memories').delete().eq('id', id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const generateSummary = async () => {
    if (memories.length === 0) return;
    setGenerating(true);
    setSummary(null);
    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memories })
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary('Failed to generate summary.');
      }
    } catch (err) {
      setSummary('An error occurred while generating the summary.');
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#C9A84C] uppercase tracking-wide flex items-center gap-3 mb-2">
              <Camera className="w-8 h-8" />
              AI Memories
            </h1>
            <p className="text-gray-400 font-medium tracking-wider text-sm">
              Your personal travel journal, powered by AI.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.3)] shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add Memory
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
          >
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-gray-300 mb-2">Start your journey</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Your memories will appear here once you add your first one. Keep track of the places you visit and the stories you create.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            
            {/* AI Summary Section */}
            <div className="bg-[#1B6B93]/10 border border-[#1B6B93]/30 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1B6B93]/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#4CC9F0] flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> AI Trip Summary
                  </h2>
                  <button
                    onClick={generateSummary}
                    disabled={generating}
                    className="px-4 py-1.5 border border-[#4CC9F0]/50 hover:bg-[#4CC9F0]/10 text-[#4CC9F0] text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Now'}
                  </button>
                </div>
                {summary ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed italic border-l-2 border-[#C9A84C] pl-4 py-1">
                      {summary}
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Click generate to let AI write a personalized journal entry based on your {memories.length} memories.
                  </p>
                )}
              </div>
            </div>

            {/* Timeline / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memories.map((mem, idx) => (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#0A1628]/80 border border-[#C9A84C]/20 rounded-2xl p-6 backdrop-blur-sm group hover:border-[#C9A84C]/50 transition-colors relative"
                >
                  <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <button onClick={() => openEditModal(mem)} className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-md">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMemory(mem.id)} className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 pr-16">{mem.title}</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {mem.visited_at && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                        <Calendar className="w-3.5 h-3.5" /> {mem.visited_at}
                      </span>
                    )}
                    {mem.attractions && (
                      <span className="flex items-center gap-1.5 text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">
                        <MapPin className="w-3.5 h-3.5" /> {mem.attractions.name_en}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {mem.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0A1628] border border-[#C9A84C]/30 rounded-2xl shadow-2xl p-6"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">
                {isEditing ? 'Edit Memory' : 'Add Memory'}
              </h2>

              <form onSubmit={saveMemory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                  <input 
                    required type="text" maxLength={100}
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]"
                    placeholder="E.g., Sunrise at the Pyramids"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                  <input 
                    type="date"
                    value={formData.visited_at} onChange={e => setFormData({...formData, visited_at: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location (Optional)</label>
                  <select
                    value={formData.attraction_id} onChange={e => setFormData({...formData, attraction_id: e.target.value})}
                    className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
                  >
                    <option value="">-- None --</option>
                    {attractions.map(a => (
                      <option key={a.id} value={a.id}>{a.name_en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Journal Note</label>
                  <textarea 
                    required rows={4}
                    value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                    placeholder="Write your memory here..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
