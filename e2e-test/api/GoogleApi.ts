
import { google } from 'googleapis';
import fs from "fs";
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
);
export default class GoogleApi {

  async oauth2Client(): Promise<any>{
      try {
          const creds:any = fs.readFileSync('creds.json');
          oauth2Client.setCredentials(JSON.parse(creds));
      } catch (err) {
          console.log('No creds found');
      }
      return oauth2Client;
  }

  async getFilesInFolder(folderId){
      const oauth2Client = await this.oauth2Client();
      const drive = google.drive({ version: 'v3', auth:oauth2Client });
      const list = await drive.files.list({
        q: `parents in '${folderId}'`,
      });
      return await list.data.files
  }

  async createFile(folderId,filename,content){
      const oauth2Client = await this.oauth2Client();
      const drive = google.drive({ version: 'v3', auth:oauth2Client });
      const request = {
          requestBody: {
            name: filename,
            mimeType: 'application/vnd.google-apps.document',
          },
          media: {
            mimeType: 'text/plain',
            body: content,
          },
        };
        if (folderId != 'local') {
          request.requestBody["parents"] = [folderId];
        }
        const info = await drive.files.create(request);
        return await info.data
  }

  async deleteFile(fileId){
      const oauth2Client = await this.oauth2Client();
      const drive = google.drive({ version: 'v3', auth:oauth2Client });
      const info = await drive.files.delete({
          fileId,
        });
      return await info
  }

  async saveImage(imgUrl,nameFileUpload){
      const oauth2Client = await this.oauth2Client();
      const drive = google.drive({ version: 'v3', auth:oauth2Client });
      const info = await drive.files.create({
          requestBody: {
            name: imgUrl,
            mimeType: 'imge/jpeg',
          },
          media: {
            mimeType: 'imge/jpeg',
            body: fs.createReadStream(nameFileUpload),
          },
        });
      return await info
  }

  async getContentGGDoc(documentId){
      const oauth2Client = await this.oauth2Client();
      const docs = google.docs({version: 'v1',auth: oauth2Client});
      const response = await docs.documents.get({documentId});
      return await response.data;
  }

  async batchUpdateGGDoc(documentId,content){
      const oauth2Client = await this.oauth2Client();
      const docs = google.docs({version: 'v1',auth: oauth2Client});
      const response = await docs.documents.batchUpdate({
          documentId,
      
          requestBody: {
            requests: [
              {
                insertText: {
                  location: {
                    index: 1,
                  },
                  text: content,
                },
              },
            ],
          },
        });
      return await response.data;
  }
}
