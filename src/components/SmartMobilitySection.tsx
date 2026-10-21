'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Plane, Car, Bus, Ship, CheckCircle, Loader2 } from 'lucide-react';

const getMobilityServices = (t: (k: string) => string) => [
  {
    id: 'airport',
    title: t('home.mobility.airport.title'),
    description: t('home.mobility.airport.desc'),
    icon: <Plane className="w-8 h-8 text-[#C9A84C]" />
  },
  {
    id: 'city',
    title: t('home.mobility.city.title'),
    description: t('home.mobility.city.desc'),
    icon: <Car className="w-8 h-8 text-[#4CC9F0]" />
  },
  {
    id: 'buses',
    title: t('home.mobility.buses.title'),
    description: t('home.mobility.buses.desc'),
    icon: <Bus className="w-8 h-8 text-purple-400" />
  },
  {
    id: 'nile',
    title: t('home.mobility.nile.title'),
    description: t('home.mobility.nile.desc'),
    icon: <Ship className="w-8 h-8 text-green-400" />
  }
];

export default function SmartMobilitySection() {
  const { t } = useLanguage();
  const MOBILITY_SERVICES = getMobilityServices(t);
  const [email, setEmail] = useState('');
  const [activeService, setActiveService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleNotify = async (serviceId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/mobility-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, service_type: serviceId })
      });
      if (res.ok) {
        setSuccessMsg(serviceId);
        setEmail('');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setActiveService(null);
    }
  };

  return (
    <section className="py-24 bg-[#FDFBF7] dark:bg-[#0B0F19] relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/5 dark:bg-[#1B6B93]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif-editorial font-bold text-slate-900 dark:text-gray-100 uppercase tracking-widest mb-4"
          >
            {t('home.mobility.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-yellow-700 dark:text-yellow-400 font-medium tracking-widest uppercase text-sm"
          >
            {t('home.mobility.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOBILITY_SERVICES.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#F8F3E9] dark:bg-[#131A2A] border border-slate-200/80 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-[#FDFBF7] dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-lg py-1 px-2">
                <span className="text-[10px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-widest">
                  {t('home.mobility.comingSoon')}
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 mt-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1A2332] dark:text-gray-100 mb-2">{service.title}</h3>
              <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow font-light">
                {service.description}
              </p>

              <div className="bg-[#FDFBF7] dark:bg-[#0B0F19] rounded-xl p-4 border border-slate-200 dark:border-white/5">
                <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold uppercase tracking-wider mb-3 text-center">
                  {t('home.mobility.integration')}
                </p>
                
                {successMsg === service.id ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">{t('home.mobility.added')}</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleNotify(service.id, e)} className="flex flex-col gap-2">
                    <input
                      type="email"
                      required
                      placeholder={t('home.mobility.notifyPlaceholder')}
                      value={activeService === service.id ? email : ''}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setActiveService(service.id);
                      }}
                      onFocus={() => setActiveService(service.id)}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading && activeService === service.id}
                      className="w-full py-2 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] text-white font-bold rounded-lg transition-colors text-xs uppercase flex items-center justify-center"
                    >
                      {loading && activeService === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : t('home.mobility.notifyBtn')}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
