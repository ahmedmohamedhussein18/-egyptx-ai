import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessPortalContent from "@/components/BusinessPortalContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Portal | EgyptX AI",
  description: "Grow your tourism business with EgyptX AI.",
};

export default function BusinessPortalPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <BusinessPortalContent />
      <Footer />
    </main>
  );
}
