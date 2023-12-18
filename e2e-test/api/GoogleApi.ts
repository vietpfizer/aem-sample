
import { CodeGen } from "ajv";

const path = require('path');
const util = require('util');
const {google} = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');
const docs = google.docs('v1');
export default class GoogleApi {

    async getAccessToken(request,data){
        const response = await request.post('https://oauth2.googleapis.com/token', {
            data:data
        });
        return (await response.json()).access_token;
    }
    async googeLogin(){
        const auth = await authenticate({
            scopes: 'https://www.googleapis.com/auth/documents',
            keyfilePath: path.join(__dirname, '../key.json'),
        });
        google.options({auth});
    }

    async getContentGoogleDoc(documentID:string){
        await this.googeLogin();
        const res = await docs.documents.get({
            documentId: documentID,
        });
        return res.data;
    }

    async drive() {
        const oauth2Client = new google.auth.OAuth2(
            "790062188849-7nt2p3hrlcu22685acj56ugvqfq3371e.apps.googleusercontent.com",
            "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",
            "http://localhost"
        );

        google.options({
            auth: oauth2Client
        });
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        return await drive;
    }

    async getContentGoogleAPIDoc(request:any,accessToken:string,documentID:string, ) {
        const response = await request.get('https://content-docs.googleapis.com/v1/documents/'+documentID+'?suggestionsViewMode=DEFAULT_FOR_CURRENT_ACCESS', {
        headers: {
            'Authorization': "Bearer "+accessToken,
        },
        });
        return await response.json();
    }

    async postContentGoogleAPIDoc(request:any,accessToken:string,documentID:string) {
        const response = await request.post('https://content-docs.googleapis.com/v1/documents/'+documentID+'?suggestionsViewMode=DEFAULT_FOR_CURRENT_ACCESS', {
        headers: {
            'Authorization': "Bearer "+accessToken,
        },
        });
        return await response.json();
    }
}
