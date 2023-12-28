
import Tag from "./Tag";
import TextTag from "./TextTag";
const tag = new Tag();
const textTag = new TextTag();
export default class TableTag {
    // convert namedStyleType to tag html
    convertToTable(tableRows){
      const childHead = new Array();
      const childBody = new Array();
      for(let i=1;i < tableRows.length;i++){
        const childTr = new Array();
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
          childTr.push({
            tag:"td",
            child:contentDiv
          }) 
        }
        if(i==1){
          childHead.push({
            tag:"tr",
            child:childTr
          })
        }
        else{
          childBody.push({
            tag:"tr",
            child:childTr
          })
        }
        
      }
      return {
          thead:{
            tag:"thead",
            child:childHead
          },
          tbody:{
            tag:"tbody",
            child:childBody
          }
      }
    }
  }
  