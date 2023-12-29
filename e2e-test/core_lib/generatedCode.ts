
import Tag from './block/Tag';
import TextTag  from './block/TextTag';
import CardTag from './block/CardTag';
import TableTag from './block/TableTag';
import EmbedTag from './block/EmbedTag';
import ColumnTag from './block/ColumnTag';
import MetaDataTag from './block/MetaDataTag';
const tag = new Tag();
const textTag = new TextTag();
const cardTag = new CardTag();
const tableTag = new TableTag();
const embedTag = new EmbedTag();
const columnTag = new ColumnTag();
const metaDataTag = new MetaDataTag();
export default class GeneratedCode {
  // generate code from google doc
  generateCodeFromGoogleDoc(doc){
    const result = new Array();
    const content = doc.body.content;
    for(let i=0;i<content.length;i++){
      const contentItem = content[i];
      const paragraph = contentItem.paragraph;
      const table = contentItem.table;
      if(paragraph){
        const namedStyleType = paragraph.paragraphStyle.namedStyleType;
        const indentFirstLine = paragraph.paragraphStyle.indentFirstLine;
        const textRun =  paragraph.elements[0].textRun;
        const bullet = paragraph.bullet;
        let _tag,_elements;
        if(textRun){
          if(textRun.content!= "\n"){
            _tag = tag.convertToTag(namedStyleType,indentFirstLine,paragraph.elements);
            _elements = textTag.convertToText(paragraph.elements);
          }
        }
        else{
          _tag = tag.convertToTag(namedStyleType,indentFirstLine,paragraph.elements);
          _elements = textTag.convertToText(paragraph.elements);
        }
        const arr ={
          tag: _tag,
          elements: _elements
        }
        if(bullet){
          arr["bullet"]=bullet
        }
        if(arr.tag){
          result.push(arr)
        }
      }

      if(table){
        const tableType =  table.tableRows[0].tableCells[0].content[0].paragraph.elements[0].textRun.content;
        if(tableType =="Cards\n"){
          result.push({
            tag:'div',
            elements: cardTag.convertToCards(table.tableRows)
          })
        }
        else if(tableType == "Table\n" || tableType == "Table (striped)\n" || tableType == "Table (bordered)\n" || tableType=="Table (striped, bordered)\n"){
          result.push({
            tag:'table',
            elements: tableTag.convertToTable(table.tableRows)
          })
        }
        else if(tableType=="Embed\n"){
          result.push({
            tag:'div',
            elements: embedTag.convertToEmbed(table.tableRows)
          })
        }
        else if(tableType=="Columns\n"){
          result.push({
            tag:'div',
            row: columnTag.convertToColumn(table.tableRows)
          })
        }
        else if(tableType=="Metadata\n"){
          result.push({
            tag:'head',
            elements: metaDataTag.convertToMetaData(table.tableRows)
          })
        }
      }
    }
    //
  
    return this.summaryTag(result);
  }
  
  // summary tag
  summaryTag(convertDoc:any){
    let result = new Array();
    let content="";
    let listLi = new Array();
    let subListLi =new Array();
    let listIdTemp="";
    let index = 0;
    let indexChild = 0;
    for(let i=0;i< convertDoc.length ;i++){
      if(convertDoc[i]["tag"] == "p" && convertDoc[i]["elements"][0]["textStyle"]["tag"][0] == "code"){
        content += (convertDoc[i]["elements"][0]["content"]).replace("\u000b","\n") +"\n";
        result[index] = { tag:'pre',elements:[{ content: content, textStyle: { tag: [ 'code' ], style: [] } }] }
      }
      else if(convertDoc[i]["tag"] == "li"){
        const nestingLevel = convertDoc[i]["bullet"]["nestingLevel"];
        if(nestingLevel){
          const embedGGdoc = convertDoc.filter(x=>x.bullet.listId==listIdTemp && x.bullet.nestingLevel==nestingLevel);
          listLi[indexChild-1]["child"] = { tag:'ul',li:embedGGdoc};
        }
        else{
          if(listIdTemp==convertDoc[i]["bullet"]["listId"]){
            listLi[indexChild]=convertDoc[i];
            indexChild ++;
          }
          else{
            listLi = new Array();
            indexChild = 0;
            if(listIdTemp!=""){
              index ++;
            }
            listIdTemp = convertDoc[i]["bullet"]["listId"];
            listLi[indexChild]=convertDoc[i];
            indexChild ++;
          }
        }
        result[index] = { tag:'ul',li:listLi}
        
      }
      else{
        content="";
        result[index] = convertDoc[i];
        index ++;
      }
    }
    return result;
  }
}
