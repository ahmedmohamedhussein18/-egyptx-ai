import React from 'react';
import { Metadata } from 'next';
import EmergencyContent from '@/components/EmergencyContent';

export const metadata: Metadata = {
  title: 'Emergency Assistant | EgyptX AI',
  description: 'Official Egyptian emergency numbers and location assistance for tourists.',
};

export default function EmergencyPage() {
  return <EmergencyContent />;
}
