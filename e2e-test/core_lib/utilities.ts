
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

  // Include Content
  includeContent(elements){
    let result ='';
    for(let i=0; i< elements.length;i++){
      result += elements[i].content;
    }
    return result;
  }
  
  // Get Icon in string
  getIconInStr(text:string){
    const arrIndex = new Array();
    const arrIcon =new Array();
    for(let i=0; i< text.length;i++){
      if(text[i]==":"){
        arrIndex.push(i);
      }
     }
     const count = arrIndex.length;
     if(count % 2 == 0){
       if(count == 2){
        arrIcon.push((text.substring(arrIndex[0],arrIndex[1])).replace(":",""));
       }
     }
     return arrIcon;
  }
}
