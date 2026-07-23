const fs = require('fs');
const html = fs.readFileSync('old_site.html', 'utf8');

// Find all matches for data-category and data-src (lazy-loaded images)
const items = [];
const regex = /class="[^"]*(?:masonry-item|portfolio-item)[^"]*"[^>]*data-category="([^"]+)"[\s\S]*?(?:data-src|src)="([^"]+)"/g;

let match;
while ((match = regex.exec(html)) !== null) {
  items.push({
    category: match[1],
    src: match[2]
  });
}

console.log(`Found ${items.length} items with regex 1`);
console.log(items.slice(0, 3));

// Alternatively, let's just search for any element with data-category
const categoryRegex = /data-category="([^"]+)"[\s\S]*?(?:background-image:\s*url\(['"]([^'"]+)['"]\)|src="([^"]+)"|data-src="([^"]+)")/g;
const items2 = [];
while ((match = categoryRegex.exec(html)) !== null) {
    items2.push({
        category: match[1],
        src: match[2] || match[3] || match[4]
    });
}
console.log(`Found ${items2.length} items with regex 2`);
console.log(items2.slice(0, 3));
