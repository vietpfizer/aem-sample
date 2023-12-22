
import BasePage from "@pom/BasePage";
export default class TextPage extends  BasePage{
    public block1 = "//*[@id='example-heading-1']";
    public block2 = this.block1+"/following-sibling::p[1]";
}
  