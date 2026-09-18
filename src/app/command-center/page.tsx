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

  // Using Service Role Client here to bypass a known infinite recursion bug 
  // in the profiles RLS policy until the database is patched.
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { data: profile, error: profileError } = await supabaseAdmin
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
