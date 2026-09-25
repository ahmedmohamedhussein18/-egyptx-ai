import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MuseumAIContent from "@/components/MuseumAIContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Museum AI | EgyptX AI",
  description: "Point, scan, and discover artifacts with AI vision.",
};

export default function MuseumAIPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <MuseumAIContent />
      <Footer />
    </main>
  );
}
