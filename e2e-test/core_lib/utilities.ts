
import { CodeGen } from "ajv";

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
}
