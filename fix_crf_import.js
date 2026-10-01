const fs = require('fs');
let crf = fs.readFileSync('src/components/CraftsContent.tsx', 'utf8');
if (!crf.includes('useLanguage')) {
  // Use regex to catch varying line endings or spaces
  crf = crf.replace(/import \{ AlertCircle, Filter, Store \} from 'lucide-react';/g, "import { AlertCircle, Filter, Store } from 'lucide-react';\nimport { useLanguage } from '@/context/LanguageContext';");
  fs.writeFileSync('src/components/CraftsContent.tsx', crf);
  console.log("Injected useLanguage");
}
