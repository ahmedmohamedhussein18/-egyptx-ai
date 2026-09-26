const fs = require('fs');
const path = 'src/components/DestinationsSection.tsx';
let text = fs.readFileSync(path, 'utf8');

// Update Siwa image
text = text.replace(
  /image:\s*'\/images\/siwa.jpg',/g,
  "image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80',"
);

// Inject imageErrors state
const stateOld = "  const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);";
const stateNew = "  const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);\n  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});";
text = text.replace(stateOld, stateNew);

// Update image rendering
const renderOld = `              {/* Visual Top Half */}
              <div className="h-[60%] w-full overflow-hidden relative">
                <div className="absolute inset-0 transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transform origin-center group-hover:brightness-110">
                  <Image 
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent"></div>
              </div>`;

const renderNew = `              {/* Visual Top Half */}
              <div className="h-[60%] w-full overflow-hidden relative bg-gradient-to-br from-[#C9A84C] to-[#1B6B93]">
                {!imageErrors[dest.id] && (
                  <div className="absolute inset-0 transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-105 transform origin-center group-hover:brightness-110">
                    <Image 
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover"
                      onError={() => setImageErrors(prev => ({ ...prev, [dest.id]: true }))}
                    />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent"></div>
              </div>`;

text = text.replace(renderOld, renderNew);

fs.writeFileSync(path, text, 'utf8');
console.log("Updated DestinationsSection");
