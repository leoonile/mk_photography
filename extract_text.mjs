import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://mk-photography-eta.vercel.app/', { waitUntil: 'domcontentloaded' });
  
  // Wait a bit
  await page.waitForTimeout(2000);

  // Click on pricing
  const links = await page.$$('a, button');
  for (const link of links) {
    const text = await link.textContent();
    if (text && text.toLowerCase().includes('pricing')) {
      await link.click();
      break;
    }
  }

  await page.waitForTimeout(2000);

  // Dump the entire text of the page to a file
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('vercel_text.txt', text);

  // Dump the HTML for good measure
  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('vercel_html.txt', html);

  await browser.close();
  console.log("Done extracting vercel text.");
}

run().catch(console.error);
