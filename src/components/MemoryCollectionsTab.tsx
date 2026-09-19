'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { FolderHeart, Plus, Trash2, Edit2, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MemoryCollectionsTab({ photos }: { photos: any[] }) {
  const { user } = useAuth();
  const supabase = createClient();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState<any | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchCollections();
  }, [user]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memory_collections')
        .select(`
          *,
          memory_collection_items (
            memory_photo_id,
            memory_photos ( photo_url, caption )
          )
        `)
        .order('created_at', { ascending: false });

      if (data) setCollections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !user) return;
    setSaving(true);
    try {
      await supabase.from('memory_collections').insert([{
        user_id: user.id,
        name: form.name,
        description: form.description
      }]);
      setIsModalOpen(false);
      setForm({ name: '', description: '' });
      fetchCollections();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await supabase.from('memory_collections').delete().eq('id', id);
      if (activeCollection?.id === id) setActiveCollection(null);
      fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePhoto = async (itemId: string) => {
    try {
      await supabase.from('memory_collection_items').delete().eq('id', itemId);
      fetchCollections();
      // Update active collection view if needed, but for simplicity let's just re-fetch and close/re-open or rely on reactive state if we had it.
      // Better to fetch and update local state:
      const { data } = await supabase.from('memory_collections').select(`*, memory_collection_items(id, memory_photo_id, memory_photos(photo_url, caption))`).eq('id', activeCollection.id).single();
      if (data) setActiveCollection(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" /></div>;

  if (activeCollection) {
    return (
      <div className="space-y-6">
        <button onClick={() => setActiveCollection(null)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Collections
        </button>
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{activeCollection.name}</h2>
            {activeCollection.description && <p className="text-gray-400">{activeCollection.description}</p>}
          </div>
        </div>

        {activeCollection.memory_collection_items?.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400">No photos in this collection yet. Add them from the Timeline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCollection.memory_collection_items?.map((item: any) => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden bg-[#0A1628] border border-white/10">
                <img src={item.memory_photos?.photo_url} alt="Memory" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button onClick={() => handleRemovePhoto(item.id)} className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.memory_photos?.caption && <p className="text-white font-medium">{item.memory_photos.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderHeart className="w-6 h-6 text-[#C9A84C]" /> My Collections
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.3)]"
        >
          <Plus className="w-4 h-4" /> Create Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
          <FolderHeart className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-gray-300 mb-2">Organize your memories.</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Create your first collection to organize your Egypt memories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col => {
            const itemCount = col.memory_collection_items?.length || 0;
            const coverPhoto = col.cover_photo_url || (itemCount > 0 ? col.memory_collection_items[0]?.memory_photos?.photo_url : null);
            
            return (
              <motion.div
                key={col.id}
                onClick={() => setActiveCollection(col)}
                whileHover={{ scale: 1.02 }}
                className="bg-[#0A1628]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm cursor-pointer group hover:border-[#C9A84C]/50 transition-colors"
              >
                <div className="h-48 w-full bg-[#030712] relative">
                  {coverPhoto ? (
                    <img src={coverPhoto} alt={col.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderHeart className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <button onClick={(e) => handleDelete(col.id, e)} className="p-2 text-white hover:text-red-400 bg-black/50 backdrop-blur-md rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-1">{col.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-1">{col.description || 'No description'}</p>
                  <span className="inline-block text-xs font-bold bg-[#C9A84C]/10 text-[#C9A84C] px-2 py-1 rounded-md border border-[#C9A84C]/20">
                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A1628] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Create Collection</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Collection Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                    placeholder="e.g. Aswan Trip 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (Optional)</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]"
                    rows={3}
                    placeholder="A few words about this collection..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-[#C9A84C] hover:bg-[#E3C973] text-[#0A1628] font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
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
