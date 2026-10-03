import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveOtp } from '@/lib/otp-store';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address (e.g. user@gmail.com)' },
        { status: 400 }
      );
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail SMTP Error: Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment.');
      return NextResponse.json(
        {
          success: false,
          error: 'Email service configuration is missing. Please check server settings.',
        },
        { status: 500 }
      );
    }

    // Generate cryptographically random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Prepare elite HTML email template
    const emailSubject = 'EgyptX - Kids Mode Security Verification Code';
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #030712; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="520" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #0B1120; border: 1px solid rgba(201, 168, 76, 0.4); border-radius: 24px; padding: 40px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 25px;">
                      <div style="font-size: 28px; font-weight: 800; color: #C9A84C; letter-spacing: 2px;">
                        EGYPTX <span style="color: #1B6B93;">AI</span>
                      </div>
                      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255, 255, 255, 0.4); margin-top: 4px;">
                        National Smart Tourism Ecosystem
                      </div>
                    </td>
                  </tr>

                  <!-- Security Badge -->
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <div style="display: inline-block; padding: 8px 18px; background-color: rgba(201, 168, 76, 0.12); border: 1px solid rgba(201, 168, 76, 0.35); border-radius: 999px; color: #E2CB85; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        🛡️ Parental Control Security Gate
                      </div>
                    </td>
                  </tr>

                  <!-- Title -->
                  <tr>
                    <td align="center" style="padding-bottom: 12px;">
                      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #FFFFFF;">
                        Kids Mode Verification Code
                      </h1>
                    </td>
                  </tr>

                  <!-- Description -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); max-width: 420px;">
                        A request was made to unlock <strong style="color: #FFFFFF;">Kids Mode</strong> on EgyptX AI. Use the 6-digit verification code below to authorize access:
                      </p>
                    </td>
                  </tr>

                  <!-- Code Display Box -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <div style="background: linear-gradient(180deg, #060E1A 0%, #030712 100%); border: 2px solid #C9A84C; border-radius: 16px; padding: 20px 30px; display: inline-block; box-shadow: 0 0 30px rgba(201, 168, 76, 0.2);">
                        <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 38px; font-weight: 800; color: #C9A84C; letter-spacing: 10px; display: block;">
                          ${otp}
                        </span>
                      </div>
                    </td>
                  </tr>

                  <!-- Expiration Note -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.5);">
                        ⏱️ This single-use code expires in <strong style="color: #E2CB85;">5 minutes</strong>.
                      </p>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 25px;" align="center">
                      <p style="margin: 0; font-size: 11px; line-height: 1.5; color: rgba(255, 255, 255, 0.4);">
                        If you did not request this verification code, please ignore this email. No access will be granted without entering this code.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send real email via Gmail SMTP
    try {
      await transporter.sendMail({
        from: `"EgyptX AI" <${process.env.GMAIL_USER}>`,
        to: cleanEmail,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log(`[SendOtp] Successfully dispatched real OTP email via Gmail SMTP to ${cleanEmail}`);
    } catch (smtpError: any) {
      console.error('Gmail SMTP Error:', smtpError);
      return NextResponse.json(
        {
          success: false,
          error: "We couldn't send the email right now. Please check the address and try again.",
        },
        { status: 500 }
      );
    }

    // Store in server memory with 5-minute expiration only upon genuine delivery
    saveOtp(cleanEmail, otp, 5 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error('Gmail SMTP Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't send the email right now. Please check the address and try again.",
      },
      { status: 500 }
    );
  }
}
