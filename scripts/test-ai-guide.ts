/**
 * EgyptX AI Guide — Zero-Hallucination RAG Evaluation Script
 * Run with: npx tsx scripts/test-ai-guide.ts
 */

import fs from 'fs';
import path from 'path';

// 1. Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  }
}

async function runEvaluation() {
  const { executeThreeStagePipeline } = await import('../src/lib/answerPipeline');

  console.log('==============================================================');
  console.log(' EGYPTX AI GUIDE — ZERO-HALLUCINATION RAG EVALUATION SUITE');
  console.log('==============================================================\n');

  let passed = 0;
  const total = 2;

  // -------------------------------------------------------------------------
  // TEST 1: Grand Egyptian Museum Official Opening Date
  // -------------------------------------------------------------------------
  const q1 = 'متى تم افتتاح المتحف المصري الكبير؟';
  console.log(`[TEST 1] Query: "${q1}"`);
  const res1 = await executeThreeStagePipeline(q1);

  console.log(` -> Retrieved Context Items: ${res1.context.items.length}`);
  console.log(` -> Supported Claims: ${res1.supportedClaims.length}`);
  console.log(` -> AI Guide Reply:\n${res1.reply}\n`);

  const hasValidDate =
    res1.reply.includes('November 1, 2025') ||
    res1.reply.includes('1 نوفمبر 2025') ||
    res1.reply.includes('١ نوفمبر ٢٠٢٥');
  const hasHallucinatedDate =
    res1.reply.includes('2023') || res1.reply.includes('16 فبراير') || res1.reply.includes('February 16');

  if (res1.context.hasVerifiedData && hasValidDate && !hasHallucinatedDate) {
    console.log('✅ [TEST 1 PASSED]: Strictly output November 1, 2025 with zero hallucinated dates.\n');
    passed++;
  } else {
    console.error('❌ [TEST 1 FAILED]: Did not meet strict GEM opening date verification.\n');
  }

  // -------------------------------------------------------------------------
  // TEST 2: Completely Fabricated Pharaoh Name (Abstention Test)
  // -------------------------------------------------------------------------
  const q2 = 'حدثني عن الملك الفرعوني زيروكسيس التاسع والتسعين (Pharaoh Zeroxes XCIV)';
  console.log(`[TEST 2] Query: "${q2}"`);
  const res2 = await executeThreeStagePipeline(q2);

  console.log(` -> Retrieved Context Items: ${res2.context.items.length}`);
  console.log(` -> Supported Claims: ${res2.supportedClaims.length}`);
  console.log(` -> AI Guide Reply:\n${res2.reply}\n`);

  const abstainedCorrectly = res2.reply.includes('لا تتوفر لدي معلومات موثقة حول هذا الموضوع حالياً.');

  if (!res2.context.hasVerifiedData && abstainedCorrectly) {
    console.log('✅ [TEST 2 PASSED]: Strictly abstained from answering about fabricated pharaoh.\n');
    passed++;
  } else {
    console.error('❌ [TEST 2 FAILED]: Did not abstain properly.\n');
  }

  console.log('==============================================================');
  console.log(` SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log('==============================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runEvaluation().catch((err) => {
  console.error('Evaluation error:', err);
  process.exit(1);
});
