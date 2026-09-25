import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    // 1. Authenticate User
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'عذراً، يجب تسجيل الدخول' }, { status: 401 });
    }

    // 2. Admin Client for Auth Check & Data Fetching
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY; 

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'حدث خطأ في إعدادات الخادم' }, { status: 500 });
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const allowedRoles = ['national_admin', 'governorate_admin', 'governorate_analyst', 'site_manager'];
    
    if (profileError || !profile || !allowedRoles.includes(profile.role)) {
      return NextResponse.json({ error: 'عذراً، ليس لديك صلاحية للوصول' }, { status: 403 });
    }

    // Fetch real context data
    const [
      { count: attractionsCount },
      { count: analyticsCount },
      { count: checkinsCount }
    ] = await Promise.all([
      supabaseAdmin.from('attractions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('qr_checkins').select('*', { count: 'exact', head: true })
    ]);

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'مفتاح الذكاء الاصطناعي غير متوفر' }, { status: 500 });
    }
    const groq = new Groq({ apiKey });

    const systemInstruction = `أنت المساعد الذكي الرسمي لمركز القيادة الوطني للسياحة في مصر (EgyptX AI).
قدم تحليلات وإجابات دقيقة واحترافية باللغة العربية بناءً على هذه البيانات الحقيقية:
- عدد المعالم الكلي: ${attractionsCount || 0}
- أحداث التحليلات المسجلة: ${analyticsCount || 0}
- إشارات التحقق (الزيارات الموثقة): ${checkinsCount || 0}
تحدث بثقة ولا تذكر أبداً أنك نموذج ذكاء اصطناعي إلا إذا سُئلت. كن دقيقاً وموجزاً.`;

    const groqMessages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
      { role: 'system', content: systemInstruction },
      ...messages.map((m: any) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: String(m.content)
      }))
    ];

    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: groqMessages,
      temperature: 0.5,
      max_tokens: 500,
    });

    const replyText = response?.choices?.[0]?.message?.content || "عذراً، لم أتمكن من تكوين إجابة في الوقت الحالي.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Government AI API Error:', error);
    return NextResponse.json({ error: 'عذراً، حدث خطأ أثناء معالجة طلبك' }, { status: 500 });
  }
}
