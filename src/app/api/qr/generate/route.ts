import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const attractionId = searchParams.get('attractionId');

    if (!attractionId) {
      return NextResponse.json({ error: 'attractionId is required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const checkinUrl = `${baseUrl}/checkin/${attractionId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(checkinUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#030712',
        light: '#C9A84C'
      }
    });

    return NextResponse.json({ qrCode: qrCodeDataUrl });
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}
