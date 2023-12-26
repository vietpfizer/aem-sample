import dotenv from "dotenv";
dotenv.config();

const emailGG = process.env.EMAILGG || "";
const passGG = process.env.PASSGG || "";
const secretGG = process.env.SECRETGG || "";
import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import BasePage from '@pom/BasePage';
import TextPage from '@pom/block/boilerplate/TextPage';
import CardsPage from '@pom/block/boilerplate/CardsPage';
import ListPage from '@pom/ListPage';
import PicturePage from "@pom/block/boilerplate/PicturePage";
import GoogleApi from '@api/GoogleApi';
import GooglePage from '@pom/GooglePage';
const googleApi= new GoogleApi();
const utilities = new Utilities();
const base =new BasePage();
const cardsPage = new CardsPage();
const textPage = new TextPage();
const listPage =new ListPage();
const picturePage = new PicturePage();
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
    // Compare block 2
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
    const content:any = await googleApi.getContentGGDoc(fileId);
    const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content);

    const cardGGdoc = convertGGdoc.filter(x=>x.tag=="div");
    const card1GGdoc = cardGGdoc[0];
    const elementsCard1doc = cardGGdoc[0].elements;

    const card2GGdoc = cardGGdoc[1];
    const elementsCard2doc = cardGGdoc[1].elements;

    await page.goto("/Block/boilerplate/cards");
    const blockTagCard1 =  await base.getTagHtml(page,cardsPage.block1);
    const blockTagUl1 =  await base.getTagHtml(page,cardsPage.block1+"//ul");
    const countLi1 =  await base.count(page,cardsPage.block1+"//li");
    // Compare 
    // block 1
    expect(blockTagCard1).toBe(card1GGdoc.tag);
    expect(blockTagUl1).toBe(elementsCard1doc.tag);
    expect(countLi1).toBe(elementsCard1doc.child.length);
    // block 2
    const blockTagCard2 =  await base.getTagHtml(page,cardsPage.block2);
    const blockTagUl2 =  await base.getTagHtml(page,cardsPage.block2+"//ul");
    const countLi2 =  await base.count(page,cardsPage.block2+"//li");
    expect(blockTagCard2).toBe(card2GGdoc.tag);
    expect(blockTagUl2).toBe(elementsCard2doc.tag);
    expect(countLi2).toBe(elementsCard2doc.child.length);

});

test('images', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "images"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content);

  const pictureGGdoc = convertGGdoc.filter(x=>x.tag=="picture");
  const picture1GGdoc = pictureGGdoc[0];
  const picture2GGdoc = pictureGGdoc[1];
  const picture3GGdoc = pictureGGdoc[2];
  await page.goto("/Block/boilerplate/images");
  // block 1
  const blockTagPicture1 =  await base.getTagHtml(page,picturePage.block1);
  const blockTagPicture2 =  await base.getTagHtml(page,picturePage.block2);
  const blockTagPicture3 =  await base.getTagHtml(page,picturePage.block3);
  // Compare 
  expect(blockTagPicture1).toBe(picture1GGdoc.tag);
  expect(blockTagPicture2).toBe(picture2GGdoc.tag);
  expect(blockTagPicture3).toBe(picture3GGdoc.tag);
});

test('code', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "code"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content);
});

test('columns', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "columns"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content);
});
// test('headings', async ({ page }) => {

// });
// test('hero', async ({ page }) => {

// });

// test('icons', async ({ page }) => {

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

