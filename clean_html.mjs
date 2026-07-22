import fs from 'fs';

try {
    console.log('Reading old_site.html...');
    let content = fs.readFileSync('old_site.html', 'utf8');
    console.log(`Original size: ${content.length} bytes`);
    
    // Replace base64 images in src attributes
    content = content.replace(/src="data:image\/[^"]+"/gi, 'src=""');
    content = content.replace(/src='data:image\/[^']+'/gi, "src=''");
    
    // Replace base64 images in url() CSS functions
    content = content.replace(/url\("data:image\/[^"]+"\)/gi, 'url("")');
    content = content.replace(/url\('data:image\/[^']+'\)/gi, "url('')");
    content = content.replace(/url\(data:image\/[^)]+\)/gi, 'url()');
    
    // Replace SVG strings if they are huge
    content = content.replace(/<svg[^>]*>.*?<\/svg>/gs, (match) => {
        if (match.length > 500) {
            return '<svg><!-- huge svg removed --></svg>';
        }
        return match;
    });

    console.log(`Cleaned size: ${content.length} bytes`);
    fs.writeFileSync('clean_old_site.html', content);
    console.log('Successfully wrote clean_old_site.html');
} catch (e) {
    console.error('Error:', e);
}
