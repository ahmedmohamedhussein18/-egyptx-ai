import { NextResponse } from 'next/server';
import { verifyStoredOtp } from '@/lib/otp-store';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp } = body;

    if (!otp) {
      return NextResponse.json(
        { success: false, error: 'Verification code is required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanOtp = String(otp || '').trim();

    const verificationResult = verifyStoredOtp(cleanEmail, cleanOtp);

    if (!verificationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: verificationResult.reason || 'Invalid confirmation code. Please check your inbox and try again.',
        },
        { status: 400 }
      );
    }

    // Generate verified session token
    const timestamp = Date.now();
    const randomEntropy = Math.random().toString(36).substring(2, 12);
    const sessionToken = `egyptx_kids_auth_${timestamp}_${randomEntropy}`;

    return NextResponse.json({
      success: true,
      verified: true,
      sessionToken,
      message: 'Kids Mode parental authorization confirmed.',
    });
  } catch (error: any) {
    console.error('[VerifyOtp] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
