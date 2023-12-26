
import { TOTP } from "otpauth";
export default class Utilities {
  // Converts the Object Parameter Data API to a String Parameter Data API
  convertsObjectAPItoStringAPI(object: any) {
    let result = "";
    if (JSON.stringify(object) != "{}") {
      result = "?";
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const value = object[key];
          result += key + "=" + value + "&";
        }
      }
      result = result.substring(0, result.length - 1);
    }
    return result;
  }

  // Generate random string
  generateRandomString(length, type = "total") {
    let result = "";
    let characters = "";
    if (type == "number") {
      characters = "0123456789";
    } else {
      characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    }
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  // Generate otp token google
    async generateOTPGoogle(secret: string) {
      let totp = new TOTP({
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret,
      });
      return totp.generate();
    }

  // convert namedStyleType to tag html
  convertTagHtml(namedStyleType,indentFirstLine,elements){
    let tag='';
    if(indentFirstLine && namedStyleType=="NORMAL_TEXT"){
      tag = "li";
    }
    else if(elements[0].inlineObjectElement && namedStyleType=="NORMAL_TEXT"){
      tag = "picture";
    }
    else{
      switch(namedStyleType) {
        case "HEADING_1":
          tag = "h1"
          break;
        case "HEADING_2":
          tag = "h2"
          break;
        case "HEADING_3":
          tag = "h3"
          break;
        case "HEADING_4":
          tag = "h4"
          break;
        case "HEADING_5":
          tag = "h5"
          break;
        case "HEADING_6":
          tag = "h6"
          break;
        case "NORMAL_TEXT":
          tag = "p"
          break;
      }
    }
    
    return tag;
  }
  //convert properties on content
  convertPropertiesOnContent(textStyle,properties,propertiesValue){
    let result='';
    if(properties == "baselineOffset"){
      if(propertiesValue =="SUBSCRIPT"){
        result = "sub"
      }
      else if(propertiesValue =="SUPERSCRIPT"){
        result = "sup"
      }
    }
    else{
      switch(properties) {
        case "bold":
          result = "strong"
          break;
        case "italic":
          result = "em"
          break;
        case "underline":
          result = "u"
          break;
        case "link":
          result = "a"
        case "strikethrough":
          result = 'del'
        break;
      }
    }
    return result;
  }


  progressPropertiesOnElement(textStyle){
    let tag = new Array();
    let style = new Array();
    for (var properties in textStyle) {
      const propertiesValue = textStyle[properties];
      if(properties=="backgroundColor" || properties =="foregroundColor" ){
        for (var key in textStyle[properties].color.rgbColor) {
          style.push(properties+":"+key);
        }
      }
      else if(properties=="fontSize"){
        style.push(properties+":"+textStyle[properties].magnitude+" "+textStyle[properties].unit);
      }
      else{
        tag.push(this.convertPropertiesOnContent(textStyle,properties,propertiesValue))
      }
   }
   return {
    tag:tag,
    style:style
   };
  }
  
  // 
  progressElementInBlock(type,elements){
    if(type=="paragraph"){
      let data= new Array();
      for(let i=0;i < elements.length;i++){
        const textRun = elements[i].textRun
        if(textRun){
          const content = textRun.content;
          const textStyle = textRun.textStyle;
          data.push({
            content:content.replace("\n",""),
            textStyle: this.progressPropertiesOnElement(textStyle)
          })
        }
        else{
          const inlineObjectElement = elements[i].inlineObjectElement;
          const inlineObjectId = inlineObjectElement.inlineObjectId;
          const textStyle = inlineObjectId.textStyle;
          data.push({
            inlineObjectId:inlineObjectElement.inlineObjectId ,
            textStyle: this.progressPropertiesOnElement(textStyle)
          })
        }
        
      }
      return data;
    }
    else if(type=="cards"){
      const child = new Array();
      for(let i=1;i < elements.length;i++){
          const childLi = new Array();
          for(let j=0;j<elements[i].tableCells.length;j++){
              const contentDiv =new Array();
              for(let h=0;h<elements[i].tableCells[j].content.length;h++){
              const paragraph = elements[i].tableCells[j].content[h].paragraph;
              const elementsDiv = this.progressElementInBlock("paragraph",paragraph.elements);
              const namedStyleType = paragraph.paragraphStyle.namedStyleType;
              const indentFirstLine = paragraph.paragraphStyle.indentFirstLine;
              contentDiv.push({
                  tag:this.convertTagHtml(namedStyleType,indentFirstLine,paragraph.elements),
                  elements:elementsDiv
              });
              }
              childLi.push({
                tag:"div",
                child:contentDiv
              })
              
          }
          child.push({
              tag:"li",
              child:childLi
          })
      }
      return {
          tag:"ul",
          child:child
      }
    }
    else if(type=="table"){
      const childHead = new Array();
      const childBody = new Array();
      for(let i=1;i < elements.length;i++){
        const childTr = new Array();
        for(let j=0;j<elements[i].tableCells.length;j++){
          const contentDiv =new Array();
          for(let h=0;h<elements[i].tableCells[j].content.length;h++){
          const paragraph = elements[i].tableCells[j].content[h].paragraph;
          const elementsDiv = this.progressElementInBlock("paragraph",paragraph.elements);
          const namedStyleType = paragraph.paragraphStyle.namedStyleType;
          const indentFirstLine = paragraph.paragraphStyle.indentFirstLine;
          contentDiv.push({
              tag:this.convertTagHtml(namedStyleType,indentFirstLine,paragraph.elements),
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
  
  // generate code from google doc
  generateCodeFromGoogleDoc(doc){
    const result = new Array();
    const content = doc.body.content;
    for(let i=0;i<content.length;i++){
      const contentItem = content[i];
      const paragraph = contentItem.paragraph;
      const table = contentItem.table;
      if(paragraph){
        const elements = this.progressElementInBlock("paragraph",paragraph.elements);
        const namedStyleType = paragraph.paragraphStyle.namedStyleType;
        const indentFirstLine = paragraph.paragraphStyle.indentFirstLine;
        result.push({
          tag:this.convertTagHtml(namedStyleType,indentFirstLine,paragraph.elements),
          elements: elements
        })
      }

      if(table){
        const tableType =  table.tableRows[0].tableCells[0].content[0].paragraph.elements[0].textRun.content;
        if(tableType =="Cards\n"){
          const elements = this.progressElementInBlock("cards",table.tableRows);
          result.push({
            tag:'div',
            elements: elements
          })
        }
        else if(tableType == "Table\n" || tableType == "Table (striped)\n" || tableType == "Table (bordered)\n" || tableType=="Table (striped, bordered)"){
          const elements = this.progressElementInBlock("table",table.tableRows);
          result.push({
            tag:'table',
            elements: elements
          })
        }
      }
    }
    return result;
  }
}
