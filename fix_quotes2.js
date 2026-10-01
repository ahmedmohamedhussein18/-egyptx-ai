const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');
c = c.replace(/'\{t\('([^']+)'\)\}([^']+)'/g, "t('$1') + '$2'");
fs.writeFileSync('src/components/PlannerContent.tsx', c);
