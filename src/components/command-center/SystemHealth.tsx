import React from 'react';
import { Activity, Server } from 'lucide-react';

export interface SystemStatus {
  name: string;
  status: 'Operational' | 'Degraded' | 'Offline';
}

interface SystemHealthProps {
  statuses?: SystemStatus[];
}

const defaultStatuses: SystemStatus[] = [
  { name: 'Supabase', status: 'Operational' },
  { name: 'Analytics', status: 'Operational' },
  { name: 'QR Check-in System', status: 'Operational' },
  { name: 'Map', status: 'Operational' },
  { name: 'AI Services', status: 'Operational' },
];

const SystemHealth: React.FC<SystemHealthProps> = ({ statuses }) => {
  const displayStatuses = statuses && statuses.length > 0 ? statuses : defaultStatuses;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
      case 'Degraded':
        return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'Offline':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-[#0A1628] rounded-xl border border-[#C9A84C]/20 p-6 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#030712] rounded-lg border border-[#C9A84C]/30 relative overflow-hidden">
          <Activity className="w-5 h-5 text-[#C9A84C]" />
        </div>
        <h3 className="text-[#C9A84C] font-semibold tracking-wider text-sm flex-1">SYSTEM HEALTH</h3>
        <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">99.9% UPTIME</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayStatuses.map((sys, idx) => (
          <div key={idx} className="bg-[#030712] border border-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">{sys.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider hidden sm:inline">{sys.status}</span>
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(sys.status)}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealth;
