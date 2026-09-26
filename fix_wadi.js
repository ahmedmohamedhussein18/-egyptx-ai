const fs = require('fs');

let hidden = fs.readFileSync('src/components/HiddenEgyptContent.tsx', 'utf8');
hidden = hidden.replace(
  /if \(name\.includes\('white desert'\)\) \{\s*return <Image src="\/images\/White Deserttt\.jpg" alt=\{name_en\} fill className="object-cover" \/>;\s*\}/,
  `if (name.includes('white desert')) {
    return <Image src="/images/White Deserttt.jpg" alt={name_en} fill className="object-cover" />;
  }

  if (name.includes('wadi el hitan')) {
    return <Image src="/images/Wadi El Hitannn.jpg" alt={name_en} fill className="object-cover" />;
  }`
);
fs.writeFileSync('src/components/HiddenEgyptContent.tsx', hidden);
console.log('Fixed Wadi El Hitan in HiddenEgyptContent');
