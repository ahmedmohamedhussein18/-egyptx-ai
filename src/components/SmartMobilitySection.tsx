'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Car, Bus, Ship, CheckCircle, Loader2 } from 'lucide-react';

const MOBILITY_SERVICES = [
  {
    id: 'airport',
    title: 'Airport Transfers',
    description: 'Seamless transfers from Cairo, Sphinx, and Luxor international airports.',
    icon: <Plane className="w-8 h-8 text-[#C9A84C]" />
  },
  {
    id: 'city',
    title: 'City Transport',
    description: 'On-demand smart vehicles for safe and verified inner-city travel.',
    icon: <Car className="w-8 h-8 text-[#4CC9F0]" />
  },
  {
    id: 'buses',
    title: 'Tourist Buses',
    description: 'Intercity eco-friendly buses connecting major governorates and attractions.',
    icon: <Bus className="w-8 h-8 text-purple-400" />
  },
  {
    id: 'nile',
    title: 'Nile Cruises',
    description: 'Integrated booking for authenticated smart cruises along the Nile.',
    icon: <Ship className="w-8 h-8 text-green-400" />
  }
];

export default function SmartMobilitySection() {
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
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1B6B93]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white uppercase tracking-widest mb-4"
          >
            Smart Mobility
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#C9A84C] font-medium tracking-widest uppercase text-sm"
          >
            Connected transport ecosystem
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
              className="bg-[#0A1628]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#C9A84C]/50 transition-colors flex flex-col relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-white/10 border border-white/20 rounded-lg py-1 px-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#030712] border border-white/10 flex items-center justify-center mb-6 mt-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>

              <div className="bg-[#030712] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-[#C9A84C] font-bold uppercase tracking-wider mb-3 text-center">
                  Integration in Progress
                </p>
                
                {successMsg === service.id ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Added to list!</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleNotify(service.id, e)} className="flex flex-col gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter email to get notified"
                      value={activeService === service.id ? email : ''}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setActiveService(service.id);
                      }}
                      onFocus={() => setActiveService(service.id)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading && activeService === service.id}
                      className="w-full py-2 bg-[#1B6B93]/20 hover:bg-[#1B6B93]/40 border border-[#1B6B93] text-white font-bold rounded-lg transition-colors text-xs uppercase flex items-center justify-center"
                    >
                      {loading && activeService === service.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify Me'}
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
