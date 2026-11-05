"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginContent from "@/components/LoginContent";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col bg-[#FDFBF7] dark:bg-[#030712] text-slate-900 dark:text-white transition-colors duration-200">
        <LoginContent />
      </main>
      <Footer />
    </>
  );
}
