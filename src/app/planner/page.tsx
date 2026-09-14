import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlannerContent from "@/components/PlannerContent";

export default function PlannerPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <PlannerContent />
      <Footer />
    </main>
  );
}
