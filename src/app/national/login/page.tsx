import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NationalLoginContent from "@/components/NationalLoginContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "National Login | EgyptX AI",
  description: "Secure access for National Admins",
};

export default function NationalLoginPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <NationalLoginContent />
      <Footer />
    </main>
  );
}
