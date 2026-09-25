'use client';

import React from 'react';
import { Map, Bot, Download, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function BottomActions() {
  const actions = [
    {
      title: 'استكشف مصر',
      subtitle: 'اكتشف المعالم والأنشطة السياحية',
      icon: <Map className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      href: '/explore'
    },
    {
      title: 'استخدام الذكاء الاصطناعي',
      subtitle: 'احصل على توصيات مخصصة لرحلتك',
      icon: <Bot className="w-5 h-5 text-[#C8A24A]" />,
      bgColor: 'bg-yellow-50',
      href: '#'
    },
    {
      title: 'تصدير التقارير',
      subtitle: 'PDF / Excel',
      icon: <Download className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      href: '#'
    },
    {
      title: 'مركز المساعدة',
      subtitle: 'دليل الاستخدام والأسئلة الشائعة',
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />,
      bgColor: 'bg-purple-50',
      href: '#'
    },
  ];

  return (
    <div dir="rtl" className="w-full flex gap-4 overflow-x-auto">
      {actions.map((action, index) => (
        <Link 
          key={index}
          href={action.href}
          className="flex-1 min-w-[200px] bg-white border border-[#E5E9EC] rounded-[10px] p-3 flex items-center gap-3 hover:border-gray-300 hover:shadow-md transition-all text-right group"
        >
          <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${action.bgColor} group-hover:scale-105 transition-transform`}>
            {action.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#0B1F2A]">{action.title}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">{action.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
