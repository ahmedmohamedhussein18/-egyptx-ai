'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, MapPin, Loader2, Search } from 'lucide-react';

type Attraction = {
  id: string;
  name_en: string;
  name_ar?: string;
  description_en: string;
  description_ar?: string;
  city: string;
  category: string;
  governorate_id: string;
  verified: boolean;
  image_url?: string;
};

export default function ContentManagement({ profile }: { profile: any }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAttraction, setCurrentAttraction] = useState<Partial<Attraction>>({});

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/government/content');
      const json = await res.json();
      if (json.data) {
        setAttractions(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المعلم؟')) return;
    
    try {
      const res = await fetch(`/api/government/content?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAttractions(attractions.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVerified = async (attraction: Attraction) => {
    try {
      const res = await fetch('/api/government/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: attraction.id, verified: !attraction.verified })
      });
      const json = await res.json();
      if (json.data) {
        setAttractions(attractions.map(a => a.id === attraction.id ? json.data : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const isEdit = !!currentAttraction.id;
    const method = isEdit ? 'PUT' : 'POST';

    // Auto-fill governorate_id for governorate_admin
    const dataToSubmit = { ...currentAttraction };
    if (profile.role === 'governorate_admin') {
      dataToSubmit.governorate_id = profile.governorate;
    }

    try {
      const res = await fetch('/api/government/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });
      const json = await res.json();
      
      if (res.ok && json.data) {
        if (isEdit) {
          setAttractions(attractions.map(a => a.id === json.data.id ? json.data : a));
        } else {
          setAttractions([json.data, ...attractions]);
        }
        setIsModalOpen(false);
        setCurrentAttraction({});
      } else {
        alert(json.error || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddModal = () => {
    setCurrentAttraction({
      name_en: '',
      description_en: '',
      city: '',
      category: 'general',
      verified: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (attraction: Attraction) => {
    setCurrentAttraction(attraction);
    setIsModalOpen(true);
  };

  const filteredAttractions = attractions.filter(a => 
    a.name_en?.toLowerCase().includes(search.toLowerCase()) ||
    a.name_ar?.includes(search) ||
    a.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2">إدارة المحتوى</h1>
          <p className="text-gray-500">إدارة المعالم السياحية وتوثيق البيانات</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#C9A84C] hover:bg-[#b5953e] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          إضافة معلم جديد
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث عن معلم..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-100">اسم المعلم</th>
                  <th className="px-6 py-4 border-b border-gray-100">المدينة</th>
                  <th className="px-6 py-4 border-b border-gray-100">التصنيف</th>
                  <th className="px-6 py-4 border-b border-gray-100">الحالة</th>
                  <th className="px-6 py-4 border-b border-gray-100 w-32">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttractions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      لا يوجد معالم مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredAttractions.map((attraction) => (
                    <tr key={attraction.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 border-b border-gray-50">
                        <div className="font-bold text-[#0A1628]">{attraction.name_ar || attraction.name_en}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{attraction.description_en}</div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-50 text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {attraction.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-50 text-gray-700">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">
                          {attraction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-50">
                        <button 
                          onClick={() => handleToggleVerified(attraction)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            attraction.verified 
                              ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {attraction.verified ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {attraction.verified ? 'موثق' : 'غير موثق'}
                        </button>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(attraction)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(attraction.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0A1628]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-[#0A1628]">
                {currentAttraction.id ? 'تعديل المعلم' : 'إضافة معلم جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم (إنجليزي) *</label>
                  <input 
                    type="text" 
                    required
                    value={currentAttraction.name_en || ''}
                    onChange={(e) => setCurrentAttraction({...currentAttraction, name_en: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم (عربي)</label>
                  <input 
                    type="text" 
                    value={currentAttraction.name_ar || ''}
                    onChange={(e) => setCurrentAttraction({...currentAttraction, name_ar: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">الوصف (إنجليزي) *</label>
                <textarea 
                  required
                  rows={3}
                  value={currentAttraction.description_en || ''}
                  onChange={(e) => setCurrentAttraction({...currentAttraction, description_en: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  dir="ltr"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">المدينة *</label>
                  <input 
                    type="text" 
                    required
                    value={currentAttraction.city || ''}
                    onChange={(e) => setCurrentAttraction({...currentAttraction, city: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">التصنيف *</label>
                  <select
                    required
                    value={currentAttraction.category || 'general'}
                    onChange={(e) => setCurrentAttraction({...currentAttraction, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="ancient">Ancient (فرعوني)</option>
                    <option value="museum">Museum (متحف)</option>
                    <option value="nature">Nature (طبيعة)</option>
                    <option value="religious">Religious (ديني)</option>
                    <option value="leisure">Leisure (ترفيه)</option>
                    <option value="general">General (عام)</option>
                  </select>
                </div>
              </div>

              {profile.role === 'national_admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">معرف المحافظة (Governorate ID) *</label>
                  <input 
                    type="text" 
                    required
                    value={currentAttraction.governorate_id || ''}
                    onChange={(e) => setCurrentAttraction({...currentAttraction, governorate_id: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1">مدير النظام لديه صلاحية تعيين المحافظة يدوياً.</p>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={currentAttraction.verified || false}
                    onChange={(e) => setCurrentAttraction({...currentAttraction, verified: e.target.checked})}
                    className="w-4 h-4 text-[#C9A84C] focus:ring-[#C9A84C] rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">معلم موثق ورسمي</span>
                </label>
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 mt-auto">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-[#0A1628] hover:bg-[#11233f] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 font-medium"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                حفظ البيانات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
