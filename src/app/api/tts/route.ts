import { NextResponse } from 'next/server';

/**
 * Valid default ElevenLabs Premade Voice IDs:
 * - Adam (Male):   pNInz6obpgDQGcFmaJgB
 * - Sarah (Female): EXAVITQu4vr4xnSDxMaL
 * - Liam (Youth):   TX3LPaxmHKxFdv7VOQHJ
 */
const KNOWN_VOICE_MAP: Record<string, string> = {
  male: 'pNInz6obpgDQGcFmaJgB',    // Adam
  female: 'EXAVITQu4vr4xnSDxMaL',  // Sarah
  youth: 'TX3LPaxmHKxFdv7VOQHJ',   // Liam
};

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = typeof body?.text === 'string' ? body.text.trim().slice(0, 600) : '';
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided for audio synthesis.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const elevenlabsKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenlabsKey) {
      console.error('[TTS API] Missing ELEVENLABS_API_KEY in environment variables.');
      return NextResponse.json(
        { error: 'Voice generation failed. ELEVENLABS_API_KEY is not configured.' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resolve voice ID: Check direct ID, or mapped alias (male/female/youth), or default to Sarah
    let voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Default: Sarah (Female)
    if (typeof body?.voiceId === 'string' && body.voiceId.trim()) {
      const v = body.voiceId.trim();
      voiceId = KNOWN_VOICE_MAP[v.toLowerCase()] || v;
    } else if (process.env.ELEVENLABS_VOICE_ID) {
      voiceId = process.env.ELEVENLABS_VOICE_ID;
    }

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': elevenlabsKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    // 1. Strict Error Handling: If ElevenLabs fails, parse and return JSON error. DO NOT return audio buffer!
    if (!elevenRes.ok) {
      let errorMessage = `ElevenLabs synthesis failed with status ${elevenRes.status}.`;
      try {
        const errJson = await elevenRes.json();
        if (errJson?.detail?.message) {
          errorMessage = errJson.detail.message;
        } else if (errJson?.message) {
          errorMessage = errJson.message;
        } else if (errJson?.detail) {
          errorMessage = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        const rawText = await elevenRes.text().catch(() => '');
        if (rawText) errorMessage = rawText;
      }

      console.error(`[TTS API] ElevenLabs error (${elevenRes.status}):`, errorMessage);

      const statusCode = elevenRes.status >= 400 && elevenRes.status < 600 ? elevenRes.status : 500;
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Verified Audio Stream: Return as audio/mpeg binary
    const audioBuffer = await elevenRes.arrayBuffer();
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'ElevenLabs returned empty audio response.' },
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err: any) {
    console.error('[TTS API] Server exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Voice generation failed. Please check server logs.' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
