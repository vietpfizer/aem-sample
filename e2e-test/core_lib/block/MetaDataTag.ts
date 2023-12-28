
import Tag from "./Tag";
import TextTag from "./TextTag";
const tag = new Tag();
const textTag = new TextTag();
export default class MetaDataTag {
    // convert namedStyleType to tag html
    convertToMetaData(tableRows){
      const result = new Array();
      for(let i=1;i < tableRows.length;i++){
        const contentCell1 = tableRows[i].tableCells[0].content[0].paragraph.elements[0].textRun.content.replace("\n","").toLowerCase();
        let contentCell2 = "";
        if(tableRows[i].tableCells[1].content[0].paragraph.elements[0].textRun){
            contentCell2 = tableRows[i].tableCells[1].content[0].paragraph.elements[0].textRun.content.replace("\n","");
        }
        let tag="", name = "", content = "";
        if(contentCell1=="title"){
            tag = "title";
            name ="";
            content = contentCell2; 
        }
        else{
            tag = "meta";
            name = contentCell1;
            content = contentCell2;
        }
        result.push({tag,name,content});
      }
      return result;
    }
  }
  