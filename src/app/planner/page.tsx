import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlannerContent from "@/components/PlannerContent";

export default function PlannerPage() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <PlannerContent />
      <Footer />
    </div>
  );
}
