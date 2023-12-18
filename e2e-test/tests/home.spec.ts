import { test, expect } from '@playwright/test';
const { chromium } = require("playwright");

test('text page link', async ({ page }) => {
    await page.goto('https://main--aem-sample--vietpfizer.hlx.page/');
  
    // Click the Text Page link.
    await page.getByRole('link', { name: 'Text Page' }).click();
});

test('headings link', async ({ page }) => {
    await page.goto('https://main--aem-sample--vietpfizer.hlx.page/');
  
    // Click the Headings Page link.
    await page.getByRole('link', { name: 'Headings Page' }).click();
  
    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', { name: 'Example Heading 1' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Example Heading 1' })).toContainText("Example Heading 1")
    await expect(page.getByRole('heading', { name: 'Example Heading 2' })).toBeVisible();
    
    // get text of components
    const h1 = await page.locator('//h1[@id="example-heading-1"]').textContent();
    console.log(h1);
});