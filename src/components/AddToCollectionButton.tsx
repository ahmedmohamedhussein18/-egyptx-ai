'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FolderPlus, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddToCollectionButton({ photoId }: { photoId: string }) {
  const { user } = useAuth();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchCollections = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('memory_collections').select('*').eq('user_id', user.id);
    if (data) setCollections(data);
    setLoading(false);
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchCollections();
      setSuccess(false);
    }
    setIsOpen(!isOpen);
  };

  const addToCollection = async (collectionId: string) => {
    setAddingTo(collectionId);
    try {
      await supabase.from('memory_collection_items').insert([
        { collection_id: collectionId, memory_photo_id: photoId }
      ]);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingTo(null);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleToggle}
        className="p-2 text-white hover:text-[#C9A84C] bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-2"
        title="Add to Collection"
      >
        <FolderPlus className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 w-64 bg-[#FDFBF7] dark:bg-[#0A1628] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-white/10 bg-[#F8F3E9] dark:bg-white/5">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Add to Collection</span>
              </div>
              
              <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                {loading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 text-[#C9A84C] animate-spin" /></div>
                ) : collections.length === 0 ? (
                  <div className="p-3 text-xs text-slate-700 dark:text-gray-400 text-center font-medium">No collections found. Create one first!</div>
                ) : success ? (
                  <div className="p-4 flex flex-col items-center justify-center text-green-400 gap-2">
                    <Check className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Added Successfully</span>
                  </div>
                ) : (
                  collections.map(c => (
                    <button
                      key={c.id}
                      onClick={() => addToCollection(c.id)}
                      disabled={addingTo !== null}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors flex justify-between items-center"
                    >
                      <span className="truncate pr-2">{c.name}</span>
                      {addingTo === c.id && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
