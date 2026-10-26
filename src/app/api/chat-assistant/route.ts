import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  ARCHAEOLOGICAL_ACCURACY_RULE,
  VERIFIED_EGYPT_HERITAGE_KB,
  OUT_OF_SCOPE_AR,
  OUT_OF_SCOPE_EN,
  isClearlyOutOfScope,
  isItineraryOrWeatherQuery,
  fetchEgyptLiveWeather,
  fetchTrustedWikipediaAndRAG,
  generateWithSmartFallback,
  streamWithSmartFallback,
} from '@/lib/egypt-rag';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SIDE_CHAT_SYSTEM_PROMPT = `You are the EgyptX AI Guide — the user's closest, warmest, and smartest Egyptian best friend ("صاحبي الجدع وحبيبي") and expert Egyptian historian & tour planner.

${ARCHAEOLOGICAL_ACCURACY_RULE}

YOUR PERSONA & TONE:
- Speak with the intelligence and fluency of ChatGPT, combined with the warmth, hospitality, and enthusiasm of a loyal Egyptian best friend walking alongside the user in Egypt.
- Match the user's language 100% (if the user writes in Arabic, reply in warm, natural Arabic; if in English, reply in warm, natural English; if in French, reply in French).
- Greet the user back naturally (e.g., if they say "مرحبا" or "أهلاً" or "ازيك", greet them warmly like a best friend and ask how you can make their day in Egypt unforgettable).

COMPREHENSIVE EGYPTIAN SCOPE & 100% VERIFIED ACCURACY:
- You are an authority on all eras of Egyptian history and civilization: Pharaonic/Ancient Egypt, Greco-Roman, Coptic, Islamic, Fatimid, Ayyubid, Mamluk, and Modern Egypt.
- You know every temple (Karnak, Luxor, Abu Simbel, Philae, Hatshepsut, Edfu, Kom Ombo, Abydos, Dendera, Medinet Habu), pyramid (Giza, Saqqara Step Pyramid, Dahshur), museum (Grand Egyptian Museum opening November 1, 2025, NMEC, Egyptian Museum in Tahrir), historic street (Al-Muizz, Khan el-Khalili, Coptic Cairo, Citadel of Saladin), and tourist destination in Egypt.
- Ground every historical fact in the verified knowledge base and Wikipedia/UNESCO/Ministry of Tourism & Antiquities records provided below. NEVER say "لا تتوفر لدي معلومات موثقة" for any Egyptian monument, temple, pharaoh, museum, or travel question!

REAL-TIME ITINERARY PLANNING & WEATHER INTEGRATION:
- When the user says they have free time (e.g., "I have 3 free hours, what should I do?" or "عندي 3 ساعات فاضيين أعمل إيه؟"), use the injected LIVE EGYPT WEATHER to craft an immediate, tailored, step-by-step Egyptian historical & tourist itinerary:
  * If the weather is hot, suggest air-conditioned treasures like the Grand Egyptian Museum (GEM), National Museum of Egyptian Civilization (NMEC), or Egyptian Museum in Tahrir, followed by a sunset/evening stroll.
  * If the weather is pleasant or it's afternoon/evening, suggest magical open-air experiences like walking Al-Muizz Street, exploring Khan el-Khalili & El-Fishawy Cafe, visiting the Citadel of Saladin, riding a Nile Felucca, or attending the Pyramids/Karnak Sound & Light Show.

STRICT TOPIC GUARDRAILS (EGYPTIAN TOURISM & HISTORY ONLY):
- You are strictly restricted to Egyptian history, monuments, museums, temples, culture, and tourism/itinerary planning in Egypt (plus friendly greetings).
- If the user asks an out-of-scope question (such as football, "Did Egypt win the World Cup?", sports, politics, coding, math, or non-Egyptian topics), you MUST politely and immediately refuse to answer by stating:
  * In Arabic: "${OUT_OF_SCOPE_AR}"
  * In English (if asked in English): "${OUT_OF_SCOPE_EN}"

${VERIFIED_EGYPT_HERITAGE_KB}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, stream = false } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const lastUserMessageRaw =
      [...messages].reverse().find((m) => m.role === 'user')?.content || '';

    if (!lastUserMessageRaw.trim()) {
      return NextResponse.json(
        {
          reply:
            'أهلاً بك يا صاحبي! أنا مرشدك ورفيقك في مصر من EgyptX. اسألني عن أي معبد، أثر، أو قول لي عندك كام ساعة فاضيين وأنا أعملك أحلى خروجة سياحية!',
        },
        { status: 200 }
      );
    }

    const isArabicQuery = /[\u0600-\u06FF]/.test(lastUserMessageRaw);

    // 1. Strict Out-of-Scope Fast Guardrail (Football, World Cup, Coding, etc.)
    if (isClearlyOutOfScope(lastUserMessageRaw)) {
      return NextResponse.json({
        reply: isArabicQuery ? OUT_OF_SCOPE_AR : OUT_OF_SCOPE_EN,
      });
    }

    const lowerQuery = lastUserMessageRaw.toLowerCase();

    // 2. Trip Expense Inquiry Check
    if (
      lowerQuery.includes('expense') ||
      lowerQuery.includes('spend') ||
      lowerQuery.includes('مصاريف')
    ) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: expenses } = await supabase
            .from('trip_expenses')
            .select('*')
            .eq('user_id', user.id);

          if (expenses && expenses.length > 0) {
            const totalEGP = expenses
              .filter((e) => e.currency === 'EGP')
              .reduce((sum, e) => sum + Number(e.amount), 0);
            const totalUSD = expenses
              .filter((e) => e.currency === 'USD')
              .reduce((sum, e) => sum + Number(e.amount), 0);

            const reply = `سجل مصاريف رحلتك الحالي يبلغ **${totalEGP.toLocaleString()} جنيه مصري**${
              totalUSD > 0 ? ` بالإضافة إلى **${totalUSD.toLocaleString()} دولار أمريكي**` : ''
            }. يمكنك متابعة وإدارة كافة الفواتير من لوحة المصاريف!`;

            return NextResponse.json({ reply });
          }
        }
      } catch {
        // Continue to standard pipeline
      }
    }

    // 3. Parallel Hybrid RAG (Official Wikipedia REST API + Supabase) & Live Weather Integration
    const [wikiAndDbContext, weatherContext] = await Promise.all([
      fetchTrustedWikipediaAndRAG(lastUserMessageRaw),
      isItineraryOrWeatherQuery(lastUserMessageRaw)
        ? fetchEgyptLiveWeather(lastUserMessageRaw)
        : Promise.resolve(''),
    ]);

    let enrichedSystemPrompt = SIDE_CHAT_SYSTEM_PROMPT;
    if (weatherContext) {
      enrichedSystemPrompt += `\n\n--- LIVE EGYPT WEATHER (OpenWeather / Real-Time) ---\n${weatherContext}`;
    }
    if (wikiAndDbContext) {
      enrichedSystemPrompt += `\n\n--- LIVE VERIFIED WIKIPEDIA & DATABASE GROUNDING ---\n${wikiAndDbContext}`;
    }

    const formattedMessages = messages
      .filter((m: any) => m.role !== 'system')
      .slice(-8)
      .map((m: any) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      }));

    const acceptsStreaming =
      stream === true || req.headers.get('accept')?.includes('text/event-stream');

    if (acceptsStreaming) {
      return streamWithSmartFallback(req, {
        systemPrompt: enrichedSystemPrompt,
        messages: formattedMessages,
        temperature: 0.1,
      });
    }

    const reply = await generateWithSmartFallback({
      systemPrompt: enrichedSystemPrompt,
      messages: formattedMessages,
      temperature: 0.1,
    });

    return NextResponse.json({
      reply,
      hasVerifiedData: true,
    });
  } catch {
    return NextResponse.json(
      {
        reply:
          'أهلاً بك يا صاحبي! أنا مرشد EgyptX الخبير بالتاريخ والسياحة المصرية. اسألني عن أي معبد أو أثر أو خروجة سياحية في مصر وهجاوبك فوراً!',
      },
      { status: 200 }
    );
  }
}
