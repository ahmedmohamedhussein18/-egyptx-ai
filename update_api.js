const fs = require('fs');

const path = 'src/app/api/generate-itinerary/route.ts';
let text = fs.readFileSync(path, 'utf8');

text = text.replace("avoidCrowds\n    } = body;", "avoidCrowds,\n      language\n    } = body;");

text = text.replace("    const systemPrompt = `You are EgyptX AI,", "    const systemPrompt = `You are EgyptX AI, a highly advanced travel planner.\\nCRITICAL REQUIREMENT: You MUST respond entirely in the language corresponding to language code: \${language || 'en'}. Do not use any other language.\\n");

fs.writeFileSync(path, text, 'utf8');
console.log('Updated API itinerary');
