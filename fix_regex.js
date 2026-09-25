const fs = require('fs');
let text = fs.readFileSync('src/components/ExploreContent.tsx', 'utf8');
text = text.replace(/\[\\\\(\\\\) -'\]/g, "[()'-]");
text = text.replace(/replace\(\/\[\\\(\\v?\)-'\]\/g/g, "replace(/[()'-]/g");
text = text.replace(/replace\(\/\[\\\\?\\\\?\\(\\v?\\\\?\\\\?\\)-'\]\/g/g, "replace(/[()'-]/g");
text = text.replace(/replace\(\/\[\\(\\)-'\]\/g/g, "replace(/[()'-]/g");
fs.writeFileSync('src/components/ExploreContent.tsx', text, 'utf8');
