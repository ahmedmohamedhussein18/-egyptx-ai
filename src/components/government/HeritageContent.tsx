'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, MapPin, CheckCircle, XCircle, ChevronDown, ChevronUp, 
  Map as MapIcon, Loader2, Building2, Filter, Info
} from 'lucide-react';

type Governorate = {
  id: string;
  name_en: string;
  name_ar: string;
};

type Attraction = {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  city: string;
  latitude: number;
  longitude: number;
  governorate_id: string;
  verified: boolean;
  last_verified_at: string;
  description_en: string;
  description_ar: string;
  governorates: {
    id: string;
    name_en: string;
    name_ar: string;
  } | null;
};

export default function HeritageContent() {
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  
  const [search, setSearch] = useState('');
  const [govFilter, setGovFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/government/heritage');
        const json = await res.json();
        if (json.attractions) setAttractions(json.attractions);
        if (json.governorates) setGovernorates(json.governorates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(attractions.map(a => a.category).filter(Boolean));
    return Array.from(cats);
  }, [attractions]);

  const filteredAttractions = useMemo(() => {
    return attractions.filter(a => {
      const matchSearch = search.trim() === '' || 
        (a.name_en?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (a.name_ar || '').includes(search);
      const matchGov = govFilter === 'all' || a.governorate_id === govFilter;
      const matchCat = catFilter === 'all' || a.category === catFilter;
      
      return matchSearch && matchGov && matchCat;
    });
  }, [attractions, search, govFilter, catFilter]);

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-lg border border-gray-200">
      <Building2 className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-lg font-medium text-gray-500">لا توجد بيانات متاحة</p>
      <p className="text-sm mt-1">حاول تغيير فلاتر البحث أو إضافة معالم جديدة</p>
    </div>
  );

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] mb-1">إدارة التراث</h1>
          <p className="text-sm text-gray-500">مراجعة وتوثيق المعالم الأثرية والسياحية في مصر</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث باسم المعلم (عربي أو إنجليزي)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
          />
        </div>
        
        <div className="w-full md:w-48 relative">
          <select 
            value={govFilter}
            onChange={e => setGovFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#C9A84C]"
          >
            <option value="all">كل المحافظات</option>
            {governorates.map(g => (
              <option key={g.id} value={g.id}>{g.name_ar || g.name_en}</option>
            ))}
          </select>
          <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
        </div>

        <div className="w-full md:w-48 relative">
          <select 
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#C9A84C]"
          >
            <option value="all">كل الفئات</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
        </div>
      ) : filteredAttractions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#0A1628] text-white">
                <tr>
                  <th className="px-6 py-4 font-medium rounded-tr-xl">المعلم</th>
                  <th className="px-6 py-4 font-medium">الفئة</th>
                  <th className="px-6 py-4 font-medium">الموقع</th>
                  <th className="px-6 py-4 font-medium">حالة التحقق</th>
                  <th className="px-6 py-4 font-medium rounded-tl-xl w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttractions.map(attraction => {
                  const isExpanded = expandedRow === attraction.id;
                  const verifyDate = attraction.last_verified_at 
                    ? new Date(attraction.last_verified_at).toLocaleDateString('ar-EG')
                    : 'غير متوفر';

                  return (
                    <React.Fragment key={attraction.id}>
                      <tr 
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}
                        onClick={() => toggleRow(attraction.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{attraction.name_ar || 'بدون اسم عربي'}</div>
                          <div className="text-xs text-gray-500 mt-1" dir="ltr">{attraction.name_en}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="inline-flex px-2 py-1 bg-gray-100 text-xs rounded-md">
                            {attraction.category || 'غير محدد'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{attraction.city || 'غير محدد'}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {attraction.governorates?.name_ar || attraction.governorates?.name_en || 'غير محدد'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {attraction.verified ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                <CheckCircle className="w-4 h-4" /> موثق
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">آخر تحقق: {verifyDate}</div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                              <Info className="w-4 h-4" /> قيد المراجعة
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50 px-6 py-6 border-b-2 border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Details */}
                              <div className="space-y-4 text-sm">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-2">الوصف (عربي)</h4>
                                  <p className="text-gray-600 leading-relaxed text-justify">
                                    {attraction.description_ar || 'لا يوجد وصف متاح باللغة العربية.'}
                                  </p>
                                </div>
                                <div dir="ltr" className="text-left">
                                  <h4 className="font-semibold text-gray-900 mb-2">Description (EN)</h4>
                                  <p className="text-gray-600 leading-relaxed">
                                    {attraction.description_en || 'No English description available.'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Map & Coordinates */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapIcon className="w-4 h-4 text-[#C9A84C]" />
                                  <span className="font-semibold">الإحداثيات:</span>
                                  <span dir="ltr">{attraction.latitude}, {attraction.longitude}</span>
                                </div>
                                {attraction.latitude && attraction.longitude ? (
                                  <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      frameBorder="0"
                                      scrolling="no"
                                      marginHeight={0}
                                      marginWidth={0}
                                      src={`https://maps.google.com/maps?q=${attraction.latitude},${attraction.longitude}&hl=ar&z=14&output=embed`}
                                    ></iframe>
                                  </div>
                                ) : (
                                  <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                    <MapPin className="w-8 h-8 mb-2 opacity-30" />
                                    <span>الإحداثيات غير متوفرة للتمثيل على الخريطة</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
