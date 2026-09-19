'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import dynamic from 'next/dynamic';
import { FolderHeart } from 'lucide-react';
import MemoryCollectionsTab from './MemoryCollectionsTab';
import AddToCollectionButton from './AddToCollectionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { 
  Camera, Plus, Calendar, MapPin, Sparkles, 
  Trash2, Edit2, X, Loader2, BookOpen, Image as ImageIcon, Upload
} from 'lucide-react';

interface Journal {
  id: string;
  title: string;
  note: string;
  visited_at: string;
  attraction_id: string | null;
  attractions?: { name_en: string } | null;
  type: 'journal';
}

interface PhotoMemory {
  id: string;
  photo_url: string;
  caption: string;
  memory_date: string;
  attraction_id: string | null;
  attractions?: { name_en: string } | null;
  type: 'photo';
}

interface Attraction {
  id: string;
  name_en: string;
}

export default function MemoriesContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [journals, setJournals] = useState<Journal[]>([]);
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [journalForm, setJournalForm] = useState({ title: '', note: '', visited_at: '', attraction_id: '' });
  const [photoForm, setPhotoForm] = useState({ caption: '', memory_date: '', attraction_id: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [saving, setSaving] = useState(false);

  // Summary State
  const [summary, setSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [activeTab, setActiveTab] = useState<'timeline' | 'collections'>('timeline');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const [memRes, photoRes, attrRes] = await Promise.all([
        supabase.from('ai_memories').select('*, attractions(name_en)').order('visited_at', { ascending: false }),
        supabase.from('memory_photos').select('*, attractions(name_en)').order('memory_date', { ascending: false }),
        supabase.from('attractions').select('id, name_en').eq('verified', true).order('name_en')
      ]);

      if (memRes.data) setJournals(memRes.data.map((d: any) => ({ ...d, type: 'journal' })));
      if (photoRes.data) setPhotos(photoRes.data.map((d: any) => ({ ...d, type: 'photo' })));
      if (attrRes.data) setAttractions(attrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openJournalModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setJournalForm({ title: '', note: '', visited_at: new Date().toISOString().split('T')[0], attraction_id: '' });
    setIsJournalModalOpen(true);
  };

  const openPhotoModal = () => {
    setPhotoForm({ caption: '', memory_date: new Date().toISOString().split('T')[0], attraction_id: '' });
    setSelectedFile(null);
    setIsPhotoModalOpen(true);
  };

  const saveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        title: journalForm.title,
        note: journalForm.note,
        visited_at: journalForm.visited_at || null,
        attraction_id: journalForm.attraction_id || null
      };

      if (isEditing && currentId) {
        await supabase.from('ai_memories').update(payload).eq('id', currentId);
      } else {
        await supabase.from('ai_memories').insert(payload);
      }
      
      setIsJournalModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const savePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;
    setSaving(true);
    try {
      // 1. Upload to Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('memory-photos')
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memory-photos')
        .getPublicUrl(filePath);

      // 2. Insert into memory_photos
      const payload = {
        user_id: user.id,
        photo_url: publicUrl,
        caption: photoForm.caption,
        memory_date: photoForm.memory_date || null,
        attraction_id: photoForm.attraction_id || null
      };

      await supabase.from('memory_photos').insert(payload);
      
      setIsPhotoModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Photo save failed:', err);
      alert('Failed to upload photo. Ensure you created the memory-photos bucket and enabled RLS policies.');
    } finally {
      setSaving(false);
    }
  };

  const deleteJournal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal?')) return;
    try {
      await supabase.from('ai_memories').delete().eq('id', id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo memory?')) return;
    try {
      await supabase.from('memory_photos').delete().eq('id', id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const generateSummary = async () => {
    if (journals.length === 0) return;
    setGenerating(true);
    setSummary(null);
    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memories: journals })
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

  // Combine and sort both lists by date
  const combinedTimeline = [...journals, ...photos].sort((a: any, b: any) => {
    const dateA = new Date(a.visited_at || a.memory_date).getTime();
    const dateB = new Date(b.visited_at || b.memory_date).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#C9A84C] uppercase tracking-wide flex items-center gap-3 mb-2">
              <Camera className="w-8 h-8" />
              Memories & Timeline
            </h1>
            <p className="text-gray-400 font-medium tracking-wider text-sm">
              Your personal travel journal and photo memories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => router.push('/expenses')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Add Expense
            </button>
            <button
              onClick={() => router.push('/travel-card')}
              className="px-5 py-2.5 bg-[#1B6B93]/30 hover:bg-[#1B6B93]/50 border border-[#4CC9F0]/30 text-[#4CC9F0] font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Create Travel Card
            </button>
            <button
              onClick={openPhotoModal}
              className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.3)]"
            >
              <ImageIcon className="w-4 h-4" />
              Upload Photo
            </button>
            <button
              onClick={openJournalModal}
              className="px-5 py-2.5 bg-[#0A1628] border border-[#C9A84C]/50 hover:bg-[#0A1628]/80 text-[#C9A84C] font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Journal
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 font-bold uppercase tracking-wider text-sm transition-colors px-4 py-2 rounded-lg ${activeTab === 'timeline' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Calendar className="w-4 h-4" /> Timeline
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-2 font-bold uppercase tracking-wider text-sm transition-colors px-4 py-2 rounded-lg ${activeTab === 'collections' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FolderHeart className="w-4 h-4" /> My Collections
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
          </div>
        ) : activeTab === 'collections' ? (
          <MemoryCollectionsTab photos={photos} />
        ) : combinedTimeline.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
          >
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-gray-300 mb-2">Your Egypt story starts here.</h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Add your first memory or upload a photo to start tracking the places you visit.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            
            {/* AI Summary Section (only if journals exist) */}
            {journals.length > 0 && (
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
                      Click generate to let AI write a personalized journal entry based on your {journals.length} written memories.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="relative border-l-2 border-[#C9A84C]/30 ml-4 md:ml-6 space-y-10 pl-6 md:pl-10">
              {combinedTimeline.map((item: any, idx) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[35px] md:-left-[51px] top-4 w-5 h-5 rounded-full bg-[#030712] border-4 border-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.5)] z-10" />

                  {item.type === 'photo' ? (
                    // Photo Card
                    <div className="bg-[#0A1628]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-[#C9A84C]/50 transition-colors">
                      <div className="relative h-64 md:h-80 w-full">
                        <img src={item.photo_url} alt="Memory" className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <AddToCollectionButton photoId={item.id} />
                          <button onClick={() => deletePhoto(item.id)} className="p-2 text-white hover:text-red-400 bg-black/50 backdrop-blur-md rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-5">
                        {item.caption && <p className="text-lg font-bold text-white mb-3">{item.caption}</p>}
                        <div className="flex flex-wrap gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(item.memory_date).toLocaleDateString()}
                          </span>
                          {item.attractions && (
                            <span className="flex items-center gap-1.5 text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">
                              <MapPin className="w-3.5 h-3.5" /> {item.attractions.name_en}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Journal Card
                    <div className="bg-[#0A1628]/80 border border-[#C9A84C]/20 rounded-2xl p-6 backdrop-blur-sm group hover:border-[#C9A84C]/50 transition-colors relative">
                      <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                        <button onClick={() => deleteJournal(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 pr-16">{item.title}</h3>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {item.visited_at && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(item.visited_at).toLocaleDateString()}
                          </span>
                        )}
                        {item.attractions && (
                          <span className="flex items-center gap-1.5 text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">
                            <MapPin className="w-3.5 h-3.5" /> {item.attractions.name_en}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-full border border-purple-400/20">
                          <BookOpen className="w-3.5 h-3.5" /> Journal Entry
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.note}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Journal Modal */}
      <AnimatePresence>
        {isJournalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsJournalModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0A1628] border border-[#C9A84C]/30 rounded-2xl shadow-2xl p-6"
            >
              <button 
                onClick={() => setIsJournalModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">Add Journal Entry</h2>

              <form onSubmit={saveJournal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                  <input 
                    required type="text" maxLength={100}
                    value={journalForm.title} onChange={e => setJournalForm({...journalForm, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]"
                    placeholder="E.g., Sunrise at the Pyramids"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                  <input 
                    type="date"
                    value={journalForm.visited_at} onChange={e => setJournalForm({...journalForm, visited_at: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location (Optional)</label>
                  <select
                    value={journalForm.attraction_id} onChange={e => setJournalForm({...journalForm, attraction_id: e.target.value})}
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
                    value={journalForm.note} onChange={e => setJournalForm({...journalForm, note: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                    placeholder="Write your memory here..."
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsJournalModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-[#0A1628] border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Journal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsPhotoModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0A1628] border border-[#C9A84C]/30 rounded-2xl shadow-2xl p-6"
            >
              <button 
                onClick={() => setIsPhotoModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">Upload Photo</h2>

              <form onSubmit={savePhoto} className="space-y-4">
                
                {/* File Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}
                >
                  {selectedFile ? (
                    <div className="text-center text-[#C9A84C]">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium text-sm truncate px-4">{selectedFile.name}</p>
                      <p className="text-xs opacity-70 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium text-sm">Click to select a photo</p>
                      <p className="text-xs opacity-70 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                />

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Caption (Optional)</label>
                  <input 
                    type="text" maxLength={150}
                    value={photoForm.caption} onChange={e => setPhotoForm({...photoForm, caption: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]"
                    placeholder="E.g., Beautiful view of the Nile"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                    <input 
                      required type="date"
                      value={photoForm.memory_date} onChange={e => setPhotoForm({...photoForm, memory_date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location (Optional)</label>
                    <select
                      value={photoForm.attraction_id} onChange={e => setPhotoForm({...photoForm, attraction_id: e.target.value})}
                      className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#C9A84C] appearance-none"
                    >
                      <option value="">-- None --</option>
                      {attractions.map(a => (
                        <option key={a.id} value={a.id}>{a.name_en}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsPhotoModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={saving || !selectedFile} className="px-6 py-2 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Photo'}
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
