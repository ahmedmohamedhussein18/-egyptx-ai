'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertCircle, Filter, Store } from 'lucide-react';

const CATEGORIES = ['All', 'Pottery', 'Papyrus', 'Textiles', 'Jewelry', 'Wood Crafts', 'Traditional Crafts'];

const DEMO_PRODUCTS = [
  { id: 1, title: 'Hand-Painted Fayoum Pottery Bowl', category: 'Pottery', price: '450 EGP', image: '/crafts/pottery.jpg' },
  { id: 2, title: 'Authentic Painted Papyrus Scroll', category: 'Papyrus', price: '350 EGP', image: '/crafts/papyrus.jpg' },
  { id: 3, title: 'Akhmim Handwoven Textile', category: 'Textiles', price: '800 EGP', image: '/crafts/textiles.jpg' },
  { id: 4, title: 'Silver Lotus Flower Pendant', category: 'Jewelry', price: '1,200 EGP', image: '/crafts/jewelry.jpg' },
  { id: 5, title: 'Mother of Pearl Inlaid Box', category: 'Wood Crafts', price: '650 EGP', image: '/crafts/wood-crafts.jpg' },
  { id: 6, title: 'Traditional Alabaster Vase', category: 'Traditional Crafts', price: '550 EGP', image: '/crafts/traditional-crafts.jpg' },
  { id: 7, title: 'Nubian Handwoven Basket', category: 'Traditional Crafts', price: '280 EGP', image: '/crafts/baskets.jpg' },
  { id: 8, title: 'Gold Cartouche Pendant', category: 'Jewelry', price: '2,500 EGP', image: '/crafts/cartouche.jpg' },
];

export default function CraftsContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();

  const filteredProducts = activeCategory === 'All' 
    ? DEMO_PRODUCTS 
    : DEMO_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Demo Banner */}
      <div className="max-w-7xl mx-auto mb-8 bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-yellow-500">
        <div className="flex items-start sm:items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-1 sm:mt-0" />
          <p className="font-bold text-sm sm:text-base">
            🏺 DEMO MARKETPLACE — Illustrative Demo Only. Real verified artisan vendors coming soon.
          </p>
        </div>
        <p className="font-bold text-sm sm:text-base whitespace-nowrap" dir="rtl">
          الأسعار تقريبية وتعكس أسعار السوق المصري
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#0A1628] border border-[#C9A84C]/20 rounded-2xl p-6 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#C9A84C]" /> Categories
            </h2>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeCategory === category 
                    ? 'bg-[#C9A84C] text-[#0A1628]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-[#C9A84C]" /> Are you an artisan?
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Join the national marketplace to sell your authentic crafts directly to tourists worldwide.
              </p>
              <button 
                onClick={() => router.push('/crafts/register')}
                className="w-full py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A1628] font-bold rounded-xl transition-colors text-sm uppercase"
              >
                Register as Artisan
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider mb-4">
              Egyptian Crafts
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Support local artisans and discover authentic, handcrafted heritage items from across Egypt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A1628] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 transition-colors group"
              >
                <div className="w-full h-[200px] bg-[#030712] border-b border-white/10 relative overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-5 flex flex-col h-[200px]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest leading-tight pr-2">
                      {product.category}
                    </span>
                    <span className="text-white font-bold bg-[#1B6B93]/30 px-2 py-1 rounded text-sm border border-[#1B6B93]/50 shrink-0">
                      {product.price}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-auto">
                    {product.title}
                  </h3>
                  
                  {/* Strict label enforcement */}
                  <div className="mt-4 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-center">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Illustrative Demo Product
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-[#0A1628] rounded-2xl border border-white/10">
              <Store className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No demo products in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
