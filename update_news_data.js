const fs = require('fs');

const path = 'src/data/egypt-news.ts';
let text = fs.readFileSync(path, 'utf8');

const replacements = [
  { id: 1, img: '/news/gem.jpg' },
  { id: 2, img: '/news/luxor-tomb.jpg' },
  { id: 3, img: '/news/tourists.jpg' },
  { id: 4, img: '/news/saqqara.jpg' },
  { id: 5, img: '/news/crafts.jpg' },
  { id: 6, img: '/news/karnak.jpg' },
  { id: 7, img: '/news/alexandria.jpg' },
  { id: 8, img: '/news/chariots.jpg' },
  { id: 9, img: '/news/white-desert.jpg' },
  { id: 10, img: '/news/papyri.jpg' },
  { id: 11, img: '/news/philae.jpg' },
  { id: 12, img: '/news/siwa.jpg' }
];

let newText = text;

replacements.forEach(item => {
  const regex = new RegExp("(id:\\s*" + item.id + ",[\\s\\S]*?)image:\\s*null", 'g');
  newText = newText.replace(regex, "$1image: '" + item.img + "'");
});

fs.writeFileSync(path, newText, 'utf8');
console.log('Fixed news data');
