import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FourPillarsSection from "@/components/FourPillarsSection";
import SmartMobilitySection from "@/components/SmartMobilitySection";
import SmartTourismSection from "@/components/SmartTourismSection";
import DestinationsSection from "@/components/DestinationsSection";
import EcosystemSection from "@/components/EcosystemSection";
import FutureEcosystemSection from "@/components/FutureEcosystemSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <FourPillarsSection />
      <SmartMobilitySection />
      <SmartTourismSection />
      <DestinationsSection />
      <EcosystemSection />
      <FutureEcosystemSection />
      <CTASection />
      <Footer />
    </main>
  );
}
