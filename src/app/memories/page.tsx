import React from 'react';
import { Metadata } from 'next';
import MemoriesContent from '@/components/MemoriesContent';

export const metadata: Metadata = {
  title: 'AI Memories | EgyptX AI',
  description: 'Your personal AI-generated travel journal and memory collection.',
};

export default function MemoriesPage() {
  return <MemoriesContent />;
}
