import React from 'react';

const DashboardFilters = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-8" dir="rtl">
      {/* Title & Subtitle - Right Side */}
      <div className="mb-4 lg:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">لوحة تحكم المحافظات</h1>
        <p className="text-sm text-gray-500 mt-1">تحليلات سياحية دقيقة لكل محافظات مصر</p>
      </div>
      
      {/* Filters - Left Side */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Governorate Filter */}
        <div className="relative">
          <select className="appearance-none bg-white border border-[#E5E9EC] text-gray-700 py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full min-w-[140px]">
            <option>القاهرة</option>
            <option>الإسكندرية</option>
            <option>الأقصر</option>
            <option>أسوان</option>
            <option>البحر الأحمر</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        
        {/* Timeframe Filter */}
        <div className="relative">
          <select className="appearance-none bg-white border border-[#E5E9EC] text-gray-700 py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium w-full min-w-[140px]">
            <option>آخر 7 أيام</option>
            <option>آخر 30 يوم</option>
            <option>هذا الشهر</option>
            <option>هذا العام</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white border border-[#E5E9EC] text-gray-700 py-2.5 px-4 rounded-lg flex items-center text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span dir="rtl" className="text-left" style={{ direction: 'ltr' }}>17 أبريل - 23 أبريل</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
