const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Mobile
  const mobile = await browser.newContext({ ...devices['iPhone 13'] });
  const mpage = await mobile.newPage();
  const errors = [];
  mpage.on('pageerror', (e) => errors.push(e.message));
  await mpage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await mpage.screenshot({ path: 'C:\\Users\\david\\Desktop\\Flourishing-Souls-Foundation-Project\\_nav_mobile_closed.png' });

  await mpage.click('[data-testid="headerMobileNavToggle"]');
  await mpage.waitForTimeout(300);
  await mpage.screenshot({ path: 'C:\\Users\\david\\Desktop\\Flourishing-Souls-Foundation-Project\\_nav_mobile_open.png' });

  // tap "Get Involved" to expand (scoped to the mobile menu, desktop nav also has one)
  await mpage.locator('[data-testid="headerMobileNavMenu"] >> text=Get Involved').click();
  await mpage.waitForTimeout(300);
  await mpage.screenshot({ path: 'C:\\Users\\david\\Desktop\\Flourishing-Souls-Foundation-Project\\_nav_mobile_expanded.png' });

  // tap backdrop (below the panel's bottom edge) to close
  const panelBox = await mpage.locator('[data-testid="headerMobileNavMenu"]').boundingBox();
  console.log('panel box:', panelBox);
  const clickX = panelBox.x + 5;
  const clickY = panelBox.y + panelBox.height + 40;
  const elAtPoint = await mpage.evaluate(
    ([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return el ? el.outerHTML.slice(0, 200) : null;
    },
    [clickX, clickY]
  );
  console.log('element at click point:', elAtPoint);
  await mpage.mouse.click(clickX, clickY);
  await mpage.waitForTimeout(300);
  const stillOpen = await mpage.locator('[data-testid="headerMobileNavMenu"]').evaluate(
    (el) => getComputedStyle(el).opacity
  );
  console.log('Mobile menu opacity after backdrop tap (should be 0):', stillOpen);
  console.log('Page errors:', errors.length ? errors : 'none');
  await mobile.close();

  // Desktop
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dpage = await desktop.newPage();
  await dpage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await dpage.hover('text=Get Involved');
  await dpage.waitForTimeout(300);
  await dpage.screenshot({ path: 'C:\\Users\\david\\Desktop\\Flourishing-Souls-Foundation-Project\\_nav_desktop_hover.png' });
  await desktop.close();

  await browser.close();
})();
