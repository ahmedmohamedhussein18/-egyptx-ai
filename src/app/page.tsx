import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FourPillarsSection from "@/components/FourPillarsSection";
import SmartMobilitySection from "@/components/SmartMobilitySection";
import SmartTourismSection from "@/components/SmartTourismSection";
import DestinationsSection from "@/components/DestinationsSection";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import EcosystemSection from "@/components/EcosystemSection";
import FutureEcosystemSection from "@/components/FutureEcosystemSection";
import CTASection from "@/components/CTASection";
import SponsorsShowcase from "@/components/SponsorsShowcase";
import OfficialSponsorsSection from "@/components/OfficialSponsorsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-transparent">
      <Navbar />
      <HeroSection />
      <FourPillarsSection />
      <DestinationsSection />
      {/* <UpcomingEventsSection /> */}
      <SmartTourismSection />
      <EcosystemSection />
      <FutureEcosystemSection />
      <CTASection />
      <SmartMobilitySection />
      <SponsorsShowcase />
      <OfficialSponsorsSection />
      <Footer />
    </main>
  );
}
