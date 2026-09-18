import React from 'react';
import { Metadata } from 'next';
import KidsModeContent from '@/components/KidsModeContent';

export const metadata: Metadata = {
  title: 'Kids Mode | EgyptX AI',
  description: 'A magical, educational experience for young explorers in ancient Egypt.',
};

export default function KidsModePage() {
  return <KidsModeContent />;
}
