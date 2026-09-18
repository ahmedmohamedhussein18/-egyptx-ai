'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Clock, Activity, Radio, MapPin, 
  BarChart3, AlertCircle, Loader2, Calendar, Map
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const MapLeaflet = dynamic(() => import('@/components/MapLeaflet'), { ssr: false });

export default function CommandCenterContent() {
  const [dateRange, setDateRange] = useState('today'); // today, 7d, 30d, custom
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<any>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [dateRange, customStart, customEnd]);

  async function fetchData() {
    if (dateRange === 'custom' && (!customStart || !customEnd)) {
      return; // Wait for both dates
    }
    
    setLoading(true);
    setError(null);
    try {
      let url = `/api/command-center?range=${dateRange}`;
      if (dateRange === 'custom') {
        url += `&startDate=${customStart}&endDate=${customEnd}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch dashboard data');
      }

      setData(json);
      
      // Auto-select first site if none selected
      if (!selectedSiteId && json.mapData && json.mapData.length > 0) {
        setSelectedSiteId(json.mapData[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const mapData = data?.mapData || [];
  
  const scopeTitle = data?.isNational 
    ? 'National Command Center' 
    : data?.scopeName ? `${data.scopeName} Tourism Dashboard` : 'Command Center';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A1628] border border-[#C9A84C]/30 p-3 rounded-lg shadow-xl">
          <p className="text-white text-sm mb-1">{label}</p>
          <p className="text-[#C9A84C] font-bold">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Derived crowd prediction logic
  const selectedSite = useMemo(() => mapData.find((a: any) => a.id === selectedSiteId), [mapData, selectedSiteId]);
  let predictionText = 'Insufficient data to estimate crowd level.';
  let predictionColor = 'text-gray-500';
  let predictionBg = 'bg-white/5 border-white/10';

  if (selectedSite && selectedSite.checkins >= 5) {
    if (selectedSite.checkins > 20) {
      predictionText = 'Predicted: High Crowd Density';
      predictionColor = 'text-red-400';
      predictionBg = 'bg-red-500/10 border-red-500/20';
    } else if (selectedSite.checkins > 10) {
      predictionText = 'Predicted: Moderate Crowd Density';
      predictionColor = 'text-yellow-400';
      predictionBg = 'bg-yellow-500/10 border-yellow-500/20';
    } else {
      predictionText = 'Predicted: Low Crowd Density (Optimal)';
      predictionColor = 'text-green-400';
      predictionBg = 'bg-green-500/10 border-green-500/20';
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold text-[#C9A84C] mb-2 uppercase tracking-wide flex items-center gap-3"
            >
              <Radio className="w-8 h-8" />
              {scopeTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 font-medium tracking-wider uppercase text-sm"
            >
              Real-time Tourism Intelligence Platform
            </motion.p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-sm font-bold tracking-widest uppercase">System Online</span>
            </motion.div>
            
            {/* Date Filters */}
            <div className="flex bg-[#0A1628] rounded-lg border border-white/10 p-1">
              {(['today', '7d', '30d', 'custom'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${
                    dateRange === range 
                    ? 'bg-[#C9A84C]/20 text-[#C9A84C]' 
                    : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range}
                </button>
              ))}
            </div>
            
            {dateRange === 'custom' && (
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={customStart} 
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="bg-[#0A1628] border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
                <input 
                  type="date" 
                  value={customEnd} 
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="bg-[#0A1628] border border-white/10 rounded px-2 py-1 text-xs text-white"
                />
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl text-center mb-8">
            <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
            <p>{error}</p>
          </div>
        ) : loading && !data ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-[#C9A84C]">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <span className="text-lg uppercase tracking-widest font-bold">Initializing Uplink...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={dateRange + customStart + customEnd}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* KPIs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Check-ins */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Verified Check-ins</p>
                    <div className="flex flex-col gap-1">
                      {kpis.verifiedCheckins > 0 ? (
                        <h3 className="text-3xl font-bold text-[#C9A84C]">{kpis.verifiedCheckins}</h3>
                      ) : (
                        <h3 className="text-sm font-bold text-gray-500 italic mt-1">No verified check-ins recorded yet for this period.</h3>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <MapPin className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                </div>

                {/* Page Views */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#1B6B93]/30 rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Attraction Page Views</p>
                    <div className="flex flex-col gap-1">
                      {kpis.attractionViews > 0 ? (
                        <h3 className="text-3xl font-bold text-[#4CC9F0]">{kpis.attractionViews}</h3>
                      ) : (
                        <h3 className="text-sm font-bold text-gray-500 italic mt-1">No attraction views recorded yet.</h3>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <Activity className="w-6 h-6 text-[#4CC9F0]" />
                  </div>
                </div>

                {/* Planner Requests */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">AI Planner Requests</p>
                    <div className="flex flex-col gap-1">
                      {kpis.plannerRequests > 0 ? (
                        <h3 className="text-3xl font-bold text-[#C9A84C]">{kpis.plannerRequests}</h3>
                      ) : (
                        <h3 className="text-sm font-bold text-gray-500 italic mt-1">No itineraries generated yet.</h3>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <Calendar className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                </div>

                {/* Most Viewed */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#1B6B93]/30 rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Most Viewed Attraction</p>
                    <div className="flex flex-col gap-1">
                      {kpis.mostViewedAttraction ? (
                        <>
                          <h3 className="text-lg font-bold text-[#4CC9F0] leading-tight truncate max-w-[150px]" title={kpis.mostViewedAttraction.name}>
                            {kpis.mostViewedAttraction.name}
                          </h3>
                          <span className="text-xs text-gray-400">{kpis.mostViewedAttraction.views} views</span>
                        </>
                      ) : (
                        <h3 className="text-sm font-bold text-gray-500 italic mt-1">Awaiting Data</h3>
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <Users className="w-6 h-6 text-[#4CC9F0]" />
                  </div>
                </div>
              </div>

              {/* Middle Row: Map and Prediction */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                
                {/* Live Tourism Map */}
                <div className="lg:col-span-2 bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-6 relative flex flex-col min-h-[500px]">
                  <h3 className="text-lg font-bold text-[#C9A84C] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Map className="w-5 h-5" /> Live Tourism Map
                  </h3>
                  <div className="flex-grow w-full relative z-0">
                    <MapLeaflet 
                      attractions={mapData} 
                      selectedId={selectedSiteId} 
                      onMarkerClick={(id) => setSelectedSiteId(id)} 
                    />
                  </div>
                </div>

                {/* AI Crowd Prediction Panel */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#1B6B93]/30 rounded-2xl overflow-hidden relative shadow-[0_0_40px_rgba(27,107,147,0.1)] flex flex-col">
                  <div className="p-6 border-b border-[#1B6B93]/20 flex justify-between items-center bg-[#1B6B93]/5">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#4CC9F0]" /> AI Crowd Prediction
                    </h3>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Target Zone</p>
                    <h2 className="text-2xl font-bold text-white mb-6 truncate" title={selectedSite?.name_en || 'Select an attraction'}>
                      {selectedSite?.name_en || 'Select an attraction'}
                    </h2>
                    
                    <div className="space-y-6 flex-grow">
                      <div className="p-4 bg-[#1B6B93]/10 border border-[#1B6B93]/20 rounded-xl">
                        <p className="text-[#4CC9F0] text-xs font-bold uppercase mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Current Data Volume
                        </p>
                        <p className="text-white font-mono text-lg">{selectedSite?.checkins || 0} <span className="text-sm text-gray-400">check-ins</span></p>
                      </div>

                      <div className={`p-4 border rounded-xl ${predictionBg}`}>
                        <p className="text-gray-400 text-xs font-bold uppercase mb-2">AI Analysis</p>
                        <p className={`font-semibold ${predictionColor}`}>
                          {predictionText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 italic text-center">Prediction requires a minimum of 5 verified check-ins in the selected period to establish a baseline.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Line Chart */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#C9A84C]/20 rounded-2xl p-6">
                  <h3 className="text-md font-bold text-[#C9A84C] uppercase tracking-wider mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Verified Check-ins Over Time
                  </h3>
                  <div className="w-full h-64">
                    {charts.checkinsOverTime.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts.checkinsOverTime}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280" 
                            tick={{fill: '#9ca3af', fontSize: 12}} 
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            tick={{fill: '#9ca3af', fontSize: 12}} 
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="checkins" 
                            name="Check-ins"
                            stroke="#C9A84C" 
                            strokeWidth={3}
                            dot={{ fill: '#C9A84C', r: 4, strokeWidth: 2, stroke: '#030712' }}
                            activeDot={{ r: 6, fill: '#E2CB85' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-500 italic text-sm">No data available for this period.</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Source: EgyptX Platform Analytics • Last Updated: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-[#0A1628]/80 backdrop-blur border border-[#1B6B93]/30 rounded-2xl p-6">
                  <h3 className="text-md font-bold text-[#4CC9F0] uppercase tracking-wider mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Most Viewed Attractions
                  </h3>
                  <div className="w-full h-64">
                    {charts.viewsChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.viewsChartData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                          <XAxis 
                            type="number" 
                            stroke="#6b7280" 
                            tick={{fill: '#9ca3af', fontSize: 12}} 
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            stroke="#6b7280" 
                            tick={{fill: '#9ca3af', fontSize: 11}} 
                            tickLine={false}
                            axisLine={false}
                            width={100}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="views" 
                            name="Views"
                            fill="#1B6B93" 
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-500 italic text-sm">No data available for this period.</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Source: EgyptX Platform Analytics • Last Updated: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
