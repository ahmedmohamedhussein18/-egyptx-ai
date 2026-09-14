import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExploreContent from "@/components/ExploreContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Egypt | EgyptX AI",
  description: "Discover the wonders of Egypt from ancient monuments to hidden oases.",
};

export default function ExplorePage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <ExploreContent />
      <Footer />
    </main>
  );
}
