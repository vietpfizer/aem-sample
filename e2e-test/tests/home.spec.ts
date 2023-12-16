import { test, expect } from '@playwright/test';
const { chromium } = require("playwright");

test('has title aem', async ({ page }) => {
    await page.goto('https://main--aem-sample--vietpfizer.hlx.page/');
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/AEM Boilerplate/);
  });

test('text page link', async ({ page }) => {
    await page.goto('https://main--aem-sample--vietpfizer.hlx.page/');
  
    // Click the get started link.
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

test('Get content from google doc (public)', async () => {
    const browser = await chromium.launch({
        headless: false,
        args: ["--disable-dev-shm-usage"],
    });
    const context = await browser.newContext({});
    const page = await context.newPage();
    const navigationPromise = page.waitForNavigation({
        waitUntil: "domcontentloaded",
    });
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
        "https://docs.google.com/document/d/1qoLZ72OS_4PBnKjrbpIX80bN7f2-XMvU4KYh2u2EWuM/edit#heading=h.cdl7pm39dblm"
    );
    const doc_content = await page.locator('.kix-rotatingtilemanager').textContent();
    console.log('content:' ,doc_content);
    
    await page.waitForTimeout(3000);
    await browser.close();
    })

// *****************
test('Get content from google doc (private)', async () => {
    // login
    const browser = await chromium.launch({
        headless: false,
        args: ["--disable-dev-shm-usage"],
    });
    const context = await browser.newContext({});
    const page = await context.newPage();
    const navigationPromise = page.waitForNavigation({
        waitUntil: "domcontentloaded",
    });
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
        "https://docs.google.com/document/d/1L4L4gazIwST_hOr-Z8YpdFh5V7Zip6fr_Gm1-0-HyOM/edit#heading=h.cdl7pm39dblm"
    );
    await navigationPromise;
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "");
    await page.click("#identifierNext");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', "");
    await page.waitForSelector("#passwordNext", { visible: true });
    await page.click("#passwordNext");
    await page.waitForTimeout(5000);
    await navigationPromise;
    
    // get content
    const doc_content = await page.locator('#docs-editor').textContent();
    console.log('content: ' ,doc_content);
    
    // extract content from google doc that contains its format

    // Teardown
    await browser.close();
})


import { auth } from 'google-auth-library';
test('get content', async ({ request}) => {
    // const api_method = 'https://docs.googleapis.com/v1/documents/{documentId}'
    const SCOPES = 'https://www.googleapis.com/auth/documents.readonly'
    const DISCOVERY_DOC = 'https://docs.googleapis.com/$discovery/rest?version=v1'
    const DOCUMENT_ID = "1qoLZ72OS_4PBnKjrbpIX80bN7f2-XMvU4KYh2u2EWuM";
    const response = await request.get('https://content-docs.googleapis.com/v1/documents/1qoLZ72OS_4PBnKjrbpIX80bN7f2-XMvU4KYh2u2EWuM?suggestionsViewMode=DEFAULT_FOR_CURRENT_ACCESS', {
        headers: {
            'Authorization': "Bearer ya29.a0AfB_byAZuIroW5AWXNmkk_Y0csRmljwQS3cwGf3nCZmfBnleDuxnn9lRSSiOrfPXv1vIbZmifrNKNHLSsg5-42iAKbzx5gwqo-sHodvwcP-X97qu7toagYVSnUObeUvs0tavOIE54kmjg-7HWU-7UKUhfYu3cNHSBYjXayckqlQbpQaCgYKAfMSARESFQHGX2MiPiV8_gj0DI2gfMvHbyIudg0181",
        }, 
    });
    console.log('11111111',await response.json());
    const a = response.json();
    console.log('*********', await a['body']);
    
    
})
