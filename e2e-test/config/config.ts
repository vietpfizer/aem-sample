import dotenv from "dotenv";
dotenv.config();

const browser = process.env.BROWSER || "chromium";
let testFiles = process.env.FILE_RUN || "tests/*.spec.ts";
import { defineConfig, devices } from "@playwright/test";
import Utilities from "@core_lib/utilities";
//declare
const utilities = new Utilities();
//get base url following environment

//get browsers run
function getBrowsers() {
  let result = new Array();
  const browsersConfig = {
    chromium: {
      name: "chromium",
      devices: "Desktop Chrome",
    },
    firefox: {
      name: "firefox",
      devices: "Desktop Firefox",
    },
    webkit: {
      name: "webkit",
      devices: "Desktop Safari",
    },
  };
  const browsers = browser.split(",");
  for (let i = 0; i < browsers.length; i++) {
    const item = browsers[i];
    result.push(browsersConfig[item]);
  }
  return result;
}

// Files run test
function fileRunTest() {
  let result = new Array();
  const testFilesArr = testFiles.split(",");
  for (let i = 0; i < testFilesArr.length; i++) {
    const testFile = testFilesArr[i];
    const testFileArr = testFile.split("/");
    const lengTestFiles = testFileArr.length;
    const fileName = testFileArr[lengTestFiles - 1];
    const testMatch = fileName;
    const testDir = testFile.replace(testMatch, "");
    result.push({
      testDir: "../" + testDir,
      testMatch: testMatch,
    });
  }
  return result;
}
//run tests on multiple browsers
function runTestsMultipleBrowser() {
  let result = new Array();
  const browsers = getBrowsers();
  const filesRun = fileRunTest();
  for (let i = 0; i < browsers.length; i++) {
    for (let j = 0; j < filesRun.length; j++) {
      result.push({
        testDir: filesRun[j].testDir,
        testMatch: filesRun[j].testMatch,
        name: browsers[i].name,
        use: {
          ...devices[browsers[i].devices],
          launchOptions: {
            args: [
              "--disable-blink-features=AutomationControlled",
              "--disable-dev-shm-usage",
              "--disable-component-extensions-with-background-pages",
            ],
          },
        },
      });
    }
  }
  return result;
}
export default defineConfig({
  projects: runTestsMultipleBrowser(),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"], ["allure-playwright"]],
  timeout: 5 * 60 * 1000,
  use: {
    baseURL: "https://main--aem-sample--vietpfizer.hlx.page",
    trace: "on-first-retry",
    screenshot: "on",
    video: "on",
  },
});
