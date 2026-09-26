const fs = require('fs');

// Update UI
const uiPath = 'src/components/AIGuideContent.tsx';
let uiText = fs.readFileSync(uiPath, 'utf8');

if (!uiText.includes('useLanguage')) {
  uiText = uiText.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { useLanguage } from '@/context/LanguageContext';");
  uiText = uiText.replace("export default function AIGuideContent() {", "export default function AIGuideContent() {\n  const { t, locale } = useLanguage();");
}

uiText = uiText.replace("context: identificationResult", "context: identificationResult, language: locale");
uiText = uiText.replace(">AI Vision Guide<", ">{t('aiGuide.title')}<");
uiText = uiText.replace(">Snap a photo of any monument or artifact in Egypt.<", ">{t('aiGuide.snap')}<");
uiText = uiText.replace(">Identify with AI<", ">{t('aiGuide.identify')}<");
uiText = uiText.replace(">HIGH CONFIDENCE<", ">{t('aiGuide.high')}<");
uiText = uiText.replace(">MEDIUM CONFIDENCE<", ">{t('aiGuide.med')}<");
uiText = uiText.replace(">LOW CONFIDENCE<", ">{t('aiGuide.low')}<");
uiText = uiText.replace(">General AI Description<", ">{t('aiGuide.desc')}<");
uiText = uiText.replace(">Verified Location<", ">{t('aiGuide.verified')}<");
uiText = uiText.replace(">View Full Details<", ">{t('aiGuide.viewFull')}<");

fs.writeFileSync(uiPath, uiText, 'utf8');

// Update API
const apiPath = 'src/app/api/ai-guide/chat/route.ts';
let apiText = fs.readFileSync(apiPath, 'utf8');

apiText = apiText.replace("const { messages, context } = await req.json();", "const { messages, context, language } = await req.json();");
apiText = apiText.replace("5. Provide your answers in English unless the user explicitly speaks in another language.", "5. CRITICAL: You must answer entirely in the language corresponding to language code: ${language || 'en'}. Do not use any other language.");

fs.writeFileSync(apiPath, apiText, 'utf8');
console.log('Updated AIGuide');
