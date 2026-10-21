import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { heroName = 'Young Explorer', companion = 'Horus', destination = 'Pyramid', prompt } = body;

    // Mapping destinations to rich cinematic pharaonic video assets
    let videoUrl = '/videos/kids-mode-welcome.mp4';
    const destLower = (destination || '').toLowerCase();

    if (destLower.includes('pyramid')) {
      videoUrl = '/videos/giza.mp4';
    } else if (destLower.includes('abu simbel') || destLower.includes('sun temple')) {
      videoUrl = '/videos/aswan.mp4';
    } else if (destLower.includes('nefertiti') || destLower.includes('garden')) {
      videoUrl = '/videos/luxor.mp4';
    } else if (destLower.includes('alexandria') || destLower.includes('palace')) {
      videoUrl = '/videos/kids-mode-welcome.mp4';
    }

    const constructedPrompt = prompt || 
      `Cinematic 3D animation for kids: A brave young pharaonic hero named ${heroName}, guided by ${companion}, embarking on a mystical quest to discover ${destination}, featuring ancient Egyptian temples and golden pyramids in a vibrant fantasy style.`;

    return NextResponse.json({
      success: true,
      videoUrl,
      heroName,
      title: `✨ مغامرة البطل ${heroName} السينمائية`,
      titleEn: `The Cinematic Quest of Hero ${heroName}`,
      prompt: constructedPrompt,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate kids story video', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
