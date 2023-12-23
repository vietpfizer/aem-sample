import dotenv from "dotenv";
dotenv.config();

const emailGG = process.env.EMAILGG || "";
const passGG = process.env.PASSGG || "";
const secretGG = process.env.SECRETGG || "";
import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import BasePage from '@pom/BasePage';
import TextPage from '@pom/TextPage';
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

test('Get token ', async ({page}) => {
  await page.goto("http://localhost:8000/auth/google");
  await googlePage.enterAccountGoogle(page,emailGG,passGG,secretGG);
  await googlePage.wait(page,10000);
});

test('verify get files folder', async ({  }) => {
  const folderId = googleDocData.folderId;
  const files = googleDocData.files;
  //lay thong tin danh sach file trong folder
  const listFiles:any = await googleApi.getFilesInFolder(folderId);
  let fileInfo=new Array();
  if(listFiles.length > 0){
    for(let i=0;i<listFiles.length;i++){
      // get content file google doc va push vao fileInfo
      const content = await googleApi.getContentGGDoc(await listFiles[i]["id"])
      if(typeof content !== "undefined"){
        fileInfo.push(await content);
      }
    }
  }
});

test('verify can create and get content google doc', async ({ request,page }) => {
  const folderId =   googleDocData.folderIdUpload;
  const fileName =  utilities.generateRandomString(4);
  const contentTest =  utilities.generateRandomString(10);
  const info = await googleApi.createFile(folderId,fileName,contentTest);
  const content:any = await googleApi.getContentGGDoc(info["id"]);
  const text = content.body.content[1].paragraph.elements[0].textRun.content;
  await googleApi.deleteFile(info.id);
});

test('document content object properties', async ({ page }) => {
  const documentId = googleDocData.files[0].id;
  const content_document:any = await googleApi.getContentGGDoc(documentId); 
  const textRun = content_document.body.content[1].paragraph.elements[0].textRun;
  const contentDoc = textRun.content;
  const styleDoc = textRun.textStyle;
  const googleDocStyle = {
    "bold":styleDoc.bold,
    "italic":styleDoc.italic,
    "underline":styleDoc.underline,
    "backgroundColor":styleDoc.backgroundColor,
    "foregroundColor":styleDoc.foregroundColor,
    "fontSize":styleDoc.fontSize
  }
  await page.goto('/text');
  const block1 = await base.getText(page,textPage.block1);
  const styleList = ["background-color","color","font-weight","text-decoration","background-color","font-size", "font-style"]
  const style = await base.getStyleElement(page,textPage.block1,styleList);
  await expect(contentDoc).toBe(block1);
});

test('Use the extracted content with formatting to compare the components on AEM rendered web page', async ({ page }) => {
  //get content gg doc
  const documentId = googleDocData.files[0].id;//text
  const content_document = await googleApi.getContentGGDoc(documentId);
  const json = content_document;
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(json);
  const block1GGdoc = convertGGdoc[0];
  const block2GGdoc = convertGGdoc[1];
  
  // get block page
  await page.goto('/text');
  const blockTag1 =  await base.getTagHtml(page,textPage.block1);
  const contentBlock1 =  await base.getText(page,textPage.block1+"//strong");
  
  const blockTag2 =  await base.getTagHtml(page,textPage.block2);
  const contentBlock2_1 = await base.getText(page,textPage.block2+"//u");
  // Compare 
  // Compare block 1
  expect(blockTag1).toBe(block1GGdoc.tag);
  expect(contentBlock1).toBe(block1GGdoc.elements[0].content);
  await checkTagExistInBlock(page,textPage.block1,block1GGdoc.elements[0].textStyle.tag);
  // Compare block 2
  expect(blockTag2).toBe(block2GGdoc.tag);
  expect(contentBlock2_1).toBe(block2GGdoc.elements[0].content);
  await checkTagExistInBlock(page,textPage.block2,block2GGdoc.elements[0].textStyle.tag);
});


test('Verify the list formats of content in google doc should be respond the components on AEM rendered web page', async ({ page }) => {
  //get content google doc as list
  const documentId =  googleDocData.files[1].id;
  const content_document = await googleApi.getContentGGDoc(documentId);
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content_document);
  const block1GGdoc = convertGGdoc[0];
  const block2GGdoc = convertGGdoc[1];
  await page.goto('/list');
  const listblockTag =  await base.getTagHtml(page,listPage.block1);
  const contentlistblock =  await base.getText(page,listPage.block1);
  expect(listblockTag).toBe(block1GGdoc.tag)
  expect(contentlistblock).toBe(block1GGdoc.elements[0].content);
});