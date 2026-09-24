import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    // 1. Authenticate User
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Admin Client for Auth Check
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY; 

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const allowedRoles = ['national_admin', 'governorate_admin', 'governorate_analyst', 'site_manager'];
    
    if (profileError || !profile || !allowedRoles.includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Process Request
    const body = await req.json();
    const { messages, dashboardData } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing or invalid messages' }, { status: 400 });
    }

    const governorate = dashboardData?.scopeName || 'National';
    const kpis = dashboardData?.kpis || {};

    const systemInstruction = `You are the EgyptX AI Tourism Intelligence Agent for the ${governorate} Governorate.
You provide insights, explain trends, and answer questions based on the real verified data provided to you.
Keep your answers professional, concise, and focused on tourism strategy. 
If asked to speak Arabic, do so fluently and professionally.

CURRENT VERIFIED DATA FOR ${governorate}:
- Verified Check-ins: ${kpis.verifiedCheckins || 0}
- Attraction Views: ${kpis.attractionViews || 0}
- AI Planner Requests: ${kpis.tripPlansCreated || kpis.plannerRequests || 0}
- Registered Users: ${kpis.registeredUsers || 0}
`;

    // Ensure system prompt is first, then append chat history
    const groqMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    const response = await generateContentWithFallback({
      messages: groqMessages,
      config: {
        temperature: 0.5,
        max_tokens: 500,
      }
    });

    const replyText = response?.choices?.[0]?.message?.content || "عذراً، لم أتمكن من توليد تحليل في الوقت الحالي.";

    return NextResponse.json({ response: replyText });
  } catch (error) {
    console.error('Government AI API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
