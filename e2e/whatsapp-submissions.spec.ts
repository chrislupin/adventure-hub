import { expect, test, type Page } from '@playwright/test';

const whatsappUrl = 'https://wa.me/254711851915?text=Hello%20Adventure%20Hub';

async function recordAutomaticOpens(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__whatsappOpenUrls', { value: [], writable: false });
    window.open = ((url?: string | URL) => {
      window.__whatsappOpenUrls.push(String(url));
      return null;
    }) as typeof window.open;
  });
}

async function expectOneAutomaticOpen(page: Page) {
  await expect.poll(() => page.evaluate(() => window.__whatsappOpenUrls)).toEqual([whatsappUrl]);
}

test('a saved inquiry opens WhatsApp once, retains its reference, and provides a manual fallback', async ({ page }) => {
  await recordAutomaticOpens(page);
  await page.route('**/api/inquiries', (route) => route.fulfill({
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({ reference: 'AHI-20261018-ABC12345', whatsappUrl }),
  }));
  await page.goto('/booking?service=quad-biking');
  await page.getByLabel('Your name').fill('Ada Lovelace');
  await page.getByLabel('Email address').fill('ada@example.test');
  await page.getByRole('button', { name: 'Submit inquiry' }).click();

  await expect(page.getByText('AHI-20261018-ABC12345')).toBeVisible();
  await expectOneAutomaticOpen(page);
  const fallback = page.getByRole('link', { name: /continue to whatsapp/i });
  await expect(fallback).toHaveAttribute('href', whatsappUrl);
  await expect(fallback).toBeVisible();
  await page.context().route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: 'WhatsApp fallback test' }));
  const fallbackPagePromise = page.waitForEvent('popup');
  await fallback.click();
  const fallbackPage = await fallbackPagePromise;
  await expect(fallbackPage).toHaveURL(whatsappUrl);
  await fallbackPage.close();
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
});

test('a saved quotation request opens WhatsApp once and retains its reference', async ({ page }) => {
  await recordAutomaticOpens(page);
  await page.route('**/api/quotations', (route) => route.fulfill({
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({ reference: 'AHR-20261018-ABC12345', whatsappUrl }),
  }));
  await page.goto('/transport');
  await page.getByLabel('Your name').fill('Grace Hopper');
  await page.getByLabel('Phone number').fill('+254700000000');
  await page.getByLabel('Pickup location').fill('Nairobi CBD');
  await page.getByLabel('Destination').fill('Nanyuki');
  await page.getByRole('button', { name: 'Request quotation' }).click();

  await expect(page.getByText('AHR-20261018-ABC12345')).toBeVisible();
  await expectOneAutomaticOpen(page);
  await expect(page.getByRole('link', { name: /continue to whatsapp/i })).toHaveAttribute('href', whatsappUrl);
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= window.innerWidth)).toBe(true);
});

declare global {
  interface Window {
    __whatsappOpenUrls: string[];
  }
}
