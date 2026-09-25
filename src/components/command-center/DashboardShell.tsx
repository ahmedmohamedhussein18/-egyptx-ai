'use client';

import React, { useState, useEffect } from 'react';
import CommandSidebar from './CommandSidebar';
import CommandHeader from './CommandHeader';
import { KPIGrid } from './KPIGrid';
import TourismMap from './TourismMap';
import TourismActivityChart from './TourismActivityChart';
import GovernorateActivity from './GovernorateActivity';
import TopAttractions from './TopAttractions';
import TourismDistribution from './TourismDistribution';
import AIAssistantPanel from './AIAssistantPanel';
import BottomActions from './BottomActions';
import { Loader2 } from 'lucide-react';

export default function DashboardShell() {
  const [activeTab, setActiveTab] = useState('المحافظات');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/command-center?range=7d&governorate=cairo', { credentials: 'include' });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F5F7F8] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#C8A24A] animate-spin" />
      </div>
    );
  }

  const profile = data?.profile || {};
  const kpis = data?.kpis || {};
  const mapData = data?.mapData || [];
  const charts = data?.charts || {};
  const govData = mapData.reduce((acc: any, attr: any) => {
    const govName = attr.governorate_id || 'القاهرة';
    const existing = acc.find((a: any) => a.name === govName);
    if (existing) { existing.value += attr.checkins; } 
    else { acc.push({ name: govName, value: attr.checkins }); }
    return acc;
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F5F7F8] font-sans" dir="rtl">
      <CommandHeader profile={profile} />

      <div className="flex flex-1 overflow-hidden">
        {/* FAR RIGHT: SIDEBAR */}
        <div className="w-[145px] shrink-0 border-l border-[#C8A24A]/20 bg-[#071827]">
          <CommandSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* CENTER: MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-4 md:p-6 gap-4">
          <KPIGrid kpis={kpis} />
          
          {/* Middle Row (3 columns) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* RIGHT (1st in RTL): Donut Chart */}
            <div className="h-[350px] xl:h-[400px] bg-white border border-[#E5E9EC] rounded-[10px] shadow-sm">
              <TourismDistribution data={charts.categoryDistribution || []} />
            </div>
            
            {/* CENTER (2nd in RTL): Line Chart */}
            <div className="h-[350px] xl:h-[400px] bg-white border border-[#E5E9EC] rounded-[10px] shadow-sm">
              <TourismActivityChart data={charts.checkinsOverTime || []} />
            </div>

            {/* LEFT (3rd in RTL): Map */}
            <div className="h-[350px] xl:h-[400px]">
              <TourismMap data={mapData} />
            </div>
          </div>

          {/* Bottom Row (2 columns) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* RIGHT (1st in RTL): Bar chart */}
            <div className="bg-white border border-[#E5E9EC] rounded-[10px] shadow-sm overflow-hidden h-[300px]">
              <GovernorateActivity data={govData} />
            </div>

            {/* LEFT (2nd in RTL): Table */}
            <div className="bg-white border border-[#E5E9EC] rounded-[10px] shadow-sm overflow-hidden h-[300px]">
              <TopAttractions data={charts.topAttractionsTable || []} />
            </div>
          </div>

          <div className="mt-2">
            <BottomActions />
          </div>
        </main>

        {/* FAR LEFT: AI PANEL (Visualized as Right Panel in LTR, but in RTL it occupies the left side if it's the last element) */}
        <div className="w-[280px] shrink-0 border-r border-[#122C38] bg-[#0B1F2A]">
          <AIAssistantPanel />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F5F7F8; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E9EC; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4B05A; }
      `}} />
    </div>
  );
}
