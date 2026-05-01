/* SVG → PNG 변환 스크립트
 * - 입력: ../assets/{logo,favicon,og-image}.svg
 * - 출력: ./{name}-{size}.png  (size: 256, 512, 1024)
 * - 종횡비 보존, 너비 기준
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
const OUT_DIR = __dirname;

const SOURCES = [
  { file: 'logo.svg',     vbW: 400, vbH: 100 },  // 4 : 1
  { file: 'favicon.svg',  vbW: 64,  vbH: 64  },  // 1 : 1
  { file: 'og-image.svg', vbW: 1200, vbH: 630 }, // 1.905 : 1
];

const SIZES = [256, 512, 1024];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const src of SOURCES) {
      const svgRaw = fs.readFileSync(path.join(ASSETS_DIR, src.file), 'utf8');
      for (const targetW of SIZES) {
        const targetH = Math.round((targetW * src.vbH) / src.vbW);
        const page = await browser.newPage();
        await page.setViewport({
          width: targetW,
          height: targetH,
          deviceScaleFactor: 1,
        });

        const html = `<!DOCTYPE html><html><head><style>
          html,body{margin:0;padding:0;background:transparent;}
          svg{display:block;width:${targetW}px;height:${targetH}px;}
        </style></head><body>${svgRaw}</body></html>`;

        await page.setContent(html, { waitUntil: 'networkidle0' });
        // Force SVG to fit viewport explicitly (override any width/height attrs)
        await page.evaluate((w, h) => {
          const svg = document.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', w);
            svg.setAttribute('height', h);
            svg.style.width = w + 'px';
            svg.style.height = h + 'px';
          }
        }, targetW, targetH);

        const baseName = src.file.replace(/\.svg$/, '');
        const outPath = path.join(OUT_DIR, `${baseName}-${targetW}.png`);
        await page.screenshot({
          path: outPath,
          omitBackground: true,
          clip: { x: 0, y: 0, width: targetW, height: targetH },
        });
        await page.close();
        console.log(`✓ ${baseName}-${targetW}.png  (${targetW}×${targetH})`);
      }
    }
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
