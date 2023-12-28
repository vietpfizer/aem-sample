
export default class Tag {

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
      else if(properties=="weightedFontFamily"){
        if(textStyle.weightedFontFamily){
          // & textStyle.weightedFontFamily.weight == 400
          if(textStyle.weightedFontFamily.fontFamily == "Courier New"){
            result = "code";
          }
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
              break;
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
          JSON.stringify
        }
     }
     // remove tag u when has tag a
    const tagUIndex = tag.indexOf("u");
    const tagAIndex = tag.indexOf("a");
     if(tagUIndex != -1 && tagAIndex !=-1){
       tag.splice(tagUIndex, 1);
     }
     return {
      tag:tag,
      style:style
     };
    }

  // convert namedStyleType to tag html
  convertToText(elements){
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
          if(inlineObjectElement){
            const inlineObjectId = inlineObjectElement.inlineObjectId;
            const textStyle = inlineObjectId.textStyle;
            data.push({
              inlineObjectId:inlineObjectElement.inlineObjectId ,
              textStyle: this.progressPropertiesOnElement(textStyle)
            })
          }
        }
      }
      return data;
  }
}
