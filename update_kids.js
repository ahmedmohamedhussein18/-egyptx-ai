const fs = require('fs');

const path = 'src/components/KidsModeContent.tsx';
let text = fs.readFileSync(path, 'utf8');

const insertionPoint = `          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#0A1628] px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-[#C9A84C] font-bold text-3xl">{profile.points}</span>
            <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">Points</span>
          </div>
        </div>`;

const newVideoSection = `          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#0A1628] px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-[#C9A84C] font-bold text-3xl">{profile.points}</span>
            <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">Points</span>
          </div>
        </div>

        {/* Welcome Video Section */}
        <div className="bg-[#1B6B93]/20 border border-[#1B6B93]/30 rounded-3xl overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C9A84C]" />
            Welcome to Kids Mode!
          </h2>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black aspect-video w-full">
            <video 
              controls 
              preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src="/videos/kids-mode-welcome.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>`;

text = text.replace(insertionPoint, newVideoSection);
fs.writeFileSync(path, text, 'utf8');
console.log('Fixed video section');
