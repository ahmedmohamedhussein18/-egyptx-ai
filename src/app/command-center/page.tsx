import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommandCenterContent from "@/components/CommandCenterContent";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Command Center | EgyptX AI",
  description: "National Tourism Intelligence Platform and Command Center.",
};

export default async function CommandCenterPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role === "tourist") {
    redirect("/?error=unauthorized");
  }

  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <CommandCenterContent />
      <Footer />
    </main>
  );
}
