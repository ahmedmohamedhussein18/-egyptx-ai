const fs = require('fs');
let apiContent = fs.readFileSync('src/app/api/generate-itinerary/route.ts', 'utf8');

apiContent = apiContent.replace(
  "unless explicitly selected.`\n\nREAL ATTRACTIONS DATABASE:",
  "unless explicitly selected.\n\nREAL ATTRACTIONS DATABASE:"
);
apiContent = apiContent.replace(/Budget: \$\{budget\}/, 'Budget: $${budget}');
apiContent = apiContent.replace(/That's \$\{\(budget \/ parsedTravelers\)\.toFixed\(2\)\}/, "That's $${(budget / parsedTravelers).toFixed(2)}");


fs.writeFileSync('src/app/api/generate-itinerary/route.ts', apiContent, 'utf8');
