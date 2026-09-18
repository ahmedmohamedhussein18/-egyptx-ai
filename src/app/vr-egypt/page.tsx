import React from 'react';
import { Metadata } from 'next';
import VrEgyptContent from '@/components/VrEgyptContent';

export const metadata: Metadata = {
  title: 'VR Egypt | EgyptX AI',
  description: 'Immersive 360° virtual tours of ancient wonders.',
};

export default function VrEgyptPage() {
  return <VrEgyptContent />;
}
