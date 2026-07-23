const fs = require('fs');
const path = require('path');

const configDataRaw = fs.readFileSync('config_data.json', 'utf8');
let CONFIG;
eval('CONFIG = ' + configDataRaw);

const portfolio = CONFIG.portfolio;
const outDir = path.join(__dirname, 'mk_photography_next', 'public', 'images', 'portfolio');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const portfolioData = [];

portfolio.forEach((item, index) => {
  const src = item.src;
  const category = item.category;
  
  if (src.startsWith('data:image/')) {
    // Extract base64 data
    const matches = src.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      let ext = matches[1];
      if (ext === 'jpeg') ext = 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');
      const filename = `portfolio-${index + 1}.${ext}`;
      const filepath = path.join(outDir, filename);
      fs.writeFileSync(filepath, buffer);
      
      portfolioData.push({
        src: `/images/portfolio/${filename}`,
        category: category
      });
    } else {
      console.log(`Failed to parse base64 for item ${index}`);
    }
  } else {
    // It's a regular URL or path
    portfolioData.push({
      src: src,
      category: category
    });
  }
});

// Write the data file for Next.js
const dataFileContent = `export const portfolioData = ${JSON.stringify(portfolioData, null, 2)};
`;

const dataFilePath = path.join(__dirname, 'mk_photography_next', 'components', 'portfolioData.ts');
fs.writeFileSync(dataFilePath, dataFileContent);

console.log(`Successfully extracted ${portfolioData.length} images to ${outDir}`);
console.log(`Created data file at ${dataFilePath}`);
