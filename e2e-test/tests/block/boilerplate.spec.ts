import dotenv from "dotenv";
dotenv.config();

const emailGG = process.env.EMAILGG || "";
const passGG = process.env.PASSGG || "";
const secretGG = process.env.SECRETGG || "";
import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import GeneratedCode from "@core_lib/generatedCode";
import BasePage from '@pom/BasePage';
import TextPage from '@pom/block/boilerplate/TextPage';
import CardsPage from '@pom/block/boilerplate/CardsPage';
import ListPage from '@pom/ListPage';
import PicturePage from "@pom/block/boilerplate/PicturePage";
import SectionPage from "@pom/block/boilerplate/SectionPage";
import CodePage from "@pom/block/boilerplate/CodePage";
import ButtonPage from "@pom/block/boilerplate/ButtonPage";
import MetaDataPage from "@pom/block/boilerplate/MetaDataPage";
import HeadingsPage from "@pom/block/boilerplate/HeadingPage";
import GoogleApi from '@api/GoogleApi';
import GooglePage from '@pom/GooglePage';
import ListBlockPage from '@pom/block/boilerplate/ListPage';
import LinkPage from "@pom/block/boilerplate/LinkPage";
import SectionMetaDataPage from "@pom/block/boilerplate/SectionMetaDataPage";
import IconPage from "@pom/block/boilerplate/IconsPage";
import ColumnsPage from "@pom/block/boilerplate/ColumnsPage";
const googleApi= new GoogleApi();
const utilities = new Utilities();
const generatedCode = new GeneratedCode();
const base =new BasePage();
const cardsPage = new CardsPage();
const textPage = new TextPage();
const listPage =new ListPage();
const picturePage = new PicturePage();
const sectionPage = new SectionPage();
const codePage = new CodePage();
const metaDataPage = new MetaDataPage();
const buttonPage = new ButtonPage();
const listBlockPage = new ListBlockPage();
const linkPage = new LinkPage();
const headingPage = new HeadingsPage();
const googlePage = new GooglePage();
const sectionMetaPage = new SectionMetaDataPage();
const iconsPage = new IconPage();
const columnsPage = new ColumnsPage();

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
    const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);

    const block1GGdoc = convertGGdoc[0];
    const block2GGdoc = convertGGdoc[1];

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
    const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);

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
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
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
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const code1GGdoc = convertGGdoc[0];
  const code2GGdoc = convertGGdoc[1];
  
  await page.goto("/Block/boilerplate/code");
  // block1
  const block1CodeText = await base.getText(page,codePage.block1);
  const block1CodeTag = await base.getTagHtml(page,codePage.block1);
  const block1CodeTag_1 = await base.getTagHtml(page,codePage.block1+"/code");
  // compare 1
  await checkTagExistInBlock(page,codePage.block1,code1GGdoc.elements[1].textStyle.tag);
  expect(block1CodeTag).toBe(code1GGdoc.tag);
  expect(block1CodeText.includes(code1GGdoc.elements[0].content)).toBe(true);
  expect(block1CodeText.includes(code1GGdoc.elements[1].content)).toBe(true);
  expect(block1CodeText.includes(code1GGdoc.elements[2].content)).toBe(true);
  // block 2
  const block2CodeText = await base.getText(page,codePage.block2);
  const block2CodeTag = await base.getTagHtml(page,codePage.block2);
  // compare 2
  expect(block2CodeTag).toBe(code2GGdoc.tag);
  await checkTagExistInBlock(page,codePage.block2,code2GGdoc.elements[0].textStyle.tag);
  expect(block2CodeText).toBe(code2GGdoc.elements[0].content);
});


test('sections', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "sections"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  
  //section 1
  const titleSection1GGdoc = convertGGdoc[0];
  const contentsection1GGdoc = convertGGdoc[1];

  //section 2
  const titleSection2GGdoc = convertGGdoc[3];
  const contentsection2GGdoc = convertGGdoc[4];

  //section 3
  const titleSection3GGdoc = convertGGdoc[6];
  const contentsection3GGdoc = convertGGdoc[7];

  await page.goto("/Block/boilerplate/sections");
  // section page 1
  const blockTitleSectionTag1 =  await base.getTagHtml(page,sectionPage.block1+"//h2[1]");
  const blockTitleSectionText1 =  await base.getText(page,sectionPage.block1+"//h2[1]");
  const blockContentSectionTag1 =  await base.getTagHtml(page,sectionPage.block1+"//p[1]");
  const blockContentSectionText1 =  await base.getText(page,sectionPage.block1+"//p[1]");
  // Compare 1
  expect(blockTitleSectionTag1).toBe(titleSection1GGdoc.tag);
  expect(blockTitleSectionText1).toBe(titleSection1GGdoc.elements[0].content);
  expect(blockContentSectionTag1).toBe(contentsection1GGdoc.tag);
  expect(blockContentSectionText1).toBe(contentsection1GGdoc.elements[0].content);
  
  // section page 2
  const blockTitleSectionTag2 =  await base.getTagHtml(page,sectionPage.block2+"//h2[1]");
  const blockTitleSectionText2 =  await base.getText(page,sectionPage.block2+"//h2[1]");
  const blockContentSectionTag2 =  await base.getTagHtml(page,sectionPage.block2+"//p[1]");
  const blockContentSectionText2 =  await base.getText(page,sectionPage.block2+"//p[1]");
  // Compare 2
  expect(blockTitleSectionTag2).toBe(titleSection2GGdoc.tag);
  expect(blockTitleSectionText2).toBe(titleSection2GGdoc.elements[0].content);
  expect(blockContentSectionTag2).toBe(contentsection2GGdoc.tag);
  expect(blockContentSectionText2).toBe(contentsection2GGdoc.elements[0].content);

  // section page 3
  const blockTitleSectionTag3 =  await base.getTagHtml(page,sectionPage.block3+"//h2[1]");
  const blockTitleSectionText3 =  await base.getText(page,sectionPage.block3+"//h2[1]");
  const blockContentSectionTag3 =  await base.getTagHtml(page,sectionPage.block3+"//p[1]");
  const blockContentSectionText3 =  await base.getText(page,sectionPage.block3+"//p[1]");

  // Compare 2
  expect(blockTitleSectionTag3).toBe(titleSection3GGdoc.tag);
  expect(blockTitleSectionText3).toBe(titleSection3GGdoc.elements[0].content);
  expect(blockContentSectionTag3).toBe(contentsection3GGdoc.tag);
  expect(blockContentSectionText3).toBe(contentsection3GGdoc.elements[0].content);

});


test('button', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "button"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);

  //button 1
  const button1GGdoc = convertGGdoc[0];
  //button 2
  const button2GGdoc = convertGGdoc[1];
  //button 3
  const button3GGdoc = convertGGdoc[2];
  //button 4
  const button4GGdoc = convertGGdoc[3];

  await page.goto("/Block/boilerplate/button");

  //button page 1
  const block1ButtonTag =  await base.getTagHtml(page,buttonPage.block1);
  const block1ButtonText =  await base.getText(page,buttonPage.block1+"//a");
  // Compare 1
  await checkTagExistInBlock(page,buttonPage.block1,button1GGdoc.elements[0].textStyle.tag);
  expect(block1ButtonTag).toBe(button1GGdoc.tag);
  expect(block1ButtonText).toBe(button1GGdoc.elements[0].content);

  //button page 2
  const block2ButtonTag =  await base.getTagHtml(page,buttonPage.block2);
  const block2ButtonText =  await base.getText(page,buttonPage.block2+"//a");
  // Compare 2
  await checkTagExistInBlock(page,buttonPage.block2,button2GGdoc.elements[0].textStyle.tag);
  expect(block2ButtonTag).toBe(button2GGdoc.tag);
  expect(block2ButtonText).toBe(button2GGdoc.elements[0].content);

  //button page 3
  const block3ButtonTag =  await base.getTagHtml(page,buttonPage.block3);
  const block3ButtonText =  await base.getText(page,buttonPage.block3+"//a");
  // Compare 3
  await checkTagExistInBlock(page,buttonPage.block1,button1GGdoc.elements[0].textStyle.tag);
  expect(block3ButtonTag).toBe(button3GGdoc.tag);
  expect(block3ButtonText).toBe(button3GGdoc.elements[0].content);

  //button page 4
  const block4ButtonTag =  await base.getTagHtml(page,buttonPage.block4);
  const block4ButtonText =  await base.getText(page,buttonPage.block4+"//a");
  // Compare 4
  await checkTagExistInBlock(page,buttonPage.block4,button4GGdoc.elements[0].textStyle.tag);
  expect(block4ButtonTag).toBe(button4GGdoc.tag);
  expect(block4ButtonText).toBe(button4GGdoc.elements[0].content);

});

test('meta data', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "metadata"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const headGGdoc = convertGGdoc.filter(x=>x.tag=="head");
  const headElementsGGdoc = headGGdoc[0].elements;

  await page.goto("/Block/Boilerplate/metadata");
  // Compare
  await expect(page).toHaveTitle((headElementsGGdoc.filter(x=>x.tag == 'title'))[0].content);
  await expect(page.locator(metaDataPage.metaDescription)).toHaveAttribute('content', (headElementsGGdoc.filter(x=>x.name == 'description'))[0].content)
  await expect(page.locator(metaDataPage.metaRobots)).toHaveAttribute('content', (headElementsGGdoc.filter(x=>x.name == 'robots'))[0].content)
  await expect(page.locator(metaDataPage.metaColor)).toHaveAttribute('content', (headElementsGGdoc.filter(x=>x.name == 'color'))[0].content)
  await expect(page.locator(metaDataPage.metaTheme)).toHaveAttribute('content', (headElementsGGdoc.filter(x=>x.name == 'theme'))[0].content)
  await expect(page.locator(metaDataPage.metaTemplate)).toHaveAttribute('content', (headElementsGGdoc.filter(x=>x.name == 'template'))[0].content)

});

test('headings', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "headings"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const h1GGdoc =convertGGdoc[0];
  const h2GGdoc =convertGGdoc[1];
  const h3GGdoc =convertGGdoc[2];
  const h4GGdoc =convertGGdoc[3];
  const h5GGdoc =convertGGdoc[4];
  const h6GGdoc =convertGGdoc[5];
  await page.goto("/Block/Boilerplate/headings");
  const h1Tag =  await base.getTagHtml(page,headingPage.h1);
  const h1Text =  await base.getText(page,headingPage.h1);

  const h2Tag =  await base.getTagHtml(page,headingPage.h2);
  const h2Text =  await base.getText(page,headingPage.h2);

  const h3Tag =  await base.getTagHtml(page,headingPage.h3);
  const h3Text =  await base.getText(page,headingPage.h3);

  const h4Tag =  await base.getTagHtml(page,headingPage.h4);
  const h4Text =  await base.getText(page,headingPage.h4);

  const h5Tag =  await base.getTagHtml(page,headingPage.h5);
  const h5Text =  await base.getText(page,headingPage.h5);

  const h6Tag =  await base.getTagHtml(page,headingPage.h6);
  const h6Text =  await base.getText(page,headingPage.h6);
  // Compare
  expect(h1Tag).toBe(h1GGdoc.tag);
  expect(h1Text).toBe(h1GGdoc.elements[0].content);

  expect(h2Tag).toBe(h2GGdoc.tag);
  expect(h2Text).toBe(h2GGdoc.elements[0].content);

  expect(h3Tag).toBe(h3GGdoc.tag);
  expect(h3Text).toBe(h3GGdoc.elements[0].content);

  expect(h4Tag).toBe(h4GGdoc.tag);
  expect(h4Text).toBe(h4GGdoc.elements[0].content);

  expect(h5Tag).toBe(h5GGdoc.tag);
  expect(h5Text).toBe(h5GGdoc.elements[0].content);

  expect(h6Tag).toBe(h6GGdoc.tag);
  expect(h6Text).toBe(h6GGdoc.elements[0].content);

});

test('list', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "list"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const block1ListGGdoc = convertGGdoc[0];
  const block2ListGGdoc = convertGGdoc[1];

  await page.goto("/Block/Boilerplate/list");
  const block1Tag = await base.getTagHtml(page,listBlockPage.block1);
  const countLiChildBlock1 = await base.count(page,listBlockPage.block1+"/li/ul/li");
  const countLiParentBlock1 = (await base.count(page,listBlockPage.block1+"/li")) - countLiChildBlock1;

  const block2Tag = await base.getTagHtml(page,listBlockPage.block2);
  const countLiChildBlock2 = await base.count(page,listBlockPage.block2+"/li/ol/li");
  const countLiParentBlock2 = (await base.count(page,listBlockPage.block2+"/li")) - countLiChildBlock1;
  // Compare 1
  expect(block1Tag).toBe(block1ListGGdoc.tag);
  expect(countLiParentBlock1).toBe(block1ListGGdoc.li.length);
  expect(countLiChildBlock1).toBe(block1ListGGdoc.li[1].child.li.length);
  // Compare 2
  //expect(block1Tag).toBe(block1ListGGdoc.tag);
  expect(countLiParentBlock2).toBe(block2ListGGdoc.li.length);
  expect(countLiChildBlock2).toBe(block2ListGGdoc.li[1].child.li.length);

});

test('link', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "link"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const block1H1GGDoc = convertGGdoc[0];
  const block2PGGDoc = convertGGdoc[1];
  const block3PictureGGDoc = convertGGdoc[2];
  const block4PictureGGDoc = convertGGdoc[4];
  const block5LinkGDoc = convertGGdoc[5];
 
  await page.goto("/Block/Boilerplate/link");
  //block 1
  const block1H1 = await base.getTagHtml(page,linkPage.block1H1);
  const block1H1Text = await base.getText(page,linkPage.block1H1);
  const block1A = await base.getTagHtml(page,linkPage.block1H1+"/a");
  const block1AText = await base.getText(page,linkPage.block1H1+"/a");
  // Compare 1
  expect(block1H1).toBe(block1H1GGDoc.tag);
  expect(block1H1Text).toBe(utilities.includeContent(block1H1GGDoc.elements));
  expect(block1A).toBe(block1H1GGDoc.elements[1].textStyle.tag[0]);
  expect(block1AText).toBe(block1H1GGDoc.elements[1].content);
  
  //block 2
  const block2P = await base.getTagHtml(page,linkPage.block2P);
  const block2PText = await base.getText(page,linkPage.block2P);
  const block2A1 = await base.getTagHtml(page,linkPage.block2P+"/a[1]");
  const block2A1Text = await base.getText(page,linkPage.block2P+"/a[1]");
  const block2A2 = await base.getTagHtml(page,linkPage.block2P+"/a[2]");
  const block2A2Text = await base.getText(page,linkPage.block2P+"/a[2]");
  // Compare 2
  expect(block2P).toBe(block2PGGDoc.tag);
  expect(block2PText).toBe(utilities.includeContent(block2PGGDoc.elements));
  expect(block2A1).toBe(block2PGGDoc.elements[1].textStyle.tag[0]);
  expect(block2A1Text).toBe(block2PGGDoc.elements[1].content);
  expect(block2A2).toBe(block2PGGDoc.elements[3].textStyle.tag[0]);
  expect(block2A2Text).toBe(block2PGGDoc.elements[3].content);
  //block 5
  const block5Link = await base.getTagHtml(page,linkPage.Block5Link);
  const block5LinkText = await base.getText(page,linkPage.Block5Link);
  const block5A = await base.getTagHtml(page,linkPage.Block5Link+"/a[1]");
  const block5AText = await base.getText(page,linkPage.Block5Link+"/a[1]");
  // Compare 5
  expect(block5Link).toBe(block5LinkGDoc.tag);
  expect(block5LinkText).toBe(utilities.includeContent(block5LinkGDoc.elements));
  expect(block5A).toBe(block5LinkGDoc.elements[0].textStyle.tag[0]);
  expect(block5AText).toBe(block5LinkGDoc.elements[0].content);

});

test('setion-metadata', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "setion-metadata"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const section1H1GGdoc = await convertGGdoc[0];
  const section1PGGdoc = await convertGGdoc[1];
  const section2H2GGdoc = await convertGGdoc[3];
  const section2PGGdoc = await convertGGdoc[4];
  await page.goto("/Block/Boilerplate/setion-metadata");
  //section 1
  const section1H1 = await base.getTagHtml(page,sectionMetaPage.section1+"/h1");
  const section1H1Text = await base.getText(page,sectionMetaPage.section1+"/h1");
  const section1P = await base.getTagHtml(page,sectionMetaPage.section1+"/p");
  const section1PText = await base.getText(page,sectionMetaPage.section1+"/p");
  // Compare 1
  expect(section1H1).toBe(section1H1GGdoc.tag);
  expect(section1H1Text).toBe(utilities.includeContent(section1H1GGdoc.elements));
  expect(section1P).toBe(section1PGGdoc.tag);
  expect(section1PText).toBe(utilities.includeContent(section1PGGdoc.elements));
  //section 2
  const section2H2 = await base.getTagHtml(page,sectionMetaPage.section2+"/h2");
  const section2H2Text = await base.getText(page,sectionMetaPage.section2+"/h2");
  const section2P = await base.getTagHtml(page,sectionMetaPage.section2+"/p");
  const section2PText = await base.getText(page,sectionMetaPage.section2+"/p");
  // Compare 1
  expect(section2H2).toBe(section2H2GGdoc.tag);
  expect(section2H2Text).toBe(utilities.includeContent(section2H2GGdoc.elements));
  expect(section2P).toBe(section2PGGdoc.tag);
  expect(section2PText).toBe(utilities.includeContent(section2PGGdoc.elements));

});

test('icons', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "icons"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const block1GGdoc = convertGGdoc[0];
  const block2GGdoc = convertGGdoc[1];
  const block3GGdoc = convertGGdoc[2];
  const block4GGdoc = convertGGdoc[3];

  await page.goto("/Block/Boilerplate/icons");
  //block 1
  const block1H1Tag = await base.getTagHtml(page,iconsPage.block1H1);
  const block1H1Text = await base.getText(page,iconsPage.block1H1);
  const block1IconUrl = await base.getAttribute(page,iconsPage.block1H1+"/span[1]/img[1]","src");
  // Compare 1
  expect(block1H1Tag).toBe(block1GGdoc.tag);
  expect(block1H1Text).toBe(utilities.includeContent(block1GGdoc.elements).replace(" :search:",""));
  expect(block1IconUrl).toBe("/icons/"+utilities.getIconInStr(block1GGdoc.elements[0].content)[0]+".svg")
  //block 2
  const block2Icon1Url = await base.getAttribute(page,iconsPage.block2P+"/span[1]/img[1]","src");
  const block2ATag = await base.getTagHtml(page,iconsPage.block2P+"/a[1]");
  const block2AText = await base.getText(page,iconsPage.block2P+"/a[1]");
  const block2Icon2Url = await base.getAttribute(page,iconsPage.block2P+"/a[1]/span[1]/img[1]","src");
  // Compare 2
  expect(block2Icon1Url).toBe("/icons/"+utilities.getIconInStr(block2GGdoc.elements[0].content)[0]+".svg")
  expect(block2ATag).toBe(block2GGdoc.elements[1].textStyle.tag[0]);
  expect(block2AText).toBe(block2GGdoc.elements[1].content.replace(":search: ",""));
  expect(block2Icon2Url).toBe("/icons/"+utilities.getIconInStr(block2GGdoc.elements[1].content)[0]+".svg")
  //block 3
  const block3ATag = await base.getTagHtml(page,iconsPage.block3P+"//a[1]");
  const block3AText = await base.getText(page,iconsPage.block3P+"//a[1]");
  const block3Icon2Url = await base.getAttribute(page,iconsPage.block3P+"//a[1]/span[1]/img[1]","src");
  // Compare 3
  expect(block3ATag).toBe(block3GGdoc.elements[0].textStyle.tag[1]);
  expect(block3AText).toBe(block3GGdoc.elements[0].content.replace(":search: ",""));
  expect(block2Icon2Url).toBe("/icons/"+utilities.getIconInStr(block3GGdoc.elements[0].content)[0]+".svg")
});

test('columns', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "columns"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);
  const block1Columns = convertGGdoc[0];
  const block2Columns = convertGGdoc[1];
  await page.goto("/Block/boilerplate/columns");
  //block 1
  const countRowBlock1 = await base.count(page,columnsPage.block1+"/div");
  // Compare 1
  expect(countRowBlock1).toBe(block1Columns.row.length);
});

test('hero', async ({ page }) => {
  const fileId = (filesBoilerlate.filter(x => x.name === "hero"))[0]["id"];
  const content:any = await googleApi.getContentGGDoc(fileId);
  const convertGGdoc = await generatedCode.generateCodeFromGoogleDoc(content);

  await page.goto("/Block/boilerplate/hero");
});




