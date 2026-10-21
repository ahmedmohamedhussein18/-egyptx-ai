import React from 'react';
import type { Metadata } from 'next';
import BookingsContent from '@/components/BookingsContent';

export const metadata: Metadata = {
  title: 'Book Your Egypt Experience | EgyptX AI',
  description: 'Official travel reservation hub for flights to Egypt, luxury Nile hotels, authentic culinary dining, and official tourism reels.',
};

export default function BookingsPage() {
  return <BookingsContent />;
}
