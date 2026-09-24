'use client';

import React, { useState, useRef } from 'react';
import { Loader2, FileText, Download, Calendar, MapPin, CheckCircle } from 'lucide-react';

export default function ReportsContent() {
  const [governorate, setGovernorate] = useState('cairo');
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/government/reports?range=${dateRange}&governorate=${governorate}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExportingPDF(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`EgyptX_Report_${governorate}_${dateRange}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto w-full text-white bg-[#0A1628]" dir="rtl" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#C9A84C]" />
            التقارير والتصدير
          </h2>
          <p className="text-gray-400 mt-2 text-sm">قم بتوليد تقارير سياحية مخصصة</p>
        </div>
      </div>

      <div className="bg-[#0D1E36]/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" /> المحافظة
            </label>
            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="bg-[#0A1628] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#C9A84C] transition-colors"
            >
              <option value="cairo">القاهرة</option>
              <option value="alexandria">الإسكندرية</option>
              <option value="giza">الجيزة</option>
              <option value="luxor">الأقصر</option>
              <option value="aswan">أسوان</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" /> الفترة الزمنية
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#0A1628] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[#C9A84C] transition-colors"
            >
              <option value="today">اليوم</option>
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-[#1B6B93] hover:bg-[#155474] text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              {loading ? 'جاري التوليد...' : 'توليد التقرير'}
            </button>
          </div>
        </div>
      </div>

      {data ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <button
              onClick={handleExportPDF}
              disabled={exportingPDF}
              className="bg-[#C9A84C] hover:bg-[#B8983B] text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              {exportingPDF ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {exportingPDF ? 'جاري التصدير...' : 'تصدير PDF'}
            </button>
          </div>

          <div ref={reportRef} className="bg-white text-black p-8 rounded-xl" dir="rtl">
            <div className="flex justify-between items-center border-b-2 border-[#1B6B93] pb-6 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1B6B93]">تقرير الأداء السياحي</h1>
                <p className="text-gray-600 mt-2 text-lg">{data.governorateName}</p>
                <p className="text-gray-500 mt-1">
                  الفترة: {data.dateRange === 'today' ? 'اليوم' : data.dateRange === '7d' ? 'آخر 7 أيام' : 'آخر 30 يوم'}
                </p>
              </div>
              <div className="text-left" dir="ltr">
                <div className="text-[#C9A84C] font-serif text-4xl mb-1">☥</div>
                <div className="text-xl font-bold text-[#0A1628]">EgyptX AI</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500 text-sm font-bold mb-2">إجمالي تسجيلات الدخول</p>
                <p className="text-4xl font-bold text-[#1B6B93]">{data.totalCheckins}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500 text-sm font-bold mb-2">المستخدمين الجدد</p>
                <p className="text-4xl font-bold text-[#2ECC71]">{data.newUsers}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500 text-sm font-bold mb-2">عدد المعالم الموثقة</p>
                <p className="text-4xl font-bold text-[#9B59B6]">{data.totalAttractions}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#0A1628] mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#C9A84C]" /> الأماكن الأكثر زيارة
              </h3>
              {data.topAttractions && data.topAttractions.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-gray-600 font-bold">المكان</th>
                        <th className="px-6 py-3 text-gray-600 font-bold w-1/3">عدد الزيارات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topAttractions.map((attr: any, idx: number) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                          <td className="px-6 py-4 font-medium text-gray-800">{attr.name}</td>
                          <td className="px-6 py-4 text-[#1B6B93] font-bold">{attr.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">لا توجد بيانات متاحة لهذه الفترة.</p>
              )}
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
              <p>تم توليد هذا التقرير آلياً بواسطة نظام EgyptX AI للذكاء الاصطناعي.</p>
              <p className="mt-1">{new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0D1E36]/30 border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-16 h-16 text-gray-500 mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">لا يوجد تقرير حالياً</h3>
          <p className="text-gray-500 max-w-md">قم بتحديد المحافظة والفترة الزمنية ثم اضغط على "توليد التقرير" لعرض البيانات.</p>
        </div>
      )}
    </div>
  );
}
