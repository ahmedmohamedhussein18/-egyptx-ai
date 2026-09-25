import React from 'react';
import Link from 'next/link';
import { Map, Plane, ShieldCheck, History, Mountain, LayoutDashboard } from 'lucide-react';

const actions = [
  { name: 'Explore Egypt', icon: Mountain, href: '/explore', color: 'from-blue-600 to-cyan-500' },
  { name: 'Open AI Planner', icon: Plane, href: '/planner', color: 'from-[#C9A84C] to-[#E8D08D]' },
  { name: 'Tourist Passport', icon: ShieldCheck, href: '/tourist-passport', color: 'from-emerald-600 to-teal-500' },
  { name: 'AI Memories', icon: History, href: '/memories', color: 'from-purple-600 to-pink-500' }
];

export default function QuickActions() {
  return (
    <div className="bg-[#0A1628] rounded-2xl border border-white/5 p-6 h-full shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <h3 className="text-[#C9A84C] font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[#030712]/50 border border-white/5 hover:border-[#C9A84C]/30 hover:bg-white/5 transition-all"
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-xs font-medium text-center group-hover:text-[#C9A84C] transition-colors">
              {action.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
