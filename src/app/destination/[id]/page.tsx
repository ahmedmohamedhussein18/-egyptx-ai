import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DestinationDetailContent from "@/components/DestinationDetailContent";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from('attractions').select('name_en').eq('id', params.id).single();
  
  return {
    title: `${data?.name_en || 'Destination'} | EgyptX AI`,
    description: `Explore ${data?.name_en || 'this amazing destination'} with EgyptX AI`,
  };
}

export default function DestinationPage({ params }: { params: { id: string } }) {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <DestinationDetailContent id={params.id} />
      <Footer />
    </main>
  );
}
