const fs = require('fs');
let c = fs.readFileSync('src/components/KidsModeContent.tsx', 'utf8');
c = c.replace(/import React, \{ useState, useEffect, useRef \} from 'react';/, "import React, { useState, useEffect, useRef } from 'react';\nimport { useLanguage } from '@/context/LanguageContext';");
fs.writeFileSync('src/components/KidsModeContent.tsx', c);
console.log('Fixed KidsModeContent import');
