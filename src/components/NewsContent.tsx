'use client';

import React, { useState } from 'react';
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

const getCategories = (t: any) => [
  { id: 'All', label: t('news.filters.all') },
  { id: 'Archaeology', label: t('news.filters.archaeology') },
  { id: 'Tourism', label: t('news.filters.tourism') },
  { id: 'Heritage', label: t('news.filters.heritage') },
  { id: 'Museums', label: t('news.filters.museums') },
  { id: 'History', label: t('news.filters.history') }
];

const getNews = (t: any): Article[] => [
  {
    id: 1,
    title: t('news.items.gem.title'),
    description: t('news.items.gem.desc'),
    category: 'Museums',
    date: "2023-11-18",
    source: "Grand Egyptian Museum Official",
    sourceUrl: "https://gem.gov.eg",
    image: '/news/gem.jpg'
  },
  {
    id: 2,
    title: t('news.items.luxor.title'),
    description: t('news.items.luxor.desc'),
    category: 'Archaeology',
    date: "2024-03-15",
    source: "Ministry of Tourism and Antiquities",
    sourceUrl: "https://www.antiquities.go.eg",
    image: '/news/luxor-tomb.jpg'
  },
  {
    id: 3,
    title: t('news.items.tourism2024.title'),
    description: t('news.items.tourism2024.desc'),
    category: 'Tourism',
    date: "2025-01-10",
    source: "Egyptian Ministry of Tourism",
    sourceUrl: "https://www.egypt.travel",
    image: '/news/tourists.jpg'
  }
];

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
  const [activeCategory, setActiveCategory] = useState('All');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const articles = activeCategory === 'All' 
    ? getNews(t) 
    : getNews(t).filter(a => a.category === activeCategory);

  const categories = getCategories(t);

  return (
    <main className="relative min-h-screen bg-[#030712] font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#C9A84C] mb-6"
          >
            <Newspaper className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t('news.badge')}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif"
          >
            {t('news.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            {t('news.subtitle')}
          </motion.p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, index) => (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium ${
                activeCategory === cat.id
                  ? 'bg-[#C9A84C] text-[#030712] border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.4)]'
                  : 'bg-white/5 text-gray-300 border-[#C9A84C]/30 hover:border-[#C9A84C] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#C9A84C]/50 transition-all shadow-lg flex flex-col h-full"
                >
                  <div className="h-56 relative overflow-hidden bg-gray-900">
                    <img
                      src={imageErrors[article.id] || !article.image 
                        ? 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1000&auto=format&fit=crop'
                        : article.image
                      }
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => setImageErrors(prev => ({ ...prev, [article.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
                    
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md shadow-lg ${getCategoryColor(article.category)}`}>
                      {getCategoryIcon(article.category)}
                      {categories.find(c => c.id === article.category)?.label || article.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#C9A84C] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <span className="text-xs text-gray-500 font-medium truncate max-w-[60%]">
                        {article.source}
                      </span>
                      <a 
                        href={article.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#C9A84C] text-sm font-bold flex items-center gap-1.5 hover:text-[#E2C779] transition-colors"
                      >
                        {t('news.learnMore')} <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <Newspaper className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl text-white font-medium mb-2">{t('news.noArticles')}</h3>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured Video Banner */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 relative w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
            <video
              src="/videos/vv1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
