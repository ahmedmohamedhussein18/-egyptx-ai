import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NationalDashboardContent from "@/components/NationalDashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "National Command Center | EgyptX AI",
  description: "Supreme Tourism Intelligence and Data Analytics",
};

export default function NationalDashboardPage() {
  return (
    <main className="relative overflow-hidden bg-[#0A1628]">
      <Navbar />
      <NationalDashboardContent />
      <Footer />
    </main>
  );
}
