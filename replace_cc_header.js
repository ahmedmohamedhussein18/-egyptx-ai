const fs = require('fs');
const p = 'src/components/CommandCenterContent.tsx';
let t = fs.readFileSync(p, 'utf8');

const startTag = '<header className="w-full';
const endTag = '</header>';

const startIndex = t.indexOf(startTag);
const endIndex = t.indexOf(endTag) + endTag.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newHeader = `<header className="w-full bg-[#0a0f1e]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg relative border-b border-[#C9A84C]/20 overflow-hidden">
        {/* Map Silhouette Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/images/egypt-map.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        
        {/* Subtle Egyptian Flag Accent on top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-red-600/50"></div>
          <div className="flex-1 bg-white/50"></div>
          <div className="flex-1 bg-black/50"></div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="text-[#C9A84C] text-3xl">🦅</div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-wide text-white">EgyptX AI</span>
            <span className="text-[10px] text-[#C9A84C]">National Smart Tourism Ecosystem</span>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-[#C9A84C] absolute left-1/2 -translate-x-1/2 hidden md:block z-10 drop-shadow-md">
          مركز القيادة الوطني - جمهورية مصر العربية
        </h1>

        <div className="flex items-center gap-6 relative z-10">
          <button className="relative p-2 text-gray-300 hover:text-[#C9A84C] transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-bold text-sm text-white">{profile.firstName} {profile.lastName}</span>
              <span className="text-[10px] text-white bg-gradient-to-r from-red-600 via-yellow-500 to-black px-2 py-0.5 rounded-full font-bold shadow-sm mt-0.5">وطني</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1B6B93] border-2 border-[#C9A84C] flex items-center justify-center overflow-hidden">
              <span className="text-lg font-bold text-white">{profile.firstName?.charAt(0)}</span>
            </div>
          </div>
        </div>
      </header>`;

  t = t.substring(0, startIndex) + newHeader + t.substring(endIndex);
  fs.writeFileSync(p, t);
  console.log('Successfully replaced header in CommandCenterContent.tsx');
} else {
  console.log('Could not find header');
}
