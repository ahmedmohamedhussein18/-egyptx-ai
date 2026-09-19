import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GovernmentDashboardContent from "@/components/GovernmentDashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governorate Command Center | EgyptX AI",
  description: "Tourism Intelligence and Data Analytics",
};

export default function GovernmentDashboardPage() {
  return (
    <main className="relative overflow-hidden bg-[#0A1628]">
      <Navbar />
      <GovernmentDashboardContent />
      <Footer />
    </main>
  );
}
