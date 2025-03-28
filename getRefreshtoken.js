// getGmailRefreshToken.js
import { google } from 'googleapis';
import dotenv from 'dotenv';
import open from 'open';
import readline from 'readline';

dotenv.config();

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Generate auth URL and get code
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('Authorize this app by visiting this url:', authUrl);
open(authUrl);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter the code from that page here: ', async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log('Your Refresh Token:', tokens.refresh_token);
  rl.close();
});