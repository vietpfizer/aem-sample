
import BasePage from "@pom/BasePage";
export default class LinkPage extends  BasePage{
    public block1H1= "//h1";
    public block2P= "//p[contains(text(),'Lorem ipsum')]";
    public block3Picture= this.block2P +"/following-sibling::p[1]";
    public block4Picture= this.block3Picture +"/following-sibling::p[2]";
    public Block5Link= this.block4Picture +"/following-sibling::p[1]";
}
  