const fs = require('fs');
let c = fs.readFileSync('src/components/PlannerContent.tsx', 'utf8');

const hieroglyph = `const HieroglyphText = ({ text, className }: { text: string, className?: string }) => {
  const [display, setDisplay] = React.useState(text.replace(/./g, '0'));
  
  React.useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(prev => prev.split('').map((char, idx) => {
        if (idx < iterations) return text[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 4;
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
}

`;

c = c.replace('function EgyptMap({ cities }:', hieroglyph + 'function EgyptMap({ cities }:');
fs.writeFileSync('src/components/PlannerContent.tsx', c);
