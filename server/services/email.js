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

export async function sendEmail(email, subject, html) {
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
          subject: subject,  // Subject line
          html: html,
        });
    
        console.log("Message sent: %s", info.messageId);  // Log the message ID after sending
      } catch (error) {
        console.error("Error sending email:", error);  // Log errors if any
      }
}

export async function createGoogleMeet(scheduledTime) {
  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const event = {
      summary: "15-Minute Meeting",
      start: {
        dateTime: scheduledTime,
        timeZone: "Asia/Singapore", // Change based on your region
      },
      end: {
        dateTime: new Date(new Date(scheduledTime).getTime() + 15 * 60000).toISOString(),
        timeZone: "Asia/Singapore",
      },
      conferenceData: {
        createRequest: { requestId: new Date().toISOString() },
      },
    };

    console.log("Creating event with data:", event);

    // Make the request to create the event
    const response = await calendar.events.insert({
      calendarId: "primary", // Use "primary" or the correct calendar ID
      resource: event,
      conferenceDataVersion: 1, // Required for Google Meet link
    });

    console.log("Event created successfully:", response.data);
    return response.data.conferenceData.entryPoints[0].uri; // The Google Meet link
  } catch (error) {
    // Enhanced error logging for debugging
    console.error("Error creating Google Meet link:", error.message || error);
    if (error.response) {
      console.error("Error response details:", error.response.data);
    }
    return null;
  }
}