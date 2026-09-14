import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TouristPassportContent from "@/components/TouristPassportContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tourist Passport | EgyptX AI",
  description: "Track your journey, unlock badges, and earn rewards.",
};

export default function TouristPassportPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <TouristPassportContent />
      <Footer />
    </main>
  );
}
