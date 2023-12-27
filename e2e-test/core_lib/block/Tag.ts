
export default class Tag {
    // convert namedStyleType to tag html
    convertToTag(namedStyleType,indentFirstLine,elements){
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
  }
  