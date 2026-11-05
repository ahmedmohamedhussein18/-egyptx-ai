import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmartNavigator from '@/components/SmartNavigator';

export const metadata = {
  title: 'Smart Navigator | EgyptX AI',
  description: 'Real-time GPS transit and hotel navigation for tourists in Cairo and Egypt.',
};

export default function NavigatorPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#070B13] text-gray-900 dark:text-white flex flex-col justify-between transition-colors duration-200">
      <Navbar />
      <div className="pt-24 pb-16 flex-1 flex flex-col items-center justify-center">
        <SmartNavigator />
      </div>
      <Footer />
    </main>
  );
}
