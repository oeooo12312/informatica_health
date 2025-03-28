import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const REDIRECT_URI = "https://developers.google.com/oauthplayground"; //DONT EDIT THIS

console.log(`${CLIENT_ID}, ${CLIENT_SECRET} and ${REFRESH_TOKEN}`);
// OAuth2 Config
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

console.log(oAuth2Client);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendEmailAppointment(email, meetingLink) {
    try {
        // Send mail with defined transport object
        const accessToken = await oAuth2Client.getAccessToken();

        console.log(` accessToken = ${accessToken}`);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.GMAIL_SENDER,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
          tls: {
            rejectUnauthorized: true,
          },
        });

        const info = await transporter.sendMail({
          from: `"Meeting Scheduler" <${process.env.GMAIL_SENDER}>`, // sender address
          to: email,  // list of receivers
          subject: "Your Consultation Meeting is Scheduled",  // Subject line
          text: `Your consultation meeting has been scheduled. You can join using this link: ${meetingLink}.`,  // plain text body
          html: `<p>Your consultation meeting has been scheduled. You can join using this link: <a href="${meetingLink}">Join Meeting</a>.</p>`,  // html body
        });
    
        console.log("Message sent: %s", info.messageId);  // Log the message ID after sending
      } catch (error) {
        console.error("Error sending email:", error);  // Log errors if any
      }
}
