import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HiddenEgyptContent from "@/components/HiddenEgyptContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hidden Egypt | EgyptX AI",
  description: "Discover Egypt's hidden gems and help preserve its most treasured sites.",
};

export default function HiddenEgyptPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <HiddenEgyptContent />
      <Footer />
    </main>
  );
}
