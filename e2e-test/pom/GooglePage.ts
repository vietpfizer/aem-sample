import dotenv from "dotenv";
dotenv.config();

const email = process.env.EMAILGG;
const  testFiles = process.env.FILE_RUN || "tests/*.spec.ts";
import GoogleApi from "@api/GoogleApi";
import BasePage from "@pom/BasePage";
import Utilities from "@core_lib/utilities";
//declare
const utilities = new Utilities();
const googleApi = new GoogleApi();

export default class GooglePage extends BasePage {
  public emailInput = "//input[@id='identifierId']";
  public nextBtn =
    "//*[@id='passwordNext' or @id='identifierNext' or @id='totpNext']";
  public passwordInput = "//input[@aria-label='Enter your password']";
  public totpPinInput = "//input[@id='totpPin']";

  // Enter account google
  async enterAccountGoogle(
    page: any,
    email: string,
    password: string,
    secret: string
  ): Promise<void> {
    await this.enterText(page, this.emailInput, email);
    await this.click(page, this.nextBtn);
    await this.enterText(page, this.passwordInput, password);
    await this.click(page, this.nextBtn);
    const totp = await utilities.generateOTPGoogle(secret);
    if (await this.isDisplayed(page, this.totpPinInput)) {
      await this.enterText(page, this.totpPinInput, totp);
      await this.click(page, this.nextBtn);
    }
  }

  // set up access token google 
  async setAccessToken(page,emailGG,passGG,secretGG){
    try{
      await googleApi.getFolderDrive();
    }catch(error){
      await page.goto("http://localhost:8000/auth/google");
      await this.enterAccountGoogle(page,emailGG,passGG,secretGG);
      await this.wait(page,10000);
    }
    
  }
}
