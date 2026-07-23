import fs from 'fs';

const html = fs.readFileSync('old_site.html', 'utf8');
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scripts) {
    scripts.forEach((s, i) => {
        if (s.includes('masonry') || s.includes('portfolio') || s.includes('img.src')) {
            fs.writeFileSync(`script_${i}.js`, s);
            console.log(`Saved script_${i}.js (length: ${s.length})`);
        }
    });
}
