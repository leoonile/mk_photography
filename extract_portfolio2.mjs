import fs from 'fs';

const html = fs.readFileSync('old_site.html', 'utf8');

// Find JSON or JS objects in the file
const scriptMatch = html.match(/const\s+portfolioImages\s*=\s*(\[[\s\S]*?\]);/);
if (scriptMatch) {
    console.log("Found portfolioImages array length:", scriptMatch[1].length);
    console.log("Snippet:", scriptMatch[1].substring(0, 500));
} else {
    // try to find any array of objects with category
    const categoryMatch = html.match(/\[[^\]]*category:\s*['"]([^'"]+)['"][^\]]*\]/);
    if (categoryMatch) {
        console.log("Found category array");
        console.log(categoryMatch[0].substring(0, 500));
    } else {
        // Just extract the script tags
        const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
        if (scripts) {
            scripts.forEach((s, i) => {
                if (s.includes('category') || s.includes('portfolio') || s.includes('mkImg')) {
                    console.log(`Script ${i} matches:`, s.substring(0, 500));
                }
            });
        }
    }
}
