import React from 'react';
import { 
  LayoutDashboard, Map, MapPin, Building, 
  BrainCircuit, Calendar, Bot, Users, 
  CreditCard, Baby, BarChart3, QrCode, 
  Receipt, Compass, Headset, Image, 
  AlertTriangle, Settings, X, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const navigation = [
  {
    group: 'Overview',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard }
    ]
  },
  {
    group: 'Tourism Intelligence',
    items: [
      { id: 'live-map', label: 'Live Tourism Map', icon: Map },
      { id: 'destinations', label: 'Destinations', icon: MapPin },
      { id: 'governorates', label: 'Governorates', icon: Building }
    ]
  },
  {
    group: 'AI Operations',
    items: [
      { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit },
      { id: 'planner', label: 'Smart Planner', icon: Calendar, href: '/planner' },
      { id: 'ai-guide', label: 'AI Guide', icon: Bot }
    ]
  },
  {
    group: 'Tourist Intelligence',
    items: [
      { id: 'tourists', label: 'Tourists', icon: Users },
      { id: 'tourist-passport', label: 'Tourist Passport', icon: CreditCard, href: '/tourist-passport' },
      { id: 'kids-mode', label: 'Kids Mode', icon: Baby }
    ]
  },
  {
    group: 'Analytics',
    items: [
      { id: 'analytics', label: 'Tourism Analytics', icon: BarChart3 },
      { id: 'qr-checkins', label: 'QR Check-ins', icon: QrCode },
      { id: 'expenses', label: 'Expenses', icon: Receipt }
    ]
  },
  {
    group: 'Experiences',
    items: [
      { id: 'hidden-egypt', label: 'Hidden Egypt', icon: Compass },
      { id: 'vr-egypt', label: 'VR Egypt', icon: Headset, href: '/vr-egypt' },
      { id: 'ai-memories', label: 'AI Memories', icon: Image }
    ]
  },
  {
    group: 'System',
    items: [
      { id: 'emergency', label: 'Emergency Center', icon: AlertTriangle },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto 
          bg-[#0A1628] border-r border-[#1e293b] text-white transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#1e293b]">
          <span className="text-xl font-bold text-[#C9A84C] tracking-wider uppercase">EgyptX AI</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-6">
          {navigation.map((group, idx) => (
            <div key={idx}>
              <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.group}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  const content = (
                    <div className={`
                      flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-[#C9A84C]/10 text-[#C9A84C]' 
                        : 'text-gray-300 hover:bg-[#1e293b] hover:text-white'
                      }
                    `}>
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? 'text-[#C9A84C]' : 'text-gray-400'} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight size={16} className="text-[#C9A84C]" />}
                    </div>
                  );

                  return (
                    <li key={item.id}>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="block"
                          onClick={(e) => {
                            if (!item.href.startsWith('/')) {
                              e.preventDefault();
                              setActiveTab(item.id);
                            }
                          }}
                        >
                          {content}
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            if (window.innerWidth < 1024) setIsOpen(false);
                          }}
                          className="w-full text-left block"
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
