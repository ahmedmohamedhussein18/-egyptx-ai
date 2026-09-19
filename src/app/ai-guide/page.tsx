import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIGuideContent from "@/components/AIGuideContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Guide | EgyptX AI",
  description: "Identify ancient Egyptian monuments instantly using our Vision AI.",
};

export default function AIGuidePage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <AIGuideContent />
      <Footer />
    </main>
  );
}
