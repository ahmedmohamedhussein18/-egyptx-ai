import { NextResponse } from 'next/server';
import { executeThreeStagePipeline, EGYPTX_GUIDE_SYSTEM_PROMPT } from '@/lib/answerPipeline';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
        { reply: 'أهلاً بك! أنا مرشد EgyptX السياحي والتاريخي، كيف يمكنني مساعدتك اليوم؟' },
        { status: 200 }
      );
    }

    const lowerQuery = lastUserMessageRaw.toLowerCase();

    // Expense inquiry check
    if (
      lowerQuery.includes('expense') ||
      lowerQuery.includes('spend') ||
      lowerQuery.includes('cost') ||
      lowerQuery.includes('مصاريف') ||
      lowerQuery.includes('تكلف')
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
            }. يمكنك متابعة وإدارة كافة الفواتير من لوحة المصاريف! 💳✨`;

            return NextResponse.json({ reply });
          }
        }
      } catch (expErr) {
        console.warn('[Chat Assistant] Expense check error:', expErr);
      }
    }

    // Check if client requested streaming
    const acceptsStreaming =
      stream === true || req.headers.get('accept')?.includes('text/event-stream');

    // Run the Foolproof Three-Stage Text Pipeline:
    // Stage 1 (Groq) -> Stage 2 (OpenRouter) -> Stage 3 (OpenAI)
    const pipelineResult = await executeThreeStagePipeline(lastUserMessageRaw, {
      stream: acceptsStreaming,
    });

    if (acceptsStreaming && pipelineResult.stream) {
      return new Response(pipelineResult.stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    return NextResponse.json({
      reply: pipelineResult.reply,
      claims: pipelineResult.supportedClaims,
      hasVerifiedData: pipelineResult.context.hasVerifiedData,
    });
  } catch (error: any) {
    console.error('[Chat Assistant Pipeline Error]:', error);
    return NextResponse.json(
      {
        reply:
          'أهلاً بك! أنا مرشد EgyptX الخبير بالتاريخ والسياحة المصرية. تفضل بطرح سؤالك عن معالم مصر الخالدة أو أحدث الأخبار السياحية!',
      },
      { status: 200 }
    );
  }
}
