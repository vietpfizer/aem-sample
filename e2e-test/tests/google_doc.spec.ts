import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import BasePage from '@pom/BasePage';
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

test('Document content object properties', async ({ request,page }) => {
  const documentId = "1zXrxqpIeiSj5UuVkAx5t_LargapgoGkW3qgoSLDIwzA";
  const content_document = await getContentGoogleDoc(request,documentId);
  //console.log('noi dung cua no ne:',content_document);
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

test('Extract content from google doc', async ({ request,page }) => {
  const docuemntId = "1qoLZ72OS_4PBnKjrbpIX80bN7f2-XMvU4KYh2u2EWuM";
  // Them thong tin vao file
  await batchUpdateContentGoogleDoc(request,docuemntId,"Xin chao");
});

test('Use the extracted content with formatting to compare the components on AEM rendered web page', async ({ request,page }) => {
   // 
  const docuemntId = "1qoLZ72OS_4PBnKjrbpIX80bN7f2-XMvU4KYh2u2EWuM";
  // lay content google doc them documetID cho san 
  const content = await getContentGoogleDoc(request,docuemntId);
  console.log(content.body.content);
  // get AEM 

  // dang viet
  //compare
  // so sanh 2 noi dung
});