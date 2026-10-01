const fs = require('fs');

function fix(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  c = c.replace(/'\{t\('([^']+)'\)\}'/g, "t('$1')");
  fs.writeFileSync(filePath, c);
}

fix('src/components/PlannerContent.tsx');
