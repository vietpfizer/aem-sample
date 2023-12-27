import dotenv from "dotenv";
dotenv.config();

const emailGG = process.env.EMAILGG || "";
const passGG = process.env.PASSGG || "";
const secretGG = process.env.SECRETGG || "";
import { test, expect, type Page } from '@playwright/test';
import Utilities from '@core_lib/utilities';
import GeneratedCode from "@core_lib/generatedCode";
import BasePage from '@pom/BasePage';
import GoogleApi from '@api/GoogleApi';
import GooglePage from '@pom/GooglePage';
import TablePage from "@pom/block/blockCollection/TablePage";
import EmbedPage from "@pom/block/blockCollection/EmbedPage";
const googleApi= new GoogleApi();
const utilities = new Utilities();
const generateCode = new GeneratedCode();
const tablePage = new TablePage();
const embedPage = new EmbedPage();
const base =new BasePage();
const googlePage = new GooglePage();

let boilerplateFolderInfo, filesBoilerlate;
test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await googlePage.setAccessToken(page,emailGG,passGG,secretGG);
    boilerplateFolderInfo = await googleApi.getFolderDrive("BlockCollection");
    filesBoilerlate = await googleApi.getFilesInFolder(boilerplateFolderInfo[0]["id"]);
});

test('table', async ({ page }) => {
    const fileId = (filesBoilerlate.filter(x => x.name === "table"))[0]["id"];
    const content:any = await googleApi.getContentGGDoc(fileId);
    const convertGGdoc = await generateCode.generateCodeFromGoogleDoc(content);
    
   
    const tableGGdoc = convertGGdoc.filter(x=>x.tag=="table");
    const table1GGdoc = tableGGdoc[0];
    const elementsTable1doc = table1GGdoc.elements;
    
    const table2GGdoc = tableGGdoc[1];
    const elementsTable2doc = table1GGdoc.elements;

    const table3GGdoc = tableGGdoc[2];
    const elementsTable3doc = table3GGdoc.elements;

    const table4GGdoc = tableGGdoc[3];
    const elementsTable4doc = table4GGdoc.elements;

    await page.goto("/Block/blockcollection/table");
    //block 1
    const blockTagTable1 =  await base.getTagHtml(page,tablePage.block1);
    const blockThead1 =  await base.getTagHtml(page,tablePage.block1+"/thead");
    const countTrThead1 = await base.count(page,tablePage.block1+"/thead/tr");
    const blockTbody1 =  await base.getTagHtml(page,tablePage.block1+"/tbody");
    const countTrTBody1 =  await base.count(page,tablePage.block1+"/tbody/tr");
    //Compare 1
    expect(blockTagTable1).toBe(table1GGdoc.tag);
    expect(blockThead1).toBe(elementsTable1doc.thead.tag);
    expect(countTrThead1).toBe(elementsTable1doc.thead.child.length);
    expect(blockTbody1).toBe(elementsTable1doc.tbody.tag);
    expect(countTrTBody1).toBe(elementsTable1doc.tbody.child.length);
    // block 2
    const blockTagTable2 =  await base.getTagHtml(page,tablePage.block2);
    const blockThead2 =  await base.getTagHtml(page,tablePage.block2+"/thead");
    const countTrThead2 = await base.count(page,tablePage.block2+"/thead/tr");
    const blockTbody2 =  await base.getTagHtml(page,tablePage.block2+"/tbody");
    const countTrTBody2 =  await base.count(page,tablePage.block2+"/tbody/tr");
    // Compare 2
    expect(blockTagTable2).toBe(table2GGdoc.tag);
    expect(blockThead2).toBe(elementsTable2doc.thead.tag);
    expect(countTrThead2).toBe(elementsTable2doc.thead.child.length);
    expect(blockTbody2).toBe(elementsTable2doc.tbody.tag);
    expect(countTrTBody2).toBe(elementsTable2doc.tbody.child.length);

    // block 3
    const blockTagTable3 =  await base.getTagHtml(page,tablePage.block3);
    const blockThead3 =  await base.getTagHtml(page,tablePage.block3+"/thead");
    const countTrThead3 = await base.count(page,tablePage.block3+"/thead/tr");
    const blockTbody3 =  await base.getTagHtml(page,tablePage.block3+"/tbody");
    const countTrTBody3 =  await base.count(page,tablePage.block3+"/tbody/tr");
    // Compare 3
    expect(blockTagTable3).toBe(table3GGdoc.tag);
    expect(blockThead3).toBe(elementsTable3doc.thead.tag);
    expect(countTrThead3).toBe(elementsTable3doc.thead.child.length);
    expect(blockTbody3).toBe(elementsTable3doc.tbody.tag);
    expect(countTrTBody3).toBe(elementsTable3doc.tbody.child.length);

    // block 4
    const blockTagTable4 =  await base.getTagHtml(page,tablePage.block4);
    const blockThead4 =  await base.getTagHtml(page,tablePage.block4+"/thead");
    const countTrThead4 = await base.count(page,tablePage.block4+"/thead/tr");
    const blockTbody4 =  await base.getTagHtml(page,tablePage.block4+"/tbody");
    const countTrTBody4 =  await base.count(page,tablePage.block4+"/tbody/tr");
    // Compare 4
    expect(blockTagTable4).toBe(table4GGdoc.tag);
    expect(blockThead4).toBe(elementsTable4doc.thead.tag);
    expect(countTrThead4).toBe(elementsTable4doc.thead.child.length);
    expect(blockTbody4).toBe(elementsTable4doc.tbody.tag);
    expect(countTrTBody4).toBe(elementsTable4doc.tbody.child.length);

});


test('embed', async ({ page }) => {
    const fileId = (filesBoilerlate.filter(x => x.name === "embed"))[0]["id"];
    const content:any = await googleApi.getContentGGDoc(fileId);
    const convertGGdoc = await generateCode.generateCodeFromGoogleDoc(content);
    const embedGGdoc = convertGGdoc.filter(x=>x.tag=="div");
    const embed1GGdoc = embedGGdoc[0];
    const embed1GGElementdoc = embed1GGdoc.elements[0];

    const embed2GGdoc = embedGGdoc[1];
    const embed2GGElementdoc = embed2GGdoc.elements[0];

    const embed3GGdoc = embedGGdoc[2];
    const embed3GGElementdoc = embed3GGdoc.elements[0];

    await page.goto("/Block/blockcollection/embed");
    //block 1
    const blockTagEmbed1 =  await base.getTagHtml(page,embedPage.block1);
    const blockPicture1 =  await base.getTagHtml(page,embedPage.block1+"//picture");
    //Compare 1
    expect(blockTagEmbed1).toBe(embed1GGdoc.tag);
    expect(blockPicture1).toBe(embed1GGElementdoc.tag);
    //block 2
    const blockTagEmbed2 =  await base.getTagHtml(page,embedPage.block2);
    const blockPicture2 =  await base.getTagHtml(page,embedPage.block2+"//picture");
    //Compare 2
    expect(blockTagEmbed2).toBe(embed2GGdoc.tag);
    expect(blockPicture2).toBe(embed2GGElementdoc.tag);
    //block 3
    const blockTagEmbed3 =  await base.getTagHtml(page,embedPage.block3);
    const blockPicture3 =  await base.getTagHtml(page,embedPage.block3+"//picture");
    //Compare 3
    expect(blockTagEmbed3).toBe(embed3GGdoc.tag);
    expect(blockPicture3).toBe(embed3GGElementdoc.tag);

});
