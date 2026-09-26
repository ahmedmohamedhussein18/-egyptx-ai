'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Newspaper, Landmark, Map, BookOpen, Compass, Tent } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  source: string;
  sourceUrl: string;
  image: string | null;
}

const CATEGORIES = ['All', 'Archaeology', 'Tourism', 'Heritage', 'Museums', 'History'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Archaeology': return 'bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30';
    case 'Tourism': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Heritage': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Museums': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'History': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Archaeology': return <Compass className="w-4 h-4" />;
    case 'Tourism': return <Map className="w-4 h-4" />;
    case 'Heritage': return <Landmark className="w-4 h-4" />;
    case 'Museums': return <Tent className="w-4 h-4" />;
    case 'History': return <BookOpen className="w-4 h-4" />;
    default: return <Newspaper className="w-4 h-4" />;
  }
};

export default function NewsContent() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/news?category=${activeCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory]);

  return (
    <main className="relative min-h-screen bg-[#030712] font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-white/5 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6"
          >
            <Newspaper className="w-8 h-8 text-[#C9A84C]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-4"
          >
            Egypt Tourism & Heritage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Verified news and discoveries about Egypt's ancient civilization and modern tourism
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all border ${
                activeCategory === category 
                  ? 'bg-[#C9A84C] text-[#0A1628] border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.4)]' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-[#C9A84C]/50 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {articles.map((article, idx) => (
              <motion.div
                layout
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-[#0A1628] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#C9A84C]/50 transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] group"
              >
                {/* Article Image */}
                {article.image && !imageErrors[article.id] ? (
                  <div className="w-full h-[200px] overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => setImageErrors(prev => ({ ...prev, [article.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent opacity-60"></div>
                  </div>
                ) : (
                  <div className="w-full h-[200px] bg-gradient-to-br from-[#1B6B93]/30 to-[#0A1628] flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10 opacity-60">
                      {getCategoryIcon(article.category)}
                      <span className="font-bold tracking-widest text-[#C9A84C] uppercase text-sm">{article.category}</span>
                    </div>
                  </div>
                )}
                
                {/* Category Badge & Date Header */}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getCategoryColor(article.category)}`}>
                    {getCategoryIcon(article.category)}
                    {article.category}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white leading-snug mb-4 group-hover:text-[#C9A84C] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                    {article.description}
                  </p>
                  
                  <div className="pt-4 border-t border-white/10 mt-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>{t('news.source')}</span>
                      <span className="text-gray-300 truncate max-w-[150px]">{article.source}</span>
                    </div>
                    
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full py-3 bg-white/5 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/50 text-[#C9A84C] rounded-xl text-sm font-bold uppercase tracking-wider transition-colors items-center justify-center gap-2"
                    >
                      Learn More <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="col-span-full py-20 text-center bg-white/5 border border-white/10 rounded-2xl"
          >
            <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">There are no articles matching this category.</p>
          </motion.div>
        )}

        <div className="mt-16 text-center border-t border-white/10 pt-8">
          <p className="text-gray-500 text-sm italic">
            Sourced from official Egyptian ministries, UNESCO, and international archaeological publications
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
