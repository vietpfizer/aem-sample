import dotenv from "dotenv";
dotenv.config();

const emailGG = process.env.EMAILGG || "";
const passGG = process.env.PASSGG || "";
const secretGG = process.env.SECRETGG || "";
import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import BasePage from '@pom/BasePage';
import TextPage from '@pom/block/boilerplate/TextPage';
import ListPage from '@pom/ListPage';
import GoogleApi from '@api/GoogleApi';
import GooglePage from '@pom/GooglePage';
import googleDocData  from '@data/google_doc_data.json' assert { type: 'json' }; ;
const googleApi= new GoogleApi();
const utilities = new Utilities();
const base =new BasePage();
const textPage =new TextPage();
const listPage =new ListPage();
const googlePage = new GooglePage();

async function checkTagExistInBlock(page,blockLocator,tag) {
  for(let i=0; i< tag.length;i++){
    expect(await base.isDisplayed(page,blockLocator+"//"+tag[i])).toBe(true);
  }
}
let boilerplateFolderInfo, filesBoilerlate;
test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await googlePage.setAccessToken(page,emailGG,passGG,secretGG);
    boilerplateFolderInfo = await googleApi.getFolderDrive("Boilerplate");
    filesBoilerlate = await googleApi.getFilesInFolder(boilerplateFolderInfo[0]["id"]);
});

test('text', async ({ page }) => {
    const fileId = (filesBoilerlate.filter(x => x.name === "text"))[0]["id"];
    const content = await googleApi.getContentGGDoc(fileId);
    const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content);
    const block1GGdoc = convertGGdoc[0];
    const block2GGdoc = convertGGdoc[2];

    await page.goto("/Block/boilerplate/text");
    const blockTag1 =  await base.getTagHtml(page,textPage.block1);
    const contentBlock1 =  await base.getText(page,textPage.block1);
    const blockTag2 =  await base.getTagHtml(page,textPage.block2);
    // Compare 
    //Compare block 1
    expect(blockTag1).toBe(block1GGdoc.tag);
    expect(contentBlock1).toBe(block1GGdoc.elements[0].content);
    const elementsBlock1 =block1GGdoc.elements;
    for(let i=0; i< elementsBlock1.length;i++){
        if(JSON.stringify(elementsBlock1[i].textStyle.tag)!="[]"){
            await checkTagExistInBlock(page,textPage.block1,elementsBlock1[i].textStyle.tag);
        }
    }
    // // Compare block 2
    expect(blockTag2).toBe(block2GGdoc.tag);
    const elementsBlock2 =block2GGdoc.elements;
    for(let i=0; i< elementsBlock2.length;i++){
        if(JSON.stringify(elementsBlock2[i].textStyle.tag)!="[]"){
            await checkTagExistInBlock(page,textPage.block2,elementsBlock2[i].textStyle.tag);
        }
    }
});

test('cards', async ({ page }) => {
    const fileId = (filesBoilerlate.filter(x => x.name === "cards"))[0]["id"];
    const content = await googleApi.getContentGGDoc(fileId);
    const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content);
    await page.goto("/Block/boilerplate/cards");
});

// test('code', async ({ page }) => {

// });
// test('columns', async ({ page }) => {

// });
// test('headings', async ({ page }) => {

// });
// test('hero', async ({ page }) => {

// });

// test('icons', async ({ page }) => {

// });

// test('images', async ({ page }) => {

// });

// test('link', async ({ page }) => {

// });

// test('list', async ({ page }) => {

// });

// test('meta data', async ({ page }) => {

// });

// test('sections', async ({ page }) => {

// });

// test('setion-metadata', async ({ page }) => {

// });

// test('button', async ({ page }) => {

// });

