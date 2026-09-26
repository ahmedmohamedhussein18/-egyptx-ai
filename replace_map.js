const fs = require('fs');

const targetFile = 'src/components/CairoMap.tsx';
let c = fs.readFileSync(targetFile, 'utf8');

c = c.replace(
  /<TileLayer[\s\S]*?attribution='\&copy; <a href="https:\/\/carto\.com\/attributions">CARTO<\/a>'[\s\S]*?url="https:\/\/\{s\}\.basemaps\.cartocdn\.com\/dark_all\/\{z\}\/\{x\}\/\{y\}\{r\}\.png"[\s\S]*?\/>/,
  `<TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />`
);

fs.writeFileSync(targetFile, c);
console.log('Replaced Carto with OpenStreetMap');
