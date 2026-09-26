const fs = require('fs');
const p = 'src/components/CommandCenterContent.tsx';
let t = fs.readFileSync(p, 'utf8');

// Header modifications
t = t.replace(
  /<header className="w-full bg-\[\#0a0f1e\]\/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">/g,
  `<header className="w-full bg-[#0a0f1e]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg relative border-b border-[#C9A84C]/20 overflow-hidden">
        {/* Map Silhouette Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/images/egypt-map.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        
        {/* Subtle Egyptian Flag Accent on top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600/50"></div>
          <div className="flex-1 bg-white/50"></div>
          <div className="flex-1 bg-black/50"></div>
        </div>`
);

t = t.replace(
  /<h1 className="text-2xl md:text-3xl font-bold text-\[\#C9A84C\] absolute left-1\/2 -translate-x-1\/2 hidden md:block">\s*U\.OUO O U,U,USO O_Oc O U,U\^OU\+US U,U,O3USO O-Oc\s*<\/h1>/g,
  `<h1 className="text-xl md:text-2xl font-bold text-[#C9A84C] absolute left-1/2 -translate-x-1/2 hidden md:block z-10">
          مركز القيادة الوطني - جمهورية مصر العربية
        </h1>`
);

t = t.replace(
  /<span className="text-xs text-\[\#C9A84C\]">\{profile\.role === 'national_admin' \? 'U\.O_USO O U,U\+O,O U\.' : 'U\.O'OU\?'\}<\/span>/g,
  `<span className="text-[10px] text-white bg-gradient-to-r from-red-600 via-yellow-500 to-black px-2 py-0.5 rounded-full font-bold shadow-sm">وطني</span>`
);

// We need to decode the Arabic garbled text to proper Arabic strings, but the regex above might fail if the encoding in stdout is just terminal gibberish. Let's just use string replace carefully or rewrite the whole header block.
