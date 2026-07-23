import fs from 'fs';

const html = fs.readFileSync('old_site.html', 'utf8');

const regex = /<div[^>]*class="[^"]*(?:masonry-item|portfolio-item)[^"]*"[^>]*data-category="([^"]+)"[\s\S]*?(?:data-src|src)="([^"]+)"/g;
const items = [];
let match;
while ((match = regex.exec(html)) !== null) {
  items.push({
    category: match[1],
    src: match[2]
  });
}

console.log(`Found ${items.length} items with regex 1`);
console.log(items.slice(0, 3));

const categoryRegex = /data-category="([^"]+)"[\s\S]*?(?:background-image:\s*url\(['"]([^'"]+)['"]\)|src="([^"]+)"|data-src="([^"]+)")/g;
const items2 = [];
while ((match = categoryRegex.exec(html)) !== null) {
    items2.push({
        category: match[1],
        src: match[2] || match[3] || match[4]
    });
}
console.log(`Found ${items2.length} items with regex 2`);
if (items2.length > 0) {
    console.log(items2.slice(0, 3));
} else {
    // try searching for anything looking like an image inside a masonry item
    const masonryRegex = /class="[^"]*masonry-item[^"]*"[\s\S]*?<\/div>/g;
    const blocks = html.match(masonryRegex);
    if (blocks) {
        console.log(`Found ${blocks.length} masonry blocks. Here is the first one:`);
        console.log(blocks[0].substring(0, 500));
    } else {
        console.log('No masonry blocks found.');
    }
}
