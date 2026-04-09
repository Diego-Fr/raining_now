import { test } from '@playwright/test';

const sizes = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'fullhd', width: 1920, height: 1080 },
  { name: 'tv_hd', width: 1280, height: 720 },
  { name: 'tv_1366', width: 1366, height: 768 },
  { name: 'tv_fullhd', width: 1920, height: 1080 },
  { name: 'tv_4k', width: 3840, height: 2160 },
];

test('screenshots responsivos', async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize({
      width: size.width,
      height: size.height,
    });

    await page.goto('http://localhost:5174/sibh/chuva_agora/');

    // espera carregar (ajusta conforme sua app)
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `screenshots/${size.name}.png`,
      fullPage: true, // pega a página inteira
    });

    console.log(`✔ Screenshot: ${size.name}`);
  }
});