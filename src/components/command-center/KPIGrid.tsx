'use client';

import React from 'react';
import { Users, UserPlus, Map, Eye, CheckCircle, Clock } from 'lucide-react';

export interface KPIProps {
  kpis?: {
    totalSessions?: number;
    registeredUsers?: number;
    tripPlansCreated?: number;
    attractionViews?: number;
    verifiedCheckins?: number;
    pendingCheckins?: number;
  };
}

export function KPIGrid({ kpis }: KPIProps) {
  const kpiData = [
    {
      title: 'جلسات المنصة',
      value: kpis?.totalSessions || 0,
      trend: '12%',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-50',
    },
    {
      title: 'المستخدمون المسجلون',
      value: kpis?.registeredUsers || 0,
      trend: '8%',
      icon: <UserPlus className="w-5 h-5 text-teal-600" />,
      iconBg: 'bg-teal-50',
    },
    {
      title: 'خطط الرحلات المنشأة',
      value: kpis?.tripPlansCreated || 0,
      trend: '15%',
      icon: <Map className="w-5 h-5 text-green-600" />,
      iconBg: 'bg-green-50',
    },
    {
      title: 'مشاهدات صفحات المعالم',
      value: kpis?.attractionViews || 0,
      trend: '5%',
      icon: <Eye className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50',
    },
    {
      title: 'إشارات التحقق الموثقة',
      value: kpis?.verifiedCheckins || 0,
      trend: '24%',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      iconBg: 'bg-green-50',
    },
    {
      title: 'إشارات تحقق مرتقبة',
      value: kpis?.pendingCheckins || 0,
      trend: '2%',
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      iconBg: 'bg-yellow-50',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" dir="rtl">
      {kpiData.map((item, index) => (
        <div key={index} className="bg-white rounded-[10px] border border-[#E5E9EC] p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-full ${item.iconBg}`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium text-gray-500 text-left whitespace-nowrap overflow-hidden text-ellipsis leading-tight max-w-[65%]">
              {item.title}
            </span>
          </div>
          
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 truncate">
              {item.value.toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-green-600 whitespace-nowrap">
              ↑ {item.trend}
            </span>
          </div>
          
          <p className="mt-2 text-[10px] text-gray-400">مقارنة بالفترة السابقة</p>
        </div>
      ))}
    </div>
  );
}

export default KPIGrid;
