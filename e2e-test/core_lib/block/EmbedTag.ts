
import Tag from "./Tag";
import TextTag from "./TextTag";
const textTag = new TextTag(); 
const tag = new Tag();
export default class EmbedTag {
    // convert namedStyleType to tag html
    convertToEmbed(tableRows){
        const result =new Array();
        const content = tableRows[1].tableCells[0].content;
        for(let i = 0; i <content.length;i++){
            const elements = content[i].paragraph.elements;
            for(let j=0; j <  elements.length; j++){
                const textRun = elements[j].textRun;
                if(textRun){
                    const textStyle = textRun.textStyle;
                    if(textStyle){
                        const link = textStyle.link;
                        if(link){
                            let tag;
                            const url = link.url;
                            const checkYouTobe = url.includes("youtube");
                            const checkYouTobe1 = url.includes("youtu.be");
                            const checkVimeo = url.includes("vimeo");
                            if(checkYouTobe || checkYouTobe1 || checkVimeo){
                                tag = "picture";
                            }
                            else{
                                tag = "iframe";
                            }
                            result.push({
                                tag:tag,
                                url:url
                            })
                        }
                    }
                }
            }
        }
        return result;
    }
  }
  