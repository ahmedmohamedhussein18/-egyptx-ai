import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GovernorateAnalyticsProps {
  data: { name: string; value: number }[];
}

export default function GovernorateAnalytics({ data }: GovernorateAnalyticsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0A1628] rounded-xl border border-[#C9A84C]/20 shadow-lg">
        <p className="text-gray-400">No tourism activity data available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1628] p-6 rounded-xl border border-[#C9A84C]/20 shadow-lg">
      <h3 className="text-[#C9A84C] font-semibold text-lg mb-4">Activity by Governorate</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
            <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip 
              cursor={{ fill: '#1F2937' }}
              contentStyle={{ backgroundColor: '#030712', borderColor: '#C9A84C', borderRadius: '8px' }}
              itemStyle={{ color: '#C9A84C' }}
            />
            <Bar dataKey="value" fill="#C9A84C" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
