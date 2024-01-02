
import BasePage from "@pom/BasePage";
export default class IconPage extends  BasePage{
    public block1H1= "//h1[1]";
    public block2P= this.block1H1 +"/following-sibling::p[1]";
    public block3P= this.block2P +"/following-sibling::p[1]";
    public block4P= this.block3P +"/following-sibling::p[1]";
}
  