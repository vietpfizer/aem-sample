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
app.listen(POST, () => {
  console.log('Server started');
});
