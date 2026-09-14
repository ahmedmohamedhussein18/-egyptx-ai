import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommandCenterContent from "@/components/CommandCenterContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center | EgyptX AI",
  description: "National Tourism Intelligence Platform and Command Center.",
};

export default function CommandCenterPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <CommandCenterContent />
      <Footer />
    </main>
  );
}
