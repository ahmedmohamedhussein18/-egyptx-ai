import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CraftsRegisterContent from "@/components/CraftsRegisterContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register as Artisan | EgyptX AI",
  description: "Join the Egyptian Crafts Marketplace.",
};

export default function CraftsRegisterPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <CraftsRegisterContent />
      <Footer />
    </main>
  );
}
