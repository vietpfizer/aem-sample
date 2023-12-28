
import Tag from "./Tag";
import TextTag from "./TextTag";
const tag = new Tag();
const textTag = new TextTag();
export default class ColumnTag {
    // convert namedStyleType to tag html
    convertToColumn(tableRows){
        const child = new Array();
        for(let i=1;i < tableRows.length;i++){
            const childLi = new Array();
            for(let j=0;j<tableRows[i].tableCells.length;j++){
                const contentDiv =new Array();
                for(let h=0;h<tableRows[i].tableCells[j].content.length;h++){
                    const paragraph = tableRows[i].tableCells[j].content[h].paragraph;
                    const elementsDiv = textTag.convertToText(paragraph.elements);
                    const namedStyleType = paragraph.paragraphStyle.namedStyleType;
                    const indentFirstLine = paragraph.paragraphStyle.indentFirstLine;
                    contentDiv.push({
                        tag:tag.convertToTag(namedStyleType,indentFirstLine,paragraph.elements),
                        elements:elementsDiv
                    });
                }
                childLi.push({
                  tag:"div",
                  childCell:contentDiv
                })
                
            }
            child.push({
                tag:"div",
                cell:childLi
            })
        }
        return child
    }
  }
  