'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Globe, MapPin, EyeOff, Plus, X, Loader2, Image as ImageIcon, Lock } from 'lucide-react';

interface Attraction {
  id: string;
  name_en: string;
  city: string;
}

interface VrExperience {
  id: string;
  attraction_id: string;
  asset_url: string;
  source: string;
  creator: string;
}

export default function VrEgyptContent() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [vrAssets, setVrAssets] = useState<Record<string, VrExperience>>({});
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ attraction_id: '', asset_url: '', source: '', license: '', creator: '' });
  const [saving, setSaving] = useState(false);

  // Viewer State
  const [activeVr, setActiveVr] = useState<VrExperience | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchData();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile && ['national_admin', 'governorate_admin', 'site_manager'].includes(profile.role)) {
        setIsAdmin(true);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attrRes, vrRes] = await Promise.all([
        supabase.from('attractions').select('id, name_en, city').eq('verified', true).order('name_en'),
        supabase.from('vr_experiences').select('*').eq('verified', true)
      ]);

      if (attrRes.data) setAttractions(attrRes.data);
      if (vrRes.data) {
        const vrMap: Record<string, VrExperience> = {};
        vrRes.data.forEach(vr => {
          vrMap[vr.attraction_id] = vr;
        });
        setVrAssets(vrMap);
      }
    } catch (err) {
      console.error('Error fetching VR data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/vr-experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add');
      }
      setShowAddModal(false);
      setAddForm({ attraction_id: '', asset_url: '', source: '', license: '', creator: '' });
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Basic CSS Pan/Zoom wrapper state for the viewer
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#C9A84C] uppercase tracking-wide flex items-center gap-4 mb-4">
              <Globe className="w-10 h-10" />
              VR Egypt
            </h1>
            <p className="text-gray-400 font-medium tracking-wider max-w-2xl text-lg">
              Immersive 360° virtual tours of ancient wonders. Drag to look around in available panoramas.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#1B6B93] hover:bg-[#1B6B93]/80 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 border border-[#4CC9F0]/30 shadow-[0_0_15px_rgba(27,107,147,0.5)]"
            >
              <Plus className="w-5 h-5" />
              Add VR Asset (Admin)
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-10 h-10 text-[#C9A84C] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attr, idx) => {
              const vr = vrAssets[attr.id];
              return (
                <motion.div
                  key={attr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative rounded-3xl p-6 border transition-all bg-white/5 cursor-pointer group hover:bg-white/10 ${
                    vr ? 'border-[#C9A84C]/40 hover:border-[#C9A84C]' : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => {
                    if (vr) {
                      setActiveVr(vr);
                    } else {
                      showToast('VR experience not yet available for this site.');
                    }
                  }}
                >
                  {/* Subtle badge for unavailable VR */}
                  {!vr && (
                    <div className="absolute top-4 right-4 text-gray-500 bg-black/20 p-1.5 rounded-full border border-white/5">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#C9A84C] transition-colors mb-1 pr-8">{attr.name_en}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {attr.city}</p>
                  </div>

                  {vr ? (
                    <div className="flex items-center gap-2 text-[#4CC9F0] font-medium text-sm mt-8">
                      <ImageIcon className="w-4 h-4" /> 360° Panorama Available
                    </div>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* VR Viewer Modal */}
      <AnimatePresence>
        {activeVr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <button 
              onClick={() => { setActiveVr(null); setPosition({x:0, y:0}); }}
              className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="absolute top-6 left-6 z-50 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm">
              <h3 className="text-[#C9A84C] font-bold text-lg mb-1 flex items-center gap-2">
                <Globe className="w-5 h-5"/> 360° View
              </h3>
              <p className="text-xs text-gray-300">Drag to look around</p>
              {(activeVr.source || activeVr.creator) && (
                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-gray-500">
                  {activeVr.creator && <p>Credit: {activeVr.creator}</p>}
                  {activeVr.source && <p>Source: {activeVr.source}</p>}
                </div>
              )}
            </div>

            {/* Simple CSS drag-to-pan equirectangular viewer fallback */}
            <div 
              className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ touchAction: 'none' }}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
              >
                <img 
                  src={activeVr.asset_url} 
                  alt="360 Panorama" 
                  className="max-w-none max-h-[150vh] min-w-[150vw] object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Add Modal */}
      <AnimatePresence>
        {showAddModal && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0A1628] border border-[#1B6B93]/50 rounded-2xl shadow-2xl p-8"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#4CC9F0]" /> Add VR Experience
              </h2>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Attraction</label>
                  <select
                    required
                    value={addForm.attraction_id} onChange={e => setAddForm({...addForm, attraction_id: e.target.value})}
                    className="w-full bg-[#030712] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4CC9F0]"
                  >
                    <option value="">-- Select Attraction --</option>
                    {attractions.map(a => (
                      <option key={a.id} value={a.id}>{a.name_en}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Asset URL (Equirectangular Image Link)</label>
                  <input 
                    type="url" required
                    value={addForm.asset_url} onChange={e => setAddForm({...addForm, asset_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4CC9F0]"
                    placeholder="https://example.com/panorama.jpg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Source URL (Optional)</label>
                  <input 
                    type="text"
                    value={addForm.source} onChange={e => setAddForm({...addForm, source: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4CC9F0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Creator/Credit</label>
                    <input 
                      type="text"
                      value={addForm.creator} onChange={e => setAddForm({...addForm, creator: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4CC9F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">License</label>
                    <input 
                      type="text"
                      value={addForm.license} onChange={e => setAddForm({...addForm, license: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#4CC9F0]"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-gray-400 hover:text-white font-medium">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-[#1B6B93] hover:bg-[#4CC9F0] text-white font-bold rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Experience'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 bg-[#0A1628] border border-[#1B6B93]/50 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(27,107,147,0.3)] backdrop-blur-md font-medium text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Lock className="w-4 h-4 text-[#C9A84C]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
