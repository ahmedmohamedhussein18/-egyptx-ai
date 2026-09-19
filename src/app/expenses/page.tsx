import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExpensesContent from "@/components/ExpensesContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip Expenses | EgyptX AI",
  description: "Track your travel spending in Egypt",
};

export default function ExpensesPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <ExpensesContent />
      <Footer />
    </main>
  );
}
