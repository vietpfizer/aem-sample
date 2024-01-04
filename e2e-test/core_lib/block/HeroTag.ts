
import Tag from "./Tag";
import TextTag from "./TextTag";
const textTag = new TextTag(); 
const tag = new Tag();
export default class HeroTag {
    // convert namedStyleType to tag html
    convertToHero(tableRows){
        const result =new Array();
        const content = tableRows[1].tableCells[0].content;
        for(let i = 0; i < content.length;i++){
            const paragraph = tableRows[1].tableCells[0].content[i].paragraph;
            const elementsDiv = textTag.convertToText(paragraph.elements);
            const namedStyleType = paragraph.paragraphStyle.namedStyleType;
            const indentFirstLine = paragraph.paragraphStyle.indentFirstLine;
            result.push({
                tag:tag.convertToTag(namedStyleType,indentFirstLine,paragraph.elements),
                elements:elementsDiv
            });
        }
        return result;
    }
  }
  