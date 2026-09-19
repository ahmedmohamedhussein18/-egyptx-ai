import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GovernmentLoginContent from "@/components/GovernmentLoginContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Login | EgyptX AI",
  description: "Secure access for Governorate Admins and Analysts",
};

export default function GovernmentLoginPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <GovernmentLoginContent />
      <Footer />
    </main>
  );
}
