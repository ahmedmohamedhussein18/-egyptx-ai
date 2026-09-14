import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSiteContent from "@/components/SmartSiteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Site Experience | EgyptX AI",
  description: "Scan and explore heritage sites with AI-powered insights.",
};

export default function SmartSitePage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <SmartSiteContent />
      <Footer />
    </main>
  );
}
