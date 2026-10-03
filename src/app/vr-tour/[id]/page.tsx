import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VrTourDetailContent from '@/components/VrTourDetailContent';
import { getMonumentById } from '@/lib/monuments';

interface VrTourPageProps {
  params: Promise<{ id?: string }> | { id?: string };
}

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: 'abu-simbel' },
  ];
}

export async function generateMetadata({ params }: VrTourPageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const id = resolved?.id || '1';
  const monument = getMonumentById(id);

  return {
    title: `${monument.title} | Immersive 360° VR Tour | EgyptX AI`,
    description: `Experience the ancient wonder of ${monument.title} in ${monument.city}, Egypt with interactive 360° photogrammetry and ElevenLabs HD Audio.`,
  };
}

export default async function VrTourDetailPage({ params }: VrTourPageProps) {
  const resolved = await Promise.resolve(params);
  const id = resolved?.id || '1';

  return (
    <main className="min-h-screen bg-[#030712] relative overflow-hidden">
      <Navbar />
      <VrTourDetailContent id={id} />
      <Footer />
    </main>
  );
}
