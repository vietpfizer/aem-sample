

import { test, expect } from '@playwright/test';
import BasePage from '@pom/BasePage';
import Utilities from '@core_lib/utilities';
import GoogleApi from "@api/GoogleApi";
const utilities = new Utilities();
const basePage = new BasePage()
const googleApi =new GoogleApi();
const { chromium } = require("playwright");
// async function getAccessToken(page){
//   await page.goto('https://developers.google.com/docs/api/reference/rest/v1/documents/get');
//   const documentID = "//*[@id='documentId']";
//   const execute  = "//*[@id='execute']";
//   await basePage.enterText(page,documentID,"1OTvtGQuXm7J23Wez9uYYC-zqXW0o9GZ-ttpI-xuDFFQ");
//   await basePage.click(page,execute)
// }

test('Get content from google doc(private)', async ({page}) => {
    const content = await  googleApi.getContentGoogleDoc("OTvtGQuXm7J23Wez9uYYC-zqXW0o9GZ-ttpI-xuDFFQ");
    console.log(content);

})


    
