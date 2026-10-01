const fs = require('fs');

const missingData = {
  crafts: {
    cat: {
      papyrus: "Papyrus",
      wood: "Woodwork",
      traditional: "Traditional"
    },
    prod: {
      "1": "Hand-painted Fayoum Pottery",
      "2": "Authentic Papyrus Scroll",
      "3": "Akhmim Woven Tapestry",
      "4": "Silver Lotus Pendant",
      "5": "Mother of Pearl Inlaid Box",
      "6": "Traditional Alabaster Vase",
      "7": "Handwoven Nubian Basket",
      "8": "Gold Cartouche"
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

const f = 'messages/en.json';
let data = JSON.parse(fs.readFileSync(f, 'utf8'));
deepMerge(data, missingData);
fs.writeFileSync(f, JSON.stringify(data, null, 2));

console.log('Successfully merged product English keys!');
