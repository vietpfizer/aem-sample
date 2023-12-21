import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import BasePage from '@pom/BasePage';
import fs from "fs";
const utilities = new Utilities();
const base =new BasePage();
const baseUrl = "http://localhost:8000";

async function createFile(request,fileName,content,folderId="local"){
  const response =  await request.get(baseUrl+'/saveText/'+folderId+'/'+fileName+'/'+content);
  return await response.json();
}

async function deleteFile(request,fileId){
    const response =  await request.get(baseUrl+'/delete/'+fileId);
    return await response.json();
}

async function getFiles(request,folderId){
  const response =  await request.get(baseUrl+'/getFilesOnFolder/'+folderId);
  return await response.json();
}

async function getContentGoogleDoc(request,documentId){
  const response = await request.get(baseUrl+'/getDocContent/'+documentId);
  return await response.json();
}

async function batchUpdateContentGoogleDoc(request,documentId,content){
  const response = await request.get(baseUrl+'/batchUpdate/'+documentId+'/'+content);
  return await response.json();
}

async function checkTagExistInBlock(page,blockLocator,tag) {
  for(let i=0; i< tag.length;i++){
    expect(await base.isDisplayed(page,blockLocator+"//"+tag[i])).toBe(true);
  }
}

test(' verify create and get content google doc', async ({ request,page }) => {
  const folderId = "1HVGKFSqe-pG_o7jGiROnOZ5W2N818afx";
  const fileName =  "file_name_test";
  const contentTest =  "test";
  const info = await createFile(request,fileName,contentTest,folderId);
  const content = await getContentGoogleDoc(request,info["id"]);
  const text = content.body.content[1].paragraph.elements[0].textRun.content;
  console.log(text);
  console.log(contentTest);
  //expect(text).toBe(contentTest);
  await deleteFile(request,info.id);
});
test('test', async ({ request,page }) => {
  const creds:any = fs.readFileSync('temp.json');
  const json = JSON.parse(creds)
  await utilities.generateCodeFromGoogleDoc(json);
});

test('Document content object properties', async ({ request,page }) => {
  const documentId = "1zXrxqpIeiSj5UuVkAx5t_LargapgoGkW3qgoSLDIwzA";
  const content_document = await getContentGoogleDoc(request,documentId);
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
  await page.goto('https://main--aem-sample--vietpfizer.hlx.page/text');
  const locator = "//u[contains(text(),'Lorem ipsum dolor')]";
  const textPage = await base.getText(page,locator);
  const styleList = ["background-color","color","font-weight","text-decoration","background-color","font-size", "font-style"]
  const style = await base.getStyleElement(page,locator,styleList);
  console.log(googleDocStyle);
  console.log(style);
  await expect(contentDoc).toBe(textPage);
  
});

test('Use the extracted content with formatting to compare the components on AEM rendered web page', async ({ request,page }) => {
  //get content gg doc
  const documentId = "1zXrxqpIeiSj5UuVkAx5t_LargapgoGkW3qgoSLDIwzA";
  const content_document = await getContentGoogleDoc(request,documentId);
  const json = content_document;
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(json);
  const block1GGdoc = convertGGdoc[0];
  const block2GGdoc = convertGGdoc[1];
  console.log(convertGGdoc);
  
  // get block page
  const block1Locator = '//*[@id="example-heading-1"]';
  const block2Locator = block1Locator+"/following-sibling::p[1]";
  await page.goto('https://main--aem-sample--vietpfizer.hlx.page/text');
  const blockTag1 =  await base.getTagHtml(page,block1Locator);
  console.log(blockTag1);
  const contentBlock1 =  await base.getText(page,block1Locator+"//strong");
  
  const blockTag2 =  await base.getTagHtml(page,block2Locator);
  console.log(blockTag2);
  const contentBlock2_1 = await base.getText(page,block2Locator+"//u");
  //Compare 
  // Compare block 1
  expect(blockTag1).toBe(block1GGdoc.tag);
  expect(contentBlock1).toBe(block1GGdoc.elements[0].content);
  await checkTagExistInBlock(page,block1Locator,block1GGdoc.elements[0].textStyle.tag);
  // Compare block 2
  expect(blockTag2).toBe(block2GGdoc.tag);
  expect(contentBlock2_1).toBe(block2GGdoc.elements[0].content);
  await checkTagExistInBlock(page,block2Locator,block2GGdoc.elements[0].textStyle.tag);
});


test(' get files folder', async ({ request,page }) => {
    const folderId = "1cOOAA5ZqTfW4TjICSSM0TxCYcZxTD_iz";
  //lay thong tin danh sach file trong folder
  const listFiles = await getFiles(request,folderId);
  let fileInfo=new Array();
  if(listFiles.length > 0){
    for(let i=0;i<listFiles.length;i++){
      // get content file google doc va push vao fileInfo
      const content = await getContentGoogleDoc(request,await listFiles[i]["id"]);
      if(typeof content !== "undefined"){
        fileInfo.push(await content);
      }
    }
  }
  console.log(fileInfo);
});


test('Verify the list formats of content in google doc should be respond the components on AEM rendered web page', async ({ request,page }) => {
  //get content google doc as list
  const documentId = "1UruVhKr86NDON5eipb1sRlJl3a4gnXFDUlk2Derye_c";
  const content_document = await getContentGoogleDoc(request,documentId);
  const convertGGdoc = await utilities.generateCodeFromGoogleDoc(content_document);

  const block1GGdoc = convertGGdoc[0];
  const block2GGdoc = convertGGdoc[1];
  console.log('convertGGdoc',convertGGdoc);
  console.log('block1GGdoc',block1GGdoc);
  console.log('block2GGdoc',block2GGdoc);

  const listblock = '(//ul/li[text()="Item 1"])[1]'
  await page.goto('https://main--aem-sample--vietpfizer.hlx.page/list');
  const listblockTag =  await base.getTagHtml(page,listblock);
  console.log('listblockTag', listblockTag);
  const contentlistblock =  await base.getText(page,listblock);
  expect(listblockTag).toBe(block1GGdoc.tag)
  expect(contentlistblock).toBe(block1GGdoc.elements[0].content);
});