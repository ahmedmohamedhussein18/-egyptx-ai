import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationDetailContent from "@/components/DestinationDetailContent";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('attractions').select('name_en').eq('id', resolvedParams.id).single();
  
  return {
    title: `${data?.name_en || 'Destination'} | EgyptX AI`,
    description: `Explore ${data?.name_en || 'this amazing destination'} with EgyptX AI`,
  };
}

export default async function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <DestinationDetailContent id={resolvedParams.id} />
      <Footer />
    </main>
  );
}
