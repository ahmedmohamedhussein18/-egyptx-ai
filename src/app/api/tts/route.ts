import { NextRequest, NextResponse } from 'next/server';

const VOICE_MAP: Record<string, string> = {
  // Female (Sarah)
  female: 'EXAVITQu4vr4xnSDxMaL',
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  'EXAVITQu4vr4xnSDxMaL': 'EXAVITQu4vr4xnSDxMaL',

  // Male (Adam)
  male: 'pNInz6obpgDQGcFmaJgB',
  adam: 'pNInz6obpgDQGcFmaJgB',
  'VR6AewLTigWG4xSOukaG': 'pNInz6obpgDQGcFmaJgB',
  'pNInz6obpgDQGcFmaJgB': 'pNInz6obpgDQGcFmaJgB',

  // Youth (Liam)
  youth: 'TX3LPaxmHKxFdv7VOQHJ',
  liam: 'TX3LPaxmHKxFdv7VOQHJ',
  'yoZ06aMxZJJ28mfd3POQ': 'TX3LPaxmHKxFdv7VOQHJ',
  'TX3LPaxmHKxFdv7VOQHJ': 'TX3LPaxmHKxFdv7VOQHJ',

  // Egyptian (Ahmed)
  egyptian: 'ihycSANIrpHfhWoaq1g3',
  ahmed: 'ihycSANIrpHfhWoaq1g3',
  'Jez3JdhBInQTvlAvDOWR': 'ihycSANIrpHfhWoaq1g3',
  'ihycSANIrpHfhWoaq1g3': 'ihycSANIrpHfhWoaq1g3',
};

/**
 * Phonetically sanitize and optimize Egyptian Arabic slang and heritage names for ElevenLabs TTS.
 * Rewrites problematic Egyptian slang words and monument names with explicit short vowels / diacritics
 * (e.g. "ازيك" / "إزيك" -> "إِزَّيَّك", "ازيكم" -> "إِزَّيُّكُمْ", "الكرنك" -> "الكَرْنَك"),
 * normalizes repetitive letters before passing to ElevenLabs,
 * and adds terminal punctuation for natural Egyptian prosodic rhythm.
 */
function optimizeArabicEgyptianTTS(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // 1. Remove Arabic Tatweel / Kashida (ـ) and enforce verified GEM date
  let res = text
    .replace(/\u0640+/g, '')
    .replace(/16\s*فبراير\s*2023/g, '1 نوفمبر 2025')
    .replace(/فبراير\s*2023/g, '1 نوفمبر 2025')
    .replace(/February\s*16,?\s*2023/gi, 'November 1, 2025');

  // 2. Token-level phonetic rewrite and letter elongation normalization
  res = res.replace(/[\u0621-\u064A\u064B-\u065F]+/gu, (word) => {
    // Strip any existing diacritics to inspect underlying consonant/vowel structure
    const plain = word.replace(/[\u064B-\u065F]/g, '');

    // Heritage and Egyptian Monument Phonetic Tuning
    if (plain === 'الكرنك') return 'الكَرْنَك';
    if (plain === 'كرنك') return 'كَرْنَك';
    if (plain === 'الأقصر' || plain === 'الاقصر') return 'الأُقْصُر';
    if (plain === 'أقصر' || plain === 'اقصر') return 'أُقْصُر';
    if (plain === 'الجيزة' || plain === 'الجيزه') return 'الجِيزَة';
    if (plain === 'الهرم' || plain === 'الأهرام' || plain === 'الاهرام') return 'الأَهْرَام';
    if (plain === 'توت' && plain.includes('عنخ')) return 'تُوت عَنْخ آمُون';

    // Explicit short-vowel rewrites for Egyptian slang
    if (/^[اإأ]ز[يى]+ك+$/u.test(plain)) return 'إِزَّيَّك';
    if (/^[اإأ]ز[يى]+ك+م+$/u.test(plain)) return 'إِزَّيُّكُمْ';
    if (/^[اإأ]ز[يى]+ك+و+ا?$/u.test(plain)) return 'إِزَّيَّكُوا';
    if (/^[اإأ]ي+ه+$/u.test(plain)) return 'إيه';
    if (/^يا+$/u.test(plain)) return 'يا';
    if (/^حب[يى]+بي+$/u.test(plain)) return 'حبيبي';
    if (/^منو+ر+$/u.test(plain)) return 'منور';
    if (/^كد[ااه]+$/u.test(plain)) return 'كده';
    if (/^تما+م+$/u.test(plain)) return 'تمام';
    if (/^معل+ش+$/u.test(plain)) return 'معلش';
    if (/^برنس+$/u.test(plain)) return 'برنس';
    if (/^باش[اى]+$/u.test(plain)) return 'باشا';
    if (/^فل+$/u.test(plain)) return 'فل';
    if (/^هل[اى]+$/u.test(plain)) return 'هلا';
    if (/^فين+$/u.test(plain)) return 'فِين';
    if (/^أهو+$/u.test(plain)) return 'أهو';
    if (/^أهي+$/u.test(plain)) return 'أهي';
    if (/^أومال+$/u.test(plain)) return 'أومال';
    if (/^يلا+$/u.test(plain)) return 'يلا';

    // Normalize any other repetitive letters (3 or more down to 1)
    return plain.replace(/([\u0621-\u064A])\1{2,}/gu, '$1');
  });

  // Clean extra spaces
  res = res.replace(/\s+/g, ' ').trim();

  // 3. Prosodic punctuation: add terminal period if no punctuation exists for a natural cadence pause
  if (res && !/[.!?،؛:…]$/.test(res)) {
    res += '.';
  }

  return res;
}

const OPENAI_VOICES: Record<string, string> = {
  female: 'nova',
  sarah: 'nova',
  male: 'echo',
  adam: 'echo',
  youth: 'alloy',
  liam: 'alloy',
  egyptian: 'onyx',
  ahmed: 'onyx',
  Jez3JdhBInQTvlAvDOWR: 'onyx',
};

function audioResponse(buf: ArrayBuffer) {
  return new NextResponse(buf, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': buf.byteLength.toString(),
    },
  });
}

async function tryElevenLabs(text: string, voiceId: string): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) return null;
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`,
      {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({
          text: text.slice(0, 500),
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.0, use_speaker_boost: true },
        }),
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!response.ok) return null;
    const buf = await response.arrayBuffer();
    return buf.byteLength > 0 ? buf : null;
  } catch {
    return null;
  }
}

async function tryOpenAITTS(text: string, voiceKey: string): Promise<ArrayBuffer | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tts-1',
        voice: OPENAI_VOICES[voiceKey] || 'onyx',
        input: text.slice(0, 1500),
        response_format: 'mp3',
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const buf = await response.arrayBuffer();
    return buf.byteLength > 0 ? buf : null;
  } catch {
    return null;
  }
}

function splitForGoogle(text: string): string[] {
  const sentences = text.match(/[^.!?؟،\n]+[.!?؟،\n]*/g) || [text];
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + s).length > 180) {
      if (cur) chunks.push(cur.trim());
      cur = s;
      while (cur.length > 180) {
        chunks.push(cur.slice(0, 180));
        cur = cur.slice(180);
      }
    } else {
      cur += s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.slice(0, 6);
}

async function tryGoogleTTS(text: string): Promise<ArrayBuffer | null> {
  try {
    const lang = /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
    const buffers: Uint8Array[] = [];
    for (const chunk of splitForGoogle(text)) {
      const res = await fetch(
        `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunk)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(6000) }
      );
      if (!res.ok) return null;
      buffers.push(new Uint8Array(await res.arrayBuffer()));
    }
    const total = buffers.reduce((n, b) => n + b.length, 0);
    if (!total) return null;
    const out = new Uint8Array(total);
    let off = 0;
    for (const b of buffers) {
      out.set(b, off);
      off += b.length;
    }
    return out.buffer;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const resolvedVoiceId =
      VOICE_MAP[voiceId] ||
      (typeof voiceId === 'string' && voiceId.length > 15 ? voiceId : VOICE_MAP['ihycSANIrpHfhWoaq1g3']);

    const phoneticPayload = optimizeArabicEgyptianTTS(text);

    // 1. ElevenLabs -> 2. OpenAI TTS -> 3. Google Translate TTS (always available)
    const audio =
      (await tryElevenLabs(phoneticPayload, resolvedVoiceId)) ||
      (await tryOpenAITTS(String(text), String(voiceId))) ||
      (await tryGoogleTTS(String(text)));

    if (audio) return audioResponse(audio);

    return NextResponse.json({ error: 'TTS unavailable' }, { status: 503 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
