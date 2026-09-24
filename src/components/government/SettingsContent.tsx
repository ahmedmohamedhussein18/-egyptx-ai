'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, BarChart2, Loader2 } from 'lucide-react';

export default function SettingsContent({ initialProfile, userEmail }: { initialProfile: any, userEmail: string }) {
  const [profile, setProfile] = useState({
    firstName: initialProfile?.first_name || '',
    lastName: initialProfile?.last_name || '',
    governorate: initialProfile?.governorate || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [stats, setStats] = useState({
    governorates: 0,
    attractions: 0,
    users: 0,
    tripPlans: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/government/settings');
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/government/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage('تم تحديث البيانات بنجاح');
      } else {
        setMessage('حدث خطأ أثناء التحديث');
      }
    } catch (err) {
      setMessage('حدث خطأ أثناء التحديث');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إعدادات النظام</h1>
        <p className="text-gray-500">إدارة الملف الشخصي وإعدادات النظام الخاصة بك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#C9A84C]" />
              المعلومات الشخصية
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                <input 
                  type="text" 
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأخير</label>
                <input 
                  type="text" 
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-gray-900"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={userEmail}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الصلاحية</label>
                <input 
                  type="text" 
                  value={initialProfile?.role === 'admin' ? 'مدير النظام' : (initialProfile?.role || 'مستخدم')}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحافظة</label>
                <input 
                  type="text" 
                  value={profile.governorate}
                  onChange={(e) => setProfile({...profile, governorate: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <span className={`text-sm ${message.includes('بنجاح') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </span>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-[#0A1628] hover:bg-[#11233f] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#C9A84C]" />
              نظرة عامة على النظام
            </h2>

            {statsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">إجمالي المحافظات</span>
                  <span className="text-xl font-bold text-[#0A1628]">{stats.governorates}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">المعالم الموثقة</span>
                  <span className="text-xl font-bold text-[#0A1628]">{stats.attractions}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">المستخدمين المسجلين</span>
                  <span className="text-xl font-bold text-[#0A1628]">{stats.users}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">خطط الرحلات</span>
                  <span className="text-xl font-bold text-[#0A1628]">{stats.tripPlans}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
