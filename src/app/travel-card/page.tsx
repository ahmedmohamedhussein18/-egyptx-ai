import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TravelCardContent from "@/components/TravelCardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Travel Cards | EgyptX AI",
  description: "Generate beautiful AI travel cards for your memories",
};

export default function TravelCardPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <TravelCardContent />
      <Footer />
    </main>
  );
}
