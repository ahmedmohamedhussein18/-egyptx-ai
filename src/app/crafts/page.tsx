import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CraftsContent from "@/components/CraftsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Egyptian Crafts Marketplace | EgyptX AI",
  description: "Discover authentic Egyptian crafts and heritage products.",
};

export default function CraftsPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <CraftsContent />
      <Footer />
    </main>
  );
}
