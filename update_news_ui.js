const fs = require('fs');

const path = 'src/components/NewsContent.tsx';
let text = fs.readFileSync(path, 'utf8');

const oldState = `export default function NewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);`;

const newState = `export default function NewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});`;

text = text.replace(oldState, newState);

const oldCardUI = `              <motion.div
                layout
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-[#0A1628] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#C9A84C]/50 transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] group"
              >
                {/* Category Badge & Date Header */}`;

const newCardUI = `              <motion.div
                layout
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-[#0A1628] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#C9A84C]/50 transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] group"
              >
                {/* Article Image */}
                {article.image && !imageErrors[article.id] ? (
                  <div className="w-full h-[200px] overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => setImageErrors(prev => ({ ...prev, [article.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent opacity-60"></div>
                  </div>
                ) : (
                  <div className="w-full h-[200px] bg-gradient-to-br from-[#1B6B93]/30 to-[#0A1628] flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10 opacity-60">
                      {getCategoryIcon(article.category)}
                      <span className="font-bold tracking-widest text-[#C9A84C] uppercase text-sm">{article.category}</span>
                    </div>
                  </div>
                )}
                
                {/* Category Badge & Date Header */}`;

text = text.replace(oldCardUI, newCardUI);
fs.writeFileSync(path, text, 'utf8');
console.log('Fixed NewsContent UI');
