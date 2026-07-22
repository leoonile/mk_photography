import { chromium } from 'playwright';
import fs from 'fs';

async function extractPricing() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigating to https://mk-photography-eta.vercel.app/");
  await page.goto('https://mk-photography-eta.vercel.app/', { waitUntil: 'load', timeout: 60000 });

  console.log("Clicking Pricing...");
  const pricingLink = await page.getByRole('link', { name: /pricing/i });
  if (await pricingLink.count() > 0) {
    await pricingLink.first().click();
    await page.waitForLoadState('load');
  } else {
    console.log("Could not find Pricing link, trying /pricing");
    await page.goto('https://mk-photography-eta.vercel.app/pricing', { waitUntil: 'load', timeout: 60000 });
  }

  // Wait a bit just in case
  await page.waitForTimeout(3000);

  const dom = await page.evaluate(() => {
    function getImportantStyles(node) {
        const computed = window.getComputedStyle(node);
        const res = {};
        const props = ['display', 'flexDirection', 'gap', 'width', 'height', 'padding', 'backgroundColor', 'color', 'fontSize', 'fontWeight', 'borderRadius', 'border'];
        for (const p of props) {
            if (computed[p] && computed[p] !== 'none' && computed[p] !== '0px' && computed[p] !== 'auto' && computed[p] !== 'block' && computed[p] !== 'rgba(0, 0, 0, 0)') {
                res[p] = computed[p];
            }
        }
        return res;
    }

    function mapDOM(node, depth = 0) {
      if (depth > 12) return '...';
      if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          return text ? text : null;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null;
      if (node.tagName === 'SVG' || node.tagName === 'PATH') return '<svg>';
      if (node.tagName === 'IMG') return `<img src="${node.src}">`;
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'NOSCRIPT') return null;
      
      const isImportant = getImportantStyles(node);

      const children = Array.from(node.childNodes)
        .map(c => mapDOM(c, depth + 1))
        .filter(Boolean);
        
      return {
          tag: node.tagName,
          className: node.className,
          styles: isImportant,
          children: children.length > 0 ? children : undefined
      };
    }
    
    // Find a section that contains "Pricing" or "Packages" or "$"
    const sections = Array.from(document.querySelectorAll('section, div'));
    const pricingSection = sections.find(s => s.textContent.includes('Pricing') || s.textContent.includes('$'));
    
    return mapDOM(pricingSection || document.body);
  });

  fs.writeFileSync('pricing_dom.json', JSON.stringify(dom, null, 2));
  await page.screenshot({ path: 'pricing_screenshot.png', fullPage: true });

  await browser.close();
  console.log("Extraction completed.");
}

extractPricing().catch(console.error);
