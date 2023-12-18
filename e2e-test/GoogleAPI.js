/* eslint-disable eqeqeq */
import dotenv from 'dotenv';

import { google } from 'googleapis';
import express from 'express';
import fs from 'fs';

dotenv.config();

const app = express();

// .env info
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

// Get access token
try {
  const creds = fs.readFileSync('creds.json');
  oauth2Client.setCredentials(JSON.parse(creds));
} catch (err) {
  console.log('No creds found');
}

const POST = process.env.POST || 8000;

// Authentication email to get access token if successful
// http://localhost:8000/auth/google
// Reference: https://www.npmjs.com/package/googleapis
app.get('/auth/google', async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/docs',
    ],
  });
  res.redirect(url);
});

// Add (if have not yet) or update access token in creds.json file
app.get('/google/redirect', async (req, res) => {
  console.log('this is working');
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync('creds.json', JSON.stringify(tokens));
  res.send('Success');
});

// Create a doc file in google drive api
app.get('/saveText/:folderId/:filename/:content', async (req, res) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const { content } = req.params;
  const { filename } = req.params;
  const { folderId } = req.params;
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
    request.requestBody.parents = [folderId];
  }
  const info = await drive.files.create(request);
  res.send(await info.data);
});

// Remove the doc file is just created in google drive api
app.get('/delete/:fileId', async (req, res) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const { fileId } = req.params;
  const info = await drive.files.delete({
    fileId,
  });
  res.send(await info);
});

// Upload image to google drive api
app.get('/saveImage', async (req, res) => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const info = await drive.files.create({
    requestBody: {
      name: 'uploaded_from_node.jpg',
      mimeType: 'imge/jpeg',
    },
    media: {
      mimeType: 'imge/jpeg',
      body: fs.createReadStream('1.jpg'),
    },
  });
  res.send(await info);
});

// Get info of files in folder api. ex: file name, id, type,...
// Reference:
// https://stackoverflow.com/questions/24720075/how-to-get-list-of-files-by-folder-on-google-drive-api
// https://developers.google.com/drive/api/reference/rest/v2/files/list

app.get('/getFilesOnFolder/:folderId', async (req, res) => {
  const { folderId } = req.params;
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const list = await drive.files.list({
    q: `parents in '${folderId}'`,
  });
  res.send(await list.data.files);
});

// Get content from google docs file api
app.get('/getDocContent/:documentId', async (req, res) => {
  const { documentId } = req.params;
  const docs = google.docs({
    version: 'v1',
    auth: oauth2Client,
  });
  const response = await docs.documents.get({
    documentId,
  });
  console.log(await response.data);
  res.send(await response.data);
});

// Update content for google docs file api
// Reference: https://dev.to/mcrowder65/creating-a-nodejs-script-that-can-write-to-google-docs-4hpk
app.get('/batchUpdate/:documentId/:content', async (req, res) => {
  const { documentId } = req.params;
  const { content } = req.params;
  const docs = google.docs({
    version: 'v1',
    auth: oauth2Client,
  });
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
  res.send(await response.data);
});

app.listen(POST, () => {
  console.log('Server started');
});
